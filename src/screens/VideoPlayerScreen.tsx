
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Define stack param list minimally for typing
import type { AppStackParamList } from '../../App';

function VideoPlayerScreen({ route, navigation }: NativeStackScreenProps<AppStackParamList, 'VideoPlayer'>) {
  const videoPath = route.params?.videoPath;

  if (!videoPath) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>No video path provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: `file://${videoPath}` }}
        style={styles.video}
        controls
        resizeMode="contain"
        onError={(e) => {
          console.warn('Video error', e);
        }}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
});

export default VideoPlayerScreen;
