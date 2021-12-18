import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import AddScreen from "../../screens/AddScreen";
import PlaylistScreen from "../../screens/PlaylistScreen";
import PlaylistSelectScreen from "../../screens/PlaylistSelectScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";
import { IconButton, Text, Colors } from "react-native-paper";

const MainStack = createNativeStackNavigator();

const CustomHeader = ({ navigation, route, options, back }) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 30,
        backgroundColor: "transparent",
      }}
    >
      {back ? (
        <IconButton
          icon="arrow-left"
          onPress={navigation.goBack}
          color="white"
        />
      ) : null}
      <Text style={{ color: "white", fontSize: 18 }}>{title}</Text>
    </View>
  );
};

const MainStackScreen = () => {
  const fall = new Animated.Value(1);

  return (
    <View
      style={{
        backgroundColor: "#1B1F23",
        padding: 0,
        margin: 0,
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          width: "100%",
          opacity: Animated.add(0.2, Animated.multiply(fall, 1.0)),
        }}
      >
        <MainStack.Navigator
          screenOptions={{
            headerTransparent: "true",
            headerTintColor: "white",
            header: CustomHeader,
          }}
        >
          <MainStack.Screen
            name="AddScreen"
            component={AddScreen}
            options={{
              headerShown: false,
            }}
          />
          <MainStack.Screen
            name="PlaylistSelectScreen"
            component={PlaylistSelectScreen}
            options={{
              title: "My Playlists",
            }}
          />
          <MainStack.Screen
            name="PlaylistScreen"
            options={{
              title: "",
            }}
            component={PlaylistScreen}
          />
        </MainStack.Navigator>
      </Animated.View>
    </View>
  );
};

export default MainStackScreen;
