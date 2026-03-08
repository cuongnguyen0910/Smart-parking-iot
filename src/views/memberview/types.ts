export type Screen = 'login' | 'dashboard' | 'history' | 'payments' | 'settings' | 'exit' | 'support';

export interface ParkingSession {
  id: string;
  location: string;
  dateTime: string;
  duration: string;
  cost: string;
  status: 'Completed' | 'Ongoing' | 'Cancelled';
  vehicle: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: 'motorcycle' | 'car';
  isPrimary: boolean;
}
