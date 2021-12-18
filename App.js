import { StatusBar } from "expo-status-bar";
import React from "react";
import RootNavigation from "./src/navigation/RootNavigation";

const App = () => {
  return (
    <>
      <StatusBar style="light" />
      <RootNavigation />
    </>
  );
};

export default App;
