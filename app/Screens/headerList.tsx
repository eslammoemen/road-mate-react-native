import { View, Text, FlatList } from "react-native";
import React from "react";
import { Users } from "./user";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

interface props {
  data: string[];
  style?: object;
  textstyle?: object;
}
type ItemProps = {
  item: Users;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const headerList = ({ data, style, textstyle }: props) => {
   const [selectedId, setSelectedId] = useState<string>();
  const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[textstyle, {backgroundColor}]}>
    <Text style={[textstyle, {color: textColor}]}>{item.name}</Text>
  </TouchableOpacity>
);
  const renderItem = ({item}: {item: Users}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };
  return (
    <FlatList
      data={data}
      renderItem={renderItem}      
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      style={style}
    ></FlatList>
  );
};

export default headerList;
