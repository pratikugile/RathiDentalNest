import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { getUserByEmailAndPassword } from '../services/Database';
import { AuthContext } from '../../App';

function LoginScreen() {
  const { colors, dark } = useTheme(); // Getting dark mode status
  const styles = themedStyles(colors);
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      const user = await getUserByEmailAndPassword(email, password);
      if (user) {
        setUser(user);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Database Error', 'An error occurred while trying to log in.');
    }
  };

  return (
    <View style={styles.container}>
        <Image 
            source={require('../assets/logoRathi-light.png')} 
            style={[styles.logo, dark ? styles.logoDark : styles.logoLight]} 
        />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

      <View style={styles.card}>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.border}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            />
            <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.border}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
      width: 200,
      height: 50,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 30,
  },
  logoDark: {
      tintColor: '#fff',
  },
  logoLight: {
      tintColor: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 20,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.background, // A slightly different background for input
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
