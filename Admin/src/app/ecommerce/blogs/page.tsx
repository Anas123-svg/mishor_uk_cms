"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Editor } from "@tinymce/tinymce-react";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import PhotosUploader from "@/components/Uploader";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { Blog, BlogCategory } from "@/types";
import { FaEdit } from "react-icons/fa";

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

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const initialFormData = {
    author: "",
    author_image: [] as any,
    title: "",
    title_image: [] as any,
    description: "",
    content: "",
    category_id: 0,
    time_to_read: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    getBlogsAndCategories();
  }, []);

  const getBlogsAndCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
      setBlogs(res.data);
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blog-categories`,
      );
      setCategories(res2.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getBlogs = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
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
    if (
      formData.title === "" ||
      formData.description === "" ||
      formData.category_id === 0 ||
      formData.content === "" ||
      formData.author === "" ||
      formData.time_to_read === "" ||
      formData.author_image.length === 0 ||
      formData.title_image.length === 0
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    console.log(formData);

    setLoading(true);

    try {
      if (editMode && id !== null) {
        // Update blog
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
          author: formData.author,
          author_image: formData.author_image[0],
          title: formData.title,
          title_image: formData.title_image[0],
          description: formData.description,
          content: formData.content,
          category_id: formData.category_id,
          time_to_read: formData.time_to_read,
        });
        toast.success("Blog updated successfully");
      } else {
        // Add new blog
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
          author: formData.author,
          author_image: formData.author_image[0],
          title: formData.title,
          title_image: formData.title_image[0],
          description: formData.description,
          content: formData.content,
          category_id: formData.category_id,
          time_to_read: formData.time_to_read,
        });
        toast.success("Blog added successfully");
      }

      closeModal();
      getBlogs();
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs by search term
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="Blogs" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Blogs
            </h4>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Blog
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={editMode ? "Edit Blog" : "Add Blog"}
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit Blog" : "Add Blog"}
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
                        htmlFor="author"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Author
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="author_image"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Author Image
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.author_image}
                        maxPhotos={1}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, author_image: photos })
                        }
                      />
                    </div>
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
                        htmlFor="title_image"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Title Image
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.title_image}
                        maxPhotos={1}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, title_image: photos })
                        }
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
                        htmlFor="content"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Content
                      </label>
                      <Editor
                        apiKey="g0zqs3p6v9zx7zhnrzgdphkxjcz3dvgt6kl7bxln19etxto6"
                        init={{
                          plugins:
                            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                          toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                        }}
                        value={formData.content}
                        onEditorChange={(content) =>
                          setFormData({ ...formData, content })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category_name"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category_name"
                        name="category_name"
                        value={formData.category_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category_id: parseInt(e.target.value),
                          })
                        }
                        className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value={0}>Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="time_to_read"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Time to Read
                      </label>
                      <input
                        type="text"
                        id="time_to_read"
                        name="time_to_read"
                        value={formData.time_to_read}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            time_to_read: e.target.value,
                          })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-4 w-full rounded bg-primary py-2 text-white"
                  >
                    {editMode ? "Update Blog" : "Add Blog"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>
          {loading ? (
            <Loader className="h-[60vh]" />
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 md:p-6 xl:p-7.5">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="rounded-md border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
                >
                  <img
                    src={blog.title_image}
                    alt={blog.title}
                    className="h-40 w-full rounded-md object-cover"
                  />
                  <h4 className="mt-4 text-lg font-semibold text-black dark:text-white">
                    {blog.title}
                  </h4>
                  <p className="mt-2 text-sm text-black dark:text-white">
                    {blog.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={blog.author_image}
                      alt={blog.author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {blog.author}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {blog.time_to_read} min read
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          author: blog.author,
                          author_image: [blog.author_image],
                          title: blog.title,
                          title_image: [blog.title_image],
                          description: blog.description,
                          content: blog.content,
                          category_id: parseInt(blog.category_id),
                          time_to_read: blog.time_to_read,
                        });
                        setEditMode(true);
                        setId(blog.id);
                        openModal();
                      }}
                      className="dark:text-white"
                    >
                      <FaEdit size={18} />
                    </button>
                    <Delete
                      api={`/blogs/${blog.id}`}
                      message="Blog deleted successfully"
                      fetch={getBlogs}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="w-full px-4 py-6 text-center text-black dark:text-white">
              No blogs found.
            </p>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Blogs;
