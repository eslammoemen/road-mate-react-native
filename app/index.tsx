import { Redirect } from "expo-router";
import { useFonts } from "expo-font";
import { customFonts } from "@/fonts/fonts";
import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import * as Localization from "expo-localization";
import { Text, View } from "react-native";
import i18n from "../i18n";
import * as SecureStore from "expo-secure-store"
export default function Index() {
  const [fontsLoaded] = useFonts(customFonts);
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        setHasToken(!!token); // true if token exists
      } catch {
        setHasToken(false);
      } 
    };
    const enableRTL = async () => {
      //Force RTL for Arabic
      // I18nManager.allowRTL(true);
      // I18nManager.forceRTL(true);
      // I18nManager.isRTL = true;
      // i18n.locale = 'ar';
      // i18n.defaultLocale = 'ar';
    };

    enableRTL();
    prepareApp();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> App Not Ready</Text>
      </View>
    ); // or show splash/loading
  }
  if (fontsLoaded && !hasToken) {
    return <Redirect href="/Screens/Features/Auth/Login/View/Login" />;
  } else if (fontsLoaded && hasToken) {
    return <Redirect href="/Screens/Features/HomeTrips/View/HomeTrips" />;
  }
}
