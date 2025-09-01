import {
  View,
  Text,
  FlatList,
  I18nManager,
  ActivityIndicator,
  Image, StyleSheet, TouchableOpacity,
  SafeAreaView
} from "react-native";
import { format, parse } from "date-fns";

import { useFocusEffect } from "expo-router";
import { ReactElement, useState, useEffect, useCallback } from "react";
import CellView from "@/app/Screens/Features/HomeTrips/View/CellView";
import { Colors } from "@/colors/colors";
import { Spaces } from "@/colors/spaces";
import images from "@/colors/images";
import i18n from "@/i18n";
import { Moment } from "moment";
import { DataReponse, TripsModel } from "@/app/Screens/Features/Auth/Login/Model/interfaces";
import { URLS } from "@/app/Screens/URLS";
import * as SecureStore from "expo-secure-store"
import { BackView } from "@/app/Screens/BackView";
import { Platform } from "react-native";
import { useTripStore } from "@/app/Screens/tripModelStore";
import {router} from 'expo-router'
import ItemView from "@/app/Screens/itemView";

import { homeStyles } from "@/app/Screens/Features/HomeTrips/View/HomeTrips";
const MyTrips = () => {

  const [data, setData] = useState<TripsModel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
            const response = await fetch(
        `${URLS.baseURL}/api/trips/mytrips`, // Replace with your API endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
      }
      );
      const data: DataReponse<[TripsModel]> = await response.json()
      setData(data.data);
      console.log("MyTrips Data:", data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false); // always stop loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
      {Platform.OS === "ios" ? (
              <BackView />
            ) : (
              <View style={{ height: 40 }}></View>
            )}
    <View
      style={{
        justifyContent: "center",
        width: "100%",
        alignItems: "center",
        flex: 1,
        backgroundColor: 'white'
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : data.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginTop: 10,
            padding: Spaces.left,
            width: "100%",
          }}
          data={data}
          renderItem={({ item }) => (
           <ItemView
           onPress={()=>{
              useTripStore.getState().setTrpid(item.id);
              router.push("/Screens/Features/TripDetails/View/TripDetails");
           }}
           item={item}
           />
          )}
        ></FlatList>
      ) : (
        <Image
          source={images.empty}
          style={{ resizeMode: "contain", width: "80%", maxHeight: "60%" }}
        />
      )}
    </View>
    </SafeAreaView>
  );
};

export default MyTrips;

const styles = StyleSheet.create({
  shadowBox: {
    flex: 1,
    margin: Spaces.margin,
    borderWidth: 1,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.highlight,
    justifyContent: "center",
    borderRadius: 10,
    padding: Spaces.padding,
  },
});