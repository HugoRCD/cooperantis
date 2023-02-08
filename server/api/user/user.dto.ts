export interface createUserInput {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  profession: string;
}

export interface updateUserInput {
  username?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: number;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  profession?: string;
  website?: string;
  bio?: string;
  company?: string;
}
