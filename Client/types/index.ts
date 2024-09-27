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

type Blog = {
  _id: string;
  author: string;
  authorImage: string;
  title: string;
  titleImage: string;
  description: string;
  category: string;
  content: string;
  timeToRead: string;
  createdAt: string;
  updatedAt: string;
};

type BlogCategory = {
  _id: string;
  name: string;
  blogs: number;
  createdAt: string;
  updatedAt: string;
};

enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

type Order = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  order: [
    {
      quantity: number;
      size: string;
      color: string;
      product: Product;
    }
  ];
  status: OrderStatus;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentReceipt: string;
  subTotal: number;
  delivery: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  map: string;
};

export type {
  Cart,
  Wishlist,
  User,
  Product,
  Review,
  Category,
  Blog,
  FAQ,
  BlogCategory,
  ContactInfo,
  Order,
};

export { OrderStatus };
