import React from "react";
import Link from "next/link";
import { Blog } from "@/types";

interface Props {
  blog: Blog;
}

const Card = ({ blog }: Props) => {
  return (
    <Link
      href={`/blogs/${blog._id}`}
      key={blog._id}
      className="bg-white shadow-md overflow-hidden h-fit hover:shadow-xl transition duration-300 ease-in-out"
    >
      <img
        src={blog.titleImage}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-mons tracking-wide mb-2">{blog.title}</h2>
        <p className="text-gray-700 mb-4 line-clamp-4 text-justify">
          {blog.description}
        </p>
        <div className="flex items-center">
          <img
            src={blog.authorImage}
            alt={blog.author}
            className="w-10 h-10 rounded-full mr-4 object-cover"
          />
          <div>
            <p className="text-gray-900 font-mons">{blog.author}</p>
            <p className="text-gray-600 text-sm">{blog.timeToRead} min read</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
