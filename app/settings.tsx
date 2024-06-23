import { View, Text, Switch, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

const Settings = () => {
  const [isLockEnabled, setIsLockEnabled] = useState(false);

  const changeIsLockAppEnabled = useCallback(() => {
    LocalAuthentication.getEnrolledLevelAsync().then((res) => {
      if (res !== 0) {
        LocalAuthentication.authenticateAsync({
          promptMessage: "Verify your identity!",
        }).then(async (result) => {
          if (result.success) {
            if (isLockEnabled) {
              setIsLockEnabled(false);
              await SecureStore.deleteItemAsync("is-lock-enabled");
            } else {
              setIsLockEnabled(true);
              await SecureStore.setItemAsync("is-lock-enabled", "true");
            }
          }
        });
      } else {
        Alert.alert("Error", "No screen lock configured on the device");
      }
    });
  }, [isLockEnabled]);
  return (
    <SafeView>
      <Header title="Settings" />

      <View style={tw`pt-4`}>
        <View
          style={tw`border-b border-b-gray-300 pb-4 flex-row justify-between items-center px-5`}
        >
          <Text style={tw`text-base`}>Lock app</Text>
          <Switch
            onValueChange={changeIsLockAppEnabled}
            value={isLockEnabled}
          />
        </View>
      </View>

      <View style={tw`px-5 pt-4`}>
        <Text style={tw`text-black text-lg font-medium`}>Notes</Text>
        <Text>Version 1.0.0</Text>
      </View>
    </SafeView>
  );
};

export default Settings;
