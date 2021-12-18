import * as AuthSession from "expo-auth-session";
import { spotifyCredentials } from "./secret";
import { encode as btoa } from "base-64";
import * as SecureStore from "expo-secure-store";
import SpotifyWebAPI from "spotify-web-api-js";
// import * as Linking from 'expo-linking';

export const getAuthorizationCode = async () => {
  const scopesArr = [
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
  ];
  const scopes = scopesArr.join(" ");

  try {
    const result = await AuthSession.startAsync({
      authUrl:
        "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        spotifyCredentials.clientId +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(spotifyCredentials.redirectUri),
    });

    //   console.log(result.params.code);
    return result.params.code;
  } catch (err) {
    console.error(err);
  }
};

export const getTokens = async () => {
  try {
    const authorizationCode = await getAuthorizationCode();
    const credsB64 = btoa(
      `${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`
    );

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${spotifyCredentials.redirectUri}`,
    });
    const responseJson = await response.json();

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("expirationTime", expirationTime.toString());
  } catch (err) {
    console.error(err);
  }
};

const refreshTokens = async () => {
  try {
    const credsB64 = btoa(
      `${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`
    );
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    console.log("(refreshTokens) response: " + responseJson);

    if (responseJson.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await SecureStore.setItemAsync("accessToken", newAccessToken);

      if (newRefreshToken) {
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      }
      await SecureStore.setItemAsync(
        "expirationTime",
        expirationTime.toString()
      );
    }
  } catch (err) {
    console.error(err);
  }
};

const getValidSPObj = async () => {
  const tokenExpirationTime = await SecureStore.getItemAsync("expirationTime");
  if (
    !tokenExpirationTime ||
    new Date().getTime() > parseInt(tokenExpirationTime)
  ) {
    // access token has expired, so we need to use the refresh token
    await refreshTokens();
  }
  const accessToken = await SecureStore.getItemAsync("accessToken");
  // console.log('get valid spObj accessToken:' + accessToken);
  var sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  return sp;
};
export const getUserPlaylists = async () => {
  const sp = await getValidSPObj();
  const { id: userId } = await sp.getMe();
  const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });

  return playlists;
};

export const getPlaylist = async (playlistId) => {
  const sp = await getValidSPObj();

  return await sp.getPlaylist(playlistId);
};
