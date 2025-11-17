import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SendIntentAndroid from 'react-native-send-intent';

// Sample data for games with their package names
const gamesData = [
  {
    id: '1',
    title: 'Cavity Busters',
    description: 'A fun arcade game where you fight off sugar bugs and protect the teeth!',
    icon: 'gamepad-variant-outline',
    banner: 'https://images.unsplash.com/photo-1579332452220-f4cb22f47a6d?w=600&q=80',
    packageName: 'com.example.cavitybusters' // Replace with the actual package name
  },
  {
    id: '2',
    title: 'Brushing Hero',
    description: 'Learn the correct brushing technique in this interactive and guided game.',
    icon: 'tooth-outline',
    banner: 'https://images.unsplash.com/photo-1589823495821-655416558b3a?w=600&q=80',
    packageName: 'com.example.brushinghero' // Replace with the actual package name
  },
  {
    id: '3',
    title: 'Dental Dash',
    description: 'Race against time to clean all the teeth before the plaque monster arrives!',
    icon: 'timer-outline',
    banner: 'https://images.unsplash.com/photo-1606828854649-5e489b4a4d33?w=600&q=80',
    packageName: 'com.example.dentaldash' // Replace with the actual package name
  },
];

const GameCard = ({ item, colors, onPlay }) => {
  const styles = themedStyles(colors);
  return (
    <TouchableOpacity style={styles.gameCard} onPress={() => onPlay(item.packageName)}>
      <Image source={{ uri: item.banner }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay} />
      <View style={styles.gameInfo}>
          <MaterialCommunityIcons name={item.icon} size={40} color={'#fff'} />
          <View style={styles.gameTextContainer}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameDescription}>{item.description}</Text>
          </View>
      </View>
      <View style={styles.playButton}>
          <Text style={styles.playButtonText}>Play</Text>
      </View>
    </TouchableOpacity>
  );
};

function GamesScreen() {
  const { colors } = useTheme();
  const styles = themedStyles(colors);

  const handlePlayGame = (packageName) => {
    SendIntentAndroid.isAppInstalled(packageName).then(isInstalled => {
      if (isInstalled) {
        SendIntentAndroid.openApp(packageName).catch(err => {
          console.log(err);
          Alert.alert('Error', 'Could not open the game. Please try again.');
        });
      } else {
        Alert.alert(
          'Game Not Found',
          'This game is not installed. Please install it from the app store to play.'
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dental Games</Text>
      </View>
      <FlatList
        data={gamesData}
        renderItem={({ item }) => <GameCard item={item} colors={colors} onPlay={handlePlayGame} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
      padding: 15,
  },
  gameCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderColor: colors.border,
    borderWidth: 1,
  },
  bannerImage: {
      width: '100%',
      height: 120,
  },
  bannerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)'
  },
  gameInfo: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameTextContainer: {
      flex: 1,
      marginLeft: 15,
  },
  gameTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  gameDescription: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  playButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      alignItems: 'center',
  },
  playButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default GamesScreen;
