"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "@/types";
import Grid from "@/components/grid";
import { Search } from "@/components/ui/search";
import { useParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { query } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/filter?query=${query}&page=${page}`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts();
  }, [page]);

  return (
    <div className="pt-32 pb-10 px-6 md:px-12 lg:px-24">
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="text-4xl font-mons tracking-wide">Search</h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Search for Gym Clothing & Accessories Find the perfect gym gear with
          ease. From performance-driven workout clothing to essential
          accessories like water bottles and gym bags, search for everything you
          need to elevate your fitness game!
        </p>
      </div>
      <div className="flex gap-5 w-full  items-center">
        <h2 className="font-semibold shrink-0 border p-2 text-xs sm:text-sm">
          {products.length} {products.length > 1 ? "Products" : "Product"}
        </h2>
        <Search
          placeholders={[
            "Search by product name or category",
            "Find items by color, size, or style",
            "Look for gym gear by description or features",
          ]}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={() => router.push(`/search/${search}`)}
        />
      </div>
      <h1 className="text-2xl font-mons tracking-wide mt-10">
        Showing Results for "{decodeURI(query.toString())}"
      </h1>
      <Grid loading={loading} products={products} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (page === 1) return;
                setPage(page - 1);
              }}
              disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => {
                  setPage(p);
                }}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (page === totalPages) return;
                setPage(page + 1);
              }}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default page;
