import { useMemo,useState,useEffect } from "react";
import { Flex, Box, Center } from "@chakra-ui/react";
import { useRoomConnection } from "@whereby.com/browser-sdk";
import DeviceControls from "../../components/DeviceControls";
import Peers from "../../components/Peers";
import useComControl, { LocalMediaRef } from "../../communication";

import { useLocalMedia } from "@whereby.com/browser-sdk";

interface HomeProps {
  // localMedia: LocalMediaRef;
  displayName: string;
  roomUrl: string;
}

const urlParams = new URLSearchParams(window.location.search);
const isQuizMaster = !!urlParams.get("quizMaster");


const Home = ({ displayName, roomUrl }: HomeProps) => { 

  const localMedia = useLocalMedia({ audio: true, video: true });

  const roomConnection = useRoomConnection(roomUrl, {
    localMedia,
    displayName,
    logger: console,
  });

  const { localStream } = localMedia.state;
  const { toggleCameraEnabled, toggleMicrophoneEnabled } = localMedia.actions;
  const { isSettingCameraDevice  } = localMedia.state;

  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  const [myVideoPermission, setMyVideoPermission] = useState(true);
  const [myAudioPermission, setMyAudioPermission] = useState(true);
  const [myAudioStatusChanged, setMyAudioStatusChanged] = useState(true);

  const cameraTrack = localStream?.getVideoTracks()[0];
  const microphoneTrack = localStream?.getAudioTracks()[0];

//   useEffect(() => {
//     if(microphoneTrack)
//     {setMyAudioStatusChanged(microphoneTrack.enabled);}
//   }, [microphoneTrack]); 

  //surfaced from peer from messages
  const updateMyAudioPermission = (permission) => {
    if(!permission && microphoneTrack?.enabled)
    {
        //force off
        AudioToggle();
        console.log("i had audio on ... forced audio off");
    }
    console.log("audio permission status: "+permission);
    setMyAudioPermission(permission);
  };

  const updateMyVideoPermission = (permission) => {
    if(!permission && cameraTrack?.enabled)
    {
        //force off
        toggleCameraEnabled();
        
    }
    
    setMyVideoPermission(permission);
  };

  const AudioToggle= () =>{
    toggleMicrophoneEnabled();
    if(microphoneTrack){setMyAudioStatusChanged(microphoneTrack.enabled);}
  }



//   //pass this to useQuiGame logic
//   const { state: comState, actions: comActions } = useComControl(
//     roomConnection,
//     { isQuizMaster }
//   );

//     //states get
//   const { videoNotAllowedIds, audioNotAllowedIds, spotLitIds,currentIframe } = comState;
//     //actions set
//   const { disableAudio, disableVideo, setSpotlight,setIframe,muteAll} = comActions;


  return (
    // <Flex flexDirection="column" height="100%" gap={["4", null]}>
    
    //same as myPage style
    <Flex 
        flexDirection="column"
        w="100%" 
        height="98vh" 
        gap="10px"
        alignItems="center"
    >
        {/* <Box flexGrow="2" p="4" background="whiteAlpha.500">
          <Peers roomConnection={roomConnection} isQuizMaster={isQuizMaster} myAudioIsOn={myAudioStatusChanged} AudioPermission={updateMyAudioPermission} VideoPermission={updateMyVideoPermission}/>
        </Box> */}
        
        <Flex //same as top bar
            flexGrow="0" 
            background="whiteAlpha.500"
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
            width="98%"
            height="150px"
        >
          <Peers roomConnection={roomConnection} isQuizMaster={isQuizMaster} myAudioIsOn={myAudioStatusChanged} AudioPermission={updateMyAudioPermission} VideoPermission={updateMyVideoPermission}/>
        </Flex>
      {/* )} */}
      <Center>
        {localStream && (
            <DeviceControls
            floating={true}
            videoAllowed={myVideoPermission}
            audioAllowed={myAudioPermission}
            toggleCameraEnabled={toggleCameraEnabled}
            toggleMicrophoneEnabled={AudioToggle}
            localStream={localStream}
            />
        )}
    </Center>
    </Flex>
  );
};

export default Home;
