import React, { useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Text,
  Image,
} from "react-native";
import { downloadFile } from "../../logic/youtube/download";
import { searchVideo } from "../../logic/youtube/search";
import { ProgressBar, Colors, IconButton } from "react-native-paper";
import {
  getUserPlaylists,
  getTokens,
  getPlaylist,
} from "../../logic/spotify/spotify";

const TestScreen = () => {
  const [text, setText] = React.useState("");
  const [progress, setProgress] = React.useState(0.0);
  const [playlistList, setPlaylistList] = React.useState([]);

  const progressCallback = (downloadProgress) => {
    setProgress(
      downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite
    );
  };

  const download = (str) => {
    searchVideo(str).then((r) => {
      console.log(r[0].id.videoId);
      downloadFile(
        `https://www.youtube.com/watch?v=${r[0].id.videoId}`,
        `${str}.mp3`,
        progressCallback
      );
    });
  };

  const downloadPlaylist = (id) => {
    getPlaylist(id).then((data) => {
      data.tracks.items.forEach((item) => {
        download(`${item.track.name} by ${item.track.artists[0].name}`);
      });
      // console.log(`${data.tracks.items[0].track.name} by ${data.tracks.items[0].track.artists[0].name}`)
      //download(`${data.tracks.items[0].track.name} by ${data.tracks.items[0].track.artists[0].name}`)
      // download(`Bass Drop - Sound Effect (HD)`);
    });
  };

  useEffect(() => {
    getUserPlaylists().then((r) => {
      // console.log(r);
      setPlaylistList(r);
    });
  }, []);

  const showPlaylists = () => {
    return playlistList.map((item) => {
      return (
        <View style={styles.playlist}>
          <Image
            style={styles.playList_img}
            source={{ uri: item.images[0].url }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 10,
              }}
            >
              <Text style={{ color: "white" }}>{item.name}</Text>
              <IconButton
                icon="download"
                color={Colors.white}
                size={25}
                onPress={() => downloadPlaylist(item.id)}
              />
            </View>

            <ProgressBar
              progress={progress}
              color="#858AE3"
              style={styles.progress}
            />
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {showPlaylists()}

      {/* <TextInput style={styles.input} onChangeText={setText} value={text} placeholder='...'/> */}
      {/* <Button
  onPress={()=>download(text)}
  title="Download"
  color={Colors.black}
/> */}
      {/* <ProgressBar progress={progress} color={Colors.black} style={styles.progress}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111416",
    flex: 1,
    width: "100%",
    alignContent: "center",
    padding: 10,
    paddingTop: 50,
  },
  playlist: {
    // width:300,
    alignContent: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#292F36",
    color: "#F7F7FF",
    borderRadius: 5,
  },
  playList_img: {
    width: 60,
    height: 60,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  input: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    width: 150,
  },
  progress: {
    height: 6,
    marginTop: 4.5,
    width: "100%",
    // backgroundColor:'transparent'
  },
});

export default TestScreen;
