import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, Text } from 'react-native';
import Video from 'react-native-video';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const IDLE_TIMEOUT = 60000 * 2; // 2 minutes

// Placeholder video - replace with actual intro video URL or local asset
// const INTRO_VIDEO = require('../assets/intro.mp4'); 
const INTRO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; // Example video

const Screensaver = ({ children }: { children: React.ReactNode }) => {
  const [isIdle, setIsIdle] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    setIsIdle(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (isIdle) {
    return (
      <TouchableWithoutFeedback onPress={resetTimer}>
        <View style={styles.container}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Video
              source={{ uri: INTRO_VIDEO_URL }}
              style={styles.video}
              resizeMode="cover"
              repeat={true}
              muted={true} // Muted for screensaver usually
              playInBackground={false}
              playWhenInactive={false}
            />
            <View style={styles.overlay}>
               <Text style={styles.text}>Touch anywhere to continue</Text>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={{ flex: 1 }} onStartShouldSetResponder={() => {
      resetTimer();
      return false;
    }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    opacity: 0.8,
  },
});

export default Screensaver;
