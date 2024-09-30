"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import PhotosUploader from "@/components/Uploader";
import toast from "react-hot-toast";
import axios from "axios";
import { Product, Category } from "@/types";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/authStore";

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
const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") ?? 1;
  const [id, setId] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    getProductsAndCategories();
  }, [pageParam]);

  const getProductsAndCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=${pageParam}`,
      );
      setProducts(res.data.products);
      setTotalPages(res.data.lastPage);
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      );
      setCategories(res2.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=${pageParam}`,
      );
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const initialFormData = {
    title: "",
    description: "",
    category: 0,
    price: 0,
    discountedPrice: 0,
    inStock: 1,
    inStockQuantity: 0,
    images: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setFormData(initialFormData);
    setEditMode(false);
    setModalIsOpen(false);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isFormValid = () => {
    return (
      formData.title.length > 0 &&
      formData.description.length > 0 &&
      formData.category > 0 &&
      formData.price > 0 &&
      formData.inStock >= 0 &&
      formData.inStockQuantity >= 0 && // Check inStockQuantity validity
      formData.images.length > 0
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    if (editMode) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          discounted_price: formData.discountedPrice,
          category_id: formData.category,
          in_stock: formData.inStock,
          in_stock_quantity:
            formData.inStock === 1 ? formData.inStockQuantity : 0,
          images: formData.images,
        });
        toast.success("Product updated successfully");
        closeModal();
        setId(0);
        getProducts();
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update product");
        setLoading(false);
      }
    } else {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          discounted_price: formData.discountedPrice,
          category_id: formData.category,
          in_stock: formData.inStock,
          in_stock_quantity:
            formData.inStock === 1 ? formData.inStockQuantity : 0,
          images: formData.images,
        });
        toast.success("Product added successfully");
        closeModal();
        getProducts();
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to add product");
        setLoading(false);
      }
    }
  };

  const handlePageClick = (data: any) => {
    navigate.push(`?page=${data.selected + 1}`);
  };

  if (!user?.permissions.Products) {
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
        <Breadcrumb pageName="Products" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Products
            </h4>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Product
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Add Product"
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    Add Product
                  </h4>
                  <button
                    onClick={closeModal}
                    className="dark:text-white dark:hover:text-white"
                  >
                    <IoMdClose size={18} />
                  </button>
                </div>
                <form className="px-4 py-4 md:px-6 xl:px-7.5">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: parseInt(e.target.value),
                          })
                        }
                        className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value={0}>Select Category</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="discountedPrice"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Discounted Price (Optional)
                        </label>
                        <input
                          type="number"
                          id="discountedPrice"
                          name="discountedPrice"
                          value={formData.discountedPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountedPrice: parseFloat(e.target.value),
                            })
                          }
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="in_stock"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        In Stock
                      </label>
                      <select
                        id="in_stock"
                        name="in_stock"
                        value={formData.inStock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inStock: parseInt(e.target.value),
                          })
                        }
                        className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>

                    {/* Conditionally render inStockQuantity if in_stock is 1 (Yes) */}
                    {formData.inStock === 1 && (
                      <div>
                        <label
                          htmlFor="inStockQuantity"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          id="inStockQuantity"
                          name="inStockQuantity"
                          value={formData.inStockQuantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inStockQuantity: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="images"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Images
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.images}
                        maxPhotos={5}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, images: photos })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    {editMode ? "Update Product" : "Add Product"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          <div className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
            <div className="col-span-3 flex items-center">
              <p className="font-medium">Product Name</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">Category</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Price</p>
            </div>
            <div className="col-span-2 flex items-center whitespace-nowrap">
              <p className="font-medium">Discounted Price</p>
            </div>
            <div className="col-span-2 flex items-center whitespace-nowrap">
              <p className="font-medium">Stock Quantity</p> {/* New Column */}
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <p className="font-medium">Actions</p>
            </div>
          </div>

          {loading ? (
            <Loader className="h-[60vh]" />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, key) => (
              <div
                className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                key={key}
              >
                <div className="col-span-3 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                      <img
                        src={product.images[0]}
                        className="h-15 w-15 object-cover"
                        alt="Product"
                      />
                    </div>
                    <p className="text-sm text-black dark:text-white">
                      {product.title}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {product.category}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    ${product.price}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-red-500 text-sm">
                    {product.discountedPrice
                      ? `$${product.discountedPrice}`
                      : "N/A"}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {product.inStockQuantity}
                  </p>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <a
                    // href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/products/${product.category}/${product.id}`}
                    target="_blank"
                    className="dark:text-white"
                  >
                    <FaEye size={18} />
                  </a>
                  <button
                    onClick={() => {
                      setFormData({
                        title: product.title,
                        description: product.description,
                        category: categories.find(
                          (category) => category.name === product.category,
                        )?.id as any,
                        price: product.price as any,
                        discountedPrice: product.discountedPrice as any,
                        inStock: product.inStock as any,
                        inStockQuantity: product.inStockQuantity as any,
                        images: product.images as any,
                      });
                      setEditMode(true);
                      setId(product.id);
                      openModal();
                    }}
                    className="dark:text-white"
                  >
                    <FaEdit size={18} />
                  </button>
                  <Delete
                    api={`/products/${product.id}`}
                    message="Product deleted successfully"
                    fetch={getProducts}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-black dark:text-white">
              No products found.
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
      </div>
    </DefaultLayout>
  );
};

export default Products;
