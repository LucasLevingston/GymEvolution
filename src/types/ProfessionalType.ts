export interface Review {
  id: string;
  rating: number;
  content: string;
  date: string;
  author: {
    id: string;
    name: string;
    initials: string;
  };
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  city?: string;
  state?: string;
  phone?: string;
  imageUrl?: string;
  location: string;
  specialty: string;
  experience?: number;
  rating?: number;
  available: boolean;
  specialties?: string[];
  certifications?: string[];
  education?: string[];
  availability?: string[];
  reviews?: Review[];
}
