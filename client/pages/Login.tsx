import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import API from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("🔼 Sending login request with:", { email, password });

      const res = await API.post<{ token: string }>("/auth/login", { email, password });

      console.log("✅ Login success:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("auth", "true");
      navigate("/");
    } catch (err: any) {
      console.error("❌ Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[.4]"
        style={{
          backgroundImage: "url('/bg.jpg')",
        }}
      />

      {/* Overlay Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div
          className={`transition-all duration-1000 ease-out ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
            Welcome to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Do I Need This?
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 min-h-[2.5rem] mb-6">
            <Typewriter
              words={[
                "Your personal impulse purchase analyzer.",
                "Say goodbye to buyer’s remorse!",
                "Track. Think. Decide.",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={2000}
            />
          </p>

          {/* Form Inputs */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full mb-2 px-4 py-2 rounded bg-white/90 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full mb-4 px-4 py-2 rounded bg-white/90 text-black"
          />

          {/* Register Link */}
          <p className="text-white/80 text-sm mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-teal-300 hover:text-teal-400 underline"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Sign In Button */}
        <div className="absolute bottom-12">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
