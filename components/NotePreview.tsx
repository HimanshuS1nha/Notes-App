import { View, Text, Pressable } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";
import { router } from "expo-router";
import { NoteType } from "@/hooks/useNotes";

const NotePreview = ({ note }: { note: NoteType }) => {
  return (
    <Pressable
      key={note.id}
      style={tw`bg-orange-200 p-3 rounded-lg gap-y-1.5 mb-5`}
      onPress={() => router.push({ pathname: "/note", params: { ...note } })}
    >
      <Text style={tw`text-lg font-semibold`}>
        {note.title ? note.title : note.content.substring(0, 20)}
      </Text>
      <Text>{note.content.substring(0, 50)}</Text>
      <Text style={tw`text-gray-700 text-xs`}>{note.date.split(",")[1]}</Text>
    </Pressable>
  );
};

export default memo(NotePreview);
