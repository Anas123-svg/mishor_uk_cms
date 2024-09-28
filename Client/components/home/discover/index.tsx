"use client";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import Grid from "@/components/grid";

const Discover = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products
?page=1`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-6 md:px-12 py-20 lg:px-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center tracking-wider font-mons">
        Discover our latest products
      </h1>
      <Grid products={products.slice(0, 3)} loading={loading} />
    </div>
  );
};

export default Discover;
