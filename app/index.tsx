import { Alert, BackHandler, Text, Image } from "react-native";
import SafeView from "@/components/SafeView";
import tw from "twrnc";
import { useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { router, useRootNavigationState } from "expo-router";
import { useNotes } from "@/hooks/useNotes";
import { useSQLiteContext } from "expo-sqlite";
import { useBookmarks } from "@/hooks/useBookmarks";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { getNotes } = useNotes();
  const { getBookmarks } = useBookmarks();
  const db = useSQLiteContext();
  useEffect(() => {
    if(rootNavigationState?.key){
      getNotes(db).then(async (res) => {
      if (res) {
        getBookmarks(db);
        const isLockEnabled = await SecureStore.getItemAsync("is-lock-enabled");
        if (isLockEnabled) {
          await LocalAuthentication.getEnrolledLevelAsync().then((res) => {
            if (res !== 0) {
              LocalAuthentication.authenticateAsync({
                promptMessage: "Verify your identity!",
              }).then((result) => {
                if (result.success) {
                  router.replace("/notes");
                }
              });
            } else {
              router.replace("/notes");
            }
          });
        } else {
          router.replace("/notes");
        }
      } else {
        Alert.alert("Error", "Some error occured.", [
          {
            text: "Ok",
            onPress: BackHandler.exitApp,
          },
        ]);
      }
    });
    }
  }, [rootNavigationState?.key]);
  return (
    <SafeView style={tw`justify-center items-center gap-y-6`}>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Samsung_Notes_icon.png",
        }}
        style={tw`w-28 h-28 rounded-full`}
        resizeMode="stretch"
      />
      <Text style={tw`text-3xl font-bold`}>Notes</Text>
    </SafeView>
  );
}
