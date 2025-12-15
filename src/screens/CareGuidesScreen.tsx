import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCareGuides } from '../services/Database';
import { CareGuide } from '../types';

const CareGuidesScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [guides, setGuides] = useState<CareGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<CareGuide | null>(null);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      const data = await getCareGuides();
      setGuides(data);
    } catch (error) {
      console.error('Error loading guides:', error);
    }
  };

  const renderItem = ({ item }: { item: CareGuide }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setSelectedGuide(item)}
    >
      <View style={styles.iconContainer}>
        <Icon name="tooth-outline" size={32} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardPreview} numberOfLines={2}>{item.content}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={guides}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No care guides available.</Text>}
      />

      <Modal
        visible={!!selectedGuide}
        animationType="slide"
        onRequestClose={() => setSelectedGuide(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedGuide(null)} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>{selectedGuide?.title}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.fullContent}>{selectedGuide?.content}</Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: colors.border },
  iconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  content: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  cardPreview: { fontSize: 14, color: colors.text, opacity: 0.7 },
  emptyText: { textAlign: 'center', marginTop: 20, color: colors.text, opacity: 0.6 },
  
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, elevation: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  closeButton: { padding: 8 },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  modalContent: { padding: 20 },
  fullContent: { fontSize: 16, color: colors.text, lineHeight: 24 },
});

export default CareGuidesScreen;
