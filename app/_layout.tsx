import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SavedProvider } from '../context/SavedContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SavedProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="detail/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
              animation: 'fade_from_bottom'
            }}
          />
        </Stack>
      </SavedProvider>
    </GestureHandlerRootView>
  );
}
