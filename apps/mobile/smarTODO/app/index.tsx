import { View } from "@tamagui/core";
import { H1 } from "@tamagui/text";

export default function HomeScreen() {
  return (
    <View
      flex={1}
      backgroundColor="$background"
      justifyContent="center"
      alignItems="center"
    >
      <H1
        color="$primary"
        fontSize="$10"
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
