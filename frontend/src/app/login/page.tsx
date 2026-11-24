"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const isGoogleConfigured = Boolean(clientId);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      const res = await api.post("/auth/google", { idToken: credential });

      Cookies.set("token", res.data.token, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Failed", err);
      toast.error(err?.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-brand-cream)]">
      <div className="p-10 bg-white border border-[var(--color-brand-line)] shadow-xl rounded-2xl text-center flex flex-col items-center max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-brand-ink)]">ReachInbox</h1>
        <p className="text-[var(--color-brand-muted)] mb-8">Sign in to manage your scheduled emails.</p>

        {isGoogleConfigured ? (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.error("Login Failed");
              toast.error("Login Failed");
            }}
            theme="outline"
            shape="circle"
          />
        ) : (
          <div className="rounded-lg border border-amber-600/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            Google login is not configured yet. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment and restart the app.
          </div>
        )}
      </div>
    </div>
  );
}