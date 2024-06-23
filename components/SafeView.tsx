import {
  SafeAreaView,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { memo } from "react";

const SafeView = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <SafeAreaView
      style={[
        {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          flex: 1,
          backgroundColor: "#fff",
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export default memo(SafeView);
