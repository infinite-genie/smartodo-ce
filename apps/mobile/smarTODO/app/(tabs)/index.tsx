import React from "react";
import { View, StyleSheet, Text as RNText } from "react-native";
import { Text } from "@rneui/themed";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { appColors } from "@/theme";

const AnimatedText = Animated.createAnimatedComponent(RNText);

export default function HomeScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  React.useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 2000 }), -1, true);

    opacity.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedText style={[styles.hello, animatedStyle]}>
        Hello, smarTODO! 👋
      </AnimatedText>
      <Text style={styles.subtitle}>Your smart todo app is ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  hello: {
    fontSize: 32,
    fontWeight: "700",
    color: appColors.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: appColors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
});
