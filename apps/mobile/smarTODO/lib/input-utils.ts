import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import type { FormEvent } from "react";

// Structural interface to avoid DOM dependency
interface InputElement extends EventTarget {
  value: string;
}

/**
 * Universal input change handler for Tamagui Input components
 * Handles both web and native events to extract text value
 *
 * @param setStateMethod - The state setter function
 * @param e - The event from the Input component (web or native)
 */
export const handleInputChange = (
  setStateMethod: (value: string) => void,
  e:
    | NativeSyntheticEvent<TextInputChangeEventData>
    | FormEvent<InputElement>
    | string,
) => {
  // Handle direct string value (Tamagui's typical pattern)
  if (typeof e === "string") {
    setStateMethod(e);
  }
  // Handle native event with text
  else if ("nativeEvent" in e && "text" in e.nativeEvent) {
    setStateMethod(e.nativeEvent.text);
  }
  // Handle web/React event - check for value property instead of instanceof
  // This works in both browser and test environments
  else if (
    "currentTarget" in e &&
    e.currentTarget &&
    "value" in e.currentTarget
  ) {
    setStateMethod((e.currentTarget as any).value);
  }
};
