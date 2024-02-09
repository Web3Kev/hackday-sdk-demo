import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import Home from "./views/Home";

import background from "./assets/background.svg";

function App({ roomUrl }: { roomUrl: string }) {

  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get("fname") || "guest";

  const [isConnected, setIsConnected] = useState(true);

  return (
    // <Box
    //   h="100%"
    //   w="100%" //added
    //   display="flex" //added
    //   textAlign="center"
    //   // overflow="hidden" //added
    //   backgroundImage={`url(${background})`}
    //   backgroundPosition="center"
    //   backgroundSize="cover"
    //   backgroundRepeat="no-repeat"
    // >
    //same as App style
    <Flex
      h="100%"
      w="100%" //added
      display="flex" //added
      textAlign="center"
      backgroundColor="teal.800"
    >
      {isConnected ? (
        <Home
          roomUrl={roomUrl}
          // localMedia={localMedia}
          displayName={playerName}
        />
      ):null}
    </Flex>
    // </Box>
  );
}

export default App;
