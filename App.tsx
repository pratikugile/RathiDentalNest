import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import services and screens
import { initDatabase } from './src/services/Database';
import HomeScreen from './src/screens/HomeScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import PatientEducationScreen from './src/screens/PatientEducationScreen';
import TreatmentGalleryScreen from './src/screens/TreatmentGalleryScreen';
import DentalAppScreen from './src/screens/DentalAppScreen';
import GamesScreen from './src/screens/GamesScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import LoginScreen from './src/screens/LoginScreen';
import TeamScreen from './src/screens/TeamScreen';
import TestimonialsScreen from './src/screens/TestimonialsScreen';
import FAQScreen from './src/screens/FAQScreen';
import CareGuidesScreen from './src/screens/CareGuidesScreen';
import RequestCallScreen from './src/screens/RequestCallScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import Screensaver from './src/components/Screensaver';
import { Colors } from './src/constants/colors';

// Import Admin Screens
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import ManageGalleryScreen from './src/screens/admin/ManageGalleryScreen';
import AddGalleryItemScreen from './src/screens/admin/AddGalleryItemScreen';
import ManageTeamScreen from './src/screens/admin/ManageTeamScreen';
import AddTeamMemberScreen from './src/screens/admin/AddTeamMemberScreen';
import ManageTestimonialsScreen from './src/screens/admin/ManageTestimonialsScreen';
import AddTestimonialScreen from './src/screens/admin/AddTestimonialScreen';
import ManageFAQsScreen from './src/screens/admin/ManageFAQsScreen';
import AddFAQScreen from './src/screens/admin/AddFAQScreen';
import ManageCareGuidesScreen from './src/screens/admin/ManageCareGuidesScreen';
import AddCareGuideScreen from './src/screens/admin/AddCareGuideScreen';
import ViewLeadsScreen from './src/screens/admin/ViewLeadsScreen';

// Import Contexts
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

export type AppDrawerParamList = {
  Home: undefined;
  PatientEducation: undefined;
  TreatmentGallery: undefined;
  DentalApp: undefined;
  Games: undefined;
  AboutUs: undefined;
  Team: undefined;
  Testimonials: undefined;
  FAQs: undefined;
  CareGuides: undefined;
  RequestCall: undefined;
};

export type AppStackParamList = {
  Login: undefined;
  UserApp: undefined;
  AdminApp: undefined;
  VideoPlayer: { videoPath: string };
  AdminDashboard: undefined;
  ManageGallery: undefined;
  AddGalleryItem: undefined;
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

const Drawer = createDrawerNavigator<AppDrawerParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

// --- Themes ---
const LightAppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light,
  },
};
const DarkAppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...Colors.dark,
  },
};

// --- User App (Drawer Navigator) ---
function UserApp() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { toggleTheme, isDarkTheme } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({        
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: { 
          width: isLargeScreen ? 88 : 240, // compact width on large screens
          backgroundColor: isDarkTheme ? DarkAppTheme.colors.card : LightAppTheme.colors.card,
          borderRightWidth: 1,
          borderRightColor: isDarkTheme ? DarkAppTheme.colors.border : LightAppTheme.colors.border,
        },
        headerStyle: {
          elevation: 4,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { height: 2, width: 0 },
          borderBottomWidth: 1,
          borderBottomColor: isDarkTheme ? DarkAppTheme.colors.border : LightAppTheme.colors.border,
          backgroundColor: isDarkTheme ? DarkAppTheme.colors.card : LightAppTheme.colors.card,
        },
        headerTintColor: isDarkTheme ? '#f1f1f1' : '#030303',
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            {!isLargeScreen && (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                <MaterialCommunityIcons name="menu" color={isDarkTheme ? '#f1f1f1' : '#030303'} size={24} />
              </TouchableOpacity>
            )}
            {isLargeScreen && (
              <Image source={require('./src/assets/logoRathi-light.png')} style={styles.logoImage} />
            )}
          </View>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <View style={styles.iconButtonWrapper}>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="magnify" color={isDarkTheme ? '#fff' : '#000'} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.iconButtonWrapper}>
              <TouchableOpacity style={styles.headerButton} onPress={toggleTheme}>
                <MaterialCommunityIcons name={isDarkTheme ? 'white-balance-sunny' : 'moon-waning-crescent'} color={isDarkTheme ? '#fff' : '#000'} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.iconButtonWrapper}>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="bell-outline" color={isDarkTheme ? '#fff' : '#000'} size={24} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=profile' }} style={styles.profileAvatar} />
            </TouchableOpacity>
          </View>
        ),
        headerTitle: '',
        drawerItemStyle: { display: 'none' },
      })}
    >
      {/* ...Screens... */}
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Home', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="PatientEducation" component={PatientEducationScreen} options={{ title: 'Education', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'book-open-page-variant' : 'book-open-page-variant-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="TreatmentGallery" component={TreatmentGalleryScreen} options={{ title: 'Gallery', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'image-multiple' : 'image-multiple-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="DentalApp" component={DentalAppScreen} options={{ title: 'Dental App', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'cellphone' : 'cellphone-wireless'} color={color} size={size} /> }} />
      <Drawer.Screen name="Games" component={GamesScreen} options={{ title: 'Games', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'gamepad-variant' : 'gamepad-variant-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="Team" component={TeamScreen} options={{ title: 'Our Team', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'account-group' : 'account-group-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="Testimonials" component={TestimonialsScreen} options={{ title: 'Success Stories', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'star-face' : 'star-face-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="FAQs" component={FAQScreen} options={{ title: 'FAQs', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'help-circle' : 'help-circle-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="CareGuides" component={CareGuidesScreen} options={{ title: 'Care Guides', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'medical-bag' : 'medical-bag'} color={color} size={size} /> }} />
      <Drawer.Screen name="RequestCall" component={RequestCallScreen} options={{ title: 'Request Call', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'phone-in-talk' : 'phone-in-talk-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="AboutUs" component={AboutUsScreen} options={{ title: 'About Us', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'information' : 'information-outline'} color={color} size={size} /> }} />
    </Drawer.Navigator>
  );
}

// --- Admin App (Stack Navigator) ---
function AdminApp() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ManageGallery" component={ManageGalleryScreen} options={{ title: 'Manage Gallery' }}/>
      <Stack.Screen name="AddGalleryItem" component={AddGalleryItemScreen} options={{ title: 'Add Gallery Item' }}/>
      <Stack.Screen name="ManageTeam" component={ManageTeamScreen} options={{ title: 'Manage Team' }}/>
      <Stack.Screen name="AddTeamMember" component={AddTeamMemberScreen} options={{ title: 'Add Team Member' }}/>
      <Stack.Screen name="ManageTestimonials" component={ManageTestimonialsScreen} options={{ title: 'Manage Testimonials' }}/>
      <Stack.Screen name="AddTestimonial" component={AddTestimonialScreen} options={{ title: 'Add Testimonial' }}/>
      <Stack.Screen name="ManageFAQs" component={ManageFAQsScreen} options={{ title: 'Manage FAQs' }}/>
      <Stack.Screen name="AddFAQ" component={AddFAQScreen} options={{ title: 'Add FAQ' }}/>
      <Stack.Screen name="ManageCareGuides" component={ManageCareGuidesScreen} options={{ title: 'Manage Care Guides' }}/>
      <Stack.Screen name="AddCareGuide" component={AddCareGuideScreen} options={{ title: 'Add Care Guide' }}/>
      <Stack.Screen name="ViewLeads" component={ViewLeadsScreen} options={{ title: 'Patient Leads' }}/>
    </Stack.Navigator>
  );
}

// --- Main App Navigator (Handles Auth Flow) ---
function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.role === 'admin' ? (
          <Stack.Screen name="AdminApp" component={AdminApp} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="UserApp" component={UserApp} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
          </Stack.Group>
        )
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? DarkAppTheme : LightAppTheme;
    
    return (
        <NavigationContainer theme={theme}>
          <Screensaver>
            <AppNavigator />
          </Screensaver>
        </NavigationContainer>
    );
}

// --- App Entry Point ---
export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <AuthProvider>
        <ThemeProvider>
           <AppContent /> 
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  headerLeftContainer: { flexDirection: 'row', alignItems: 'center' },
  headerRightContainer: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
  iconButtonWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: { paddingHorizontal: 16 },
  profileButton: { marginLeft: 16 },
  profileAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#ccc' },
  logoImage: { width: 105, height: 35, resizeMode: 'contain' },
});
