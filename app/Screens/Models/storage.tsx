import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeString = async (string: string, key: string) => {
  try {
    await AsyncStorage.setItem(key, string);
  } catch (e) {
    console.error('Failed to save string', e);
  }
};

// Read data from cache
export const loadToken = async (key: string) => {
  try {
    const token = await AsyncStorage.getItem(key);
    if (token) {
      console.log('Cached token:', token);
    }
  } catch (e) {
    console.error('Failed to load token', e);
  }
};