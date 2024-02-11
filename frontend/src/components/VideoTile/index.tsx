import { useEffect, useState, useRef,useCallback, useMemo } from "react";
import { motion, useAnimate } from "framer-motion";
import { Box, Flex, Avatar, AvatarBadge, Text, Center, Alert, IconButton, Icon } from "@chakra-ui/react";
import { VideoView } from "@whereby.com/browser-sdk";

import { IoVideocam,IoVideocamOff,IoMic,IoMicOff,IoStar,IoStarOutline } from "react-icons/io5";

import "./styles.css";

interface VideoTileProps {
  desktop?:boolean;
  muted?: boolean;
  showMuted?:boolean;
  id?: string;
  name: string;
  stream: MediaStream | undefined;
  hasAnswered?: boolean;  // delete this
  roundResult?: "correct" | "incorrect" | "no_vote" | null;  // delete this
  variant?: "default" | "small";
  audioAllowed?: boolean;  // admin only
  videoAllowed?:boolean; // admin only
  spotlit?:boolean;  // admin only
  changeAudioPermission: (string,boolean) => void; // admin only
  changeVideoPermission: (string,boolean) => void; // admin only
  changeSpotlightStatus: (string,boolean) => void; // admin only
  isMaster?:boolean; 
}

const ChakraBox = motion(Box);

const VideoTile = ({
  desktop,
  id,
  name,
  stream,
  hasAnswered, // delete this 
  roundResult, // delete this
  muted,
  showMuted =false,
  variant = "default",
  audioAllowed = true, // admin only
  videoAllowed = true, // admin only
  spotlit = false, // admin only
  changeAudioPermission, // admin only
  changeVideoPermission, // admin only
  changeSpotlightStatus, // admin only
  isMaster=false,
}: VideoTileProps) => {
  // const [scope, animate] = useAnimate();

  // const popAnimation = useCallback(async () => {
  //   await animate(scope.current, { scale: 1.5 });
  //   await animate(scope.current, { scale: 1 });
  // }, [animate, scope]);

  // const rotateAnimation = useCallback(async () => {
  //   await animate(scope.current, { rotate: -90 });
  //   await animate(scope.current, { scale: 1.5 });
  //   await animate(scope.current, { rotate: 0 });
  //   await animate(scope.current, { scale: 1 });
  // }, [animate, scope]);

  // const answeredAnimation = useCallback(async () => {
  //   await animate(scope.current, { rotate: -90 });
  //   await animate(scope.current, { rotate: 0 });
  // }, [animate, scope]);

  // const correctAnimation = useCallback(async () => {
  //   await animate(
  //     scope.current,
  //     { y: -120 },
  //     { ease: "anticipate", duration: 2.25 }
  //   );
  //   await animate(
  //     scope.current,
  //     { y: 0 },
  //     { ease: "anticipate", duration: 0.65 }
  //   );
  // }, [animate, scope]);

  // const incorrectAnimation = useCallback(async () => {
  //   await animate(
  //     scope.current,
  //     { x: [-20, 0] },
  //     { type: "spring", stiffness: 500, mass: 1, damping: 5 }
  //   );
  // }, [animate, scope]);

  // useEffect(() => {
  //   popAnimation();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (stream) rotateAnimation();
  // }, [stream, rotateAnimation]);

  // useEffect(() => {
  //   if (hasAnswered) answeredAnimation();
  // }, [hasAnswered, answeredAnimation]);

  // useEffect(() => {
  //   if (roundResult === "correct") {
  //     correctAnimation();
  //   } else if (roundResult === "incorrect") {
  //     incorrectAnimation();
  //   }
  // }, [correctAnimation, incorrectAnimation, popAnimation, roundResult]);

  const tileSize =
    variant === "small" ? "120px" : ["100px", "120px", "180px", "240px"];

  const borderColor = useMemo(() => {
    if (roundResult === "correct") {
      return "green.300";
    } else if (roundResult === "incorrect") {
      return "red.300";
    } else if (hasAnswered) {
      return "blue.300";
    }
    return "transparent";
  }, [roundResult, hasAnswered]);

  

  return (
    <ChakraBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      // margin="2"
      width="100%"
      height="100%"
      // ref={scope}
      whileHover={{ scale: [null, 1.1, 1.05], rotate: 1 }}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        ease: "easeOut",
        duration: 0.25,
        y: {
          type: "spring",
          duration: 2,
        },
      }}
    >
      {/* <Text>{name}</Text> */}
      <Flex
      // ref={parentRef}
      height="120px"//{tileSize}
      width="120px"
      background="yellow"
      alignItems="center"
      // justifyContent="center"
      // alignContent="center"
      >
        <Box //name tag
          width="50%"
          position="absolute" 
          borderRadius="10px"
          zIndex="1"
          bottom="0"
          left="25%"
          background="yellow"
        >
          <Text>{name}</Text>
        </Box>
        <Center //video
          // h={parentSize.width}//{desktop?(parentSize.height):(parentSize.width)}
          // w={parentSize.width}//{desktop?(parentSize.height):(parentSize.width)}
          // background="gray.200"
          borderRadius="50%"
          borderColor={borderColor}
          borderWidth={hasAnswered ? "10px" : "0px"} // use this for local and for spotlight 
          overflow="hidden"
        >
          {stream ? (
            <Box
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
              {hasAnswered && <AvatarBadge boxSize="1.25em" bg="blue.300" />}
            </Avatar>
          )}
        </Center>
        {showMuted?(
          <Icon //muted icon
            as={IoMicOff} 
            position="absolute" 
            zIndex="1" 
            bottom="25%" 
            right="25%" 
            color="red.500" 
            boxSize="50%" 
          />):null
        }
        {isMaster?(
        <Flex //master control tools
          position="absolute"
          zIndex="1"
          top="5%"
          width="100%"
          left="5%"
          display="flex"
          flexDirection="row"
          gap="5%"
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          // background="purple"
          // margin="2"
        >
          {/* <IoVideocam /> <IoVideocamOff /><IoMic /><IoMicOff /><IoStar /><IoStarOutline /> */}
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
    </ChakraBox>
  );
};

export default VideoTile;
