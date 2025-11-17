import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

function VideoPlayerScreen({ route }) {
  const { videoPath } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: `file://${videoPath}` }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoPlayerScreen;
