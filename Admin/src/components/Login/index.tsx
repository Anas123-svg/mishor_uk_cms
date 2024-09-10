"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { login } from "@/hooks/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, setToken, setUser } = useAuthStore();

  if (user) {
    router.push("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }
    try {
      const { admin, token } = await login(email, password);
      setUser(admin);
      setToken(token);
      setIsSubmitting(false);
      router.push("/");
      toast.success("Logged in successfully");
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
        return;
      }
      toast.error("Something went wrong, please try again");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-100 flex min-h-screen items-center justify-center dark:bg-meta-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
        <h2 className="text-gray-700 text-center text-2xl font-semibold dark:text-white">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-gray-700 dark:text-gray-300 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:text-white sm:text-sm"
            />
          </div>

          {error && <p className="text-red-600 mt-2 font-semibold">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="hover:bg-primary-dark flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
