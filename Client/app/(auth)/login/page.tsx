"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { login } from "@/hooks/auth";
const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { user, token } = await login(values.email, values.password);
      setUser(user);
      setToken(token);
      toast.success("Login successful");
      router.push("/");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
        return;
      }
      toast.error("Something went wrong, please try again");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen px-6 md:px-12 lg:px-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wide">
        Login to your{" "}
        <span className="text-white bg-primary px-2 italic">Account!</span>{" "}
      </h1>
      <div className="mt-2 w-full max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col">
              <Link
                href="/login/forgot-password"
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Forgot password?
              </Link>
              <Link
                href="/register"
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Don't have an account? Sign up
              </Link>
            </div>
            <Button
              type="submit"
              className="rounded-none font-mons w-full bg-primary hover:bg-primary-hover py-3  text-white  dark:border-white relative transition duration-200"
            >
              {isSubmitting ? "Submitting..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
