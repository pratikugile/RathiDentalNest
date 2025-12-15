import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getTeamMembers } from '../services/Database';
import { TeamMember } from '../types';

const { width } = Dimensions.get('window');
const numColumns = width > 600 ? 3 : 2;

const founders = [
  {
    id: 'f1',
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
    id: 'f2',
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

const CollapsibleSection = ({ title, items, colors }: { title: string, items: string[], colors: any }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const styles = themedStyles(colors);

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <Icon name={isCollapsed ? 'chevron-down' : 'chevron-up'} color={colors.text} size={24} />
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

const DoctorProfile = ({ doctor, colors }: { doctor: any, colors: any }) => {
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

const TeamScreen = () => {
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: TeamMember }) => (
    <View style={styles.card}>
      {item.image_path ? (
        <Image 
          source={{ uri: 'file://' + item.image_path }} 
          style={styles.image} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }]}>
          <Icon name="account" size={80} color={'#fff'} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <Text style={styles.qualification}>{item.qualification}</Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      <Text style={styles.headerTitle}>Meet Our Team</Text>
      <Text style={styles.sectionHeader}>Founders & Lead Dentists</Text>
      {founders.map(doc => <DoctorProfile key={doc.id} doctor={doc} colors={colors} />)}
      <Text style={[styles.sectionHeader, { marginTop: 30 }]}>Our Dedicated Team</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={ListHeader}
        data={members}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No other team members found.</Text>
          </View>
        }
      />
    </View>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    marginLeft: 5,
  },
  list: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
    fontWeight: '500',
  },
  qualification: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.6,
  },
  // Doctor Profile Styles
  doctorCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
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
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  collapsibleContent: {
    marginTop: 10,
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default TeamScreen;
