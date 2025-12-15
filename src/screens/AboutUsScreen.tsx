import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

function AboutUsScreen() {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Rathi Dental Nest</Text>
        <Text style={styles.headerSubtitle}>Excellence in Dental Care for the Whole Family</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          At Rathi Dental Nest, our mission is to provide world-class dental treatments in a comfortable and hygienic environment. We specialize in Pediatric Dentistry, Dental Implants, and Laser Dentistry, ensuring the best care for both children and adults.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureRow}>
           <MaterialCommunityIcons name="tooth-outline" size={24} color={colors.primary} />
           <Text style={styles.featureText}>Advanced Laser Technology</Text>
        </View>
        <View style={styles.featureRow}>
           <MaterialCommunityIcons name="baby-face-outline" size={24} color={colors.primary} />
           <Text style={styles.featureText}>Child-Friendly Environment</Text>
        </View>
        <View style={styles.featureRow}>
           <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.primary} />
           <Text style={styles.featureText}>19+ Years of Experience</Text>
        </View>
        <View style={styles.featureRow}>
           <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
           <Text style={styles.featureText}>Timely Appointments</Text>
        </View>
        <View style={styles.featureRow}>
           <MaterialCommunityIcons name="hospital-box-outline" size={24} color={colors.primary} />
           <Text style={styles.featureText}>State-of-the-art Infrastructure</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Clinic</Text>
        <Text style={styles.sectionText}>
          Located in the heart of the city, Rathi Dental Nest is equipped with the latest dental technology to ensure precise and painless treatments. Our team of dedicated professionals is committed to delivering the highest standard of dental care.
        </Text>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Get in Touch</Text>
        <View style={styles.quickLinksContainer}>
          <TouchableOpacity style={styles.quickLinkButton} onPress={() => Linking.openURL('tel:+911234567890')}>
            <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.quickLinkGradient}>
              <MaterialCommunityIcons name="phone" size={24} color="#fff" />
              <Text style={styles.quickLinkText}>Call Us</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickLinkButton} onPress={() => {
             const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
             const latLng = '18.5204,73.8567';
             const label = 'Rathi Dental Nest';
             const url = Platform.select({
               ios: `${scheme}${label}@${latLng}`,
               android: `${scheme}${latLng}(${label})`
             });
             if (url) Linking.openURL(url);
          }}>
            <LinearGradient colors={['#2196F3', '#1565C0']} style={styles.quickLinkGradient}>
              <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
              <Text style={styles.quickLinkText}>Locate Us</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.qrContainer}>
        <Text style={styles.qrTitle}>Scan to Download App</Text>
        <View style={styles.qrPlaceholder}>
          <MaterialCommunityIcons name="qrcode-scan" size={100} color={colors.text} />
        </View>
        <Text style={styles.qrSubtitle}>Share this QR code with patients to download the app.</Text>
      </View>

    </ScrollView>
  );
}

// Styles are now a function that accepts colors
const themedStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    opacity: 0.8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.card,
    margin: 15,
    borderRadius: 12,
    marginBottom: 40,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  qrPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 15,
  },
  qrSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  contactContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  quickLinkButton: {
    flex: 1,
    maxWidth: 200,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 10,
  },
  quickLinkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  quickLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default AboutUsScreen;
