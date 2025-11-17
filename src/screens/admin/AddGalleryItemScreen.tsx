import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { addGalleryItem, saveImageToAppDirectory } from '../../services/Database';

const AddGalleryItemScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('adult'); // Default to 'adult'
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const selectImage = (imageSetter) => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          imageSetter(response.assets[0]);
        }
      }
    });
  };

  const handleSave = async () => {
    if (!title || !beforeImage || !afterImage) {
      Alert.alert('Missing Information', 'Please provide a title and both a "Before" and "After" image.');
      return;
    }
    try {
      const beforeImagePath = await saveImageToAppDirectory(beforeImage.uri);
      const afterImagePath = await saveImageToAppDirectory(afterImage.uri);
      await addGalleryItem(title, category, beforeImagePath, afterImagePath);
      Alert.alert('Success', 'New gallery item has been added.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save the gallery item.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add New Gallery Item</Text>
      </View>

      <View style={styles.form}>
        {/* Title Input */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Dental Implants"
        />

        {/* Category Picker */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categorySelector}>
          <TouchableOpacity
            style={[styles.categoryButton, category === 'adult' && styles.activeCategory]}
            onPress={() => setCategory('adult')}
          >
            <Text style={[styles.categoryButtonText, category === 'adult' && styles.activeCategoryText]}>Adult</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, category === 'child' && styles.activeCategory]}
            onPress={() => setCategory('child')}
          >
            <Text style={[styles.categoryButtonText, category === 'child' && styles.activeCategoryText]}>Child</Text>
          </TouchableOpacity>
        </View>

        {/* Image Pickers */}
        <View style={styles.imagePickerRow}>
          <View style={styles.imagePickerContainer}>
            <Text style={styles.label}>Before</Text>
            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(setBeforeImage)}>
              {beforeImage ? (
                <Image source={{ uri: beforeImage.uri }} style={styles.imagePreview} />
              ) : (
                <MaterialCommunityIcons name="image-plus" size={40} color={colors.border} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.imagePickerContainer}>
            <Text style={styles.label}>After</Text>
            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(setAfterImage)}>
              {afterImage ? (
                <Image source={{ uri: afterImage.uri }} style={styles.imagePreview} />
              ) : (
                <MaterialCommunityIcons name="image-plus" size={40} color={colors.border} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const themedStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerText: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 16, color: colors.text, marginBottom: 10, fontWeight: '500' },
  input: { backgroundColor: colors.card, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.border, fontSize: 16, color: colors.text, marginBottom: 20 },
  categorySelector: { flexDirection: 'row', marginBottom: 20 },
  categoryButton: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  activeCategory: { backgroundColor: '#87CEEB', borderColor: '#87CEEB' },
  categoryButtonText: { fontSize: 16, color: colors.text },
  activeCategoryText: { color: '#0f0f0f', fontWeight: 'bold' },
  imagePickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  imagePickerContainer: { alignItems: 'center', width: '48%' },
  imageBox: { width: '100%', height: 150, borderRadius: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 10 },
  saveButton: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddGalleryItemScreen;
