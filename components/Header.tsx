import { View, Text, Pressable } from "react-native";
import React, { memo } from "react";
import { router } from "expo-router";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";

const Header = ({ title }: { title: string }) => {
  return (
    <View
      style={tw`pt-4 pb-3 px-5 flex-row gap-x-4 items-center border-b border-b-gray-300`}
    >
      <Pressable onPress={router.back}>
        <Entypo name="chevron-left" size={28} color="black" />
      </Pressable>
      <Text style={tw`text-xl font-semibold`}>{title}</Text>
    </View>
  );
};

export default memo(Header);
