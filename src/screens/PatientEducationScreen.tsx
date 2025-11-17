import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample data for educational topics
const topics = [
  {
    id: '1',
    title: 'The Importance of Brushing and Flossing',
    icon: 'tooth-outline',
    content: 'Brushing twice a day and flossing daily are essential for removing plaque and preventing cavities. Plaque is a sticky film of bacteria that constantly forms on your teeth...',
  },
  {
    id: '2',
    title: 'Understanding Gum Disease (Gingivitis)',
    icon: 'medical-bag',
    content: 'Gingivitis is the earliest stage of gum disease, an inflammation of the gums caused by plaque buildup. If left untreated, it can advance to a more serious condition called periodontitis...',
  },
  {
    id: '3',
    title: 'What to Expect During a Root Canal',
    icon: 'hospital-box-outline',
    content: 'A root canal is a treatment to repair and save a badly damaged or infected tooth instead of removing it. The procedure involves removing the damaged area of the tooth (the pulp) and cleaning and disinfecting it, then filling and sealing it...',
  },
  {
    id: '4',
    title: 'Cosmetic Dentistry Options',
    icon: 'star-outline',
    content: 'Cosmetic dentistry is focused on improving the appearance of your teeth. Common procedures include teeth whitening, veneers, bonding, and crowns...'
  }
];

const TopicItem = ({ topic, colors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = themedStyles(colors);

  return (
    <View style={styles.topicContainer}>
      <TouchableOpacity style={styles.topicHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <MaterialCommunityIcons name={topic.icon} size={24} color={colors.primary} />
        <Text style={styles.topicTitle}>{topic.title}</Text>
        <MaterialCommunityIcons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.primary} />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.topicContent}>
          <Text style={styles.topicContentText}>{topic.content}</Text>
        </View>
      )}
    </View>
  );
};

function PatientEducationScreen() {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Patient Education</Text>
      </View>
      {topics.map(topic => <TopicItem key={topic.id} topic={topic} colors={colors} />)}
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
  topicContainer: {
    backgroundColor: colors.card,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  topicTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginHorizontal: 15,
  },
  topicContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  topicContentText: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PatientEducationScreen;
