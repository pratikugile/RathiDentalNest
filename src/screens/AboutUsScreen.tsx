import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const doctors = [
  {
    id: '1',
    name: 'Dr. Nilesh Rathi',
    credentials: 'BDS, MDS, Ph.D., FPO (Orthodontics)',
    specialization: 'Pediatric Dentistry & Dental Implants',
    experience: '19+ years Experience',
    about: 'Dr. Nilesh Rathi is a Professor and Head at Dr. D.Y. Patil Dental College and Hospital, Pimpri, Pune. With 19 years of experience, he is specialised in advanced dental treatments for children and adults, using techniques like laughing gas for comfort and providing expertise in dental implants.',
    education: [
      'Bachelor in Dental Surgery, 2004',
      'Master in Dental Surgery, 2009',
      'Ph.D., 2017',
      'Fellow in Pediatric Orthodontics, 2018',
    ],
    achievements: [
      'Holds multiple design patents and copyrights',
      'Contributed chapters to various textbooks',
      'Published over 85 research papers',
      'Expert in aligners for malaligned teeth',
      'Invited for guest lectures at National platforms',
      'Member, Indian Dental Association',
      'Member, Indian Society of Pediatric and Preventive Dentistry',
      'Member, Indian Society of Oral Implant.',
    ],
    avatar: require('../assets/rathicrop.jpg')
  },
  {
    id: '2',
    name: 'Dr. Prithvi Rathi',
    credentials: 'BDS, ALTS (Laser)',
    specialization: 'Smile Designing & Laser Treatment',
    experience: '17+ years Experience',
    about: 'Dr. Prithvi Rathi excels in digital dentistry and laser treatments, delivering high-quality esthetic outcomes with painless procedures. Her innovative approach ensures impeccable results using advanced laser technology.',
    education: [
      'Bachelor in Dental Surgery, 2008',
      'Fellowship in Laser Dentistry',
    ],
    achievements: [
      'Received BIRAC BIG Grants for dental equipment innovation',
      'Mastered digital dentistry for esthetic outcomes',
      'Expert in laser treatments',
      'Member, Indian Dental Association',
    ],
    avatar: require('../assets/DrPrithviRathi.jpeg')
  }
];

const CollapsibleSection = ({ title, items, colors }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const styles = themedStyles(colors);

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <MaterialCommunityIcons name={isCollapsed ? 'chevron-down' : 'chevron-up'} color={colors.text} size={24} />
      </TouchableOpacity>
      {!isCollapsed && (
        <View style={styles.collapsibleContent}>
          {items.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const DoctorProfile = ({ doctor, colors }) => {
  const styles = themedStyles(colors);
  return (
    <View style={styles.doctorCard}>
      <Image source={doctor.avatar} style={styles.avatar} />
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorCredentials}>{doctor.credentials}</Text>
      <Text style={styles.doctorExperience}>{doctor.experience}</Text>
      <View style={styles.specializationChip}>
        <Text style={styles.specializationText}>{doctor.specialization}</Text>
      </View>

      <Text style={styles.aboutDoctor}>{doctor.about}</Text>

      <CollapsibleSection title="Education" items={doctor.education} colors={colors} />
      <CollapsibleSection title="Achievements & Memberships" items={doctor.achievements} colors={colors} />
    </View>
  );
};

function AboutUsScreen() {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Expert Dentists</Text>
        <Text style={styles.headerSubtitle}>Our highly skilled doctors combine years of experience with the latest dental techniques to provide exceptional care.</Text>
      </View>
      
      {doctors.map(doc => <DoctorProfile key={doc.id} doctor={doc} colors={colors} />)}

    </ScrollView>
  );
}

// Styles are now a function that accepts colors
const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  doctorCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.border,
    marginBottom: 15,
  },
  doctorName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  doctorCredentials: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  doctorExperience: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    backgroundColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden'
  },
  specializationChip: {
    backgroundColor: '#87CEEB',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 15,
  },
  specializationText: {
    color: '#0f0f0f',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aboutDoctor: {
    color: colors.text,
    opacity: 0.8,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  collapsibleContainer: {
    width: '100%',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  collapsibleTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  collapsibleContent: {
    paddingBottom: 10,
  },
  listItem: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
  }
});

export default AboutUsScreen;
