import { Stack } from "expo-router";
import FlashMessage from "react-native-flash-message";
export default function RootLayout() {
  return (
    <>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="menu"
        options={{
          presentation: "transparentModal", // overlay effect
          animation: "slide_from_left",    // slide from left
        }}
      />
    </Stack>
    <FlashMessage position="top" />
    </>
  );
}
