import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing, Platform, UIManager } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const CustomDrawerContent = (props: any) => {
  const { state, descriptors, navigation } = props;
  const { colors } = useTheme();

  const [menuOpen, setMenuOpen] = useState(true);

  // Animated values per item for staggered vertical slide
  const itemsAnimRef = useRef<Animated.Value[]>(state.routes.map(() => new Animated.Value(menuOpen ? 1 : 0)));


  // Keep anim array in sync if routes change
  useEffect(() => {
    if (itemsAnimRef.current.length !== state.routes.length) {
      itemsAnimRef.current = state.routes.map(() => new Animated.Value(menuOpen ? 1 : 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.routes.length]);

  const toggleMenu = () => {
    const target = menuOpen ? 0 : 1;
    setMenuOpen(!menuOpen);

    const animations = itemsAnimRef.current.map((av, i) =>
      Animated.timing(av, {
        toValue: target,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    if (target === 1) {
      Animated.stagger(40, animations).start();
    } else {
      Animated.stagger(25, animations.reverse()).start();
    }
  };

  const renderIcon = (options: any, isFocused: boolean) => {
    // Use a smaller icon size for compact drawer
    if (options.drawerIcon) return options.drawerIcon({ focused: isFocused, size: 20, color: isFocused ? colors.primary : colors.text });
    return <Icon name="label" size={20} color={isFocused ? colors.primary : colors.text} />;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.card }]} showsVerticalScrollIndicator={false}>
      {/* In-drawer hamburger placed above the first item */}
      <View style={styles.hamburgerRow}>
        <Pressable
          onPress={toggleMenu}
          style={({ pressed }) => [
            styles.hamburgerButton,
            pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
          accessibilityLabel="Toggle menu"
        >
          <Icon name="menu" size={28} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          if (options.drawerItemStyle?.height === 0) return null;

          // Optionally render a divider after the 'Home' item (index 1)
          const divider = index === 1 ? <View key={`divider-${index}`} style={styles.divider} /> : null;

          const isFocused = state.index === index;
          const label = options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'drawerItemPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const av = itemsAnimRef.current[index] || new Animated.Value(menuOpen ? 1 : 0);

          const labelOpacity = av.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
          // Slide the label slightly downward into place so it appears under the icon
          const labelTranslateY = av.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] });

          // Always render collapsed layout (icon above label) for compact drawer.
          // The hamburger will only toggle visibility/animation of labels (slide down + fade).
          const itemStyle = [
            styles.itemCollapsed,
            isFocused && {
              backgroundColor: `${colors.primary}20`,
              borderLeftWidth: 3,
              borderLeftColor: colors.primary,
            },
          ];

          return (
            <>
              {divider}
              <Pressable
                key={route.key}
                onPress={onPress}
                style={({ pressed }) => [
                  itemStyle,
                  pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                ]}
              >
                {/* Icon always visible and centered */}
                <View style={styles.iconBox}>{renderIcon(options, isFocused)}</View>

                {/* Label is always rendered under the icon; its visibility is animated. */}
                <Animated.View style={[styles.collapsedWrapper, { opacity: labelOpacity, transform: [{ translateY: labelTranslateY }] }]}>
                  <Text style={[styles.collapsedLabelText, { color: isFocused ? colors.primary : colors.text }]} numberOfLines={1}>
                    {label}
                  </Text>
                </Animated.View>
              </Pressable>
            </>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hamburgerRow: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  list: { paddingVertical: 8 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 6,
  },
  itemCollapsed: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  iconBox: { width: 40, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, justifyContent: 'center' },
  labelText: { fontSize: 15, fontWeight: '500' },
  collapsedWrapper: { alignItems: 'center', marginTop: 8 },
  collapsedLabelText: { fontSize: 11, marginTop: 0 },
  hintRow: { paddingVertical: 12, alignItems: 'center' },
  hintText: { fontSize: 12, opacity: 0.8 },
});

export default CustomDrawerContent;
