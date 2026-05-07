import { useAuth } from "@context/AuthContext";
import { api } from "@utils/api";
import { requireSupabase } from "@utils/supabase";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const finishLegacyOAuth = async (token) => {
      localStorage.setItem("humora_auth_token", token);

      try {
        const user = await api.auth.me();
        setUserFromToken(user);
        navigate("/dashboard", { replace: true });
      } catch {
        localStorage.removeItem("humora_auth_token");
        navigate("/login?error=auth-failed", { replace: true });
      }
    };

    const finishSupabaseOAuth = async () => {
      try {
        const supabase = requireSupabase();

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.access_token)
          throw new Error("Supabase session not found");

        const { user, token } = await api.auth.exchangeSupabase(
          session.access_token
        );
        localStorage.setItem("humora_auth_token", token);
        setUserFromToken(user);
        await supabase.auth.signOut();
        navigate("/dashboard", { replace: true });
      } catch (error) {
        navigate(
          `/login?error=${encodeURIComponent(error.message || "oauth-failed")}`,
          { replace: true }
        );
      }
    };

    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      navigate("/login?error=" + error, { replace: true });
      return;
    }

    if (token) {
      finishLegacyOAuth(token);
      return;
    }

    finishSupabaseOAuth();
  }, [navigate, params, setUserFromToken]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Archivo, sans-serif",
        background: "#F5F5F7",
      }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #E5E7EB",
            borderTop: "3px solid #4F46E5",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#6B7280", fontSize: 14 }}>Signing you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
