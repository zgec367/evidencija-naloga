import React, { useState, useEffect } from "react";
import { Text, View, Animated, Image } from "react-native";
import Robot from "../assets/eRobot.png";
import Logo from "../assets/logo.png";

export default function StartLogo() {
  const [state, setState] = useState({
    logoAnimation: new Animated.Value(0),
    robotAnimation: new Animated.Value(0),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.spring(state.logoAnimation, {
        toValue: 1,
        tension: 5,
        friction: 2,
        delay: 1100,
        useNativeDriver: false,
      }).start(),
    ]);
  }, []);
  return (
    <View
      style={{
        flex: 0.9,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ width: "80%", height: "50%" }}>
        <Animated.View
          style={{
            opacity: state.logoAnimation,
            bottom: state.logoAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }}
        >
          <Image
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            source={Robot}
          />
        </Animated.View>
      </View>
      <Image style={{ width: "80%", resizeMode: "contain" }} source={Logo} />
    </View>
  );
}
