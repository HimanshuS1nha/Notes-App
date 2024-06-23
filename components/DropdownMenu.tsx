import { View, Text, Modal, Pressable } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";

const DropdownMenu = ({
  isVisible,
  setIsVisible,
  options,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  options: {
    title: string;
    action: () => void;
  }[];
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <Pressable style={tw`flex-1`} onPress={() => setIsVisible(false)}>
        <View
          style={tw`absolute right-3 top-[7%] bg-white shadow-xl shadow-black p-5 rounded-lg gap-y-5 z-20`}
        >
          {options.map((option) => {
            return (
              <Pressable
                key={option.title}
                onPress={() => {
                  setIsVisible(false);
                  option.action();
                }}
              >
                <Text style={tw`text-base font-medium`}>{option.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
};

export default memo(DropdownMenu);
