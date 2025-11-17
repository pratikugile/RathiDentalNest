// React Navigation type definitions
import { RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root Stack
export type RootStackParamList = {
  Login: undefined;
  UserApp: undefined;
  AdminApp: undefined;
};

// User Drawer
export type UserDrawerParamList = {
  Home: undefined;
  PatientEducation: undefined;
  TreatmentGallery: undefined;
  DentalApp: undefined;
  Games: undefined;
  AboutUs: undefined;
  Appointments: undefined;
  VideoPlayer: { videoPath: string };
};

// Admin Stack
export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageGallery: undefined;
  AddGalleryItem: undefined;
  ManageAppointments: undefined;
};

// Navigation Props
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type UserDrawerNavigationProp = DrawerNavigationProp<UserDrawerParamList>;
export type AdminStackNavigationProp = NativeStackNavigationProp<AdminStackParamList>;

// Route Props
export type VideoPlayerRouteProp = RouteProp<UserDrawerParamList, 'VideoPlayer'>;

// Combined navigation prop for screens
export type NavigationProps<T extends keyof UserDrawerParamList> = {
  navigation: DrawerNavigationProp<UserDrawerParamList, T>;
  route: RouteProp<UserDrawerParamList, T>;
};

export type AdminNavigationProps<T extends keyof AdminStackParamList> = {
  navigation: NativeStackNavigationProp<AdminStackParamList, T>;
  route: RouteProp<AdminStackParamList, T>;
};
