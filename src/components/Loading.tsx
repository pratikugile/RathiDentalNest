import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

/**
 * Loading Component
 * Shows a loading indicator with optional message
 */
const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'large',
  fullScreen = true 
}) => {
  const { colors } = useTheme();
  const styles = themedStyles(colors, fullScreen);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const themedStyles = (colors: any, fullScreen: boolean) => StyleSheet.create({
  container: {
    ...(fullScreen ? {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    } : {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }),
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
});

export default Loading;
