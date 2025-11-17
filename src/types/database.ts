// Database model type definitions

export interface UserModel {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItemModel {
  id: number;
  category: 'adult' | 'child';
  title: string;
  description?: string;
  before_image_path: string;
  after_image_path: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentModel {
  id: number;
  userId: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge?: number;
  appointmentDate: string;
  appointmentTime: string;
  treatmentType: string;
  doctorId?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationModel {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'reminder' | 'appointment' | 'general';
  isRead: boolean;
  createdAt?: string;
}

export interface ReminderModel {
  id: number;
  userId: number;
  title: string;
  time: string;
  type: 'brush' | 'floss' | 'checkup' | 'medication';
  enabled: boolean;
  repeatDaily: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Database query result types
export interface QueryResult {
  rows: {
    length: number;
    item: (index: number) => any;
    raw: () => any[];
  };
  rowsAffected: number;
  insertId?: number;
}

export interface Transaction {
  executeSql: (
    sql: string,
    params?: any[],
    success?: (tx: Transaction, result: QueryResult) => void,
    error?: (tx: Transaction, error: Error) => void
  ) => void;
}
