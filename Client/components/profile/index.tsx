import React, { use, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAuthStore from "@/store/authStore";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters" }),
});
const formSchemaPassword = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Profile = () => {
  const [orders, setOrders] = useState<any>([]);
  const { user } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
    },
  });
  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
  });

  useEffect(() => {
    form.reset({
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
    });
  }, [user]);
  useEffect(() => {
    fetchOrders();
  }, []);

  const [edit, setEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/api/update`, values);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
      setEdit(false);
    }
  }
  async function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    setIsSubmittingPassword(true);
    try {
      const response = await axios.post(`/api/update`, {
        password: values.password,
        newPassword: values.newPassword,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmittingPassword(false);
      formPassword.reset({
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/order/${user?.email}`);
      setOrders(response.data.orders);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="px-2 py-1.5 text-sm transition duration-200 hover:bg-neutral-100 w-full">
        Profile
      </DialogTrigger>
      <DialogContent className="scrollbar scrollbar-none overflow-scroll w-full max-w-[1000px] h-full md:max-h-[520px] flex-col md:flex-row flex gap-10">
        <div className="md:w-1/2 h-full md:overflow-scroll scrollbar-none">
          <h1 className="text-2xl font-bold mb-3">Your Profile</h1>
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} disabled={!edit} />
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
                          <Input placeholder="" {...field} disabled />
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
                          <Input placeholder="" {...field} disabled={!edit} />
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
                          <Input placeholder="" {...field} disabled={!edit} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {edit ? (
                    <button
                      type="submit"
                      className="text-base w-full bg-transparent hover:bg-transparent py-2 border border-black text-white dark:border-white relative group transition duration-200"
                    >
                      <div className="absolute bottom-0 right-0 bg-primary h-full w-full -z-10 group-hover:scale-x-95 group-hover:scale-y-75 transition-all duration-200" />
                      <span className="relative">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </span>
                    </button>
                  ) : (
                    <div
                      onClick={() => setEdit(true)}
                      className="w-full bg-transparent hover:bg-transparent py-2 text-center border border-black  dark:border-white relative group transition duration-200"
                    >
                      <div className="absolute bottom-0 right-0 bg-primary h-full w-full -z-10 group-hover:scale-x-95 group-hover:scale-y-75 transition-all duration-200" />
                      <span className="relative text-white">Edit</span>
                    </div>
                  )}
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="password">
              <Form {...formPassword}>
                <form
                  className="space-y-3"
                  onSubmit={formPassword.handleSubmit(onSubmitPassword)}
                >
                  <FormField
                    control={formPassword.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPassword.control}
                    name="newPassword"
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
                    control={formPassword.control}
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
                  <button
                    type="submit"
                    className="text-base w-full bg-transparent hover:bg-transparent py-2 border border-black text-white dark:border-white relative group transition duration-200"
                  >
                    <div className="absolute bottom-0 right-0 bg-primary h-full w-full -z-10 group-hover:scale-x-95 group-hover:scale-y-75 transition-all duration-200" />
                    <span className="relative">
                      {isSubmittingPassword ? "Saving..." : "Save Changes"}
                    </span>
                  </button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:w-1/2 h-full">
          <h1 className="text-2xl font-bold mb-3">Previous Orders</h1>
          <div className="space-y-3 text-xs md:overflow-scroll md:h-[90%] scrollbar-none">
            {orders.filter((order: any) => order.status == "pending").length >
              0 && <h3 className="font-bold">Ongoing:</h3>}
            {orders
              .filter((order: any) => order.status == "pending")
              .map((order: any) => (
                <div key={order._id} className="border p-3">
                  <div className="flex justify-between">
                    <h2 className="font-bold">Order Date</h2>
                    <h2 className="font-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </h2>
                  </div>
                  <div>
                    <h2 className="font-bold">Items:</h2>
                    {order.orderItems.map((item: any) => (
                      <div key={item._id} className="flex justify-between">
                        <p>
                          {item.product?.name} ( {item.size.toUpperCase()} |{" "}
                          {item.color[0].toUpperCase() + item.color.slice(1)} )
                        </p>
                        <p>
                          {item.quantity} x{" "}
                          {item.product.price.toLocaleString()} = £{" "}
                          {(
                            item.quantity * item.product.price
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-bold">Total</h2>
                    <h2 className="font-bold">
                      £ {order.totalPrice.toLocaleString()}
                    </h2>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-bold">Status</h2>
                    <h2 className="font-bold">
                      {order.status === "pending" ? (
                        <span className="text-yellow-600">Pending</span>
                      ) : order.status === "completed" ? (
                        <span className="text-green-600">Completed</span>
                      ) : (
                        <span className="text-red-600">Cancelled</span>
                      )}
                    </h2>
                  </div>
                </div>
              ))}
            <hr />
            {orders.filter((order: any) => order.status != "pending").length >
              0 && <h3 className="font-bold">Completed:</h3>}
            {orders
              .filter((order: any) => order.status != "pending")
              .map((order: any) => (
                <div key={order._id} className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <h2 className="font-bold">Order Date</h2>
                    <h2 className="font-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </h2>
                  </div>
                  <div>
                    <h2 className="font-bold">Items:</h2>
                    {order.orderItems.map((item: any) => (
                      <div key={item._id} className="flex justify-between">
                        <p>{item.product.name}</p>
                        <p>
                          {item.quantity} x{" "}
                          {item.product.price.toLocaleString()} = £{" "}
                          {(
                            item.quantity * item.product.price
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-bold">Total</h2>
                    <h2 className="font-bold">
                      £ {order.totalPrice.toLocaleString()}
                    </h2>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-bold">Status</h2>
                    <h2 className="font-bold">
                      {order.status === "pending" ? (
                        <span className="text-yellow-600">Pending</span>
                      ) : order.status === "completed" ? (
                        <span className="text-green-600">Completed</span>
                      ) : (
                        <span className="text-red-600">Cancelled</span>
                      )}
                    </h2>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
