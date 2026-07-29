export type OrderStatus = 'New Order' | 'Order Confirmed' | 'Order Ongoing' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string; // ISO String
  customerName: string;
  phoneNumber: string;
  email: string;
  location: string;
  deliveryArea: 'Kathmandu Valley' | 'Outside Kathmandu Valley';
  productName: string;
  quantity: number;
  size: string;
  pricePerPiece: number;
  deliveryFee: number;
  totalPrice: number;
  paymentMethod: 'Cash On Delivery';
  orderStatus: OrderStatus;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  regularPrice: number;
  offerPrice: number;
  currency: string;
  description: string;
  heroImage: string;
  images: string[];
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  sizes: string[];
  testimonials: {
    id: string;
    quote: string;
    author: string;
    location: string;
    rating: number;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
