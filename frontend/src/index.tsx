import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { WHEREBY_ROOM } from "./config/room";

import App from "./App";
import Start from "./Start";
import theme from "./theme";

import "./index.css";
import AppHelp from "./AppHelp";

// Check if we have a valid room url
const urlParams = new URLSearchParams(window.location.search);
const roomUrl = urlParams.get("roomUrl") || WHEREBY_ROOM;
const playerName = urlParams.get("fname") || "guest";
const isTeacher = !!urlParams.get("quizMaster");
const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <ChakraProvider theme={theme}>
    {/* {roomUrl ? <App roomUrl={roomUrl} /> : <AppHelp />} */}
    {roomUrl ? <Start isTeacher={isTeacher} displayName={playerName} roomUrl={roomUrl} /> : <AppHelp />}
  </ChakraProvider>
);
