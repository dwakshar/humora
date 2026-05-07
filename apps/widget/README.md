# @humora-io/widget

> The CAPTCHA replacement developers actually enjoy building with.

Humora is a human verification widget that replaces intrusive CAPTCHAs with a short, personality-driven question flow. It scores behavioral signals and returns a signed JWT you verify on your server.

[![npm version](https://img.shields.io/npm/v/@humora-io/widget)](https://www.npmjs.com/package/@humora-io/widget)
[![license](https://img.shields.io/npm/l/@humora-io/widget)](./LICENSE)

---

## Installation

```bash
npm install @humora-io/widget
```

> **Peer dependencies:** React 17+ and React DOM are required.

---

## Quick Start

### React

```jsx
import { HumoraWidget } from '@humora-io/widget'

function ContactForm() {
  const [token, setToken] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token) return
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ humora_token: token }),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <HumoraWidget
        sitekey="sk_live_xxxxxxxx"
        onPass={(token) => setToken(token)}
      />
      <button type="submit" disabled={!token}>
        Submit
      </button>
    </form>
  )
}
```

### Next.js (App Router)

```jsx
'use client'

import { HumoraWidget } from '@humora-io/widget'
import { useState } from 'react'

export default function MyForm() {
  const [token, setToken] = useState(null)

  return (
    <form>
      <HumoraWidget
        sitekey="sk_live_xxxxxxxx"
        onPass={(token) => setToken(token)}
        onFail={() => console.log('Verification failed')}
      />
      <button disabled={!token}>Submit</button>
    </form>
  )
}
```

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sitekey` | `string` | ✅ | Your site's key from the [Humora dashboard](https://humora.io/dashboard/api-keys) |
| `onPass` | `(token: string, result: object) => void` | ✅ | Called when verification passes. Receives the signed JWT token. |
| `onFail` | `(result: object) => void` | — | Called when verification fails or is blocked. |
| `apiUrl` | `string` | — | Override the API base URL. Defaults to `https://api.humora.io`. |

---

## Server-side Verification

After the user passes, send the token to your server and verify it:

```js
// POST /api/verify
const response = await fetch('https://api.humora.io/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: req.body.humora_token,
    sitekey: process.env.HUMORA_SITEKEY,
  }),
})

const { success } = await response.json()
if (!success) return res.status(403).json({ error: 'Human verification failed' })
```

Tokens are signed JWTs — valid for **5 minutes** and single-use (replay attacks are blocked automatically).

---

## Script Tag (no framework)

If you're not using React, include the widget as a script:

```html
<script src="https://widget.humora.io/humora.min.js" async defer></script>

<div
  class="humora-widget"
  data-sitekey="sk_live_xxxxxxxx"
  data-callback="onHumoraPass"
></div>

<script>
  function onHumoraPass(token) {
    document.getElementById('humora-token').value = token
  }
</script>
```

---

## Getting a Sitekey

1. Sign up at [humora.io](https://humora.io/signup)
2. Add your domain under **My Sites**
3. Copy the sitekey from **API Keys**

---

## License

MIT © [Humora](https://humora.io)
