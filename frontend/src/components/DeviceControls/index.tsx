import { Box, Icon, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { FiMic, FiVideo, FiVideoOff, FiMicOff } from "react-icons/fi";

interface DeviceControlProps {
  desktop?:boolean;
  floating?: boolean;
  localStream: MediaStream;
  style?: React.CSSProperties;
  videoAllowed?: boolean;
  audioAllowed?: boolean;
  toggleCameraEnabled: () => void;
  toggleMicrophoneEnabled: () => void;
}

export default function DeviceControls({
  desktop,
  floating,
  localStream,
  style,
  videoAllowed=true,
  audioAllowed=true,
  toggleCameraEnabled,
  toggleMicrophoneEnabled,
}: DeviceControlProps) {
  const [toggle, setToggle] = useState(0);

  const cameraTrack = localStream.getVideoTracks()[0];
  const microphoneTrack = localStream.getAudioTracks()[0];

  let styles = {};
  if (floating) {
    if(desktop){
    styles = {
      position: "absolute",
      bottom: "100px",
      left: "15%",
      background:"yellow",
      // justifyContent:"center",
      // alignItems:"center",
      // alignContent:"center",
      borderRadius:"10px",
      padding:"5px",
      // right: 0,
    };}
    else
    {
      styles = {
        width:"85px",
        height:"40px",
        padding:"2px",
        position: "absolute",
        // background:"orange",
        borderRadius:"10px",
        top: "110px",
        // left: 0,
        right: "2%",
      };
    }
  }

  return (
    <Box pb={"4"} {...styles} style={style}>
      {cameraTrack && videoAllowed && (
        <IconButton
          colorScheme={!cameraTrack.enabled ? "red" : "blue"}
          size={desktop?("lg"):("sm")}
          mr={"2"}
          aria-label="Camera"
          icon={<Icon as={cameraTrack.enabled ? FiVideo : FiVideoOff} />}
          onClick={() => {
            setToggle(toggle + 1);
            toggleCameraEnabled();
          }}
        />
      )}
      {microphoneTrack && audioAllowed &&(
        <IconButton
          colorScheme={!microphoneTrack.enabled ? "red" : "blue"}
          size={desktop?("lg"):("sm")}
          aria-label="Microphone"
          icon={<Icon as={microphoneTrack.enabled ? FiMic : FiMicOff} />}
          onClick={() => {
            setToggle(toggle + 1);
            toggleMicrophoneEnabled();
          }}
        />
      )}
    </Box>
  );
}
