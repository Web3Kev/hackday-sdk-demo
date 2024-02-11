import { useState, useEffect, useCallback, memo } from "react";
import { useMemo } from "react";
import { Center, Flex, Box, Grid } from "@chakra-ui/react";
import { motion, AnimatePresence, usePresence } from "framer-motion";

import useComControl,{ RoomConnectionRef, ComState, LocalMediaRef } from "../../communication";
import VideoTile from "../VideoTile";
import CircleVideo from "../Circle";

interface PeersProps {
  desktop: boolean;
  roomConnection: RoomConnectionRef;
  myAudioIsOn:boolean;
  isTeacher?:boolean;
  variant?: "default" | "small";
  screen?: "scoreboard" | "game"; // delete this
  AudioPermission: (boolean) => void; //make this resurface in Home
  VideoPermission: (boolean) => void; //make this resurface in Home
}

const SORTING_TIMEOUT = 4500;

const Peers = ({
  desktop,
  roomConnection,
  isTeacher = false,
  myAudioIsOn,
  variant = "default",
  screen = "game",  // delete this
  AudioPermission,
  VideoPermission,
}: PeersProps) => {

  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  const [tiles, setTiles] = useState([...remoteParticipants, localParticipant]);
  const [isPresent, safeToRemove] = usePresence();
  const [roundResults, setRoundResults] = useState<{
    [participantId: string]: "correct" | "incorrect" | "no_vote";
  }>({});

  // Should only be triggered when participants change
  useEffect(() => {
    const allParticipants = [...remoteParticipants, localParticipant];

    setTiles(allParticipants);
  }, [remoteParticipants, localParticipant]);


  const tileSizeVariant = tiles.length > 8 ? "small" : variant;

  const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };

  const animationProps = {
    layout: true,
    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0.5, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    transition,
    onAnimationComplete: () => !isPresent && safeToRemove(),
  };


  //pass this to useQuiGame logic
  const { state: comState, actions: comActions } = useComControl(
    roomConnection,
    { isTeacher }
  );
//here
    //states get
  const { videoNotAllowedIds, audioNotAllowedIds, spotLitIds,currentIframe } = comState;
    //actions set
  const { disableAudio, disableVideo, setSpotlight,setIframe,muteAll} = comActions;


//------------ Everyone listens to Changes from messages (set in comState) ----------//

  //everyboy listens to this and mute themselves if their id is in the array
  useEffect(() => {
    let defaultState=true; //allowed by default
    videoNotAllowedIds?.forEach((id)=>{
        if(localParticipant?.id === id)
        {
            defaultState=false;  //mute yourself
        }
    });
    VideoPermission(defaultState);
  }, [videoNotAllowedIds]); 

  useEffect(() => {
    let defaultState=true; //allowed by default
    audioNotAllowedIds?.forEach((id)=>{
        if(localParticipant?.id === id)
        {
            defaultState=false;  //mute yourself
        }
    });
    AudioPermission(defaultState);
  }, [audioNotAllowedIds]); 

  useEffect(() => {
    //no need ... only check ids in and set differently
  }, [spotLitIds]); 

  useEffect(() => {
    //set iframe when it changes
  }, [currentIframe]); 

//------------FOR ADMIN ONLY ----------//

  //FOR ADMIN ONLY //
  const [videoIdPermission, setVideoIdPermission] = useState<string[]>([]);

  const [audioIdPermission, setAudioIdPermission] = useState<string[]>([]);

  const [spotLightIds, setSpotLightIds] = useState<string[]>([]);

// admin change arrays here
  const updatePermittedVideos = (id, permission) => {
    setVideoIdPermission(prev => {
        const idIndex = prev.indexOf(id);
        const idExists = idIndex !== -1;
    
        if (permission) {
            // If permission is true and id is present, remove the id
            if (idExists) {
            return prev.filter(existingId => existingId !== id);
            }
            // If permission is true and id is not present, do nothing
            return prev;
        } else {
            // If permission is false and id is not present, add the id
            if (!idExists) {
            return [...prev, id];
            }
            // If permission is false and id is present, do nothing
            return prev;
        }
        });
  };


    const updatePermittedAudios = (id, permission) => {
        setAudioIdPermission(prev => {
        const idIndex = prev.indexOf(id);
        const idExists = idIndex !== -1;
    
        if (permission) {
            // If permission is true and id is present, remove the id
            if (idExists) {
            return prev.filter(existingId => existingId !== id);
            }
            // If permission is true and id is not present, do nothing
            return prev;
        } else {
            // If permission is false and id is not present, add the id
            if (!idExists) {
            return [...prev, id];
            }
            // If permission is false and id is present, do nothing
            return prev;
        }
        });
  };
  

  const updateSpotlights = (id, spotStatus) => {
    setSpotLightIds(prev => {
        const idIndex = prev.indexOf(id);
        const idExists = idIndex !== -1;

        if (spotStatus) {
            // If spotStatus is true and id is not present, add the id
            if (!idExists) {
                return [...prev, id];
            }
            // If permission is true and id is present, do nothing
            return prev;
        } else {
            
            // If spotStatus is false and id is present, remove the id
            if (idExists) {
            return prev.filter(existingId => existingId !== id);
            }
            // If permission is false and id is not present, do nothing
            return prev;
        }
        });
  };

  //Admin changes reflected here and sent to all

  //string array of videos to force disable
  useEffect(() => {
    if(isTeacher){disableVideo(videoIdPermission);}
  }, [videoIdPermission]); 

  //string array of audios to force disable
  useEffect(() => {
    if(isTeacher){disableAudio(audioIdPermission);}
  }, [audioIdPermission]); 

  //string array of videos set in spotlight
  useEffect(() => {
    if(isTeacher){setSpotlight(spotLightIds);}
  }, [spotLightIds]); 

  //------------END of FOR ADMIN ONLY ----------//

  return (
    // <Box
    //   h="100%"
    //   textAlign="center"
    //   overflow="hidden"
    // >
    // <Flex gap="4">
    //   <Flex
    //     flexDir={screen === "scoreboard" ? "column" : "row"}
    //     justifyContent={screen === "scoreboard" ? "center" : "flex-start"}
    //     w="100%"
    //   >
    //     <AnimatePresence mode="sync">
    //       {tiles.map((participant) => {
    //         if (!participant) return null;

    //         const { id, stream, displayName, isAudioEnabled } = participant;
    //         // const hasParticipantAnswered = !!(currentAnswers || {})[id];
    //         console.log("my audio is "+myAudioIsOn);
    //         return (
    //           <motion.div {...animationProps} key={id}>
    //             <VideoTile
    //               muted={localParticipant?.id === id}
    //               showMuted={localParticipant ? (localParticipant.id === id ? !myAudioIsOn : !isAudioEnabled) : false} //if person is muted  
    //               id={id}
    //               stream={stream}
    //               name={displayName}
    //               roundResult={roundResults[id]}
    //               variant={tileSizeVariant}
    //               isMaster={isQuizMaster}
    //               hasAnswered = {spotLitIds? spotLitIds.includes(id):false} //use this just for now
    //               audioAllowed={isQuizMaster ? !audioIdPermission.includes(id) : undefined}
    //               videoAllowed={isQuizMaster ? !videoIdPermission.includes(id) : undefined}
    //               spotlit={isQuizMaster ? spotLightIds.includes(id) : undefined}
    //               changeAudioPermission={updatePermittedAudios} //admin stuff
    //               changeVideoPermission={updatePermittedVideos} //admin stuff
    //               changeSpotlightStatus={updateSpotlights} //admin stuff
    //             />
    //           </motion.div>
    //         );
    //       })}
    //     </AnimatePresence>
    //   </Flex>
    // </Flex>
   
    // </Box>

    <Flex //same as top bar
        flexGrow="0" 
        background={desktop?("yellow"):("blue")}//"whiteAlpha.500"
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        width={desktop?("40%"):("98%")}
        height={desktop?("98%"):("150px")}
        flexDirection={desktop?("column-reverse"):("row")}//
    >
        <Flex 
            //same topbar child common
            alignItems="center"
            justifyContent="center"
            height={desktop?("20%"):("100%")}
            position="relative"

            //same as grid container
            paddingLeft="5%"
            borderRadius="1%"
            width={desktop?("100%"):("20%")}
            flexGrow="1"
            background="pink"
        > 
      {/* <Grid //allpeople grid
        borderRadius="1%"
      > */}
            <AnimatePresence mode="sync">
            <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr 1fr"
                  gridTemplateRows="1fr 1fr 1fr"
                  gap="4"
                  // justifyContent="cemnt"
                  alignItems="center"
                  // alignContent="center"
                  marginRight="20px"
                >
            {tiles.map((participant) => {
                if (!participant) return null;

                const { id, stream, displayName, isAudioEnabled } = participant;
                // const hasParticipantAnswered = !!(currentAnswers || {})[id];
                
                // if(localParticipant?.id != id) 
                return (
                <motion.div {...animationProps} key={id}>
               
                    <CircleVideo
                    muted={localParticipant?.id === id}
                    showMuted={localParticipant ? (localParticipant.id === id ? !myAudioIsOn : !isAudioEnabled) : false} //if person is muted  
                    id={id}
                    stream={stream}
                    name={displayName}
                    // roundResult={roundResults[id]}
                    // variant={tileSizeVariant}
                    isMaster={isTeacher}
                    inTheSpotlight = {spotLitIds? spotLitIds.includes(id):false} //use this just for now
                    audioAllowed={isTeacher ? !audioIdPermission.includes(id) : undefined}
                    videoAllowed={isTeacher ? !videoIdPermission.includes(id) : undefined}
                    spotlit={isTeacher ? spotLightIds.includes(id) : undefined}
                    changeAudioPermission={updatePermittedAudios} //admin stuff
                    changeVideoPermission={updatePermittedVideos} //admin stuff
                    changeSpotlightStatus={updateSpotlights} //admin stuff
                    />
                </motion.div>
    
                );
            })}
            </Box>
            </AnimatePresence>
      {/* </Grid> */}
        </Flex>

        {/* <Flex
            //same topbar child common
            alignItems="center"
            justifyContent="center"
            height={desktop?("20%"):("100%")}
            position="relative"
            
            flexGrow="0"
            background="orange"
            width={desktop?("100%"):("20%")}
        >
            <AnimatePresence mode="sync">
            {tiles.map((participant) => {
                if (!participant) return null;

                const { id, stream, displayName, isAudioEnabled } = participant;
                // const hasParticipantAnswered = !!(currentAnswers || {})[id];
                if(localParticipant?.id === id) return (
                <motion.div {...animationProps} key={id}>
                    <CircleVideo
                    desktop={desktop}
                    muted={localParticipant?.id === id}
                    showMuted={localParticipant ? (localParticipant.id === id ? !myAudioIsOn : !isAudioEnabled) : false} //if person is muted  
                    id={id}
                    stream={stream}
                    name={"you"}
                    // roundResult={roundResults[id]}
                    // variant={tileSizeVariant}
                    isMaster={isQuizMaster}
                    inTheSpotlight = {spotLitIds? spotLitIds.includes(id):false} //use this just for now
                    audioAllowed={isQuizMaster ? !audioIdPermission.includes(id) : undefined}
                    videoAllowed={isQuizMaster ? !videoIdPermission.includes(id) : undefined}
                    spotlit={isQuizMaster ? spotLightIds.includes(id) : undefined}
                    changeAudioPermission={updatePermittedAudios} //admin stuff
                    changeVideoPermission={updatePermittedVideos} //admin stuff
                    changeSpotlightStatus={updateSpotlights} //admin stuff
                    />
                </motion.div>
                );
            })}
            </AnimatePresence>
        </Flex> */}
        
    </Flex>
  );
};

export default memo(Peers);


