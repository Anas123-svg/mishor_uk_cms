"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import randomstring from "randomstring";
import AuthCode from "react-auth-code-input";

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
import axios from "axios";

const formSchema = z
  .object({
    email: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ForgotPassword = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [receivedCode, setReceivedCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [isExpired, setIsExpired] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (timer === 0) {
      setIsExpired(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const sendEmail = async () => {
    setIsSending(true);
    let new_code = randomstring.generate(6);
    setCode(new_code);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        {
          email: form.getValues("email"),
          reset_code: new_code,
        }
      );
      toast.success(response.data.message);
      setTimer(60);
      setIsExpired(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setIsSending(false);
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (isExpired || receivedCode.length !== 6) {
      toast.error("Invalid code");
      setIsSubmitting(false);
      return;
    }
    if (receivedCode !== code) {
      toast.error("Invalid code");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        {
          email: values.email.toLowerCase(),
          reset_code: receivedCode,
          password: values.password,
          password_confirmation: values.confirmPassword,
        }
      );
      toast.success(response.data.message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen px-6 md:px-12 lg:px-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wide mb-3">
        Reset your{" "}
        <span className="bg-primary text-white px-2 italic">Password!</span>{" "}
      </h1>{" "}
      <p className="text-center text-sm text-gray-400 mb-5">
        Please enter the code that will be sent to your email and your new
        password.
      </p>
      <div className="mt-2 w-full max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex items-end w-full gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={sendEmail}
                disabled={
                  timer !== 0 || form.getValues("email") === "" || isSending
                }
                className="font-mons flex justify-center p-2  bg-primary hover:bg-primary-hover text-white  dark:border-white transition duration-200"
              >
                {isSending
                  ? "Sending..."
                  : isExpired
                  ? "Send Code"
                  : "00:" + (timer > 9 ? timer : "0" + timer)}
              </Button>
            </div>
            <div className="flex justify-center items-center flex-col">
              <p className="text-center mb-3">Code</p>
              <AuthCode
                containerClassName="flex justify-center gap-2 text-center"
                inputClassName="border border-neutral-300 text-center font-bold text-xl tracking-[9px] w-9 h-9 outline-none rounded-md"
                length={6}
                onChange={(value) => setReceivedCode(value)}
                autoFocus={false}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Go back to login?
            </Link>
            <Button
              disabled={isSubmitting || timer === 0}
              type="submit"
              className="rounded-none font-mons w-full bg-primary hover:bg-primary-hover py-3  dark:border-white transition duration-200"
            >
              {isSubmitting ? "Submitting..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
