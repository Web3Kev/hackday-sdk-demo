import { useEffect, useState, useRef,useCallback, useMemo } from "react";
import { Box, Flex, Avatar, AvatarBadge, Text, Center, Alert, IconButton, Icon } from "@chakra-ui/react";
import { VideoView } from "@whereby.com/browser-sdk";

import { IoVideocam,IoVideocamOff,IoMic,IoMicOff,IoStar,IoStarOutline } from "react-icons/io5";



interface CircleVideoProps {
  desktop?:boolean;
  muted?: boolean;
  showMuted?:boolean;
  id?: string;
  name: string;
  stream: MediaStream | undefined;
  inTheSpotlight?: boolean;
  audioAllowed?: boolean;  // admin only
  videoAllowed?:boolean; // admin only
  spotlit?:boolean;  // admin only
  changeAudioPermission: (string,boolean) => void; // admin only
  changeVideoPermission: (string,boolean) => void; // admin only
  changeSpotlightStatus: (string,boolean) => void; // admin only
  isMaster?:boolean; 
}

const CircleVideo = ({
  desktop,
  id,
  name,
  stream,
  inTheSpotlight, 
  muted,
  showMuted =false,
  audioAllowed = true, // admin only
  videoAllowed = true, // admin only
  spotlit = false, // admin only
  changeAudioPermission, // admin only
  changeVideoPermission, // admin only
  changeSpotlightStatus, // admin only
  isMaster=false,
}: CircleVideoProps) => {
  

 
  const borderColor = useMemo(() => {
    if (inTheSpotlight) {
      return "blue.300";
    }
    return "transparent";
  }, [inTheSpotlight]);

  const parentRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        const dimensions = parentRef.current.getBoundingClientRect();
        console.log("dimen "+dimensions.width+" "+ dimensions.height);
        setParentSize({ width: dimensions.width, height: dimensions.height });
      }
    };
  
    // Call handleResize initially to set initial size
    handleResize();
  
    // Setup event listener for window resize
    window.addEventListener('resize', handleResize);
  
    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // The empty dependency array ensures this setup is done once on mount
  


  return (
    <Box // --------------------------encapsulating element
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      margin="2"
      width="100%"
      height="100%"
    >
      {/* <Text>{name}</Text> */}
      <Flex ////-----------------------Direct Parent to Combo name Tag / Video / Button
        ref={parentRef}
        height="150px"//{tileSize}
        width="120px"
        position="relative" //need this to get name tag and buttons as overlay
        //   background="yellow"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        // background="blue"
      >
        <Box ////-----------------------name tag
          width="85px"
          height="25px"
          position="absolute" 
          borderRadius="10px"
          zIndex="1"
          bottom="-10px"
        //   left="25%"
          background="yellow"
          overflow="hidden"
        //   padding="0.1px"
        //   justifyContent="center"
        //   alignContent="center"
        //   alignItems="center"
        >
          <Text
          margin="1px"
          paddingLeft="1px"
          >{name}</Text>
        </Box>
        <Center ////-----------------------video mask
          h={desktop?(parentSize.height):(parentSize.width)}
          w={desktop?(parentSize.height):(parentSize.width)}
          // background="gray.200"
          borderRadius="50%"
          borderColor={borderColor}
          borderWidth={inTheSpotlight ? "10px" : "0px"} // use this for local and for spotlight 
          overflow="hidden"
        >
          {stream ? (
            <Box ////----------------------- Actual Video
              as={VideoView}
              key={id}
              muted={muted}
              stream={stream}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Avatar size="xl" name={name}>
              {inTheSpotlight && <AvatarBadge boxSize="1.25em" bg="blue.300" />}
            </Avatar>
          )}
        </Center>
        {showMuted?( ///--------------------micoff icon
          <Icon //muted icon
            as={IoMicOff} 
            position="absolute" 
            zIndex="1" 
            // bottom="25%" 
            // right="25%" 
            color="red.500" 
            boxSize="50%" 
            style={{ opacity: 0.6 }}
          />):null
        }
        {isMaster?(
        <Flex //-----------------------------master control tools
          position="absolute"
          zIndex="1"
          top="-10px"
          width="120px"
        //   left="5%"
          display="flex"
          flexDirection="row"
          gap="2px"
        //   alignItems="center"
        //   justifyContent="center"
        //   alignContent="center"
          // background="purple"
          // margin="2"
        >
          {<IconButton
            colorScheme={!videoAllowed ? "red" : "green"}
            size={"sm"}
            mr={"2"}
            aria-label="Video"
            icon={videoAllowed? <IoVideocam /> :<IoVideocamOff /> }
            onClick={() => {
              changeVideoPermission(id,!videoAllowed);
            }}
          />}
          {<IconButton
            colorScheme={!audioAllowed ? "red" : "green"}
            size={"sm"}//xs
            mr={"2"}
            aria-label="Audio"
            icon={audioAllowed? <IoMic /> :<IoMicOff /> }
            onClick={() => {
              changeAudioPermission(id,!audioAllowed);
              console.log("clicked audio for "+id+ "set to "+!audioAllowed);
            }}
          />}
          {<IconButton
            colorScheme={!spotlit ? undefined : "blue"}
            size={"sm"}
            mr={"2"}
            aria-label="Spotlight"
            icon={spotlit? <IoStar /> :<IoStarOutline /> }
            onClick={() => {
              changeSpotlightStatus(id,!spotlit);
            }}
          />}
        </Flex>):null}
      </Flex>
    </Box>
  );
};

export default CircleVideo;
