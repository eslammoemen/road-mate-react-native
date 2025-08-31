import { React, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
  I18nManager,
} from "react-native";
import { Dimensions } from "react-native";
import { TripsModel, DataReponse } from "../../Auth/Login/Model/interfaces";
import { useTripStore } from "../../../tripModelStore";
import { router } from "expo-router";
import images from "@/images";
import { Colors } from "@/colors/colors";
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import Call from "@/images/call.svg"; // Adjust the import based on your SVG handling
import CellView from "../../HomeTrips/View/CellView"; // Adjust the import path as necessary
import { format, parse } from "date-fns";
import { LeftArrow } from "@/images/left.arrow.svg"; // Adjust the import based on your SVG handling
import { Platform } from "react-native";
import { Background } from "@react-navigation/elements";
import i18n from "../../../../../i18n";
import { BackView } from "../../../BackView";
import { URLS } from "@/app/Screens/URLS";
import { isLoading } from "expo-font";
import * as SecureStore from "expo-secure-store";
import FlashMessage, { showMessage } from "react-native-flash-message";

const CommonSkeletonProps = {
  colorMode: "light",
  transition: {
    translateX: {
      type: "spring",
      duration: 2000,
    },
  },
} as const;

const TripDetails = () => {
  const [loading, setLoading] = useState(true);
  const tripid = useTripStore((state) => state.tripid) as number;
  const [fetchedTrip, setFetchedTrip] = useState<TripsModel>(null);
  
  const [reserveLoading, setReserveLoading] = useState(false);

  const makeCall = () => {
    const phoneNumber = `tel:${fetchedTrip.car.driver.user.phone}`; // Replace with your number
    Linking.openURL(phoneNumber);
  };

  const fetchOneTrip = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      id: tripid, // This will be like ?date=2025-08-14
    });
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(
        `${URLS.baseURL}/api/trips/tripbyid?${params.toString()}`, // Replace with your API endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, // Adjust the token retrieval as necessary
          },
        }
      );
      const data: DataReponse<TripsModel> = await response.json();
      console.log("Fetched Trip Data:", data);
      setFetchedTrip(data.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false); // always stop loading
    }
  };
  const toggleReservation = () => {
    setFetchedTrip((prev) => ({
      ...prev,
      isreserved: !prev.isreserved, // toggle value
    }));
  };
  const reserveTrip = async () => {
    setReserveLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(
        `${URLS.baseURL}/api/trips/subscribe`, // Replace with your API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization:
              "Bearer " +
              token
          },
          body: JSON.stringify({
            tripId: tripid, // Assuming you have the trip ID available
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reserve trip");
      }
      const data = await response.json();
      // fetchOneTrip();
      showMessage({
        type: "success",
        message: fetchedTrip.isReserved ? i18n.t("tripCancelled") : i18n.t("tripReserved"),
        duration: 3000,
        icon: "success",
        floating: true,
        style: { borderRadius: 10, marginTop: 20 },
      })
      fetchedTrip.isReserved = !fetchedTrip.isReserved;
    } catch (error) {
      console.error("Error reserving trip:", error);
    } finally {
      setReserveLoading(false);
    }
  };
  useEffect(() => {
    fetchOneTrip();
  }, []);

  if (!fetchedTrip) {
    return (
      <View
        style={{
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View style={{ position: "absolute", top: 40, left: 10 }}>
          {Platform.OS === "ios" ? <BackView /> : null}
        </View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {Platform.OS === "ios" ? (
        <BackView />
      ) : (
        <View style={{ height: 40 }}></View>
      )}
      <FlashMessage position="top" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.driverDetails}>
            <View
              style={{
                flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                }}
              >
                <Image
                  style={{
                    // marginHorizontal: 20,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                  }}
                  source={{ uri: fetchedTrip?.car.driver.user.image }} // Adjust the image source as necessary
                />
                <View
                  style={{
                    marginHorizontal: 15,
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontFamily: "Poppins-SemiBold",
                    }}
                  >
                    {fetchedTrip.car.driver.user.name}
                  </Text>
                  <Text style={{ fontFamily: "Poppins-Regular" }}>
                    {i18n.t("tested")}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={makeCall}>
                <Call width={37} height={37} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              width: "90%",
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <MapView
              style={{ flex: 1 }}
              provider={PROVIDER_DEFAULT} // Use Google Maps
              initialRegion={{
                latitude: fetchedTrip?.fromCity.latitude,
                longitude: fetchedTrip?.fromCity.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
              onMapReady={() => {
                console.log("Map is ready");
              }}
              onMapError={(error) => {
                console.log("❌ Map error:", error.nativeEvent);
              }}
            >
              <Marker
                coordinate={{
                  latitude: fetchedTrip?.fromCity.latitude,
                longitude: fetchedTrip?.fromCity.longitude,
                }}
                title={i18n.t("pickup")}
                description={i18n.t("pickupDescription")}
              />
            </MapView>
          </View>
          <View
            style={[
              styles.driverDetails,
              {
                marginTop: 10,
                padding: 0,
                flexDirection: "column",
                height: "140",
                backgroundColor: "white",
              },
            ]}
          >
            <CellView
              style={{ width: "95%", marginTop: 5 }}
              title={i18n.t("fromCity")}
              subtitle={
                fetchedTrip.fromCity.name +
                " - " +
                format(
                  parse(
                    fetchedTrip.arrivalTime,
                    "yyyy-MM-dd'T'HH:mm:ss.SSS",
                    new Date()
                  ),
                  "hh:mm a"
                )
              }
              Sstyle={{ fontFamily: "Poppins-Medium", fontSize: 14 }}
            />
            <CellView
              style={{ width: "95%" }}
              title={i18n.t("toCity")}
              subtitle={
                fetchedTrip.toCity.name +
                " - " +
                format(
                  parse(
                    fetchedTrip.departureTime,
                    "yyyy-MM-dd'T'HH:mm:ss.SSS",
                    new Date()
                  ),
                  "hh:mm a"
                )
              }
              Sstyle={{ fontFamily: "Poppins-Medium", fontSize: 14 }}
            />
            <CellView
              style={{ width: "95%" }}
              title={i18n.t("carDetails")}
              subtitle={fetchedTrip.car.plateNumber}
            />
            <CellView
              style={{ width: "95%" }}
              title={i18n.t("totalCost")}
              subtitle={"EGP " + fetchedTrip.price.toFixed(1)}
              Sstyle={{ fontFamily: "Poppins-SemiBold", fontSize: 14 }}
            />
          </View>
          {reserveLoading ? (<ActivityIndicator style= {{height: 45, marginTop: 10}} size="large" color={Colors.primary} />) : (
          <TouchableOpacity
            style={{
              backgroundColor: fetchedTrip?.isReserved
                ? Colors.red
                : Colors.primary,
              borderRadius: 10,
              height: 45,
              width: "90%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            color={Colors.primary}
            backgroundColor={Colors.primary}
            onPress={() => {
              reserveTrip();
            }}
            
          >
            
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Bold",
                fontSize: 13,
              }}
            >
              {fetchedTrip.isReserved
                ? i18n.t("CancelTrip")
                : i18n.t("reserveNow")}
            </Text>
          </TouchableOpacity>)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: Dimensions.get("window").height * 0.86,
  },
  backImage: {
    color: Colors.secodary,
    width: 20,
    height: 18,
    margin: 3,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButtonText: {
    marginLeft: 5,
  },
  driverDetails: {
    marginTop: 20,
    backgroundColor: Colors.highlight,
    padding: 20,
    borderRadius: 10,
    width: "90%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
