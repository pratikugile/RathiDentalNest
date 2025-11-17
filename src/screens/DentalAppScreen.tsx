import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FeatureCard = ({ icon, title, description, buttonText, colors }) => {
  const styles = themedStyles(colors);
  return (
    <View style={styles.featureCard}>
      <MaterialCommunityIcons name={icon} size={40} color={colors.primary} style={styles.featureIcon} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
      <TouchableOpacity style={styles.featureButton}>
        <Text style={styles.featureButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const ReminderCard = ({ icon, title, time, enabled, colors }) => {
    const styles = themedStyles(colors);
    return (
        <View style={styles.reminderCard}>
        <MaterialCommunityIcons name={icon} size={24} color={enabled ? colors.primary : colors.border} />
        <View style={styles.reminderTextContainer}>
            <Text style={[styles.reminderTitle, !enabled && styles.disabledText]}>{title}</Text>
            <Text style={[styles.reminderTime, !enabled && styles.disabledText]}>{time}</Text>
        </View>
        <MaterialCommunityIcons name={enabled ? 'toggle-switch' : 'toggle-switch-off-outline'} size={40} color={enabled ? '#4CAF50' : colors.border} />
        </View>
    );
};

function DentalAppScreen() {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Personal Dental Assistant</Text>
      </View>

      <FeatureCard
        icon="camera-outline"
        title="Cavity Scan"
        description="Use your phone’s camera to scan your teeth for early signs of cavities."
        buttonText="Start Scan"
        colors={colors}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Reminders</Text>
        <ReminderCard icon="tooth-outline" title="Morning Brush" time="8:00 AM" enabled={true} colors={colors} />
        <ReminderCard icon="medical-bag" title="Floss" time="8:15 AM" enabled={true} colors={colors} />
        <ReminderCard icon="tooth-outline" title="Evening Brush" time="9:00 PM" enabled={false} colors={colors} />
      </View>

    </ScrollView>
  );
}

const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    borderColor: colors.border,
    borderWidth: 1,
  },
  featureIcon: {
    marginBottom: 15,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  featureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  reminderCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  reminderTextContainer: {
      flex: 1,
      marginLeft: 15,
  },
  reminderTitle: {
    color: colors.text,
    fontSize: 16,
  },
  reminderTime: {
    color: colors.text,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.border,
  }
});

export default DentalAppScreen;
