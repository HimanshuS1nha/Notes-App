import { View, Text } from "react-native";
import React from "react";
import SafeView from "@/components/SafeView";
import tw from "twrnc";
import Header from "@/components/Header";
import { useBookmarks } from "@/hooks/useBookmarks";
import { FlashList } from "@shopify/flash-list";
import NotePreview from "@/components/NotePreview";

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();
  return (
    <SafeView>
      <Header title="Bookmarks" />

      {bookmarks.length > 0 ? (
        <View style={tw`pt-6 px-2 gap-y-5 w-full h-full pb-16`}>
          <FlashList
            data={bookmarks}
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
            No bookmarks to show.
          </Text>
        </View>
      )}
    </SafeView>
  );
};

export default Bookmarks;
