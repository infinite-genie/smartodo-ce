import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { appColors } from "@/theme";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function HomeScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  React.useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 2000 }), -1, true);

    opacity.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedText h1 style={[styles.hello, animatedStyle]}>
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
