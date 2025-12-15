import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminStackParamList } from '../../types';
import { getTestimonials, deleteTestimonial } from '../../services/Database';
import { deleteContentItem } from '../../utils/fileSystem';
import { Testimonial } from '../../types';

type NavigationProp = NativeStackNavigationProp<AdminStackParamList>;

const ManageTestimonialsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadTestimonials();
    }
  }, [isFocused]);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      Alert.alert('Error', 'Failed to load testimonials');
    }
  };

  const handleDelete = (item: Testimonial) => {
    Alert.alert(
      'Delete Testimonial',
      `Are you sure you want to remove the testimonial from ${item.patient_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTestimonial(item.id);
              if (item.image_path) {
                await deleteContentItem(item.image_path);
              }
              loadTestimonials();
            } catch (error) {
              console.error('Error deleting testimonial:', error);
              Alert.alert('Error', 'Failed to delete testimonial');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Testimonial }) => (
    <View style={styles.card}>
      {item.image_path ? (
        <Image 
          source={{ uri: 'file://' + item.image_path }} 
          style={styles.image} 
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Icon name="account" size={30} color={'#fff'} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.patient_name}</Text>
        <Text style={styles.treatment}>{item.treatment_type}</Text>
        <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Icon 
              key={i} 
              name="star" 
              size={14} 
              color={i < item.rating ? colors.primary : colors.border} 
            />
          ))}
        </View>
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
        <Text style={styles.title}>Manage Testimonials</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTestimonial' as any)}
        >
          <Icon name="plus" size={24} color={'#fff'} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={testimonials}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No testimonials added yet.</Text>
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
  placeholderImage: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  treatment: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  content: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginTop: 4,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4,
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

export default ManageTestimonialsScreen;
