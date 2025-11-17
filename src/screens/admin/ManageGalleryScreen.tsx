import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme, useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getGalleryItems, deleteGalleryItem } from '../../services/Database';

const ManageGalleryScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();

  const fetchItems = async () => {
    const galleryItems = await getGalleryItems();
    setItems(galleryItems);
  };

  useEffect(() => {
    if (isFocused) {
      fetchItems();
    }
  }, [isFocused]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this gallery item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            await deleteGalleryItem(id);
            fetchItems(); // Refresh the list
          }
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `file://${item.before_image_path}` }} style={styles.thumbnail} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <MaterialCommunityIcons name="delete-outline" size={24} color={'red'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>Manage Gallery</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No gallery items found.</Text>
            <Text style={styles.emptyText}>Tap the '+' button to add one.</Text>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddGalleryItem')} // Navigate to the Add Item screen
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.border,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  itemCategory: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default ManageGalleryScreen;
