import { useEffect, useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const cooldownRef = useRef(false);

  // 🚩 ถ้า login แล้ว → redirect ไปหน้าแรก
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const validateForm = () => {
    if (!email.includes("@") || password.length < 6) {
      setError("❌ Invalid email or password format.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || cooldownRef.current) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const res = await signIn("credentials", {
  redirect: true, // ✅ ต้องใส่ redirect true เพื่อให้ NextAuth ออก Set-Cookie แน่นอน
  email,
  password,
  callbackUrl: "/", // ✅ redirect ไปหน้าแรก
});


    if (res?.ok) {
      setSuccess("✅ Login success! Redirecting...");
      // ปิด banner หลังจาก redirect (กัน banner ค้าง)
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      console.error("Login failed:", res?.error);
      setAttempts((prev) => prev + 1);
      setError("Invalid credentials or login failed.");

      if (attempts >= 2) {
        cooldownRef.current = true;
        setError("🚫 Too many attempts. Please wait 10 seconds.");
        setTimeout(() => {
          cooldownRef.current = false;
          setAttempts(0);
        }, 10000);
      }
    }

    setLoading(false);
  };

  const handleOAuthLogin = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/" });
    setLoading(false);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  text-white px-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-1">MBTI.AI</h1>
        <p className="text-gray-300 mb-5">Sign in to your account</p>

        {/* Success banner */}
        {success && (
          <p className="mb-3 text-green-400 text-sm font-semibold">{success}</p>
        )}

        {/* Error banner */}
        {error && (
          <p className="mb-3 text-red-400 text-sm font-semibold">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-lg text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

          <div className="text-left text-sm text-purple-300 mb-2 ml-1">
            <span
              role="button"
              onClick={handleForgotPassword}
              className="hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 hover:bg-purple-700 transition rounded-full py-2 font-bold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="my-3 text-gray-400 font-semibold">OR</p>

        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className={`bg-gray-700 hover:bg-gray-600 w-full flex items-center justify-center gap-3 rounded-lg py-2 font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <button
          onClick={() => handleOAuthLogin("github")}
          disabled={loading}
          className={`bg-gray-800 hover:bg-gray-700 w-full flex items-center justify-center gap-3 rounded-lg py-2 font-semibold transition mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaGithub className="text-xl" />
          Sign in with GitHub
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
