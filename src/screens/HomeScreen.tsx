import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform, Image, useWindowDimensions, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNFS, { ReadDirItem } from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const getGridColumns = (width: number): number => {
  if (width >= 1920) return 5; // 4K/Large TVs
  if (width >= 1280) return 4; // HD TVs
  if (width >= 768) return 3;  // Smaller TVs
  return 2; // Fallback
};

const dentalTips = [
  "Brush your teeth twice a day with fluoride toothpaste.",
  "Floss daily to remove plaque from between your teeth.",
  "Limit sugary drinks and snacks to prevent cavities.",
  "Visit your dentist every 6 months for a check-up.",
  "Replace your toothbrush every 3 to 4 months.",
  "Drink plenty of water to keep your mouth clean.",
  "Don't forget to brush your tongue to remove bacteria."
];

const DashboardHeader = ({ colors, styles }: { colors: any, styles: any }) => {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const randomTip = dentalTips[Math.floor(Math.random() * dentalTips.length)];
    setTip(randomTip);
  }, []);

  const handleCall = () => {
    Linking.openURL('tel:+911234567890'); // Replace with actual number
  };

  const handleLocation = () => {
    // Replace with actual coordinates or address
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = '18.5204,73.8567'; // Example: Pune, India
    const label = 'Rathi Dental Nest';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Tip of the Day */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Icon name="lightbulb" size={24} color={colors.primary} />
          <Text style={styles.tipTitle}>Tip of the Day</Text>
        </View>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    </View>
  );
};

interface VideoItemProps {
  item: ReadDirItem;
  onPress: (item: ReadDirItem) => void;
  colors: any;
  styles: any;
  index: number;
  numColumns: number;
}

// Video item component for the grid (YouTube style)
const VideoItem = ({ item, onPress, colors, styles, index, numColumns }: VideoItemProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isLastInRow = (index + 1) % numColumns === 0;

  return (
    <TouchableOpacity style={[styles.videoCard, isLastInRow && { marginRight: 0 }]} onPress={() => onPress(item)}>
      <View style={styles.thumbnailContainer}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradient}>
          <View style={styles.thumbnail}>
            <Icon name="play-circle-filled" size={48} color="rgba(255, 255, 255, 0.9)" />
          </View>
          <View style={styles.videoDuration}>
            <Text style={styles.durationText}>Video</Text>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.videoDetails}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${item.name}` }}
          style={styles.channelAvatar}
        />
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.name.replace('.mp4', '')}</Text>
          <View style={styles.metaInfo}>
            <Icon name="storage" size={14} color={colors.text} style={{ opacity: 0.6 }} />
            <Text style={styles.metaText}>{formatFileSize(item.size)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const dimensions = useWindowDimensions();

  // Calculate available width accounting for the permanent drawer on large screens
  const isLargeScreen = dimensions.width >= 768;
  const drawerWidth = isLargeScreen ? 88 : 0;
  const availableWidth = dimensions.width - drawerWidth;

  const numColumns = getGridColumns(dimensions.width);
  const styles = themedStyles(colors, availableWidth, numColumns);
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
      <FlatList
        ListHeaderComponent={<DashboardHeader colors={colors} styles={styles} />}
        data={videos}
        renderItem={({ item, index }) => <VideoItem item={item} onPress={handleVideoPress} colors={colors} styles={styles} index={index} numColumns={numColumns} />}
        keyExtractor={(item) => item.path}
        numColumns={numColumns}
        key={numColumns}
        style={styles.videoList}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="movie" size={96} color={colors.text} style={{ opacity: 0.3 }} />
            <Text style={styles.emptyText}>No videos found.</Text>
            <Text style={styles.subEmptyText}>Add videos to your device's "Movies" folder to see them here.</Text>
          </View>
        }
      />
    </View>
  );
}

const themedStyles = (colors: any, screenWidth: number, numColumns: number) => {
  const horizontalPadding = 24;
  const itemSpacing = 16;
  const totalSpacing = horizontalPadding * 2 + itemSpacing * (numColumns - 1);
  const itemWidth = Math.floor((screenWidth - totalSpacing) / numColumns);

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoList: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  columnWrapper: {
    paddingHorizontal: 0,
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  videoCard: {
    backgroundColor: colors.card,
    width: itemWidth,
    marginRight: itemSpacing,
    marginBottom: 0,
  },
  videoCardLast: {
    marginRight: 0,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    opacity: 0.9,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
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
    alignItems: 'flex-start',
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.border,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 13,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: colors.text,
    opacity: 0.8,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  subEmptyText: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  demoText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  // Header Styles
  headerContainer: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  tipText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickLinkButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  quickLinkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  quickLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
};

export default HomeScreen;
