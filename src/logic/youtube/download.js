import ytdl from "react-native-ytdl";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { ToastAndroid } from "react-native";

export const validate = async (url, filename) => {
  return ytdl.validateURL(url);
};

export const downloadFile = (url, filename, progress_callback) => {
  ytdl(url, { filter: "audioonly" }).then(async (obj) => {
    const uri = obj[0].url;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    ToastAndroid.show("Downloading...", ToastAndroid.LONG);

    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      fileUri,
      {},
      progress_callback
    );

    const downloadedFile = await downloadResumable.downloadAsync();
    // const downloadedFile= await FileSystem.downloadAsync(uri, fileUri);
    downloadedFile.mimeType = "audio";

    if (downloadedFile.status != 200) {
      console.log(downloadedFile.status);
    }

    // const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    // if (perm.status != "granted") {
    //   return;
    // }

    try {
      const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);

      asset.mediaType = "audio";
      const album = await MediaLibrary.getAlbumAsync("Songs");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Songs", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      MediaLibrary.migrateAlbumIfNeededAsync(album);
      ToastAndroid.show("Download Finished", ToastAndroid.SHORT);
    } catch (e) {
      console.log(e);
    }
  });
};
