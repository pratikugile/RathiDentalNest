import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppointmentsScreenProps {
  navigation?: any;
}

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = () => {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    treatmentType: '',
    notes: '',
  });

  const treatmentTypes = [
    'General Checkup',
    'Teeth Cleaning',
    'Root Canal',
    'Dental Implant',
    'Teeth Whitening',
    'Orthodontics',
    'Pediatric Dentistry',
    'Other',
  ];

  const [selectedTreatment, setSelectedTreatment] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !selectedTreatment) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // TODO: Save appointment to database
    Alert.alert(
      'Appointment Request Sent',
      'Your appointment request has been submitted. We will contact you shortly to confirm.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              name: '',
              phone: '',
              email: '',
              date: '',
              time: '',
              treatmentType: '',
              notes: '',
            });
            setSelectedTreatment('');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="calendar-clock" size={40} color={colors.primary} />
        <Text style={styles.headerTitle}>Book an Appointment</Text>
        <Text style={styles.headerSubtitle}>Schedule your visit with our expert dentists</Text>
      </View>

      <View style={styles.form}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter your full name"
            placeholderTextColor={colors.border}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="+91-XXXXXXXXXX"
            placeholderTextColor={colors.border}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="your.email@example.com"
            placeholderTextColor={colors.border}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Date & Time Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={[styles.inputText, !formData.date && styles.placeholder]}>
                {formData.date || 'Select date'}
              </Text>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.border} />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={[styles.inputText, !formData.time && styles.placeholder]}>
                {formData.time || 'Select time'}
              </Text>
              <MaterialCommunityIcons name="clock-outline" size={20} color={colors.border} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Treatment Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Treatment Type *</Text>
          <View style={styles.treatmentGrid}>
            {treatmentTypes.map((treatment) => (
              <TouchableOpacity
                key={treatment}
                style={[
                  styles.treatmentChip,
                  selectedTreatment === treatment && styles.treatmentChipSelected,
                ]}
                onPress={() => setSelectedTreatment(treatment)}
              >
                <Text
                  style={[
                    styles.treatmentChipText,
                    selectedTreatment === treatment && styles.treatmentChipTextSelected,
                  ]}
                >
                  {treatment}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Any specific concerns or requirements..."
            placeholderTextColor={colors.border}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>Book Appointment</Text>
        </TouchableOpacity>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <MaterialCommunityIcons name="phone" size={24} color={colors.primary} />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>Need immediate assistance?</Text>
            <Text style={styles.contactText}>Call us at: +91-XXXXXXXXXX</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: colors.text,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  treatmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  treatmentChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  treatmentChipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  treatmentChipText: {
    fontSize: 14,
    color: colors.text,
  },
  treatmentChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  contactText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
});

export default AppointmentsScreen;
