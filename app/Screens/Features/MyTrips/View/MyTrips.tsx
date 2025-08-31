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
import CellView from "../../HomeTrips/View/CellView";
import { Colors } from "@/colors/colors";
import { Spaces } from "@/colors/spaces";
import images from "@/colors/images";
import i18n from "../../../../../i18n";
import { Moment } from "moment";
import { TripModel } from "../../../Models/TripModel";
import { DataReponse, TripsModel } from "../../Auth/Login/Model/interfaces";
import { URLS } from "@/app/Screens/URLS";
import * as SecureStore from "expo-secure-store"
import { BackView } from "@/app/Screens/BackView";
import { Platform } from "react-native";

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
            <TouchableOpacity
              onPress={() => {
                // item pressed
                //  useTripStore.getState().setTrp(item);
                //  router.push(
                //    "/Screens/Features/TripDetails/View/TripDetails"
                //  );
              }}
            >
              <View style={styles.shadowBox}>
                <CellView
                  title={i18n.t("fromCity")}
                  subtitle={
                    item.fromCity.name +
                    " " +
                    format(
                      parse(item.departureTime, "yyyy-MM-dd'T'HH:mm:ss.SSS", new Date()),
                      "HH:mm a"
                    )
                  }
                  Sstyle={{ fontFamily: "Poppins-Medium", fontSize: 14 }}
                />
                <CellView
                  title={i18n.t("toCity")}
                  subtitle={
                    item.toCity.name +
                    " " +
                    format(
                      parse(item.arrivalTime, "yyyy-MM-dd'T'HH:mm:ss.SSS", new Date()),
                      "hh:mm a"
                    )
                  }
                  Sstyle={{ fontFamily: "Poppins-Medium", fontSize: 14 }}
                />
                <CellView
                  title={i18n.t("carDetails")}
                  subtitle={
                    item.car.plateNumber
                  }
                />
                {/* <CellView
                  title={i18n.t("paymentType")}
                  subtitle={item.paymentType}
                /> */}
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderColor: Colors.highlight,
                    marginTop: Spaces.top + 5,
                    marginBottom: Spaces.bottom + 5,
                  }}
                />
                <CellView
                  title={i18n.t("totalCost")}
                  subtitle={"EGP " + item.price.toFixed(1)}
                  Sstyle={{ fontFamily: "Poppins-SemiBold", fontSize: 14 }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 8,
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  color={Colors.primary}
                  backgroundColor={Colors.primary}
                  onPress={() => {
                    console.log("Track Order Pressed");
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Poppins-Bold",
                      fontSize: 13,
                    }}
                  >
                    Trip Route
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
    borderColor: Colors.highlight,
    justifyContent: "center",
    borderRadius: 10,
    padding: Spaces.padding,
  },
});