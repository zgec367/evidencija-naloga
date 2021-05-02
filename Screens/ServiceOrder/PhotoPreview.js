import React from "react";
import { View, Image } from "react-native";

export default function PhotoPreview({ navigation, route }) {
  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{ flex: 1, resizeMode: "cover" }}
        source={{ uri: route.params.photo }}
      />
    </View>
  );
}
