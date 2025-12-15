import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, Theme } from '@react-navigation/native';

import { getUserByEmailAndPassword } from '../services/Database';
import { useAuth } from '../context/AuthContext';

function LoginScreen() {
  const { colors, dark } = useTheme(); // Getting dark mode status
  const styles = themedStyles(colors);
  const { setUser } = useAuth();

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
    <LinearGradient
      colors={[dark ? '#232526' : '#e0eafc', dark ? '#414345' : '#cfdef3']}
      style={styles.gradientBg}
    >
      <View style={styles.container}>
        <Image 
          source={require('../assets/logoRathi-light.png')} 
          style={[styles.logo, dark ? styles.logoDark : styles.logoLight]} 
        />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Image style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.border}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Image style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.border}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#4CAF50', '#388E3C']}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const themedStyles = (colors: Theme['colors']) => StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  loginButtonGradient: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
