import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, Text } from 'react-native';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const IDLE_TIMEOUT = 60000 * 2; // 2 minutes
const IMAGE_CHANGE_INTERVAL = 5000; // 5 seconds

// Placeholder images - in a real app, fetch these from the gallery database
const IMAGES = [
  require('../assets/logoRathi-light.png'), // Use logo as one image
  // Add more local images or URIs here
];

const Screensaver = ({ children }: { children: React.ReactNode }) => {
  const [isIdle, setIsIdle] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    setIsIdle(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      startImageRotation();
    }, IDLE_TIMEOUT);
  };

  const startImageRotation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    imageTimerRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, IMAGE_CHANGE_INTERVAL);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    };
  }, []);

  if (isIdle) {
    return (
      <TouchableWithoutFeedback onPress={resetTimer}>
        <View style={styles.container}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Image 
              source={IMAGES[currentImageIndex]} 
              style={styles.image} 
              resizeMode="contain"
            />
            <Text style={styles.text}>Touch anywhere to continue</Text>
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
    backgroundColor: COLORS.background,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: width * 0.8,
    height: height * 0.6,
    marginBottom: 40,
  },
  text: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '300',
    letterSpacing: 2,
  },
});

export default Screensaver;
