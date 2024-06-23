import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useCallback, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { NoteType, useNotes } from "@/hooks/useNotes";
import { useSQLiteContext } from "expo-sqlite";
import tw from "twrnc";
import SafeView from "@/components/SafeView";
import { Entypo } from "@expo/vector-icons";
import { useBookmarks } from "@/hooks/useBookmarks";

const EditNote = () => {
  const note = useLocalSearchParams() as never as NoteType;
  const db = useSQLiteContext();
  const { getNotes } = useNotes();
  const { getBookmarks } = useBookmarks();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);

  const changeValue = useCallback(
    (value: string, type: "title" | "content") => {
      if (type === "title") {
        setTitle(value);
      } else if (type === "content") {
        setContent(value);
      }
    },
    []
  );

  const handleEditNote = useCallback(async () => {
    if (title === note.title && content === note.content) {
      return router.back();
    }

    setIsLoading(true);
    try {
      await db.runAsync(
        "UPDATE notes SET title = ? , content = ? WHERE id = ?",
        title,
        content,
        note.id
      );

      getNotes(db).then((res) => {
        if (res) {
          getBookmarks(db);
          router.replace("/notes");
        } else {
          throw new Error("");
        }
      });
    } catch (error) {
      Alert.alert("Error", "Some error occured.", [
        {
          text: "Ok",
          onPress: BackHandler.exitApp,
        },
      ]);
    }
  }, [title, content]);
  return (
    <SafeView>
      <View style={tw`pt-4 px-5 flex-row justify-between items-center`}>
        <Pressable
          onPress={() => {
            Alert.alert("Warning", "Leave without saving?", [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: router.back,
              },
            ]);
          }}
          disabled={isLoading}
        >
          <Entypo name="chevron-left" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleEditNote} disabled={isLoading}>
          <Entypo name="check" size={26} color="black" />
        </Pressable>
      </View>

      <View style={tw`pt-5 px-5 gap-y-4`}>
        <View style={tw`gap-y-1.5`}>
          <TextInput
            placeholder="Title"
            style={tw`font-bold text-2xl`}
            value={title}
            onChangeText={(text) => changeValue(text, "title")}
          />
          <View style={tw`flex-row gap-x-2`}>
            <Text style={tw`text-gray-700`}>{note.date}</Text>
            <Text style={tw`text-gray-700`}>|</Text>
            <Text style={tw`text-gray-700`}>{content.length} characters</Text>
          </View>
        </View>

        <ScrollView>
          <TextInput
            value={content}
            onChangeText={(text) => changeValue(text, "content")}
            autoFocus
            multiline
            style={tw`text-base`}
          />
        </ScrollView>
      </View>
    </SafeView>
  );
};

export default EditNote;
