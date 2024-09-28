"use client";
import React, { useEffect, useMemo, useState } from "react";
//@ts-ignore
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import axios from "axios";
import { Product } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GoFilter } from "react-icons/go";
import Grid from "@/components/grid";

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts();
  }, [page]);

  const getProducts = async (filter?: boolean) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=${filter ? 1 : page}`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.lastPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 0;

    return products.reduce((acc, curr) => {
      const currentMaxPrice = curr.discountedPrice || curr.price;
      return currentMaxPrice > acc ? currentMaxPrice : acc;
    }, 0);
  }, [products]);

  return (
    <div className="pt-32 px-6 md:px-12 lg:px-24">
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wide">
          Our Catalogue
        </h1>
        <p className="text-sm md:text-base mt-4 text-gray-600 max-w-xl">
          Discover premium health and safety equipment designed to protect your
          business. Explore our range of compliance tools, safety gear, and
          solutions built for reliability and effectiveness. Equip your
          workplace with the essentials to ensure safety and compliance!
        </p>
      </div>
      <div className="w-full my-10">
        <div className="flex justify-center">
          <div className="flex justify-center w-full max-w-sm">
            <Select onValueChange={(e) => setSort(e)}>
              <SelectTrigger className="h-full rounded-none w-1/2 flex items-center justify-center gap-2 border border-black font-light px-4">
                <SelectValue placeholder={"Sort By"} />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem className="font-light" value="name">
                  Name
                </SelectItem>
                <SelectItem className="font-light" value="price-low-to-high">
                  Price (Low to High)
                </SelectItem>
                <SelectItem className="font-light" value="price-high-to-low">
                  Price (High to Low)
                </SelectItem>
                <SelectItem className="font-light" value="newest">
                  Newest
                </SelectItem>
                <SelectItem className="font-light" value="oldest">
                  Oldest
                </SelectItem>
                <SelectItem className="font-light" value="discount">
                  Discount
                </SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger className="w-1/2 flex items-center justify-center gap-2 border border-black font-light py-2 px-4">
                <GoFilter />
                Filters
              </SheetTrigger>
              <SheetContent className="h-dvh flex flex-col">
                <h1 className="text-lg md:text-2xl font-mons font-light pb-5 border-b border-black">
                  Filters
                </h1>
                <h2 className="font-mons font-light pt-5">Price Range: </h2>
                <div id="range">
                  <RangeSlider
                    min={0}
                    max={maxPrice}
                    step={1}
                    value={[filters.minPrice, filters.maxPrice]}
                    onInput={(value: any) => {
                      setFilters({
                        ...filters,
                        minPrice: value[0],
                        maxPrice: value[1],
                      });
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => {
                      const value = +e.target.value;
                      if (value <= filters.maxPrice && value >= 0)
                        setFilters({ ...filters, minPrice: value });
                    }}
                    className="border border-black rounded-none w-1/2 p-2 outline-none placeholder:font-light font-light"
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const value = +e.target.value;
                      if (value >= filters.minPrice && value <= maxPrice)
                        setFilters({ ...filters, maxPrice: value });
                    }}
                    className="border border-black rounded-none w-1/2 p-2 outline-none placeholder:font-light font-light"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => {
                      setFilters({
                        minPrice: 0,
                        maxPrice: maxPrice,
                      });
                    }}
                    className="font-mons flex justify-center py-2 bg-secondary hover:bg-black text-white transition duration-200"
                  >
                    Clear
                  </button>
                  <SheetClose
                    onClick={() => {
                      setPage(1);
                      getProducts(true);
                    }}
                    className="font-mons flex justify-center py-2 bg-primary hover:bg-primary-hover text-white transition duration-200"
                  >
                    Apply
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <Grid
          products={
            sort === "name"
              ? products.slice().sort((a, b) => a.title.localeCompare(b.title))
              : sort === "price-low-to-high"
              ? products
                  .slice()
                  .sort(
                    (a, b) =>
                      (a.discountedPrice ? a.discountedPrice : a.price) -
                      (b.discountedPrice ? b.discountedPrice : b.price)
                  )
              : sort === "price-high-to-low"
              ? products
                  .slice()
                  .sort(
                    (a, b) =>
                      (b.discountedPrice ? b.discountedPrice : b.price) -
                      (a.discountedPrice ? a.discountedPrice : a.price)
                  )
              : sort === "newest"
              ? products
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
              : sort === "oldest"
              ? products
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.created_at).getTime() -
                      new Date(b.created_at).getTime()
                  )
              : sort === "discount"
              ? products.filter((product) => product.discountedPrice > 0)
              : products
          }
          loading={loading}
        />
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
    </div>
  );
};

export default page;
