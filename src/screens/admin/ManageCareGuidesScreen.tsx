import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCareGuides, deleteCareGuide } from '../../services/Database';
import { CareGuide } from '../../types';

const ManageCareGuidesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [guides, setGuides] = useState<CareGuide[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadGuides();
    }
  }, [isFocused]);

  const loadGuides = async () => {
    try {
      const data = await getCareGuides();
      setGuides(data);
    } catch (error) {
      console.error('Error loading guides:', error);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Guide', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteCareGuide(id);
        loadGuides();
      }}
    ]);
  };

  const renderItem = ({ item }: { item: CareGuide }) => (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.content}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Icon name="delete" size={24} color={colors.notification} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Care Guides</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCareGuide')}
        >
          <Icon name="plus" size={24} color={'#fff'} />
          <Text style={styles.addButtonText}>Add Guide</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={guides}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No care guides added yet.</Text>}
      />
    </View>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, elevation: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 8 },
  title: { flex: 1, fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: colors.border },
  content: { flex: 1 },
  titleText: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  description: { fontSize: 14, color: colors.text, opacity: 0.7 },
  deleteButton: { padding: 8, justifyContent: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: colors.text, opacity: 0.6 },
});

export default ManageCareGuidesScreen;
