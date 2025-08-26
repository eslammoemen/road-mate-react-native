import { Platform } from "react-native";

export class URLS {
    static PORT = 2025;
    static baseURL = Platform.select({
        ios: `http://localhost:${URLS.PORT}`,
        android: `http://10.0.2.2:${URLS.PORT}`,
      })
}