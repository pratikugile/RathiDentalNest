import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Sample data for the gallery
const galleryData = [
  { id: '1', before: 'https://images.unsplash.com/photo-1629905675094-a8247a2f584d?w=400&q=80', after: 'https://images.unsplash.com/photo-1629905675121-72f88f026b45?w=400&q=80', title: 'Teeth Whitening' },
  { id: '2', before: 'https://images.unsplash.com/photo-1619451429079-858348b4f17a?w=400&q=80', after: 'https://images.unsplash.com/photo-1619451429079-858348b4f17a?w=400&q=80', title: 'Dental Implants' },
  { id: '3', before: 'https://images.unsplash.com/photo-1599056999491-387b32a9394e?w=400&q=80', after: 'https://images.unsplash.com/photo-1599056999491-387b32a9394e?w=400&q=80', title: 'Veneers' },
  { id: '4', before: 'https://images.unsplash.com/photo-1629905675094-a8247a2f584d?w=400&q=80', after: 'https://images.unsplash.com/photo-1629905675121-72f88f026b45?w=400&q=80', title: 'Braces' },
];

const { width } = Dimensions.get('window');
const itemSize = (width - 30) / 2;

const GalleryItem = ({ item, colors }) => {
  const styles = themedStyles(colors);
  return (
    <View style={styles.galleryItem}>
      <View style={styles.imageRow}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.before }} style={styles.image} />
          <Text style={styles.imageLabel}>Before</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.after }} style={styles.image} />
          <Text style={styles.imageLabel}>After</Text>
        </View>
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </View>
  );
}

function TreatmentGalleryScreen() {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Treatment Gallery</Text>
      </View>
      <FlatList
        data={galleryData}
        renderItem={({ item }) => <GalleryItem item={item} colors={colors} />}
        keyExtractor={item => item.id}
        numColumns={1}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  galleryItem: {
    width: width - 20,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    width: '48%',
  },
  image: {
    width: '100%',
    height: itemSize,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  imageLabel: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 12,
    marginTop: 5,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
});

export default TreatmentGalleryScreen;
