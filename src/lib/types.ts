export interface Perfume {
  id: string;
  name: string;
  description: string;
  image: string;
  price5ml: string;
  price10ml: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
