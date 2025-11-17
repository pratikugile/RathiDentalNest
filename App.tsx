import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
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
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import ManageGalleryScreen from './src/screens/admin/ManageGalleryScreen';
import AddGalleryItemScreen from './src/screens/admin/AddGalleryItemScreen';

// Define context types
interface ThemeContextType {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create contexts
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// --- Themes ---
const LightAppTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f0f2f5', card: '#ffffff', text: '#0f0f0f', border: '#dcdcdc', primary: '#000' } };
const DarkAppTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#0f0f0f', card: '#212121', text: '#ffffff', border: '#272727', primary: '#fff' } };

// --- Custom Drawer for Collapsed View ---
const CustomDrawerContent = (props: any) => {
  const { state, descriptors, navigation, isCollapsed } = props;

  if (!isCollapsed) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView {...props}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        if (options.drawerItemStyle && options.drawerItemStyle.height === 0) return null;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'drawerItemPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        const color = isFocused ? options.drawerActiveTintColor : options.drawerInactiveTintColor;
        const backgroundColor = isFocused ? options.drawerActiveBackgroundColor : 'transparent';
        const icon = options.drawerIcon ? options.drawerIcon({ focused: isFocused, size: 24, color }) : null;

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={[styles.collapsedDrawerItem, { backgroundColor }]}>
            {icon}
          </TouchableOpacity>
        );
      })}
    </DrawerContentScrollView>
  );
};

// --- User App (Drawer Navigator) ---
function UserApp() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [isDrawerCollapsed, setDrawerCollapsed] = useState(isLargeScreen);
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    throw new Error('ThemeContext not found');
  }
  
  const { toggleTheme, isDarkTheme } = themeContext;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} isCollapsed={isLargeScreen && isDrawerCollapsed} />}
      screenOptions={({ navigation }) => ({        
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: { width: isLargeScreen ? (isDrawerCollapsed ? 80 : 240) : 240, backgroundColor: isDarkTheme ? '#212121' : '#fff' },
        headerStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: isDarkTheme ? '#272727' : '#dcdcdc', backgroundColor: isDarkTheme ? '#0f0f0f' : '#f0f2f5' },
        headerTintColor: isDarkTheme ? '#fff' : '#000',
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            <TouchableOpacity onPress={() => { if (isLargeScreen) setDrawerCollapsed(!isDrawerCollapsed); else navigation.toggleDrawer(); }} style={styles.menuButton}>
              <MaterialCommunityIcons name="menu" color={isDarkTheme ? '#fff' : '#000'} size={25} />
            </TouchableOpacity>
            <Image source={require('./src/assets/logoRathi-light.png')} style={styles.logoImage} />
          </View>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity style={styles.headerButton} onPress={toggleTheme}>
              <MaterialCommunityIcons name="theme-light-dark" color={isDarkTheme ? '#fff' : '#000'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialCommunityIcons name="bell-outline" color={isDarkTheme ? '#fff' : '#000'} size={25} />
            </TouchableOpacity>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=profile' }} style={styles.profileAvatar} />
          </View>
        ),
        drawerActiveTintColor: isDarkTheme ? '#fff' : '#000',
        drawerInactiveTintColor: '#aaa',
        drawerActiveBackgroundColor: isDarkTheme ? '#383838' : '#e0e0e0',
        drawerItemStyle: { borderRadius: 10, marginHorizontal: 10, marginVertical: 4 },
        headerTitle: '',
      })}
    >
      {/* ...Screens... */}
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Home', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="PatientEducation" component={PatientEducationScreen} options={{ title: 'Patient Education', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'book-open-page-variant' : 'book-open-page-variant-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="TreatmentGallery" component={TreatmentGalleryScreen} options={{ title: 'Treatment Gallery', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'image-multiple' : 'image-multiple-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="DentalApp" component={DentalAppScreen} options={{ title: 'Dental App', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'cellphone' : 'cellphone-wireless'} color={color} size={size} /> }} />
      <Drawer.Screen name="Games" component={GamesScreen} options={{ title: 'Games', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'gamepad-variant' : 'gamepad-variant-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="AboutUs" component={AboutUsScreen} options={{ title: 'About Us', drawerIcon: ({ focused, color, size }) => <MaterialCommunityIcons name={focused ? 'information' : 'information-outline'} color={color} size={size} /> }} />
      <Drawer.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ drawerItemStyle: { height: 0 }, headerShown: false }} />
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
    </Stack.Navigator>
  );
}

// --- Main App Navigator (Handles Auth Flow) ---
function AppNavigator() {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('AuthContext not found');
  }
  
  const { user } = authContext;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.role === 'admin' ? (
          <Stack.Screen name="AdminApp" component={AdminApp} />
        ) : (
          <Stack.Screen name="UserApp" component={UserApp} />
        )
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

// --- App Entry Point ---
export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const themeMethods: ThemeContextType = useMemo(() => ({ 
    toggleTheme: () => setIsDarkTheme(isDark => !isDark), 
    isDarkTheme 
  }), [isDarkTheme]);
  
  const authMethods: AuthContextType = useMemo(() => ({ 
    user, 
    setUser 
  }), [user]);

  const theme = isDarkTheme ? DarkAppTheme : LightAppTheme;

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <AuthContext.Provider value={authMethods}>
        <ThemeContext.Provider value={themeMethods}>
          <NavigationContainer theme={theme}>
            <AppNavigator />
          </NavigationContainer>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  headerLeftContainer: { flexDirection: 'row', alignItems: 'center' },
  headerRightContainer: { flexDirection: 'row', alignItems: 'center', paddingRight: 15 },
  headerButton: { marginLeft: 20 },
  menuButton: { paddingHorizontal: 15 },
  profileAvatar: { width: 32, height: 32, borderRadius: 16, marginLeft: 20 },
  logoImage: { width: 120, height: 28, resizeMode: 'contain' },
  collapsedDrawerItem: { height: 50, justifyContent: 'center', alignItems: 'center', marginVertical: 4, marginHorizontal: 10, borderRadius: 10 },
});
