import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, Alert, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OTTPlatform {
  name: string;
  logo: any;
  packageName: string;
  url: string;
  color: string;
}

const ottPlatforms: OTTPlatform[] = [
  {
    name: 'Netflix',
    logo: require('../assets/Netflix.jpg'),
    packageName: 'com.netflix.ninja',
    url: 'https://www.netflix.com',
    color: '#E50914',
  },
  {
    name: 'Prime Video',
    logo: require('../assets/PrimeVideo.svg'),
    packageName: 'com.amazon.avod.thirdpartyclient',
    url: 'https://www.primevideo.com',
    color: '#00A8E1',
  },
  // {
  //   name: 'Disney+',
  //   logo: require('../assets/disneyplus.jpg'),
  //   packageName: 'com.disney.disneyplus',
  //   url: 'https://www.disneyplus.com',
  //   color: '#113CCF',
  // },
  {
    name: 'YouTube',
    logo: require('../assets/Youtubelogo.webp'),
    packageName: 'com.google.android.youtube.tv',
    url: 'https://www.youtube.com',
    color: '#FF0000',
  },
  // {
  //   name: 'HBO Max',
  //   logo: require('../assets/HBOMax.svg'),
  //   packageName: 'com.hbo.hbonow',
  //   url: 'https://www.hbomax.com',
  //   color: '#682EE3',
  // },
  // {
  //   name: 'Apple TV+',
  //   logo: require('../assets/AppleTVPlus.svg'),
  //   packageName: 'com.apple.atve.androidtv.appletv',
  //   url: 'https://tv.apple.com',
  //   color: '#000000',
  // },
];

const OTTScreen = () => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  
  // Calculate dynamic columns for TV - use 4 columns for 1280x720
  const isLargeScreen = width >= 768;
  const drawerWidth = isLargeScreen ? 88 : 0;
  const availableScreenWidth = width - drawerWidth;

  const numColumns = availableScreenWidth >= 1600 ? 6 : availableScreenWidth >= 1000 ? 4 : 3;
  const horizontalPadding = 16;
  const cardMargin = 6;
  const totalMargins = cardMargin * 2 * numColumns; // Each card has margin on both sides
  const totalPadding = horizontalPadding * 2;
  const availableWidth = availableScreenWidth - totalPadding - totalMargins;
  const cardWidth = Math.floor(availableWidth / numColumns);
  
  const styles = themedStyles(colors, cardWidth);

  const handlePress = async (item: OTTPlatform) => {
    if (Platform.OS === 'android') {
      // Try to open the app by package name
      const appUrl = `intent://#Intent;package=${item.packageName};end`;
      try {
        const canOpen = await Linking.canOpenURL(appUrl);
        if (canOpen) {
          await Linking.openURL(appUrl);
        } else {
          // Fallback to Play Store if app is not installed
          const playStoreUrl = `market://details?id=${item.packageName}`;
          await Linking.openURL(playStoreUrl);
        }
      } catch (error) {
        Alert.alert('Error', `Could not open ${item.name}. Please install the app from Play Store.`);
      }
    } else {
      // For non-Android, open web URL
      const supported = await Linking.canOpenURL(item.url);
      if (supported) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert('Error', `Cannot open ${item.name}`);
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLogoContainer}>
        <Icon name="television-play" size={40} color={colors.primary} />
      </View>
      <Text style={styles.headerTitle}>Entertainment Hub</Text>
      <Text style={styles.headerSubtitle}>Watch your favorite shows & movies</Text>
    </View>
  );

  const renderItem = ({ item }: { item: OTTPlatform }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={() => handlePress(item)}
    >
      <View style={[styles.logoContainer, { backgroundColor: item.color + '15' }]}>
        <Image source={item.logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={ottPlatforms}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        contentContainerStyle={[styles.list, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const themedStyles = (colors: any, cardWidth: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 5,
  },
  headerLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
  list: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  card: {
      width: cardWidth,
      aspectRatio: 1,
      margin: 6,
      padding: 12,
      borderRadius: 16,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoContainer: {
      width: '100%',
      height: '65%',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    logo: {
      width: '80%',
      height: '80%',
    },
    name: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
  });

export default OTTScreen;
