import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, Alert, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OTTPlatform {
  name: string;
  logo: string;
  packageName: string;
  url: string;
  color: string;
}

const ottPlatforms: OTTPlatform[] = [
  {
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png',
    packageName: 'com.netflix.ninja',
    url: 'https://www.netflix.com',
    color: '#E50914',
  },
  {
    name: 'Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video_logo.svg/1280px-Prime_Video_logo.svg.png',
    packageName: 'com.amazon.avod.thirdpartyclient',
    url: 'https://www.primevideo.com',
    color: '#00A8E1',
  },
  {
    name: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1280px-Disney%2B_logo.svg.png',
    packageName: 'com.disney.disneyplus',
    url: 'https://www.disneyplus.com',
    color: '#113CCF',
  },
  {
    name: 'Hotstar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Disney%2B_Hotstar_logo.svg/1280px-Disney%2B_Hotstar_logo.svg.png',
    packageName: 'in.startv.hotstar',
    url: 'https://www.hotstar.com',
    color: '#0F1014',
  },
  {
    name: 'YouTube',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/1280px-Logo_of_YouTube_%282015-2017%29.svg.png',
    packageName: 'com.google.android.youtube.tv',
    url: 'https://www.youtube.com',
    color: '#FF0000',
  },
  {
    name: 'SonyLIV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/SonyLIV_Logo.svg/1280px-SonyLIV_Logo.svg.png',
    packageName: 'com.sonyliv',
    url: 'https://www.sonyliv.com',
    color: '#000000',
  },
  {
    name: 'Zee5',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/ZEE5_logo.svg/1280px-ZEE5_logo.svg.png',
    packageName: 'com.graymatrix.did',
    url: 'https://www.zee5.com',
    color: '#9334E9',
  },
  {
    name: 'Voot',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Voot_app_logo.svg/1280px-Voot_app_logo.svg.png',
    packageName: 'com.tv.v18.viola',
    url: 'https://www.voot.com',
    color: '#EF4136',
  },
  {
    name: 'MX Player',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/MX_Player_Logo.svg/1280px-MX_Player_Logo.svg.png',
    packageName: 'com.mxtech.videoplayer.ad',
    url: 'https://www.mxplayer.in',
    color: '#0099FF',
  },
  {
    name: 'JioCinema',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/88/JioCinema_logo.svg/1280px-JioCinema_logo.svg.png',
    packageName: 'com.jio.media.ondemand',
    url: 'https://www.jiocinema.com',
    color: '#8829FF',
  },
  {
    name: 'HBO Max',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/HBO_Max_Logo.svg/1280px-HBO_Max_Logo.svg.png',
    packageName: 'com.hbo.hbonow',
    url: 'https://www.hbomax.com',
    color: '#682EE3',
  },
  {
    name: 'Apple TV+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/1280px-Apple_TV_Plus_Logo.svg.png',
    packageName: 'com.apple.atve.androidtv.appletv',
    url: 'https://tv.apple.com',
    color: '#000000',
  },
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

  const renderItem = ({ item }: { item: OTTPlatform }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={() => handlePress(item)}
    >
      <View style={[styles.logoContainer, { backgroundColor: item.color + '15' }]}>
        <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Streaming Platforms</Text>
      <FlatList
        data={ottPlatforms}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const themedStyles = (colors: any, cardWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
      letterSpacing: 0.5,
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 32,
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
