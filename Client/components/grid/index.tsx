import React from "react";
import Card from "@/components/card";
import ReactLoading from "react-loading";
import { Product } from "@/types";

interface Props {
  products: Product[];
  loading: boolean;
}

const Grid = ({ products, loading }: Props) => {
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <ReactLoading type="bars" color="#000000" />
    </div>
  ) : products.length > 0 ? (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 my-10 min-h-screen">
        {products.map((product: Product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen text-center text-lg text-gray-600 tracking-wide">
      <span>No Products Found</span>
    </div>
  );
};

export default Grid;
