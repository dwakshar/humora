import React from 'react';
import ReactDOM from 'react-dom/client';
import Widget from '../Widget.jsx';
import '../index.css';

(function (window) {
  const widgets = new Map();
  const tokens = new Map();
  const readyCallbacks = [];
  let widgetCounter = 0;
  let isReady = false;
  const assetBaseUrl = resolveAssetBaseUrl();

  function resolveAssetBaseUrl() {
    const override = window.HUMORA_WIDGET_ORIGIN || window.__HUMORA_WIDGET_ORIGIN__;
    if (override) {
      return new URL(override.endsWith('/') ? override : override + '/');
    }

    const currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
      return new URL('./', currentScript.src);
    }

    const script = Array.from(document.getElementsByTagName('script')).find((tag) => (
      typeof tag.src === 'string' && tag.src.includes('humora.min.js')
    ));

    if (script && script.src) {
      return new URL('./', script.src);
    }

    return new URL(window.location.origin + '/');
  }

  function generateWidgetId() {
    return 'humora-widget-' + ++widgetCounter;
  }

  function render(containerId, config) {
    const container = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;

    if (!container) {
      console.error('Humora: container not found:', containerId);
      return null;
    }

    const widgetId = generateWidgetId();
    const sitekey = config?.sitekey || '';
    const theme = config?.theme || 'light';
    const apiBaseUrl = config?.apiBaseUrl || window.HUMORA_API_URL || '';
    const parentOrigin = window.location.origin;

    const iframe = document.createElement('iframe');
    // Load the iframe shell from the same base URL as the hosted widget script.
    const widgetUrl = new URL('widget.html', assetBaseUrl);
    widgetUrl.searchParams.set('sitekey', sitekey);
    widgetUrl.searchParams.set('theme', theme);
    widgetUrl.searchParams.set('widgetId', widgetId);
    if (apiBaseUrl) {
      widgetUrl.searchParams.set('apiBaseUrl', apiBaseUrl);
    }
    widgetUrl.searchParams.set('parentOrigin', parentOrigin);
    iframe.src = widgetUrl.toString();
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.minHeight = '520px';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'Humora Human Verification');
    iframe.setAttribute('data-widget-id', widgetId);

    container.innerHTML = '';
    container.appendChild(iframe);

    widgets.set(widgetId, {
      iframe,
      container,
      config: config || {},
      token: null,
      expired: false,
    });

    tokens.set(widgetId, '');

    return widgetId;
  }

  function getResponse(widgetId) {
    if (widgetId === undefined) {
      const firstKey = widgets.keys().next().value;
      return tokens.get(firstKey) || '';
    }
    return tokens.get(widgetId) || '';
  }

  function reset(widgetId) {
    if (widgetId === undefined) {
      widgets.forEach((_, id) => reset(id));
      return;
    }

    const widget = widgets.get(widgetId);
    if (!widget) return;

    tokens.set(widgetId, '');
    widget.token = null;
    widget.expired = false;

    if (widget.iframe && widget.iframe.contentWindow) {
      widget.iframe.contentWindow.postMessage({ source: 'humora-host', action: 'reset' }, '*');
    }
  }

  function ready(callback) {
    if (typeof callback !== 'function') return;
    if (isReady) {
      callback();
    } else {
      readyCallbacks.push(callback);
    }
  }

  function fireReady() {
    isReady = true;
    readyCallbacks.forEach((cb) => {
      try { cb(); } catch (e) { console.error('Humora ready callback error:', e); }
    });
    readyCallbacks.length = 0;
  }

  function handleMessage(event) {
    const data = event.data;
    if (!data || data.source !== 'humora') return;

    let targetWidgetId = null;
    widgets.forEach((widget, id) => {
      if (widget.iframe && widget.iframe.contentWindow === event.source) {
        targetWidgetId = id;
      }
    });

    if (!targetWidgetId) {
      if (data.widgetId && widgets.has(data.widgetId)) {
        targetWidgetId = data.widgetId;
      }
    }

    if (!targetWidgetId) return;

    const widget = widgets.get(targetWidgetId);
    if (!widget) return;

    if (data.verified && data.token) {
      tokens.set(targetWidgetId, data.token);
      widget.token = data.token;
      widget.expired = false;

      if (typeof widget.config.callback === 'function') {
        try { widget.config.callback(data.token); } catch (e) {
          console.error('Humora callback error:', e);
        }
      }
    }

    if (data.action === 'expired') {
      tokens.set(targetWidgetId, '');
      widget.token = null;
      widget.expired = true;

      if (typeof widget.config.expiredCallback === 'function') {
        try { widget.config.expiredCallback(); } catch (e) {
          console.error('Humora expiredCallback error:', e);
        }
      }
    }

    if (data.action === 'resize' && data.height) {
      widget.iframe.style.minHeight = data.height + 'px';
    }
  }

  function autoRender() {
    const elements = document.querySelectorAll('.humora-widget[data-sitekey]');
    elements.forEach((el) => {
      const sitekey = el.getAttribute('data-sitekey');
      const theme = el.getAttribute('data-theme') || 'light';
      const callbackName = el.getAttribute('data-callback');
      const expiredCallbackName = el.getAttribute('data-expired-callback');
      const apiBaseUrl = el.getAttribute('data-api-url') || window.HUMORA_API_URL || '';

      const config = {
        sitekey,
        theme,
        apiBaseUrl,
        callback: callbackName && typeof window[callbackName] === 'function'
          ? window[callbackName]
          : null,
        expiredCallback: expiredCallbackName && typeof window[expiredCallbackName] === 'function'
          ? window[expiredCallbackName]
          : null,
      };

      render(el, config);
    });
  }

  window.addEventListener('message', handleMessage);

  window.humora = {
    render,
    getResponse,
    reset,
    ready,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      autoRender();
      fireReady();
      mountWidgetApp();
    });
  } else {
    autoRender();
    fireReady();
    mountWidgetApp();
  }

  function mountWidgetApp() {
    const rootElement = document.getElementById('root');
    if (!rootElement || !window.__HUMORA_CONFIG__) return;

    if (!rootElement.__humoraRoot) {
      rootElement.__humoraRoot = ReactDOM.createRoot(rootElement);
    }

    rootElement.__humoraRoot.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(Widget)
      )
    );
  }
}(window));
