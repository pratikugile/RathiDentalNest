import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { addTeamMember } from '../../services/Database';
import { saveContentItem } from '../../utils/fileSystem';

const AddTeamMemberScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [qualification, setQualification] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name || !role || !qualification || !imageUri) {
      Alert.alert('Error', 'Please fill all fields and select an image');
      return;
    }

    setLoading(true);
    try {
      // 1. Save image to app storage
      const fileName = `team_${Date.now()}.jpg`;
      const savedPath = await saveContentItem(imageUri, 'TEAM', fileName);

      // 2. Save to database
      await addTeamMember({
        name,
        role,
        qualification,
        image_path: savedPath,
        display_order: 0, // Default order
      });

      Alert.alert('Success', 'Team member added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding team member:', error);
      Alert.alert('Error', 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Team Member</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Icon name="camera-plus" size={40} color={colors.text} />
              <Text style={styles.placeholderText}>Tap to select photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Dr. John Doe"
            placeholderTextColor={colors.text}
          />

          <Text style={styles.label}>Role/Specialization</Text>
          <TextInput
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="Senior Dentist / Orthodontist"
            placeholderTextColor={colors.text}
          />

          <Text style={styles.label}>Qualification</Text>
          <TextInput
            style={styles.input}
            value={qualification}
            onChangeText={setQualification}
            placeholder="BDS, MDS"
            placeholderTextColor={colors.text}
          />

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Member</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  imagePicker: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: colors.border,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: colors.text,
    fontSize: 12,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTeamMemberScreen;
