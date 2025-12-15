import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getTestimonials } from '../services/Database';
import { Testimonial } from '../types';

const { width } = Dimensions.get('window');
const numColumns = width > 600 ? 2 : 1;

const TestimonialsScreen = () => {
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Testimonial }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        {item.image_path ? (
          <Image 
            source={{ uri: 'file://' + item.image_path }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Icon name="account" size={30} color={'#fff'} />
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.name}>{item.patient_name}</Text>
          <Text style={styles.treatment}>{item.treatment_type}</Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            name="star" 
            size={18} 
            color={i < item.rating ? colors.notification : colors.border} 
          />
        ))}
      </View>

      <Text style={styles.content}>"{item.content}"</Text>
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
      <Text style={styles.headerTitle}>Success Stories</Text>
      <FlatList
        data={testimonials}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No testimonials yet.</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    width: numColumns > 1 ? (width - 48) / numColumns - 8 : '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.border,
  },
  placeholderAvatar: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  treatment: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    opacity: 0.6,
  },
});

export default TestimonialsScreen;
