import React, { useEffect } from "react";
import { Image, View, StyleSheet } from "react-native";
import { IconButton, Text, Colors, ProgressBar } from "react-native-paper";

import { downloadFile } from "../../logic/youtube/download";
import { searchVideo } from "../../logic/youtube/search";

const Track = ({ idx, name, artists, image_url, dlPlaylist }) => {
  const [progress, setProgress] = React.useState(0.0);

  const progressCallback = (downloadProgress) => {
    setProgress(
      downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite
    );
  };

  const limit = (text, count) => {
    return text.slice(0, count) + (text.length > count ? "..." : "");
  };

  const download = () => {
    if (progress != 0) return;

    setProgress(0.01);
    const str = `${name} by ${artists[0].name}`;
    console.log(str);

    searchVideo(str).then((r) => {
      console.log(r[0].id.videoId);
      downloadFile(
        `https://www.youtube.com/watch?v=${r[0].id.videoId}`,
        `${str}.mp3`,
        progressCallback
      );
    });
  };

  useEffect(() => {
    if (dlPlaylist) {
      download();
    }
  }, [dlPlaylist]);

  return (
    <View style={styles.container}>
      {/* <ProgressBar
        progress={progress}
        color="#6C77E5"
        style={progress > 0 ? styles.progress : styles.progress_hidden}
      /> */}
      <View
        style={[
          styles.progress_outer,
          { backgroundColor: progress > 0 ? "#6C77E510" : "transparent" },
        ]}
      >
        <View
          style={[styles.progress_inner, { width: `${progress * 100}%` }]}
        ></View>
      </View>
      <View style={styles.track}>
        <Text style={{ color: "white", width: 20 }}>{idx + 1}</Text>
        <Image style={styles.track_img} source={{ uri: image_url }} />
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
            <View>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {limit(name, 25)}
              </Text>
              <Text style={{ color: Colors.grey300 }}>
                {limit(
                  artists
                    .map((item) => {
                      return item.name;
                    })
                    .join(", "),
                  25
                )}
              </Text>
            </View>
            <IconButton
              icon={progress != 1 ? "arrow-collapse-down" : "check-underline"}
              color={Colors.white}
              size={20}
              onPress={() => download()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Track;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    display: "flex",
    padding: 2,
    // margin: 1,
  },
  track: {
    padding: 7,
    paddingRight: 0,
    paddingLeft: 15,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#fff",
  },
  track_img: {
    marginLeft: 10,
    width: 50,
    height: 50,
  },
  progress: {
    height: 63,
    width: "100%",
    position: "absolute",
    left: "-50%",
    top: 0,
  },
  progress_outer: {
    height: "100%",
    // width: 0,
    width: "100%",
    // backgroundColor: "#6C77E510",
    position: "absolute",
    left: 2,
    borderRadius: 6,
    top: 0,
  },
  progress_inner: {
    backgroundColor: "#6C77E5",
    height: "100%",
    borderRadius: 6,
  },
});
