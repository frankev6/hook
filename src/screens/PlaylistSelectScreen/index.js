import React, { useEffect } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import { getUserPlaylists } from "../../logic/spotify/spotify";
import { Text, TouchableRipple, Title } from "react-native-paper";

const PlaylistSelectScreen = ({ navigation }) => {
  const [playlistList, setPlaylistList] = React.useState([]);

  useEffect(() => {
    getUserPlaylists().then((r) => {
      setPlaylistList(r);
    });
  }, []);

  if (!playlistList) return <View style={styles.container}></View>;

  return (
    <ScrollView style={{ backgroundColor: "#1B1F23" }}>
      <View style={styles.container}>
        {playlistList.map((item, idx) => {
          return (
            <Playlist
              key={idx}
              navigation={navigation}
              image_url={item.images.length > 0 ? item.images[0].url : ""}
              name={item.name}
              playlist_id={item.id}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const Playlist = ({ navigation, image_url, name, playlist_id }) => {
  return (
    <TouchableRipple
      rippleColor="rgba(0, 0, 0, .2)"
      style={styles.playlist}
      onPress={() => navigation.navigate("PlaylistScreen", { playlist_id })}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image style={styles.playList_img} source={{ uri: image_url }} />
        <Title style={{ color: "white" }}>{name}</Title>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1B1F23",
    flex: 1,
    width: "100%",
    alignContent: "center",
    padding: 20,
    paddingTop: 25,
  },
  playlist: {
    // width:300,
    alignContent: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    // backgroundColor: "#292F36",
    color: "#F7F7FF",
    // borderRadius: 5,
  },
  playList_img: {
    width: 80,
    height: 80,
    // borderBottomLeftRadius: 5,
    // borderTopLeftRadius: 5,
    marginRight: 25,
  },
});

export default PlaylistSelectScreen;
