import { handleInputChange } from "../../lib/input-utils";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

describe("Input Utils", () => {
  describe("handleInputChange", () => {
    let mockSetState: jest.Mock;

    beforeEach(() => {
      mockSetState = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle direct string value", () => {
      const testValue = "test string";
      handleInputChange(mockSetState, testValue);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(testValue);
    });

    it("should handle empty string value", () => {
      handleInputChange(mockSetState, "");

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith("");
    });

    it("should handle native event with text", () => {
      const testText = "native text";
      const nativeEvent: NativeSyntheticEvent<TextInputChangeEventData> = {
        nativeEvent: {
          text: testText,
          eventCount: 1,
          target: 123,
        },
        currentTarget: {} as any,
        target: {} as any,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: "change",
      };

      handleInputChange(mockSetState, nativeEvent);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(testText);
    });

    it("should handle native event with empty text", () => {
      const nativeEvent: NativeSyntheticEvent<TextInputChangeEventData> = {
        nativeEvent: {
          text: "",
          eventCount: 1,
          target: 123,
        },
        currentTarget: {} as any,
        target: {} as any,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: "change",
      };

      handleInputChange(mockSetState, nativeEvent);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith("");
    });

    it("should handle web/React FormEvent", () => {
      const testValue = "web input value";
      const mockInput = {
        value: testValue,
        tagName: "INPUT",
        nodeType: 1,
      } as HTMLInputElement;

      const formEvent = {
        currentTarget: mockInput,
        target: mockInput,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: "change",
        nativeEvent: {} as any,
      } as React.FormEvent<HTMLInputElement>;

      handleInputChange(mockSetState, formEvent);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(testValue);
    });

    it("should handle web/React FormEvent with empty value", () => {
      const mockInput = {
        value: "",
        tagName: "INPUT",
        nodeType: 1,
      } as HTMLInputElement;

      const formEvent = {
        currentTarget: mockInput,
        target: mockInput,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: "change",
        nativeEvent: {} as any,
      } as React.FormEvent<HTMLInputElement>;

      handleInputChange(mockSetState, formEvent);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith("");
    });

    it("should handle special characters in string value", () => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
      handleInputChange(mockSetState, specialChars);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(specialChars);
    });

    it("should handle unicode characters", () => {
      const unicodeText = "Hello 世界 🌍 مرحبا";
      handleInputChange(mockSetState, unicodeText);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(unicodeText);
    });

    it("should handle very long string values", () => {
      const longString = "a".repeat(10000);
      handleInputChange(mockSetState, longString);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(longString);
    });

    it("should handle whitespace-only strings", () => {
      const whitespaceString = "   \t\n\r   ";
      handleInputChange(mockSetState, whitespaceString);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(whitespaceString);
    });

    it("should not call setState when event type is not recognized", () => {
      const unknownEvent = {
        someProperty: "value",
      } as any;

      handleInputChange(mockSetState, unknownEvent);

      expect(mockSetState).not.toHaveBeenCalled();
    });

    it("should not call setState when currentTarget is not an HTMLInputElement", () => {
      const invalidEvent = {
        currentTarget: {
          tagName: "DIV",
          nodeType: 1,
        },
      } as any;

      handleInputChange(mockSetState, invalidEvent);

      expect(mockSetState).not.toHaveBeenCalled();
    });

    it("should handle multiple sequential calls", () => {
      const values = ["first", "second", "third"];

      values.forEach((value) => {
        handleInputChange(mockSetState, value);
      });

      expect(mockSetState).toHaveBeenCalledTimes(3);
      expect(mockSetState).toHaveBeenNthCalledWith(1, "first");
      expect(mockSetState).toHaveBeenNthCalledWith(2, "second");
      expect(mockSetState).toHaveBeenNthCalledWith(3, "third");
    });

    it("should handle numeric strings correctly", () => {
      const numericString = "12345.67";
      handleInputChange(mockSetState, numericString);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(numericString);
    });

    it("should preserve leading and trailing spaces", () => {
      const spacedString = "  text with spaces  ";
      handleInputChange(mockSetState, spacedString);

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith(spacedString);
    });
  });
});
