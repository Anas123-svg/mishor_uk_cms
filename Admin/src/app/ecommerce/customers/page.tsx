"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { User } from "@/types";
import axios from "axios";
import Delete from "@/components/Delete";
import useAuthStore from "@/store/authStore";
import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customerData, setCustomerData] = useState<User[]>([]);
  const { user, token } = useAuthStore();
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") ?? 1;

  const handlePageClick = (data: any) => {
    navigate.push(`?page=${data.selected + 1}`);
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users?page=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomerData(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [pageParam]);

  const filteredCustomers = customerData.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user?.permissions.Customers) {
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
        <Breadcrumb pageName="Customers" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col justify-between px-4 py-6 md:flex-row md:items-center md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Customers
            </h4>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-5 w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary md:mt-0"
              />
            </div>
          </div>
          <div className="max-w-full overflow-x-auto md:hidden">
            {/* Card layout for mobile */}
            <div className="space-y-4 p-4">
              {filteredCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="rounded border border-stroke p-4 shadow-sm dark:border-strokedark dark:bg-meta-4"
                >
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {customer.name}
                  </p>
                  <p className="text-black dark:text-white">
                    <strong>Email:</strong> {customer.email}
                  </p>
                  <p className="text-black dark:text-white">
                    <strong>Phone:</strong> {customer.phone}
                  </p>
                  <p className="text-black dark:text-white">
                    <strong>Address:</strong> {customer.address}
                  </p>
                  <div className="flex justify-end">
                    <Delete
                      api={`/admin/users/${customer.id}`}
                      fetch={fetchCustomers}
                      message="Customer deleted successfully"
                    />
                  </div>
                </div>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="text-center text-black dark:text-white">
                  No customers found.
                </p>
              )}
            </div>
          </div>
          {/* Table layout for desktop */}
          <div className="hidden max-w-full overflow-x-auto md:block">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Phone
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Address
                  </th>
                  <th className="px-4 py-4 text-end font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {customer.name}
                      </p>
                    </td>
                    <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {customer.email}
                      </p>
                    </td>
                    <td className="whitespace-nowrap border-b border-stroke px-4 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {customer.phone}
                      </p>
                    </td>
                    <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {customer.address}
                      </p>
                    </td>
                    <td className="border-b border-stroke px-4 py-4 text-end dark:border-strokedark">
                      <Delete
                        api={`/admin/users/${customer.id}`}
                        fetch={fetchCustomers}
                        message="Customer deleted successfully"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <p className="p-4 text-center text-black dark:text-white">
                No customers found.
              </p>
            )}
          </div>
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
      </div>
    </DefaultLayout>
  );
};

export default Customers;
