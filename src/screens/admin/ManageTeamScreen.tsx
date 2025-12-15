import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminStackParamList } from '../../types';
import { getTeamMembers, deleteTeamMember } from '../../services/Database';
import { deleteContentItem } from '../../utils/fileSystem';
import { TeamMember } from '../../types';

type NavigationProp = NativeStackNavigationProp<AdminStackParamList>;

const ManageTeamScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadMembers();
    }
  }, [isFocused]);

  const loadMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading team members:', error);
      Alert.alert('Error', 'Failed to load team members');
    }
  };

  const handleDelete = (member: TeamMember) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to remove ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeamMember(member.id);
              if (member.image_path) {
                await deleteContentItem(member.image_path);
              }
              loadMembers();
            } catch (error) {
              console.error('Error deleting member:', error);
              Alert.alert('Error', 'Failed to delete member');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: TeamMember }) => (
    <View style={styles.card}>
      {item.image_path ? (
        <Image 
          source={{ uri: 'file://' + item.image_path }} 
          style={styles.image} 
        />
      ) : (
        <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }]}>
          <Icon name="account" size={30} color={'#fff'} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <Text style={styles.qualification}>{item.qualification}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
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
        <Text style={styles.title}>Manage Team</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTeamMember' as any)}
        >
          <Icon name="plus" size={24} color={'#fff'} />
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No team members added yet.</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  role: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  qualification: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    opacity: 0.6,
  },
});

export default ManageTeamScreen;
