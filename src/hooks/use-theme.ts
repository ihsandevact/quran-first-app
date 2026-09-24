import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const scheme: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';
  return {
    scheme,
    isDark: scheme === 'dark',
    colors: Colors[scheme],
  };
}

export const useTheme = useAppTheme;
