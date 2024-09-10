"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import PhotosUploader from "@/components/Uploader";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { Event } from "@/types";

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

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const initialFormData = {
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    getEvents();
  }, []);

  // Fetch events from the API
  const getEvents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`);
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
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
    if (
      !formData.image ||
      !formData.title ||
      !formData.description ||
      !formData.date
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (editMode && id !== null) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
          title: formData.title,
          date: formData.date,
          description: formData.description,
          image: formData.image,
        });
        toast.success("Event updated successfully");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          title: formData.title,
          date: formData.date,
          description: formData.description,
          image: formData.image,
        });
        toast.success("Event added successfully");
      }

      closeModal();
      getEvents();
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  // Filter events by search term
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="Events" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Events
            </h4>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Event
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={editMode ? "Edit Event" : "Add Event"}
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit Event" : "Add Event"}
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
                        htmlFor="date"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date: e.target.value,
                          })
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
                        htmlFor="image"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Image
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.image ? [formData.image] : []}
                        maxPhotos={1}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, image: photos[0] })
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    {editMode ? "Update Event" : "Add Event"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          <div className="grid grid-cols-9 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Date</p>
            </div>
            <div className="col-span-3 flex items-center">
              <p className="font-medium">Event Name</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Description</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <p className="font-medium">Image</p>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <p className="font-medium">Actions</p>
            </div>
          </div>

          {loading ? (
            <Loader className="h-[60vh]" />
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-9 items-center border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
              >
                <div className="col-span-2">
                  <p className="text-sm text-black dark:text-white">
                    {new Date(event.date).toDateString()}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-black dark:text-white">
                    {event.title}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-black dark:text-white">
                    {event.description}
                  </p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-12 w-12 rounded-md object-contain"
                  />
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        title: event.title,
                        date: event.date,
                        description: event.description,
                        image: event.image,
                      });
                      setEditMode(true);
                      setId(event.id);
                      openModal();
                    }}
                    className="dark:text-white"
                  >
                    <FaEdit size={18} />
                  </button>
                  <Delete
                    api={`/events/${event.id}`}
                    message="Event deleted successfully"
                    fetch={getEvents}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-black dark:text-white">
              No events found.
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Events;
