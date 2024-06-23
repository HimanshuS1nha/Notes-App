import { Alert, BackHandler, Pressable, Text, View } from "react-native";
import SafeView from "@/components/SafeView";
import tw from "twrnc";
import { Feather, FontAwesome6, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotes } from "@/hooks/useNotes";
import { FlashList } from "@shopify/flash-list";
import NotePreview from "@/components/NotePreview";
import DropdownMenu from "@/components/DropdownMenu";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

const Notes = () => {
  const { notes, deleteAllNotes, getNotes } = useNotes();
  const db = useSQLiteContext();

  const [isVisible, setIsVisible] = useState(false);
  return (
    <SafeView>
      <DropdownMenu
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={[
          {
            title: "View bookmarks",
            action: () => router.push("/bookmarks"),
          },
          {
            title: "Delete all notes",
            action: () => {
              Alert.alert("Warning", "Do you want to delete all notes?", [
                {
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    deleteAllNotes(db).then((res) => {
                      if (res) {
                        getNotes(db);
                      } else {
                        Alert.alert("Error", "Some error occured.", [
                          {
                            text: "Ok",
                            onPress: () => BackHandler.exitApp,
                          },
                        ]);
                      }
                    });
                  },
                },
              ]);
            },
          },
          {
            title: "Settings",
            action: () => router.push("/settings"),
          },
        ]}
      />
      <View style={tw`pt-5 px-5 flex-row justify-between items-center`}>
        <Text style={tw`text-3xl font-semibold`}>Notes</Text>
        <View style={tw`flex-row items-center gap-x-7`}>
          <Pressable onPress={() => router.push("/search")}>
            <Feather name="search" size={26} color="black" />
          </Pressable>
          <Pressable onPress={() => setIsVisible(true)}>
            <FontAwesome6 name="ellipsis-vertical" size={26} color="black" />
          </Pressable>
        </View>
      </View>

      {notes.length > 0 ? (
        <View style={tw`pt-6 px-2 gap-y-5 w-full h-full pb-16`}>
          <FlashList
            data={notes}
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
            No notes to show. Please add some
          </Text>
        </View>
      )}

      <Pressable
        style={tw`absolute bottom-6 right-4 bg-red-800 p-4 rounded-full z-20 shadow-xl shadow-black`}
        onPress={() => router.push("/add-note")}
      >
        <AntDesign name="plus" size={26} color="white" />
      </Pressable>
    </SafeView>
  );
};

export default Notes;
