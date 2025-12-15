import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { useNavigation, useIsFocused, useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getLeads, updateLeadStatus } from '../../services/Database';
import { Lead } from '../../types';

const ViewLeadsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadLeads();
    }
  }, [isFocused]);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleStatusUpdate = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    Alert.alert('Update Status', `Mark as ${newStatus}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Update', onPress: async () => {
        await updateLeadStatus(id, newStatus);
        loadLeads();
      }}
    ]);
  };

  const renderItem = ({ item }: { item: Lead }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={[styles.badge, item.status === 'contacted' ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={() => handleCall(item.phone)} style={styles.phoneRow}>
        <Icon name="phone" size={20} color={colors.primary} />
        <Text style={styles.phone}>{item.phone}</Text>
      </TouchableOpacity>
      
      <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      
      <TouchableOpacity 
        style={[styles.actionButton, item.status === 'contacted' ? styles.actionButtonOutline : styles.actionButtonFilled]}
        onPress={() => handleStatusUpdate(item.id, item.status)}
      >
        <Text style={[styles.actionButtonText, item.status === 'contacted' ? styles.actionButtonTextOutline : styles.actionButtonTextFilled]}>
          {item.status === 'pending' ? 'Mark as Contacted' : 'Mark as Pending'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Patient Leads</Text>
      </View>
      <FlatList
        data={leads}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No leads yet.</Text>}
      />
    </View>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, elevation: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  list: { padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: colors.border },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  phone: { fontSize: 16, color: colors.primary, marginLeft: 8, fontWeight: '500' },
  date: { fontSize: 12, color: colors.text, opacity: 0.6, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgePending: { backgroundColor: '#FFF3E0' },
  badgeSuccess: { backgroundColor: '#E8F5E9' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  actionButton: { padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  actionButtonFilled: { backgroundColor: colors.primary },
  actionButtonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  actionButtonText: { fontWeight: 'bold' },
  actionButtonTextFilled: { color: '#fff' },
  actionButtonTextOutline: { color: colors.primary },
  emptyText: { textAlign: 'center', marginTop: 20, color: colors.text, opacity: 0.6 },
});

export default ViewLeadsScreen;
