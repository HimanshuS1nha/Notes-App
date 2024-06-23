import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import SafeView from "@/components/SafeView";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { days } from "@/constants/days";
import { months } from "@/constants/months";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { NoteType, useNotes } from "@/hooks/useNotes";
import uuid from "react-native-uuid";

const AddNote = () => {
  const db = useSQLiteContext();
  const { setNotes, notes } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const date = useMemo(() => {
    const currentDate = new Date();
    return `${days[currentDate.getDay()]}, ${
      months[currentDate.getMonth()]
    } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  }, []);

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

  const handleAddNote = useCallback(async () => {
    setIsLoading(true);
    const newNote: NoteType = {
      id: uuid.v4().toString(),
      title,
      content,
      date,
      isBookmarked: 0,
    };

    const newNotes = [{ ...newNote }, ...notes];

    try {
      await db.runAsync(
        "INSERT INTO notes values (?,?,?,?,?)",
        newNote.id,
        title,
        content,
        date,
        0
      );

      setNotes(newNotes);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Some error occured.", [
        {
          text: "Ok",
          onPress: BackHandler.exitApp,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [title, content, date]);
  return (
    <SafeView>
      <View style={tw`pt-4 px-5 flex-row justify-between items-center`}>
        <Pressable onPress={router.back} disabled={isLoading}>
          <Entypo name="chevron-left" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleAddNote} disabled={isLoading}>
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
            <Text style={tw`text-gray-700`}>{date}</Text>
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

export default AddNote;
