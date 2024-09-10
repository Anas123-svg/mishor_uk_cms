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
  const [id, setId] = useState(0);

  useEffect(() => {
    getProductsAndCategories();
  }, []);

  const getProductsAndCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
      );
      setProducts(res.data);
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
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const initialFormData = {
    title: "",
    description: "",
    category: 0,
    price: 0,
    discounted_price: 0,
    in_stock: 1,
    stock_quantity: 0,
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
      formData.in_stock >= 0 &&
      formData.stock_quantity >= 0 && // Check stock_quantity validity
      formData.images.length > 0
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid()) {
      console.log(formData);
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
          discounted_price: formData.discounted_price,
          category_id: formData.category,
          in_stock: formData.in_stock,
          in_stock_quantity:
            formData.in_stock === 1 ? formData.stock_quantity : 0,
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
          discounted_price: formData.discounted_price,
          category_id: formData.category,
          in_stock: formData.in_stock,
          in_stock_quantity:
            formData.in_stock === 1 ? formData.stock_quantity : 0,
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
                          htmlFor="discounted_price"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Discounted Price (Optional)
                        </label>
                        <input
                          type="number"
                          id="discounted_price"
                          name="discounted_price"
                          value={formData.discounted_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discounted_price: parseFloat(e.target.value),
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
                        value={formData.in_stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            in_stock: parseInt(e.target.value),
                          })
                        }
                        className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>

                    {/* Conditionally render stock_quantity if in_stock is 1 (Yes) */}
                    {formData.in_stock === 1 && (
                      <div>
                        <label
                          htmlFor="stock_quantity"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          id="stock_quantity"
                          name="stock_quantity"
                          value={formData.stock_quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stock_quantity: parseInt(e.target.value),
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
                    {product.discounted_price
                      ? `$${product.discounted_price}`
                      : "N/A"}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {product.in_stock_quantity}
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
                        discounted_price: product.discounted_price as any,
                        in_stock: product.in_stock as any,
                        stock_quantity: product.in_stock_quantity as any,
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
      </div>
    </DefaultLayout>
  );
};

export default Products;
