import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, useWindowDimensions, PermissionsAndroid, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNFS, { ReadDirItem } from 'react-native-fs';

// Paired data: each item holds before & after
interface TreatmentPair {
  id: string;
  title: string;
  before: string;
  after: string;
}

function TreatmentGalleryScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [pairs, setPairs] = useState<TreatmentPair[]>([]);
  
  // Calculate card dimensions for perfect TV fit
  const isLargeScreen = width >= 768;
  const drawerWidth = isLargeScreen ? 88 : 0;
  const screenWidth = width - drawerWidth;

  const horizontalPadding = 32;
  const cardGap = 24;
  const availableWidth = screenWidth - (horizontalPadding * 2) - cardGap;
  const cardWidth = Math.floor(availableWidth / 2);
  const imageHeight = Math.round(cardWidth * 0.7);
  
  const styles = createStyles(colors, cardWidth, imageHeight, horizontalPadding);

  useEffect(() => {
    const loadPairs = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Access Required',
            message: 'Allow access to load treatment before/after images.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
        // Directory convention: /Pictures/TreatmentGallery
        const baseDir = RNFS.ExternalStorageDirectoryPath + '/Pictures/TreatmentGallery';
        const exists = await RNFS.exists(baseDir);
        if (!exists) {
          return;
        }
        const items: ReadDirItem[] = await RNFS.readDir(baseDir);
        const imageFiles = items.filter(i => i.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(i.name));
        const map: Record<string, { before?: string; after?: string; title: string }> = {};
        const pattern = /(.*?)[-_](before|after)\.(jpg|jpeg|png|webp)$/i;
        imageFiles.forEach(f => {
          const m = f.name.match(pattern);
            if (m) {
              const key = m[1];
              const side = m[2].toLowerCase();
              if (!map[key]) {
                const title = key.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                map[key] = { title };
              }
              map[key][side === 'before' ? 'before' : 'after'] = 'file://' + f.path;
            }
        });
        const result: TreatmentPair[] = Object.entries(map)
          .filter(([_, v]) => v.before && v.after)
          .map(([key, v]) => ({ id: key, title: v.title, before: v.before!, after: v.after! }));
        setPairs(result);
      } catch (e) {
        console.warn('Gallery scan error', e);
      }
    };
    loadPairs();
  }, []);

  const renderPair = ({ item }: { item: TreatmentPair }) => (
    <View style={styles.pairRow}>
      <Pressable style={styles.card} android_ripple={{ color: colors.border }}>
        <Image source={{ uri: item.before }} style={styles.image} resizeMode="cover" />
        <View style={styles.captionBar}>
          <Text style={styles.captionLabel}>Before</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        </View>
      </Pressable>
      <Pressable style={styles.card} android_ripple={{ color: colors.border }}>
        <Image source={{ uri: item.after }} style={styles.image} resizeMode="cover" />
        <View style={styles.captionBarAfter}>
          <Text style={styles.captionLabel}>After</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pairs}
        renderItem={renderPair}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No treatment images found.</Text>
            <Text style={styles.subEmptyText}>Add images to /Pictures/TreatmentGallery as name-before.jpg and name-after.jpg</Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (colors: any, cardWidth: number, imageHeight: number, horizontalPadding: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subEmptyText: {
      color: colors.text,
      opacity: 0.6,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 8,
    },
    list: {
      paddingHorizontal: horizontalPadding,
      paddingTop: 28,
      paddingBottom: 48,
    },
    pairRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      marginBottom: 32,
      gap: 24,
    },
    banner: {
      marginHorizontal: 32,
      marginTop: 12,
      marginBottom: 4,
      backgroundColor: colors.primary + '22',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    bannerText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '500',
    },
    card: {
      width: cardWidth,
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 6,
      borderWidth: 1.5,
      borderColor: colors.border,
      marginBottom: 0,
    },
    image: {
      width: '100%',
      height: imageHeight,
      backgroundColor: colors.border,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    captionBar: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: 'rgba(0,0,0,0.60)',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 8,
    },
    captionBarAfter: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 8,
    },
    captionLabel: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    textBlock: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    title: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
  });

export default TreatmentGalleryScreen;
