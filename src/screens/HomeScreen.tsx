import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNFS, { ReadDirItem } from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface VideoItemProps {
  item: ReadDirItem;
  onPress: (item: ReadDirItem) => void;
  colors: any;
}

// Video item component for the grid (YouTube style)
const VideoItem = ({ item, onPress, colors }: VideoItemProps) => {
  const styles = themedStyles(colors);
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <TouchableOpacity style={styles.videoCard} onPress={() => onPress(item)}>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnail}>
          <Icon name="play-circle-filled" size={48} color="rgba(255, 255, 255, 0.9)" />
        </View>
        <View style={styles.videoDuration}>
          <Text style={styles.durationText}>Video</Text>
        </View>
      </View>
      <View style={styles.videoDetails}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.name.replace('.mp4', '')}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>{formatFileSize(item.size)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = themedStyles(colors);
  const [videos, setVideos] = useState<ReadDirItem[]>([]);

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

  const handleVideoPress = (video: ReadDirItem) => {
    navigation.navigate('VideoPlayer', { videoPath: video.path });
  };

  return (
    <View style={styles.container}>
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          renderItem={({ item }) => <VideoItem item={item} onPress={handleVideoPress} colors={colors} />}
          keyExtractor={(item) => item.path}
          numColumns={1}
          style={styles.videoList}
          showsVerticalScrollIndicator={false}
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

const themedStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoList: {
    flex: 1,
  },
  videoCard: {
    backgroundColor: colors.card,
    marginBottom: 16,
    borderRadius: 0,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  videoDetails: {
    padding: 12,
    flexDirection: 'row',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default HomeScreen;
