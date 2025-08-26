
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Colors } from "@/colors/colors";
import LeftArrow from "@/images/left.arrow.svg"; // Adjust the import based on your SVG handling
import { router } from "expo-router";
export const BackView = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.back();
      }}
    >
      <View style={styles.backButton}>
        <LeftArrow
          width={20}
          height={16}
          color={Colors.secodary}
          style={{ tintColor: Colors.secodary }}
        />
        {/* <Image source={images.back} style={styles.backImage} /> */}
        <Text style={{ fontWeight: "bold", color: Colors.secodary }}>Back</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  }});