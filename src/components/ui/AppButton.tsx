import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors } = useAppTheme();

  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Radius.lg,
      paddingHorizontal: Spacing.lg,
    };

    if (size === 'small') {
      base.paddingVertical = Spacing.sm;
      base.minHeight = 38;
    } else if (size === 'medium') {
      base.paddingVertical = Spacing.md;
      base.minHeight = 46;
    } else {
      base.paddingVertical = 16;
      base.minHeight = 54;
    }

    if (variant === 'primary') {
      base.backgroundColor = colors.primary;
    } else if (variant === 'secondary') {
      base.backgroundColor = colors.primaryMuted;
    } else if (variant === 'gold') {
      base.backgroundColor = colors.accentGold;
    } else {
      base.backgroundColor = 'transparent';
    }

    if (disabled) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let text: TextStyle = {
      fontSize: size === 'small' ? 14 : 16,
      fontWeight: '600',
    };

    if (variant === 'primary') {
      text.color = '#FFFFFF';
    } else if (variant === 'secondary') {
      text.color = colors.primary;
    } else if (variant === 'gold') {
      text.color = '#1C211E';
    } else {
      text.color = colors.textMuted;
    }

    return text;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
