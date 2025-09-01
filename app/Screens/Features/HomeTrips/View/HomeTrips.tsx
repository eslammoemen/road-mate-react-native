import { format, parse } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { Colors } from "@/colors/colors";
import { Spaces } from "@/colors/spaces";
import images from "@/colors/images";
import { useTripStore } from "../../../tripModelStore";
import CellView from "./CellView";
import moment from "moment";
import i18n from "../../../../../i18n";
import "moment/locale/ar";
import Orders from "@/images/orders.svg"; // Adjust the import based on your SVG handling
import Notifications from "@/images/notificaitions.svg";
import MenuImage from "@/images/menuImage.svg";
import { Menu } from "@/app/Screens/menu";

import { DataReponse, TripsModel } from "../../Auth/Login/Model/interfaces";
import { URLS } from "../../../URLS";
import ItemView from "@/app/Screens/itemView";
interface DaysModel {
  formatted: string;
  original: string;
}

const HomeTrips = () => {
  const [loading, setLoading] = useState(true);
  const [days, setdays] = useState<DaysModel[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedDate = useRef<string>("");
  const [data, setData] = useState<TripsModel[]>([]);
  //
  const [menuVisible, setMenuVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const translateX = useState(new Animated.Value(-screenWidth))[0];
  //
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };
  //
  useEffect(() => {
    const someDays: DaysModel[] = [];
    for (let i = 0; i < 7; i++) {
      const dayInEnglish = moment().locale("en").add(i, "days").format("dddd");

      if (dayInEnglish !== "Friday" && dayInEnglish !== "Saturday") {
        someDays.push({
          formatted: moment()
            .locale(I18nManager.isRTL ? "ar" : "en")
            .add(i, "days")
            .format("dddd D/M"),
          original: moment().locale("en").add(i, "days").format("yyyy-MM-DD"),
        });
      }
    }
    setdays(someDays);
    setSelectedId(someDays[0].original);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      date: selectedId, // This will be like ?date=2025-08-14
    });
    try {
      const response = await fetch(
        `${URLS.baseURL}/api/trips?${params.toString()}`, // Replace with your API endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const tripsData: DataReponse<TripsModel[]> = await response.json();
      setData(tripsData.data || []);
      console.log("HomeTrips Data:", tripsData.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false); // always stop loading
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedId]);
  return (
    <LinearGradient
      colors={["#FFFF", "#FFFFFF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: -2.0, y: 3.2 }}
      style={homeStyles.linearGradient}
    >
      <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <View style={{ width: 44.44, height: 44.44 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.highlight,
                  borderRadius: "50%",
                }}
                onPress={() => {
                  openMenu();
                }}
              >
                <MenuImage width={24} height={24}></MenuImage>
              </TouchableOpacity>
            </View>

            <View style={{ width: 44.44, height: 44.44, marginLeft: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.highlight,
                  borderRadius: "50%",
                }}
                onPress={() => {
                  router.push("/Screens/Features/MyTrips/View/MyTrips");
                }}
              >
                <Notifications width={24} height={24}></Notifications>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={homeStyles.title}>Road Mate</Text>
          <View style={{ width: 44.44, height: 44.44, marginHorizontal: 20 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.highlight,
                borderRadius: "50%",
              }}
              onPress={() => {
                router.push("/Screens/Features/MyTrips/View/MyTrips");
              }}
            >
              <Orders width={24} height={24}></Orders>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          inverted={I18nManager.isRTL}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={homeStyles.listStyle}
          keyExtractor={(item) => item.original}
          data={days}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                homeStyles.itemGardStyle,
                {
                  backgroundColor:
                    item.original === selectedId
                      ? Colors.primary
                      : Colors.highlight,
                },
              ]}
              onPress={() => {
                if (selectedId === item.original) {
                  fetchData();
                  return;
                }
                setSelectedId(item.original);
              }}
            >
              <Text
                style={[
                  homeStyles.itemsStyle,
                  {
                    color:
                      item.original === selectedId ? "white" : Colors.secodary,
                  },
                ]}
              >
                {item.formatted}
              </Text>
            </TouchableOpacity>
          )}
        ></FlatList>
        <View
          style={{
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
            flex: 1,
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
                  onPress={() => {
                    useTripStore.getState().setTrpid(item.id);
                    router.push(
                      "/Screens/Features/TripDetails/View/TripDetails"
                    );
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
        {menuVisible && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: screenWidth * 0.8,
              height: "100%",
              backgroundColor: "white",
              transform: [{ translateX }],
              elevation: 10, // shadow on Android
              shadowColor: "#000", // shadow on iOS
              shadowOpacity: 0.2,
              shadowOffset: { width: 2, height: 0 },
            }}
          >
            <Menu hideMenu={closeMenu} />
            {/* <Text style={{ fontSize: 22, margin: 20 }}>Menu</Text>
          <Pressable onPress={closeMenu}>
            <Text style={{ color: "blue", margin: 20 }}>Close</Text>
          </Pressable> */}
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeTrips;

const homeStyles = StyleSheet.create({
  subtitles: {
    color: Colors.secodary,
    fontWeight: "bold",
    fontSize: 13,
  },
  itemGardStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.highlight,
    margin: Spaces.margin,
    padding: 2,
    borderRadius: 20,
  },
  listStyle: {
    // padding: 10,
    maxHeight: 50,
    paddingHorizontal: 10,
  },
  itemsStyle: {
    // backgroundColor: "#f9c2ff",
    textAlignVertical: "center",
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    color: Colors.secodary,
    height: 25,
    borderRadius: 10,
    margin: 5,
    padding: 5,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
  },
  title: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: Colors.primary,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  shadowBox: {
    flex: 1,
    margin: Spaces.margin,
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.highlight,
    justifyContent: "center",
    borderRadius: 10,
    padding: Spaces.padding,
  },
});

export { homeStyles };
