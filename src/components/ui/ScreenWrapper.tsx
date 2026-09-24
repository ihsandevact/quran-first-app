import React from 'react';
import { View, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/use-theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  statusBarColor?: string;
  withTopInset?: boolean;
  withBottomInset?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  statusBarColor,
  withTopInset = true,
  withBottomInset = true,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: withTopInset ? insets.top : 0,
    paddingBottom: withBottomInset ? insets.bottom : 0,
  };

  return (
    <View style={[containerStyle, style]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={statusBarColor || colors.background}
      />
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
};
