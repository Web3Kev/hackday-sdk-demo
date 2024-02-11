import { useState, useEffect } from "react";
import { Box, Flex, Center,Icon,  Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useRoomConnection } from "@whereby.com/browser-sdk";
import DeviceControls from "./components/DeviceControls";

import { useLocalMedia } from "@whereby.com/browser-sdk";
import { useElementSize } from "./useElementSize";
import IframeComponent from "./IframeComponent";
import GridComponent from "./GridComponent";
import { VideoView } from "@whereby.com/browser-sdk";
import CircleVideo from "./components/Circle";
import useComControl from "./communication";
import { IoMicOff } from "react-icons/io5";
import "./styles.css"

export default function Start({ roomUrl, displayName, isTeacher }: { roomUrl: string; displayName: string; isTeacher:boolean }) {

  const [selfDivRef, selfSize] = useElementSize(); //?
  const [selfContainerRef, selfContainerSize] = useElementSize();
  const [selfDivStyle, setSelfDivStyle] = useState({});

  const [buttonStyle, setButtonStyle] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [buttonOpacity, setButtonOpacity] = useState(0);

  //TAKEN FROM APP ---------------- 
  const GetBrowserType = () => {
    const [browserType, setBrowserType] = useState({
      desktop: window.innerWidth > window.innerHeight,
    });
  
    useEffect(() => {
      const handleResize = () => {
        setBrowserType({
          desktop: window.innerWidth > window.innerHeight,
        });
      };
  
      window.addEventListener('resize', handleResize);
  
      // Cleanup function to remove the event listener
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return browserType;
  };

  const {desktop} = GetBrowserType();
  /// ---------------------------

  const localMedia = useLocalMedia({ audio: true, video: true });

  const roomConnection = useRoomConnection(roomUrl, {
    localMedia,
    displayName,
    logger: console,
  });

  const { localStream } = localMedia.state;
  const { toggleCameraEnabled, toggleMicrophoneEnabled } = localMedia.actions; //also available from roomConnection.actions.toggleCamera and roomConnection.actions.toggleMicrophone

  const [myVideoPermission, setMyVideoPermission] = useState(true);
  const [myAudioPermission, setMyAudioPermission] = useState(true);
  const [myAudioStatusChanged, setMyAudioStatusChanged] = useState(true);

  const cameraTrack = localStream?.getVideoTracks()[0];
  const microphoneTrack = localStream?.getAudioTracks()[0];


 // FROM OTEHR
  // const {actions, components, state } = roomConnection;
  // const { VideoView } = components;
  // const { localParticipant, remoteParticipants} = state;

  //BUTTONS FROM SELF VIEW//------------------------
  // const {
  //   toggleCamera,
  //   toggleMicrophone,
  // } = actions;

  //   // Function to show buttons with fade-in effect
  //   const handleMouseEnter = () => {
  //     setShowButtons(true); // Ensure buttons are rendered
  //     setButtonOpacity(1); // Start fade-in
  //   };

  //   // Function to initiate fade-out effect
  // const initiateFadeOut = () => {
  //   setButtonOpacity(0); // Start fade-out
  //   // Wait for fade-out to complete before hiding buttons
  //   setTimeout(() => setShowButtons(false), 2000); // Matches CSS transition
  // };

  // // Trigger fade-out after a delay when buttons are shown
  // useEffect(() => {
  //   if (showButtons) {
  //     const timer = setTimeout(initiateFadeOut, 2000); // Start fade-out after buttons are shown for 2 seconds
  //     return () => clearTimeout(timer); // Cleanup timeout if component unmounts or state changes again before executing
  //   }
  // }, [showButtons]);


  // SELF VIEW SIZE //---------------------------------------
  useEffect(() => {
    // Logic to adjust styles based on container size
    if (selfContainerSize.height > selfContainerSize.width) {
      // Vertical orientation
      setSelfDivStyle({
        height: `${selfContainerSize.width*.95}px`,
        width: `${selfContainerSize.width*.95}px`,
      });
      setButtonStyle({
        flexDirection: "column",
      });
    } else {
      // Horizontal orientation
      setSelfDivStyle({
        height: `${selfContainerSize.height*.95}px`,
        width: `${selfContainerSize.height*.95}px`,
      });
      setButtonStyle({
        flexDirection: "row",
      });
    }
  }, [selfContainerSize]); // Dependency array ensures this runs when selfContainerSize changes

  

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

  //-------form peers
  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  const [tiles, setTiles] = useState([...remoteParticipants, localParticipant]);
 // Should only be triggered when participants change
 useEffect(() => {
  const allParticipants = [...remoteParticipants, localParticipant];

  setTiles(allParticipants);
}, [remoteParticipants, localParticipant]);

//pass this to useQuiGame logic
const { state: comState, actions: comActions } = useComControl(
  roomConnection,
  { isTeacher }
);

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
    updateMyVideoPermission(defaultState);
  }, [videoNotAllowedIds]); 

  useEffect(() => {
    let defaultState=true; //allowed by default
    audioNotAllowedIds?.forEach((id)=>{
        if(localParticipant?.id === id)
        {
            defaultState=false;  //mute yourself
        }
    });
    updateMyAudioPermission(defaultState);
  }, [audioNotAllowedIds]); 

  useEffect(() => {
    //no need ... only check ids in and set differently
  }, [spotLitIds]); 

  // const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    //set iframe when it changes
    // currentIframe?
    // setCurrentUrl(currentIframe):null;
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
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    if(isTeacher){setIframe(inputValue);}
  };

 
  //------- end from peer

  return (
    <Flex //-------------------APP
      h="100%"
      w="100%" //added
      display="flex" //added
      textAlign="center"
      backgroundColor="teal.800"
    >
      {desktop ? (
      <Flex 
        //-------------------------------------------- Render Video Tiles -----------------------------------------
        //-- same as "mypage"
        flexDirection="row"
        w="100%" 
        height="98vh" 
        gap="10px"
        alignItems="stretch"
        justifyContent="flex-start"
      >
        {/* <Peers desktop={desktop} roomConnection={roomConnection} isQuizMaster={isQuizMaster} myAudioIsOn={myAudioStatusChanged} AudioPermission={updateMyAudioPermission} VideoPermission={updateMyVideoPermission}/> */}
        {/* start */}
        <Flex //same as top bar
          flexGrow="0" 
          background="whiteAlpha.500"
          justifyContent="space-between"
          alignContent="center"
          alignItems="center"
          width="40%"
          height="98%"
          flexDirection="column"
        >
          <Flex 
            //same topbar child common
            // alignItems="center"
            justifyContent="center"
            height="50%"
            position="relative"
            marginBottom="100px"
            marginTop="10px"
            //same as grid container
            paddingLeft="5%"
            borderRadius="1%"
            width="100%"
            flexGrow="1"
            // background="pink"
          > 
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr 1fr"
              gridTemplateRows="1fr 1fr 1fr"
              gap="4"
              // background="yellow"
              // justifyContent="cemnt"
              alignItems="center"
              // alignContent="center"
              marginRight="20px"
              // top="10px"
            >
              {tiles.map((participant) => {
                if (!participant) return null;

                const { id, stream, displayName, isAudioEnabled } = participant;
                // const hasParticipantAnswered = !!(currentAnswers || {})[id];
                
                // if(localParticipant?.id != id) 
                return (
                    <CircleVideo
                    muted={localParticipant?.id === id}
                    showMuted={localParticipant ? (localParticipant.id === id ? !myAudioStatusChanged : !isAudioEnabled) : false} //if person is muted  
                    id={id}
                    stream={stream}
                    name={displayName}
                    // roundResult={roundResults[id]}
                    // variant={tileSizeVariant}
                    isMaster={isTeacher}
                    inTheSpotlight = {spotLitIds? spotLitIds.includes(id):false}
                    audioAllowed={isTeacher ? !audioIdPermission.includes(id) : undefined}
                    videoAllowed={isTeacher ? !videoIdPermission.includes(id) : undefined}
                    spotlit={isTeacher ? spotLightIds.includes(id) : undefined}
                    changeAudioPermission={updatePermittedAudios} //admin stuff
                    changeVideoPermission={updatePermittedVideos} //admin stuff
                    changeSpotlightStatus={updateSpotlights} //admin stuff
                    />
                );
              })}
          </Box>
        </Flex> {/* gridContainer ends here */}
        <Flex
          width="95%"
          height="50px"
          grow="0"
          // background="yellow"
        >
          {isTeacher?(
          <InputGroup>
            <Input
                type="text"
                placeholder="Enter URL"
                value={inputValue}
                onChange={handleInputChange}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleButtonClick}>
                  Send
                </Button>
              </InputRightElement>
          </InputGroup>):null
          }
        </Flex>
    </Flex> {/* topbar ends here */}
        
    <Flex
      height="98%"
      width="40%"
      grow="1"
    >
      <IframeComponent currentUrl={currentIframe}/>
    </Flex>
  {/* mypage ends here */}
  </Flex> 
      ) : (
        <div 
          //-------------------------------------------- Render Top Container Only -----------------------------------------
          className="mypage"
        >
          <div className="topbar-container">
            <GridComponent
              spotLitIds={spotLitIds}
              roomConnection={roomConnection}
            />

            <div className="innerSpace topbar-child-common"></div>

            <div
              ref={selfContainerRef}
              className="self-container topbar-child-common"
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={initiateFadeOut}
            >
              <Box
                borderWidth={spotLitIds && localParticipant && spotLitIds.includes(localParticipant.id)?("10px"):("0px")}
                borderRadius={spotLitIds && localParticipant && spotLitIds.includes(localParticipant.id)?("50%"):("0px")}
                borderColor={spotLitIds && localParticipant && spotLitIds.includes(localParticipant.id)?("yellow"):("none")}
              >
              <div ref={selfDivRef} style={selfDivStyle} className="self-div">
                {/* Conditionally render local participant's video */}
                {localStream && (
                  <VideoView muted stream={localStream} />
                )}
              </div>
              </Box>
              {!myAudioStatusChanged?( ///--------------------micoff icon
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
              {/* Conditionally render buttons based on showButtons state
              {showButtons && (
                <div
                  className="buttons"
                  style={{ ...buttonStyle, opacity: buttonOpacity }}
                >
                  <IconButton
                    variant="camera"
                    isActive={isCameraActive}
                    onClick={() => {
                      setIsCameraActive((prev) => !prev);
                      toggleCamera();
                    }}
                  />
                  <IconButton
                    variant="microphone"
                    isActive={isMicrophoneActive}
                    onClick={() => {
                      setIsMicrophoneActive((prev) => !prev);
                      toggleMicrophone();
                    }}
                  />
                </div>
              )} */}
            </div>
            {/* <div className="innerSpace topbar-child-common"></div> */}
          </div>
          <div className="bottomPart">
          <IframeComponent currentUrl={currentIframe}/>
          </div>
          {/* <Center>
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
        </Center> */}
        </div>
      )}        
      <Center>
          {localStream && (
              <DeviceControls
              desktop={desktop}
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
}


