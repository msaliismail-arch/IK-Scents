export interface Size {
  id?: string;
  label: string;
  price: string;
  position?: number;
}

export interface Perfume {
  id: string;
  name: string;
  description: string;
  image: string;
  published: boolean;
  sizes: Size[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string | null;
  perfumeId?: string | null;
  perfumeName: string;
  sizeLabel: string;
  price: string;
  quantity: number;
  note?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
