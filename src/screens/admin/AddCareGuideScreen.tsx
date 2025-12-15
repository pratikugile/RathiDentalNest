import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addCareGuide } from '../../services/Database';

const AddCareGuideScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await addCareGuide(title, content);
      Alert.alert('Success', 'Care Guide added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add Care Guide');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Care Guide</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Root Canal Aftercare"
          placeholderTextColor={colors.text + '80'}
        />
        
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Enter the care instructions here..."
          placeholderTextColor={colors.text + '80'}
          multiline
          numberOfLines={10}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Guide</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const themedStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, elevation: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: colors.card, borderRadius: 8, padding: 12, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border },
  textArea: { height: 200, textAlignVertical: 'top' },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddCareGuideScreen;
