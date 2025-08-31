import { StyleSheet, Text, View,I18nManager } from "react-native";
import { Colors } from "@/colors/colors";
import { Spaces } from "@/colors/spaces";
export default CellView = ({ title, subtitle, style, Sstyle }) => {
  return (
    <View
      style={[
        style,
        {
          flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
          flex: 1,
          justifyContent: "space-between",
          padding: Spaces.left,
        },
      ]}
    >
      <Text style={styles.subtitles}>{title}</Text>
      <Text
        style={[ Sstyle, {color: 'black', fontSize: 13}]}
      >
        {subtitle}{" "}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  subtitles: {
    color: Colors.secodary,
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
});
