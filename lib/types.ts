export type EventDTO = {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  sold: number;
  categories: string[];
  organizerId: string;
  price?: number;
  currency?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type TicketDTO = {
  id: number | string;
  eventId: string;
  userId: string;
  price: number;
  currency: string;
  status: string;
  issuedAt: string;
  validatedAt?: string | null;
};
