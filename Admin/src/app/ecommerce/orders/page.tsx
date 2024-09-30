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
import { useRouter, useSearchParams } from "next/navigation";
import ReactPaginate from "react-paginate";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") ?? 1;
  const { user, token } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageParam]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
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

  const handlePageClick = (data: any) => {
    navigate.push(`?page=${data.selected + 1}`);
  };

  // Filtered orders based on search input
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user?.permissions.Orders) {
    return (
      <DefaultLayout>
        <div className="flex h-[84.4vh] items-center justify-center">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            You do not have permission to view this page
          </h1>
        </div>
      </DefaultLayout>
    );
  }

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
                    {order.id}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-black dark:text-white">
                    {order.name} ({order.email})
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-black dark:text-white">
                    ${order.total}
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
                    api={`/orders/${order.id}`}
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

        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={totalPages}
          previousLabel="< previous"
          containerClassName="flex justify-center space-x-2 py-5 mt-5"
          pageClassName="page-item"
          pageLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          previousClassName="page-item"
          previousLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          nextClassName="page-item"
          nextLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          breakClassName="page-item"
          breakLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          activeClassName="bg-primary text-white"
        />

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
                <strong>Order Number:</strong> {selectedOrder.id}
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
                <strong>Shipping Address:</strong> {selectedOrder.address},{" "}
                {selectedOrder.city}, {selectedOrder.country},{" "}
                {selectedOrder.postalCode}
              </p>
              <p className="text-white">
                <strong>Total Amount:</strong> ${selectedOrder.total}
              </p>
              <p className="text-white">
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </p>
              <p className="text-white">
                <strong>Order Items:</strong>
              </p>
              <ul className="text-white">
                {selectedOrder.order_items.map((item) => (
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
