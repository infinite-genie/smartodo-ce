import { View } from "@tamagui/core";
import { H1 } from "@tamagui/text";

export default function HomeScreen() {
  return (
    <View
      flex={1}
      backgroundColor="$background"
      justifyContent="center"
      alignItems="center"
      padding="$4"
      gap="$4"
    >
      <H1
        color="$primary"
        fontSize="$10"
        fontFamily="$heading"
        animation="bouncy"
        animateOnly={["transform"]}
        enterStyle={{
          scale: 0,
          opacity: 0,
        }}
        scale={1}
        opacity={1}
      >
        Hello, Welcome to smarTODO!
      </H1>
    </View>
  );
}
