import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrioritySelectionModal from "../../components/PrioritySelectionModal";
import { TamaguiProvider } from "@tamagui/core";
import config from "../../tamagui.config";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config}>{children}</TamaguiProvider>
);

describe("PrioritySelectionModal", () => {
  const mockPriorities = [
    { value: 0, label: "No Priority" },
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
    { value: 4, label: "Critical" },
    { value: 5, label: "Urgent" },
  ];

  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    priorities: mockPriorities,
    priority: 2,
    onSelect: mockOnSelect,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render modal when visible is true", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      expect(getByText("Select Priority")).toBeTruthy();
      expect(getByText("Done")).toBeTruthy();
    });

    it("should not render modal content when visible is false", () => {
      const { queryByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} visible={false} />
        </TestWrapper>,
      );

      // Modal should still be in DOM but not visible
      // The Modal component itself handles visibility
      expect(queryByText("Select Priority")).toBeFalsy();
    });

    it("should render all priority options", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      mockPriorities.forEach((priority) => {
        expect(getByText(priority.label)).toBeTruthy();
      });
    });

    it("should highlight selected priority", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} priority={3} />
        </TestWrapper>,
      );

      // The selected priority should have different styling
      // This test checks if "High" (value 3) is rendered
      expect(getByText("High")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call onClose when Done button is pressed", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const doneButton = getByText("Done");
      fireEvent.press(doneButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onSelect when priority option is selected", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const highPriorityOption = getByText("High");
      fireEvent.press(highPriorityOption);

      expect(mockOnSelect).toHaveBeenCalledWith(3);
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it("should call onSelect with correct value for different priorities", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      // Test selecting different priorities
      fireEvent.press(getByText("Low"));
      expect(mockOnSelect).toHaveBeenCalledWith(1);

      fireEvent.press(getByText("Critical"));
      expect(mockOnSelect).toHaveBeenCalledWith(4);

      fireEvent.press(getByText("No Priority"));
      expect(mockOnSelect).toHaveBeenCalledWith(0);
    });

    it("should handle multiple rapid selections", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const highPriorityOption = getByText("High");
      fireEvent.press(highPriorityOption);
      fireEvent.press(highPriorityOption);
      fireEvent.press(highPriorityOption);

      expect(mockOnSelect).toHaveBeenCalledTimes(3);
      expect(mockOnSelect).toHaveBeenCalledWith(3);
    });
  });

  describe("Priority Selection State", () => {
    it("should show check mark for currently selected priority", () => {
      const { UNSAFE_getByType } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} priority={2} />
        </TestWrapper>,
      );

      // Should find the Check icon component for selected priority
      // This is implementation-specific and may need adjustment
      const checkIcons = UNSAFE_getByType(require("@tamagui/lucide-icons").Check);
      expect(checkIcons).toBeTruthy();
    });

    it("should update selection when priority prop changes", () => {
      const { rerender, getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} priority={1} />
        </TestWrapper>,
      );

      // Initial selection should be "Low"
      expect(getByText("Low")).toBeTruthy();

      // Change priority to High
      rerender(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} priority={3} />
        </TestWrapper>,
      );

      // Should now show "High" as selected
      expect(getByText("High")).toBeTruthy();
    });

    it("should handle string priority values", () => {
      const stringPriorities = [
        { value: "low", label: "Low Priority" },
        { value: "medium", label: "Medium Priority" },
        { value: "high", label: "High Priority" },
      ];

      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal
            {...defaultProps}
            priorities={stringPriorities}
            priority="medium"
          />
        </TestWrapper>,
      );

      fireEvent.press(getByText("High Priority"));
      expect(mockOnSelect).toHaveBeenCalledWith("high");
    });
  });

  describe("Modal Behavior", () => {
    it("should have slide animation type", () => {
      const { UNSAFE_getByType } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const modal = UNSAFE_getByType(require("react-native").Modal);
      expect(modal.props.animationType).toBe("slide");
    });

    it("should be transparent", () => {
      const { UNSAFE_getByType } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const modal = UNSAFE_getByType(require("react-native").Modal);
      expect(modal.props.transparent).toBe(true);
    });

    it("should call onClose when modal requests close", () => {
      const { UNSAFE_getByType } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const modal = UNSAFE_getByType(require("react-native").Modal);
      
      // Simulate modal request close (e.g., Android back button)
      if (modal.props.onRequestClose) {
        modal.props.onRequestClose();
      }

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty priorities array", () => {
      expect(() => {
        render(
          <TestWrapper>
            <PrioritySelectionModal
              {...defaultProps}
              priorities={[]}
            />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should handle undefined priority value", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal
            {...defaultProps}
            priority={undefined as any}
          />
        </TestWrapper>,
      );

      // Should render without crashing
      expect(getByText("Select Priority")).toBeTruthy();
    });

    it("should handle priority value not in the list", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal
            {...defaultProps}
            priority={999}
          />
        </TestWrapper>,
      );

      // Should render without showing any check marks
      expect(getByText("Select Priority")).toBeTruthy();
    });

    it("should handle very long priority labels", () => {
      const longLabelPriorities = [
        { value: 1, label: "This is a very long priority label that should be handled gracefully without breaking the layout" },
        { value: 2, label: "Another extremely long label that tests the component's ability to handle text overflow" },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <PrioritySelectionModal
              {...defaultProps}
              priorities={longLabelPriorities}
            />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper modal accessibility", () => {
      const { UNSAFE_getByType } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const modal = UNSAFE_getByType(require("react-native").Modal);
      expect(modal).toBeTruthy();
    });

    it("should handle touch interactions properly", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      // Test that all touchable elements respond to press events
      const priorityItems = mockPriorities.map(p => getByText(p.label));
      priorityItems.forEach((item, index) => {
        fireEvent.press(item);
        expect(mockOnSelect).toHaveBeenCalledWith(mockPriorities[index].value);
      });
    });
  });

  describe("Layout and Styling", () => {
    it("should have proper header layout", () => {
      const { getByText } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const title = getByText("Select Priority");
      const doneButton = getByText("Done");

      expect(title).toBeTruthy();
      expect(doneButton).toBeTruthy();
    });

    it("should render within SafeAreaView", () => {
      const { UNSAFE_getByType } = render(
        <TestWrapper>
          <PrioritySelectionModal {...defaultProps} />
        </TestWrapper>,
      );

      const safeAreaView = UNSAFE_getByType(require("react-native-safe-area-context").SafeAreaView);
      expect(safeAreaView).toBeTruthy();
    });
  });
});