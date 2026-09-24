import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle | (ViewStyle | false | undefined)[];
  variant?: 'elevated' | 'outlined' | 'flat';
  noPadding?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'outlined',
  noPadding = false,
}) => {
  const { colors } = useAppTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: Radius.lg,
    padding: noPadding ? 0 : Spacing.md,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: colors.cardBorder,
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};
