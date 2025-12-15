// Type definitions for the application

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

// Gallery types
export interface GalleryItem {
  id: number;
  category: 'adult' | 'child';
  title: string;
  before_image_path: string;
  after_image_path: string;
  createdAt?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  qualification: string;
  image_path: string;
  display_order?: number;
}

export interface Testimonial {
  id: number;
  patient_name: string;
  treatment_type: string;
  content: string;
  image_path?: string;
  rating: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface CareGuide {
  id: number;
  title: string;
  content: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  treatment_interest?: string;
  status: 'pending' | 'contacted';
  created_at: string;
}

// Education types
export interface EducationTopic {
  id: string;
  title: string;
  icon: string;
  content: string;
  category?: string;
  videoUrl?: string;
}

// Game types
export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  banner: string;
  packageName: string;
}

// Video types
export interface Video {
  path: string;
  name: string;
  size?: number;
  duration?: number;
}

// Doctor types
export interface Doctor {
  id: string;
  name: string;
  credentials: string;
  specialization: string;
  experience: string;
  about: string;
  education: string[];
  achievements: string[];
  avatar: any;
}

// Appointment types
export interface Appointment {
  id: number;
  userId: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  treatmentType: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: string;
}

// Reminder types
export interface Reminder {
  id: string;
  title: string;
  time: string;
  icon: string;
  enabled: boolean;
  type: 'brush' | 'floss' | 'checkup' | 'medication';
}

// Auth Context types
export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Theme Context types
export interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  UserApp: undefined;
  AdminApp: undefined;
};

export type UserDrawerParamList = {
  Home: undefined;
  PatientEducation: undefined;
  TreatmentGallery: undefined;
  DentalApp: undefined;
  Games: undefined;
  AboutUs: undefined;
  VideoPlayer: { videoPath: string };
  Appointments: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageGallery: undefined;
  AddGalleryItem: undefined;
  ManageAppointments: undefined;
  ManageTeam: undefined;
  AddTeamMember: undefined;
  ManageTestimonials: undefined;
  AddTestimonial: undefined;
  ManageFAQs: undefined;
  AddFAQ: undefined;
  ManageCareGuides: undefined;
  AddCareGuide: undefined;
  ViewLeads: undefined;
};
