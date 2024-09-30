type Permissions = {
  Customers: Boolean;
  Products: Boolean;
  Orders: Boolean;
};

type Admin = {
  id: number;
  profile_pic: string;
  name: string;
  email: string;
  role: string;
  permissions: Permissions;
  created_at: string;
  updated_at: string;
};

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
  id: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  paymentMethod: string;
  delivery: number;
  email: string;
  name: string;
  phone: string;
  status: OrderStatus;
  subTotal: number;
  total: number;
  order_items: [
    {
      product: Product;
      product_id: number;
      quantity: number;
    },
  ];
  created_at: string;
  updated_at: string;
  user_id: number;
};

export type { User, Product, Category, Admin, Permissions, Order };
