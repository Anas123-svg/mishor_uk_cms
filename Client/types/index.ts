type Cart = {
  product: Product;
  quantity: number;
};

type Wishlist = {
  product: Product;
};

type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  carts: Cart[];
  wishlists: Wishlist[];
  created_at: string;
  updated_at: string;
};

type Review = {
  id: number;
  product_id: number;
  user_id: number;
  reviewer_name: string;
  user_email: string;
  rating: number;
  title: string;
  review: string;
  created_at: string;
  updated_at: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  images: string[];
  category: string;
  inStock: boolean;
  inStockQuantity: number;
  description: string;
  reviews: Review[];
  created_at: string;
  updated_at: string;
};

type Category = {
  id: number;
  name: string;
  products_count: number;
  created_at: string;
  updated_at: string;
};

enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

type Order = {
  order_id: number;
  status: OrderStatus;
  total: number;
  items: [
    {
      product: Product;
      product_id: number;
      quantity: number;
    }
  ];
  created_at: string;
  updated_at: string;
};

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export type { Cart, Wishlist, User, Product, Review, Category, FAQ, Order };

export { OrderStatus };
