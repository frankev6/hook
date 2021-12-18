import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";

const AddScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        title="Continue with Spotify"
        onPress={() => navigation.navigate("PlaylistSelectScreen")}
      />
      <Button style={styles.button} title="Continue with Youtube" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#1B1F23",
    flex: 1,
  },
  button: {
    margin: 20,
    padding: 8,
    backgroundColor: "#6C77E5",
  },
});
export default AddScreen;
