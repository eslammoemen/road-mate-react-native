import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { Colors } from "../../assets/colors/colors";
import { Spaces } from "../../assets/colors/spaces";
import { store } from "./firebase";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  Firestore,
  doc,
  setDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { format, parseISO, parse } from "date-fns";
const CellView = ({ title, subtitle }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        padding: Spaces.left,
      }}
    >
      <Text style={styles.subtitles}>{title}</Text>
      <Text>{subtitle} </Text>
    </View>
  );
};
interface DaysModel {
  formatted: string;
  original: string;
}

interface TripModel {
  id: number;
  strtDate: string;
  endDate: string;
  car: {
    id: number;
    color: string;
    number: string;
  };
  fromCity: {
    id: number;
    title: string;
  };
  toCity: {
    id: number;
    title: string;
  };
}

const weather = () => {
  const [days, setdays] = useState<DaysModel[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedDate = useRef<string>("");
  const [data, setData] = useState<TripModel[]>([]);
  //
  useEffect(() => {
    const moment = require("moment"); // if using Node.js

    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(moment().add(i, "days").format("DD-MM-yyyyTHH:mm")); // "2025-01-01T15:21"
    }
    const someDays:   DaysModel[] = [];
  for (let i = 0; i < 7; i++) {
      someDays.push(
        {
        formatted: moment().add(i, "days").format("dddd d/M"),
         original: moment().add(i, "days").format("DD-MM-yyyyTHH:mm")
        }
        ); // "2025-01-01T15:21"
    }
    console.log("Days:", someDays);
    setdays(days);
    //  setSelectedId();
    const formattedDate = format(
      parse(days[0], "dd-MM-yyyy'T'HH:mm", new Date()),
      "dd-MM-yyyy"
    );
    setSelectedId(formattedDate);
    // setSelectedId(formattedDate);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await setDoc(doc(store, "items", "users"), {
          data: [
            {
              id: 1,
              strtDate: "03-06-2025T11:21",
              endDate: "03-06-2025T15:21",
              car: { id: 10, color: "red", number: "1234" },
              fromCity: { id: 2, title: "cairo" },
              toCity: { id: 2, title: "maadi" },
            },
          ],
        });

        //  const snapshot = await getDocs(collection(store, 'items'));
        const dc = doc(store, "items", "users");
        const docSnap = await getDoc(dc);
        if (selectedId !== "") {
          const model = docSnap
            .data()
            .data.filter((item) => item.strtDate.includes(selectedId)) as [
            TripModel
          ];
          setData(model);
        }

        //   snapshot
        //  .docs
        //  .flatMap(d => d.data().data.filter(item => item.strtDate.includes('selectedid')))
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedId]);
  return (
    <LinearGradient
      colors={["#313131", "#E3E3E3"]}
      start={{ x: 1, y: 0 }}
      end={{ x: -2.0, y: 3.2 }}
      style={styles.linearGradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.title}>Road Mate</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.listStyle}
          keyExtractor={(item) => item}
          data={days.map((day) =>
            format(parse(day, "d-M-yyyy'T'HH:mm", new Date()), "dd-MM-yyyy")
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemGardStyle,
                {
                  backgroundColor:
                    item === selectedId ? Colors.primary : Colors.highlight,
                },
              ]}
              onPress={() => {
                console.log("Selected Date:", item);
                setSelectedId(item);
              }}
            >
              <Text
                style={[
                  styles.itemsStyle,
                  { color: item === selectedId ? "white" : Colors.secodary },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        ></FlatList>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginTop: 10, padding: Spaces.left }}
          data={data}
          renderItem={({ item }) => (
            <View style={styles.shadowBox}>
              <CellView
                title="Delivery type:"
                subtitle="Normal, will arrived in 2 or 3 days "
              />
              <CellView title="Order date:" subtitle="17 Aug 2023" />
              <CellView
                title={"Payment type:"}
                subtitle={"Mastercard, Payment done"}
              />
              <View
                style={{
                  borderStyle: "dashed",
                  borderWidth: 0.8,
                  borderColor: Colors.secodary,
                  marginTop: Spaces.top + 5,
                  marginBottom: Spaces.bottom + 5,
                }}
              />
              <CellView title={"Total Products:"} subtitle={"5"} />
              <CellView title={"Total Cost:"} subtitle={"130$"} />
              <Button
                title="Track Order"
                color={Colors.primary}
                onPress={() => {
                  console.log("Track Order Pressed");
                }}
              />
            </View>
          )}
        ></FlatList>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default weather;

const styles = StyleSheet.create({
  subtitles: {
    color: Colors.secodary,
  },
  itemGardStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.highlight,
    margin: Spaces.margin,
    padding: 7,

    borderRadius: 10,
  },
  listStyle: {
    // padding: 10,
    maxHeight: 50,
    paddingLeft: 10,
  },
  itemsStyle: {
    // backgroundColor: "#f9c2ff",
    textAlignVertical: "center",
    flex: 1,
    color: Colors.secodary,
    height: 25,
    borderRadius: 10,
    margin: 5,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  shadowBox: {
    flex: 1,
    backgroundColor: Colors.highlight,
    margin: Spaces.margin,
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.secodary,
    padding: Spaces.padding,
  },
});
