import { View, Text, Pressable, TextInput } from "react-native";
import React, { useCallback, useState } from "react";
import SafeView from "@/components/SafeView";
import tw from "twrnc";
import { useNotes } from "@/hooks/useNotes";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import NotePreview from "@/components/NotePreview";
import { FlashList } from "@shopify/flash-list";

const Search = () => {
  const { notes } = useNotes();

  const [filteredNotes, setFilteredNotes] = useState(notes);

  const filterNotes = useCallback(
    (searchQuery: string) => {
      if (searchQuery === "") {
        if (filteredNotes === notes) {
          return;
        } else {
          setFilteredNotes(notes);
          return;
        }
      }

      const queriedNotes = notes.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(queriedNotes);
    },
    [notes, filteredNotes]
  );
  return (
    <SafeView>
      <View style={tw`pt-2 pb-3 px-5 flex-row gap-x-2 items-center`}>
        <Pressable onPress={router.back}>
          <Entypo name="chevron-left" size={28} color="black" />
        </Pressable>

        <TextInput
          placeholder="Type here"
          onChangeText={filterNotes}
          style={tw`bg-white shadow shadow-black w-[85%] py-2 px-3 rounded-full`}
          autoFocus
        />
      </View>

      {filteredNotes.length > 0 ? (
        <View style={tw`pt-6 px-2 gap-y-5 w-full h-full pb-16`}>
          <FlashList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <NotePreview note={item} />;
            }}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={tw`pt-6 px-2 gap-y-5`}>
          <Text style={tw`text-center text-base text-rose-500 font-medium`}>
            No notes to show.
          </Text>
        </View>
      )}
    </SafeView>
  );
};

export default Search;
