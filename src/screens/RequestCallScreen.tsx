import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addLead } from '../services/Database';

const RequestCallScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter your name and phone number.');
      return;
    }

    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      await addLead(name, phone);
      Alert.alert('Success', 'Request sent! We will call you shortly.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="phone-in-talk" size={64} color={colors.primary} />
        </View>
        
        <Text style={styles.description}>
          Leave your details below and our team will contact you to schedule an appointment or answer your queries.
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor={colors.text}
        />
        
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Your Phone Number"
          placeholderTextColor={colors.text}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, alignItems: 'center' },
  iconContainer: { marginBottom: 24, backgroundColor: colors.border, padding: 20, borderRadius: 50 },
  description: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 32, lineHeight: 24, opacity: 0.7 },
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8, marginLeft: 4 },
  input: { width: '100%', backgroundColor: colors.card, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  submitButton: { width: '100%', backgroundColor: colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 12, elevation: 2 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default RequestCallScreen;
