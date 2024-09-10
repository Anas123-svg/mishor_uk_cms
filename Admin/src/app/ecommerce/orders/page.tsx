"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Order } from "@/types";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import Modal from "react-modal";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import toast from "react-hot-toast";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "650px",
    maxHeight: "90vh",
    backgroundColor: "#1f2937", // Dark mode background color
    color: "#ffffff", // Dark mode text color
    border: "1px solid #4b5563", // Border for dark mode
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const { token } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle modal opening to view order details
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  // Handle status update
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Filtered orders based on search input
  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="Orders" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Orders
            </h4>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xs rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-9 gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
            <div className="col-span-2">
              <p className="font-medium text-black dark:text-white">
                Order Number
              </p>
            </div>
            <div className="col-span-3">
              <p className="font-medium text-black dark:text-white">Customer</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-black dark:text-white">
                Total Amount
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-black dark:text-white">Status</p>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <p className="font-medium text-black dark:text-white">Actions</p>
            </div>
          </div>

          {loading ? (
            <Loader className="h-[60vh]" />
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-9 items-center gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
              >
                <div className="col-span-2">
                  <p className="text-sm text-black dark:text-white">
                    {order.order_number}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-black dark:text-white">
                    {order.name} ({order.email})
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-black dark:text-white">
                    ${order.total_amount}
                  </p>
                </div>
                <div className="col-span-1">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="w-full appearance-none rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openModal(order)}
                    className="dark:text-white"
                  >
                    <FaEye size={18} />
                  </button>
                  <Delete
                    api={`/admin/orders/${order.id}`}
                    message="Order deleted successfully"
                    fetch={fetchOrders}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-black dark:text-white">
              No orders found.
            </div>
          )}
        </div>

        {selectedOrder && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Order Details"
          >
            <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-white dark:text-white">
                Order Details
              </h4>
              <button
                onClick={closeModal}
                className="dark:text-white dark:hover:text-white"
              >
                <IoMdClose size={18} />
              </button>
            </div>
            <div className="px-4 py-4 md:px-6 xl:px-7.5">
              <p className="text-white">
                <strong>Order Number:</strong> {selectedOrder.order_number}
              </p>
              <p className="text-white">
                <strong>Customer Name:</strong> {selectedOrder.name}
              </p>
              <p className="text-white">
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p className="text-white">
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p className="text-white">
                <strong>Shipping Address:</strong>{" "}
                {selectedOrder.shipping_address_line1},{" "}
                {selectedOrder.shipping_city}, {selectedOrder.shipping_country},{" "}
                {selectedOrder.shipping_postal_code}
              </p>
              <p className="text-white">
                <strong>Total Amount:</strong> ${selectedOrder.total_amount}
              </p>
              <p className="text-white">
                <strong>Payment Method:</strong> {selectedOrder.payment_method}
              </p>
              <p className="text-white">
                <strong>Order Items:</strong>
              </p>
              <ul className="text-white">
                {selectedOrder.items.map((item) => (
                  <li key={item.product_id}>
                    {item.product.title} (Quantity: {item.quantity})
                  </li>
                ))}
              </ul>
            </div>
          </Modal>
        )}
      </div>
    </DefaultLayout>
  );
};

export default OrdersPage;
