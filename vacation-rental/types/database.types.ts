export interface GuestInfo {
  id: string;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  address?: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  check_in_date: string;
  check_out_date: string;
  created_at: string;
} 