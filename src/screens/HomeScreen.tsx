import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNFS from 'react-native-fs';

// Video item component for the grid
const VideoItem = ({ item, onPress, colors }) => {
  const styles = themedStyles(colors);
  return (
    <TouchableOpacity style={styles.videoItem} onPress={() => onPress(item)}>
      <View style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <View style={styles.videoTextContainer}>
          <Text style={styles.videoTitle}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const scanForVideos = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Needed',
              message: 'This app needs access to your storage to find videos.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const videoDir = RNFS.ExternalStorageDirectoryPath + '/Movies';
            const items = await RNFS.readDir(videoDir);
            const videoFiles = items.filter(item => item.isFile() && item.name.endsWith('.mp4'));
            setVideos(videoFiles);
          } else {
            console.log('Storage permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    scanForVideos();
  }, []);

  const handleVideoPress = (video) => {
    navigation.navigate('VideoPlayer', { videoPath: video.path });
  };

  return (
    <View style={styles.container}>
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          renderItem={({ item }) => <VideoItem item={item} onPress={handleVideoPress} colors={colors} />}
          keyExtractor={(item) => item.path}
          numColumns={2}
          style={styles.videoGrid}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos found in your Movies folder.</Text>
          <Text style={styles.emptyText}>Add some videos to /Movies to see them here.</Text>
        </View>
      )}
    </View>
  );
}

const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoGrid: {
    flex: 1,
    padding: 5,
  },
  videoItem: {
    flex: 1,
    margin: 5,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: colors.card, // Use card color for placeholder
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  videoTextContainer: {
    flex: 1,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 16,
  },
});

export default HomeScreen;
