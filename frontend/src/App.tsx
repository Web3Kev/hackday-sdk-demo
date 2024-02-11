import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";

import Home from "./views/Home";

import background from "./assets/background.svg";

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    desktop: window.innerWidth > window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        desktop: window.innerWidth > window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};

function App({ roomUrl }: { roomUrl: string }) {

  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get("fname") || "guest";
  const { width, height, desktop } = useWindowDimensions();
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
          desktop={desktop}
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
