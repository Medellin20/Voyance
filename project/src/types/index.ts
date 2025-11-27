export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
}

export interface Pack {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  features: string[];
  popular: boolean;
}

export interface Testimonial {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  pack_id: string;
  status: 'pending' | 'active' | 'expired';
  payment_method: 'rib' | 'paypal';
  start_date?: string;
  end_date?: string;
  created_at: string;
}
