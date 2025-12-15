import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';

const AdminDashboardScreen = ({ navigation }: { navigation: any }) => {
  const theme = useTheme();
  const colors = theme.colors || Colors.light;
  const styles = themedStyles(colors);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Clear user state to log out
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.email}</Text>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.navigate('ManageGallery')} // Navigate to the gallery management screen
      >
        <Text style={styles.menuButtonText}>Manage Treatment Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.navigate('ManageFAQs')}
      >
        <Text style={styles.menuButtonText}>Manage FAQs</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.navigate('ManageCareGuides')}
      >
        <Text style={styles.menuButtonText}>Manage Care Guides</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.navigate('ViewLeads')}
      >
        <Text style={styles.menuButtonText}>View Patient Leads</Text>
      </TouchableOpacity>

      {/* Add other admin actions here */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 40,
  },
  menuButton: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  logoutButton: {
    marginTop: 'auto', // Pushes the button to the bottom
    backgroundColor: colors.border,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default AdminDashboardScreen;
