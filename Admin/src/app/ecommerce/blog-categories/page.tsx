"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { BlogCategory } from "@/types";

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
    backgroundColor: "#1f2937", // dark background color
    color: "#f9fafb", // light text color
    border: "1px solid #374151", // dark border color
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const BlogCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const initialFormData = {
    name: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    getCategories();
  }, []);

  // Fetch categories from the API
  const getCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blog-categories`,
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.name === "") {
      toast.error("Please fill in the category name");
      return;
    }

    setLoading(true);

    try {
      if (editMode && id !== null) {
        // Update category
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/blog-categories/${id}`,
          {
            name: formData.name,
          },
        );
        toast.success("Category updated successfully");
      } else {
        // Add new category
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blog-categories`, {
          name: formData.name,
        });
        toast.success("Category added successfully");
      }

      closeModal();
      getCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="Blog Categories" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Categories
            </h4>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Category
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Add Category"
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit Category" : "Add Category"}
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
                        htmlFor="name"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    {editMode ? "Update Category" : "Add Category"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          <div className="grid grid-cols-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
            <div className="col-span-2 flex items-center">
              <p className="font-medium">ID</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Category Name</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Blogs</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Created On</p>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <p className="font-medium">Actions</p>
            </div>
          </div>

          {loading ? (
            <Loader className="h-[60vh]" />
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category, key) => (
              <div
                className="grid grid-cols-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                key={key}
              >
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {category.id}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {category.name}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {category.blogs}
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setFormData({ name: category.name });
                      setEditMode(true);
                      setId(category.id);
                      openModal();
                    }}
                    className="dark:text-white"
                  >
                    <FaEdit size={18} />
                  </button>
                  <Delete
                    api={`/blog-categories/${category.id}`}
                    message="Category deleted successfully"
                    fetch={getCategories}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-black dark:text-white">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BlogCategories;
