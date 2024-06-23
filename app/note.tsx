import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useCallback, useState } from "react";
import SafeView from "@/components/SafeView";
import tw from "twrnc";
import { Entypo, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { NoteType, useNotes } from "@/hooks/useNotes";
import { useSQLiteContext } from "expo-sqlite";
import { useBookmarks } from "@/hooks/useBookmarks";
import DropdownMenu from "@/components/DropdownMenu";

const Note = () => {
  const note = useLocalSearchParams() as never as NoteType;
  const db = useSQLiteContext();
  const { getNotes, deleteNote } = useNotes();
  const { getBookmarks } = useBookmarks();

  const [isBookmarked, setIsBookmarked] = useState(
    note.isBookmarked.toString() === "1"
  );
  const [isVisible, setIsVisible] = useState(false);

  const changeBookmark = useCallback(async () => {
    try {
      if (isBookmarked) {
        setIsBookmarked(false);
        await db.runAsync(
          "UPDATE notes SET isBookmarked = 0 WHERE id = ?",
          note.id
        );
      } else {
        setIsBookmarked(true);
        await db.runAsync(
          "UPDATE notes SET isBookmarked = 1 WHERE id = ?",
          note.id
        );
      }
      getNotes(db);
      getBookmarks(db);
    } catch (error) {
      Alert.alert("Error", "Some error occured.", [
        {
          text: "Ok",
          onPress: BackHandler.exitApp,
        },
      ]);
    }
  }, [note.isBookmarked, note.id, isBookmarked]);

  return (
    <SafeView>
      <DropdownMenu
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={[
          {
            title: "Edit note",
            action: () =>
              router.push({ pathname: "/edit-note", params: { ...note } }),
          },
          {
            title: "Delete note",
            action: () => {
              Alert.alert("Warning", "Do you want to delete this note?", [
                {
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    deleteNote(db, note.id).then((res) => {
                      if (res) {
                        getNotes(db).then((result) => {
                          if (result) {
                            getBookmarks(db);
                            router.back();
                          } else {
                            Alert.alert("Error", "Some error occured.", [
                              {
                                text: "Ok",
                                onPress: BackHandler.exitApp,
                              },
                            ]);
                          }
                        });
                      } else {
                        Alert.alert("Error", "Some error occured.", [
                          {
                            text: "Ok",
                            onPress: BackHandler.exitApp,
                          },
                        ]);
                      }
                    });
                  },
                },
              ]);
            },
          },
        ]}
      />
      <View style={tw`pt-4 px-5 flex-row justify-between items-center`}>
        <Pressable onPress={router.back}>
          <Entypo name="chevron-left" size={28} color="black" />
        </Pressable>
        <View style={tw`flex-row items-center gap-x-7`}>
          <Pressable onPress={changeBookmark}>
            {isBookmarked ? (
              <FontAwesome name="bookmark" size={26} color="black" />
            ) : (
              <FontAwesome name="bookmark-o" size={26} color="black" />
            )}
          </Pressable>

          <Pressable onPress={() => setIsVisible(true)}>
            <FontAwesome6 name="ellipsis-vertical" size={26} color="black" />
          </Pressable>
        </View>
      </View>

      <View style={tw`pt-5 px-5 gap-y-4`}>
        <View style={tw`gap-y-1.5`}>
          <Text
            style={tw`text-2xl font-bold ${note.title ? "" : "text-gray-500"}`}
          >
            {note.title || "Title"}
          </Text>
          <View style={tw`flex-row gap-x-2`}>
            <Text style={tw`text-gray-700`}>{note.date}</Text>
            <Text style={tw`text-gray-700`}>|</Text>
            <Text style={tw`text-gray-700`}>
              {note.content.length} characters
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw`h-full`}
          contentContainerStyle={tw`pb-2`}
        >
          <Text style={tw`text-base leading-7 text-justify`}>
            {note.content}
          </Text>
        </ScrollView>
      </View>
    </SafeView>
  );
};

export default Note;
