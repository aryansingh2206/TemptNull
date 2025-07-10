// client/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api"; // axios instance
import { toast } from "sonner"; // ✅ correct sonner import

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      interface RegisterResponse {
        token: string;
      }

      const res = await API.post<RegisterResponse>("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("auth", "true");

      toast.success("Account created! Redirecting...");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Create an Account
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold rounded hover:shadow-lg transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
