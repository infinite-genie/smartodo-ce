import React from "react";
import { Button, ButtonProps } from "@tamagui/button";

interface HeaderIconButtonProps extends ButtonProps {
  label: string;
  children: React.ReactNode;
}

export const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  label,
  children,
  ...props
}) => {
  return (
    <Button
      unstyled
      padding="$2"
      backgroundColor="transparent"
      hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
      role="button"
      aria-label={label}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...props}
    >
      {children}
    </Button>
  );
};
