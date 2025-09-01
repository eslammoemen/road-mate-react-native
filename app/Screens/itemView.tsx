import { View, Text, TouchableOpacity } from "react-native";
import { homeStyles } from "@/app/Screens/Features/HomeTrips/View/HomeTrips";
import CellView from "@/app/Screens/Features/HomeTrips/View/CellView";
import { Colors } from "@/colors/colors";
import { Spaces } from "@/colors/spaces";
import { format, parse } from "date-fns";
import i18n from "@/i18n";
import { TripsModel } from "@/app/Screens/Features/Auth/Login/Model/interfaces";
import { useTripStore } from "@/app/Screens/tripModelStore";
import React from "react";

const ItemView = ({onPress, item}) => {
  return (
    <TouchableOpacity
      onPress={ onPress }
    >
      <View style={homeStyles.shadowBox}>
        <CellView
          title={i18n.t("fromCity")}
          subtitle={
            item.fromCity.name +
            " " +
            format(
              parse(
                item.departureTime,
                "yyyy-MM-dd'T'HH:mm:ss.SSS",
                new Date()
              ),
              "hh:mm a"
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
          title={i18n.t("driverName")}
          subtitle={item.car.driver.user.name}
        />
        <CellView
          title={i18n.t("numberOfSeats")}
          subtitle={item.numberOfSeats.toString()}
        />
        <View
          style={{
            borderStyle: "dashed",
            borderWidth: 0.2,
            borderColor: Colors.black,
            marginTop: Spaces.top + 5,
            marginBottom: Spaces.bottom + 5,
          }}
        />
        <CellView
          title={i18n.t("totalCost")}
          subtitle={"EGP " + item.price.toFixed(1)}
          Sstyle={{ fontFamily: "Poppins-SemiBold", fontSize: 14 }}
        />
        {/* <TouchableOpacity
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
                      > */}
        {/* <Text
                          style={{
                            color: "white",
                            fontFamily: "Poppins-Bold",
                            fontSize: 13,
                          }}
                        >
                          Trip Route
                        </Text>
                      </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default ItemView;
