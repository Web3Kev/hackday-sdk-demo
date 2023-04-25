import { useEffect } from "react";
import { motion, isValidMotionProp, useAnimate } from "framer-motion";
import { chakra, shouldForwardProp, Box, Avatar, Text } from "@chakra-ui/react";
import { VideoView } from "@whereby.com/browser-sdk";

import "./styles.css";

//https://chakra-ui.com/getting-started/with-framer
const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface VideoTileProps {
  id?: string;
  name?: string;
  stream: MediaStream | undefined;
  position?: {
    x?: number;
    y?: number;
  };
}

const VideoTile = ({ id, name, stream, position }: VideoTileProps) => {
  const [scope, animate] = useAnimate();

  const { x, y } = position || {};

  const animation = async () => {
    await animate(scope.current, { rotate: -90 });
    await animate(scope.current, { scale: 1.5 });
    await animate(scope.current, { rotate: 0 });
    await animate(scope.current, { scale: 1 });
    animate(
      scope.current,
      {
        x: 100,
      },
      {
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        duration: 1,
      }
    );
  };

  useEffect(() => {
    animation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChakraBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin="2"
      ref={scope}
      animate={{ x, y }}
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
      {stream ? (
        <Box
          as={VideoView}
          key={id}
          stream={stream}
          height="240px"
          width="240px"
          borderRadius="16px"
          objectFit="cover"
        ></Box>
      ) : (
        <Avatar size="xl" name={name} />
      )}
      <Text>{name}</Text>
    </ChakraBox>
  );
};

export default VideoTile;
