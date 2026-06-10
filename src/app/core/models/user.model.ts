export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  loyaltyPoints: number;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  loyaltyPoints: number;
}
