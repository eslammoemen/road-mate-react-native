import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import Orders from "@/images/orders.svg"; // Adjust the import based on your SVG handling
import Notifications from "@/images/notificaitions.svg";
import LeftArrow from "@/images/left.arrow.svg";
import fonts from "@/colors/fonts";
import { Colors } from "@/colors/colors";
import Logout from "@/images/logout.svg";
import * as SecureStore from "expo-secure-store";
import Close from "@/images/close.svg";
export const Menu = ({ hideMenu }) => {
  const MenuItem = (title, Icon, onPress) => {
    return (
      <View>
        <Pressable style={styles.row} onPress={onPress}>
          {Icon && <Icon width={24} height={24} />}
          <Text style={styles.title}>{title}</Text>
          <LeftArrow style={styles.arrow} width={18} height={18} />
        </Pressable>
        <View style={styles.divider} />
      </View>
    );
  };
  const logOut = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "yellow", // dim background
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: 20,
          paddingTop: 70,
          flexDirection: "column",
          flex: 1,
        }}
      >
        {
          <View style={{ flexDirection: "row" }}>
            {/* <View style={{flex: 1}}></View> */}
            <Text style={styles.bigTitle}>Road Mate</Text>
            <Close width={25} height={25} onPress={hideMenu}></Close>
          </View>
        }
        {MenuItem("My Trips", Orders, () => {
          hideMenu();
          router.push("/Screens/Features/MyTrips/View/MyTrips");
        })}
        {MenuItem("Notifications", Notifications, () => {})}
        {MenuItem("Settings", null, () => {})}
        {MenuItem("Help", null, () => {})}
        {<View style={{ flex: 1 }}></View>}
        {
          <TouchableOpacity
            style={{ height: 40, flexDirection: "row", alignItems: "center" }}
            onPress={async () => {
              await SecureStore.deleteItemAsync("userToken");
              router.replace("/Screens/Features/Auth/Login/View/Login");
            }}
          >
            <Logout width={25} height={25}></Logout>
            <Text style={styles.title}> log Out</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    flex: 1,
    marginHorizontal: 10,
  },
  arrow: {
    transform: [{ scaleX: -1 }],
  },
  divider: {
    backgroundColor: Colors.primary,
    height: 1.0,
  },
  bigTitle: {
    flex: 1,
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: Colors.primary,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
