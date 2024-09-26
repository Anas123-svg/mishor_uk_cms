type User = {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  mobile_phone_number: string;
  email: string;
  confirmation_of_knowledge: boolean;
  referral_code: string | null;
  carts: any[];
  wishlists: any[];
  created_at: string;
  updated_at: string;
};

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

type Review = {
  _id: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number | null;
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
  id: number;
  author: string;
  author_image: string;
  title: string;
  title_image: string;
  description: string;
  content: string;
  category_id: string;
  category_name: string;
  time_to_read: string;
  created_at: string;
  updated_at: string;
  comments: any[];
};

type BlogCategory = {
  id: number;
  name: string;
  blogs: number;
  created_at: string;
  updated_at: string;
};

type Event = {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
};

type Order = {
  id: number;
  order_number: string;
  name: string;
  email: string;
  phone: string;
  shipping_address_line1: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code: string;
  payment_method: string;
  total_amount: string;
  status: string;
  items: [
    {
      product_id: number;
      product: Product;
      quantity: number;
    },
  ];
  created_at: string;
};

type GuestOrder = {
  id: number;
  order_number: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  shipping_address_line1: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code: string;
  payment_method: string;
  total_amount: string;
  status: string;
  products: [
    {
      product: Product;
      quantity: number;
    },
  ];
  created_at: string;
  updated_at: string;
};

export type {
  User,
  Product,
  Category,
  Blog,
  BlogCategory,
  Event,
  Admin,
  Permissions,
  Order,
  GuestOrder,
};
