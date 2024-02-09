import { useMemo } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { useRoomConnection } from "@whereby.com/browser-sdk";

import Participants from "../../components/Participants";
import LobbyView from "../LobbyView";

import useQuizGame, { LocalMediaRef } from "../../useQuizGame";
import QuestionView from "../QuestionView";
import Scoreboard from "../Scoreboard";

interface GameProps {
  // localMedia: LocalMediaRef;
  displayName: string;
  roomUrl: string;
}

const urlParams = new URLSearchParams(window.location.search);
const isQuizMaster = !!urlParams.get("quizMaster");


//takes in the props (parameters localMEdia, displayname and url)
const Game = ({ displayName, roomUrl }: GameProps) => { //localMedia, 
  const roomConnection = useRoomConnection(roomUrl, {
    // localMedia,
    displayName,
    logger: console,
  });

  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  //pass this to useQuiGame logic
  const { state: quizState, actions: quizActions } = useQuizGame(
    roomConnection,
    { isQuizMaster }
  );

    //states get
  const { screen, currentQuestion, revealAnswers: shouldReveal } = quizState;
    //actions set
  const { postAnswer, nextQuestion, revealAnswers } = quizActions;

  //useMemo uses cache to return stuff if no change ... saves on compute
  const quizCurrentAnswer = useMemo(() => {
    const answers = quizState.currentAnswers || {}; //get all answers
    const pid = localParticipant?.id || "unknown";

    console.log("anserlocal :" +answers[pid]);
    return answers[pid]; //return answer for localparticipant
  }, [localParticipant?.id, quizState.currentAnswers]);

  let currentScreen: any = null;

  switch (screen) {
    case "welcome":
      currentScreen = (
        <LobbyView
          quizActions={quizActions}
          playerCount={remoteParticipants.length + 1}
          isQuizMaster={isQuizMaster}
        />
      );
      break;

    case "question":
      currentScreen = (
        <QuestionView
          isQuizMaster={isQuizMaster}
          reveal={shouldReveal}
          currentAnswer={quizCurrentAnswer}
          question={currentQuestion}
          answerQuestion={postAnswer}
          nextQuestionAction={nextQuestion}
          revealQuestionAnswers={revealAnswers}
        />
      );
      break;
    case "end":
      currentScreen = (
        <Scoreboard
          variant={"end"}
          quizState={quizState}
          roomConnection={roomConnection}
        />
      );
      break;
    default:
  }

  return (
    <Flex flexDirection="column" height="100%" gap={["4", null]}>
      {/* <Box flexGrow={[1, null, 3]}>{currentScreen}</Box> */}
      {/* {screen !== "end" && ( */}
        <Box flexGrow="2" p="4" background="whiteAlpha.500">
          <Participants roomConnection={roomConnection} quizState={quizState}  isQuizMaster={isQuizMaster}/>
        </Box>
      {/* )} */}
    </Flex>
  );
};

export default Game;
