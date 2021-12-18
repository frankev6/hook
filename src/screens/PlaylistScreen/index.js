import React, { useEffect } from "react";
import { Button, View, Image, StyleSheet, ScrollView } from "react-native";
import { getPlaylist } from "../../logic/spotify/spotify";
import Track from "../../components/Track";
import { IconButton, Text, Colors } from "react-native-paper";

const PlaylistScreen = ({ navigation, route }) => {
  const { playlist_id } = route.params;

  const [playlist, setPlaylist] = React.useState();
  const [dlPlaylist, setDlPlaylist] = React.useState(false);

  useEffect(() => {
    getPlaylist(playlist_id).then((playlist) => {
      // console.log(playlist.tracks.items[0].track.album.images[0].url);
      setPlaylist(playlist);
      // playlist.tracks.items.forEach((item) => {
      //    download(`${item.track.name} by ${item.track.artists[0].name}`);
      //});
    });
  }, []);

  if (!playlist) return <View style={styles.container}></View>;

  return (
    <ScrollView style={{ backgroundColor: "#1B1F23" }}>
      <View style={styles.container}>
        <Image style={styles.cover} source={{ uri: playlist.images[0].url }} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{playlist.name}</Text>
          <IconButton
            icon="arrow-collapse-down"
            color={Colors.white}
            size={20}
            onPress={() => setDlPlaylist(true)}
          />
        </View>
        {playlist.tracks.items.map((item, idx) => {
          return (
            <Track
              key={idx}
              idx={idx}
              name={item.track.name}
              image_url={item.track.album.images[0].url}
              artists={item.track.artists}
              dlPlaylist={dlPlaylist}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: 0,
    // paddingTop: 30,
    backgroundColor: "#1B1F23",
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    margin: 20,
  },
  cover: {
    height: 200,
    width: 200,
  },
});

export default PlaylistScreen;
