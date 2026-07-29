import { Product } from '../types';

import heroFlatlay from '../assets/images/hero_flatlay_henley_1785239153496.jpg';
import model1 from '../assets/images/model_lifestyle_1_1785239166821.jpg';
import model2 from '../assets/images/model_lifestyle_2_1785239184955.jpg';
import model3 from '../assets/images/model_lifestyle_3_1785239196822.jpg';

export const PINP_PRODUCT: Product = {
  id: 'compass-tide-henley',
  brand: 'PinP (Custom Print Shirts & T-Shirts)',
  name: 'Compass & Tide Printed Henley Shirt',
  regularPrice: 200,
  offerPrice: 139,
  currency: 'NPR',
  description:
    'A relaxed, premium mandarin-collar henley shirt in a warm sand tone, featuring an original hand-drawn nautical print — a compass rose rising out of crashing waves with a trail of birds taking flight across the chest. Made for everyday wear with an effortless, well-traveled look.',
  heroImage: heroFlatlay,
  images: [
    heroFlatlay,
    model1,
    model2,
    model3,
  ],
  sizes: ['M', 'L', 'XL', 'XXL'],
  benefits: [
    {
      title: 'Soft Cotton-Linen Blend',
      description: 'Ultra-breathable cotton-linen blend fabric that keeps you cool and comfortable all day long.',
      icon: 'Feather',
    },
    {
      title: 'Exclusive Nautical Artwork',
      description: 'Original, hand-drawn compass & ocean wave print — custom crafted, not available anywhere else.',
      icon: 'Compass',
    },
    {
      title: 'Relaxed Mandarin Collar Cut',
      description: 'Sophisticated mandarin collar henley placket that pairs effortlessly with denim, chinos, or shorts.',
      icon: 'Sparkles',
    },
    {
      title: 'Roll-Up Sleeve Tabs',
      description: 'Built-in sleeve button tabs allow you to easily adjust and customize your look on the go.',
      icon: 'Sliders',
    },
    {
      title: 'Pre-Shrunk & Colorfast',
      description: 'Specially treated to resist shrinkage and hold vibrant print tones wash after wash.',
      icon: 'ShieldCheck',
    },
  ],
  testimonials: [
    {
      id: 't1',
      quote:
        "The print quality is honestly better than shirts I've bought for triple the price. Fabric feels premium too.",
      author: 'Bikash T.',
      location: 'Kathmandu',
      rating: 5,
    },
    {
      id: 't2',
      quote:
        "Ordered on COD, got it in 2 days, fit was perfect. Will be back for more designs.",
      author: 'Sujata R.',
      location: 'Lalitpur',
      rating: 5,
    },
    {
      id: 't3',
      quote:
        "Compliments every time I wear it. The compass design is different from anything else out there.",
      author: 'Aayush M.',
      location: 'Pokhara',
      rating: 5,
    },
  ],
  faqs: [
    {
      question: 'Is this Cash On Delivery available everywhere in Nepal?',
      answer: 'Yes, we deliver nationwide across Nepal with Cash On Delivery available at your doorstep.',
    },
    {
      question: 'What sizes are available?',
      answer: 'Standard sizes from M to XXL — true to size with an effortless, relaxed fit.',
    },
    {
      question: 'What is the fabric?',
      answer: 'A soft, high-grade cotton-linen blend — lightweight, breathable, and durable for daily wear.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Express delivery takes 1–2 days within Kathmandu Valley and 3–5 days outside the valley.',
    },
    {
      question: 'Is there a delivery charge?',
      answer: 'Delivery is FREE inside Kathmandu Valley! Outside the valley, delivery is NPR 50.',
    },
    {
      question: 'Can I return or exchange if it doesn\'t fit?',
      answer: 'Yes! Exchanges are accepted within 3 days of delivery as long as the item is unworn and tags remain intact.',
    },
  ],
};
