/**
 * This is a hook to manage the state of communication.
 * Depends on the room connection state.
 */

import { useEffect, useReducer, useState } from "react";
import { useLocalMedia, useRoomConnection } from "@whereby.com/browser-sdk";

// This is a hack, need to expose this type directly from the SDK
export type RoomConnectionRef = ReturnType<typeof useRoomConnection>;
export type LocalMediaRef = ReturnType<typeof useLocalMedia>;



export interface ComState {
  isTeacher: boolean;

  videoNotAllowedIds: string [];

  audioNotAllowedIds: string [];

  spotLitIds: string [] | null;

  currentIframe: string;

  AllAudioOff:boolean;
}

type ComEvents =
  | {
      type: "AUDIOOFF";
      payload: string[];
      senderId: string;
    }
  | {
      type: "VIDEOOFF";
      payload: string[];
      senderId: string;
    }
  | {
        type: "SPOTLIT";
        payload: string[];
        senderId: string;
    }
  | {
      type: "ALLAUDIOOFF";
      senderId: string;
    }
  | {
        type: "IFRAMEURL";
        payload:string;
        senderId: string;
    }
  | {
    type: "ALLAUDIOON";
    senderId: string;
    };

// export interface MyComState {
//     videoAllowed: boolean;
//     audioAllowed: boolean;
// }

export interface ComActions {
    disableAudio(ids : string[]):void,
    disableVideo(ids : string[]):void,
    setSpotlight(ids : string[]):void,
    setIframe(url:string):void,
    muteAll(muteState:boolean):void,
}


const initialState: ComState = {
  isTeacher: false,
    videoNotAllowedIds: [],
    audioNotAllowedIds: [],
    spotLitIds: [],
    currentIframe: "https://example.com",  
    AllAudioOff:false,
};

// const myInitialState: MyComState = {
//     videoAllowed: true,
//     audioAllowed: true,
// };

function reducer(state: ComState, event: ComEvents): ComState {

    switch (event.type) {
      case "AUDIOOFF":
        console.log("string array: "+event.payload.length);
        return {
          ...state,
          audioNotAllowedIds: event.payload,
        };

       case "VIDEOOFF":
        return {
            ...state,
            videoNotAllowedIds: event.payload,
        };
       case "SPOTLIT":
        return {
            ...state,
            spotLitIds: event.payload,
        };
       case "IFRAMEURL":
        return {
            ...state,
            currentIframe: event.payload,
        };
      case "ALLAUDIOON":
        return {
          ...state,
          audioNotAllowedIds:[],
          AllAudioOff:false,
        };
      case "ALLAUDIOOFF":
        return {
            ...state,
          AllAudioOff:true,
        };
      default:
        console.log("Unknown command", event);
        return state;
    }
  }

export default function useComControl(
  roomConnection: RoomConnectionRef,
  { isTeacher }: { isTeacher: boolean }
): {
  state: ComState;
  actions: ComActions;
} {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    isTeacher,
  });
  const { state: roomState, actions: roomActions } = roomConnection;

  //listen to messages here
  useEffect(() => {
    if (roomState.mostRecentChatMessage) {
      try {
        const event = JSON.parse(roomState.mostRecentChatMessage.text);
        event.senderId = roomState.mostRecentChatMessage.senderId;
        console.log("got message + "+roomState.mostRecentChatMessage.text);
        dispatch(event);
      } catch (error) {
        console.log("Invalid command, ignoring");
      }
    }
  }, [roomState.mostRecentChatMessage]);

//send messages here
  return {
    state,
    actions: {
      disableAudio(ids: string []) {
        if (!state.isTeacher) {
            console.warn("Not authorized to disable audios");
            return;
          }
          console.log("sending chat audio with "+ids[0]);
        roomActions.sendChatMessage(
            JSON.stringify({
                type: "AUDIOOFF",
                payload: ids,
            })
          );
      },
      disableVideo(ids: string []) {
        if (!state.isTeacher) {
            console.warn("Not authorized to disable videos");
            return;
          }
        roomActions.sendChatMessage(
            JSON.stringify({
                type: "VIDEOOFF",
                payload: ids,
            })
          );
      },
      muteAll(muteState: boolean) {
        if (!state.isTeacher) {
            console.warn("Not authorized to mute all");
            return;
          }
        roomActions.sendChatMessage(
            JSON.stringify({
                type: muteState?"ALLAUDIOOFF":"ALLAUDIOON",
            })
          );
      },
      setSpotlight(ids: string []) {
       
        if (!state.isTeacher) {
            console.warn("Not authorized to set Spotlight");
            return;
          }

        roomActions.sendChatMessage(
            JSON.stringify({
                type: "SPOTLIT",
                payload: ids,
            })
          );
      },
      setIframe(url: string) {
       
        if (!state.isTeacher) {
            console.warn("Not authorized to set Iframe");
            return;
          }

        roomActions.sendChatMessage(
            JSON.stringify({
                type: "IFRAMEURL",
                payload: url,
            })
          );
      },
    },
  };
}
