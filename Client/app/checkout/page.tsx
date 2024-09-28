"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long" }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long" }),
  city: z
    .string()
    .min(3, { message: "City must be at least 3 characters long" }),
  country: z
    .string()
    .min(3, { message: "Country must be at least 3 characters long" }),
  postalCode: z
    .string()
    .min(3, { message: "Postal code must be at least 3 characters long" }),
});
const page = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { user, token } = useAuthStore();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: "",
      country: "",
      postalCode: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          user_id: user ? user.id : null,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          status: "pending",
          country: values.country,
          items: items.map((item) => ({
            quantity: item.quantity,
            product_id: item.product.id,
          })),
          paymentMethod,
          subTotal: getTotalPrice(),
          delivery: getTotalPrice() > 10000 ? 0 : 300,
          total: getTotalPrice() + (getTotalPrice() > 10000 ? 0 : 300),
        }
      );
      toast.success("Order placed successfully");
      clearCart(user ? true : false, token);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setIsSubmitting(false);
    form.reset();
  }

  // useEffect(() => {
  //   if (items.length === 0) {
  //     router.push("/");
  //   }
  // }, [items]);

  return (
    <div className="px-6 md:px-12 lg:px-24 pt-28 pb-10 min-h-screen">
      <div className="text-center mb-5">
        <h1 className="text-2xl md:text-3xl text-gray-900 tracking-wide">
          Checkout
        </h1>
        <p className="text-sm md:text-base mt-4 text-gray-700">
          Fill in your details to place your order. We will deliver it to you as
          soon as possible.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <h2 className="text-xs font-bold">Personal Info</h2>
              <div className="border-y py-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <h2 className="text-xs font-bold">Payment Info:</h2>
              <div className="border-y py-5">
                <RadioGroup
                  defaultValue={paymentMethod}
                  onValueChange={(e) => setPaymentMethod(e)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">
                      Check your mail for the order confirmation and invoice.
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-none font-mons w-full bg-primary hover:bg-primary-hover py-3  text-white transition duration-200"
              >
                {isSubmitting ? "Submitting..." : "Place Order"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="md:pl-10 w-full md:border-l border-neutral-600">
          <h2 className="text-2xl font-mons mb-5">Your Cart</h2>
          {items.map((item) => (
            <div
              key={item.product.id}
              className="border border-black p-2 my-2 flex justify-between"
            >
              <div className="w-2/3">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-20 h-20 object-cover float-left mr-3.5"
                />
                <h1 className="font-mons">{item.product.title}</h1>
                <h1 className="text-xs">Qty: {item.quantity}</h1>
              </div>
              <span className="font-mons">
                £{" "}
                {(item.product.discountedPrice
                  ? item.product.discountedPrice
                  : item.product.price
                ).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>£ {getTotalPrice().toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Delivery</p>
              <p>
                {getTotalPrice() > 10000 ? (
                  <span className="font-semibold text-green-600">Free</span>
                ) : (
                  "£ 300"
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <p>
                £{" "}
                {(
                  getTotalPrice() + (getTotalPrice() > 10000 ? 0 : 300)
                ).toLocaleString()}{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
