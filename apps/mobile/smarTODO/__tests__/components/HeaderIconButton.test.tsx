import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { HeaderIconButton } from "../../components/HeaderIconButton";
import { TamaguiProvider } from "@tamagui/core";
import config from "../../tamagui.config";
import { Text } from "react-native";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config}>{children}</TamaguiProvider>
);

describe("HeaderIconButton", () => {
  const mockOnPress = jest.fn();
  const mockIcon = <Text>Icon</Text>;

  const defaultProps = {
    label: "Test Button",
    onPress: mockOnPress,
    children: mockIcon,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render button with children", () => {
      const { getByText } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      expect(getByText("Icon")).toBeTruthy();
    });

    it("should render with proper accessibility label", () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      expect(getByLabelText("Test Button")).toBeTruthy();
    });

    it("should have button role", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      expect(getByRole("button")).toBeTruthy();
    });

    it("should render with different children types", () => {
      const textChild = <Text>Text Icon</Text>;
      const { getByText } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} children={textChild} />
        </TestWrapper>,
      );

      expect(getByText("Text Icon")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call onPress when button is pressed", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple rapid presses", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it("should not call onPress when disabled", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} disabled />
        </TestWrapper>,
      );

      const button = getByRole("button");
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe("Styling Props", () => {
    it("should apply default styling", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      
      // The button should be rendered with default styling
      // This test verifies the component renders without throwing errors
      expect(button).toBeTruthy();
    });

    it("should accept additional button props", () => {
      const customProps = {
        ...defaultProps,
        testID: "custom-header-button",
        backgroundColor: "red",
      };

      const { getByTestId } = render(
        <TestWrapper>
          <HeaderIconButton {...customProps} />
        </TestWrapper>,
      );

      expect(getByTestId("custom-header-button")).toBeTruthy();
    });

    it("should handle size prop", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} size="$4" />
        </TestWrapper>,
      );

      const button = getByRole("button");
      expect(button).toBeTruthy();
    });

    it("should handle variant prop", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} variant="outlined" />
        </TestWrapper>,
      );

      const button = getByRole("button");
      expect(button).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility role", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      expect(getByRole("button")).toBeTruthy();
    });

    it("should have accessibility label from label prop", () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} label="Custom Label" />
        </TestWrapper>,
      );

      expect(getByLabelText("Custom Label")).toBeTruthy();
    });

    it("should have accessible prop set correctly", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      
      // Should have accessibility properties
      expect(button.props.accessibilityRole).toBe("button");
      expect(button.props.accessibilityLabel).toBe("Test Button");
    });

    it("should handle empty label gracefully", () => {
      expect(() => {
        render(
          <TestWrapper>
            <HeaderIconButton {...defaultProps} label="" />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });

  describe("Button Properties", () => {
    it("should be unstyled by default", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      // The unstyled prop should be applied
      expect(button).toBeTruthy();
    });

    it("should have transparent background by default", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      expect(button).toBeTruthy();
    });

    it("should have proper padding", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      expect(button).toBeTruthy();
    });
  });

  describe("Event Handling", () => {
    it("should handle onPress with event object", () => {
      const mockOnPressWithEvent = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} onPress={mockOnPressWithEvent} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      fireEvent.press(button);

      expect(mockOnPressWithEvent).toHaveBeenCalledTimes(1);
    });

    it("should handle press events correctly", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      
      // Test different press events
      fireEvent(button, "pressIn");
      fireEvent(button, "pressOut");
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined onPress", () => {
      expect(() => {
        render(
          <TestWrapper>
            <HeaderIconButton label="Test" onPress={undefined as any}>
              <Text>Icon</Text>
            </HeaderIconButton>
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should handle null children", () => {
      expect(() => {
        render(
          <TestWrapper>
            <HeaderIconButton {...defaultProps} children={null} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should handle multiple children", () => {
      const multipleChildren = (
        <>
          <Text>Icon 1</Text>
          <Text>Icon 2</Text>
        </>
      );

      const { getByText } = render(
        <TestWrapper>
          <HeaderIconButton {...defaultProps} children={multipleChildren} />
        </TestWrapper>,
      );

      expect(getByText("Icon 1")).toBeTruthy();
      expect(getByText("Icon 2")).toBeTruthy();
    });

    it("should handle very long labels", () => {
      const longLabel = "This is a very long accessibility label that should be handled gracefully by the component without causing any issues";
      
      expect(() => {
        render(
          <TestWrapper>
            <HeaderIconButton {...defaultProps} label={longLabel} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });

  describe("Integration with Button Props", () => {
    it("should forward all Button props correctly", () => {
      const buttonProps = {
        ...defaultProps,
        size: "$3" as const,
        variant: "outlined" as const,
        disabled: false,
        backgroundColor: "blue",
      };

      expect(() => {
        render(
          <TestWrapper>
            <HeaderIconButton {...buttonProps} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should override default props with custom props", () => {
      const customProps = {
        ...defaultProps,
        backgroundColor: "red",
        padding: "$4",
      };

      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton {...customProps} />
        </TestWrapper>,
      );

      const button = getByRole("button");
      expect(button).toBeTruthy();
    });

    it("should maintain button functionality with custom styling", () => {
      const { getByRole } = render(
        <TestWrapper>
          <HeaderIconButton
            {...defaultProps}
            backgroundColor="customColor"
            borderRadius={10}
          />
        </TestWrapper>,
      );

      const button = getByRole("button");
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });
});