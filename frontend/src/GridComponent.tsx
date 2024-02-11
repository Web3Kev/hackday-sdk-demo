// GridComponent.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import { useElementSize } from './useElementSize';
import useComControl,{ RoomConnectionRef, ComState, LocalMediaRef } from './communication';
import { VideoView } from "@whereby.com/browser-sdk";
import { Box, Center, Icon, Text } from '@chakra-ui/react';
import { IoMicOff} from "react-icons/io5";

interface GridComponentProps {
    roomConnection: RoomConnectionRef;
    spotLitIds: string [] | null;
}

const GridComponent: React.FC<GridComponentProps> = ({
    roomConnection,
    spotLitIds,
}) => {

  const { state: roomState } = roomConnection;
  const { remoteParticipants} = roomState;

 

  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useElementSize();
  const [gridStyle, setGridStyle] = useState<CSSProperties>({});
  const [itemStyle, setItemStyle] = useState<CSSProperties>({});
  
  const forceReflow = (element:any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight;
  };

  useEffect(() => {
    let gridTemplateColumns = 'repeat(3, 1fr)';
    let gridTemplateRows = '1fr';
    let itemWidth = '100px'; // Default, to be adjusted
    let itemHeight = '100px'; // Default, to be adjusted

    const itemsCount = remoteParticipants.length;
    const spaceBetween = .95; //5% off

    console.log("Number OF pArticipants is : "+itemsCount);

    if (itemsCount === 1) 
    {
        if (gridHeight > gridWidth) {
          itemWidth = itemHeight = `${gridWidth*spaceBetween}px`;
        } else {
          itemWidth = itemHeight = `${gridHeight*spaceBetween}px`;
        }
  
        console.log("one participant");
      } 
      else if (itemsCount === 2) 
      {
        if (gridHeight > gridWidth) 
        {
          //vertical 2
          gridTemplateColumns = "1fr";
          gridTemplateRows = "repeat(2, 1fr)";
          itemWidth = itemHeight = `${(gridHeight / 2)*spaceBetween}px`;
          console.log("two participant : vertical "+gridTemplateColumns + "and "+gridTemplateRows);
        } 
        else 
        {
          //horizontal 2
          gridTemplateColumns = "repeat(2, 1fr)";
          gridTemplateRows = "1fr";
          const halfWidth = gridWidth / 2;
          if(halfWidth<gridHeight)
          {
            itemWidth = itemHeight =`${halfWidth*spaceBetween}px`;
          }else
          {
            itemWidth = itemHeight =`${gridHeight*spaceBetween}px`;
          }
          console.log("two participant : horiz "+gridTemplateColumns + "and "+gridTemplateRows);
        }
      } 
      else if (itemsCount === 3 || itemsCount === 4) 
      {
        if (gridHeight > gridWidth) 
        {
          //2 by 2 square
          gridTemplateColumns = "repeat(2, 1fr)";
          gridTemplateRows = "repeat(2, 1fr)";
          itemWidth = itemHeight = `${(gridHeight / 2)*spaceBetween}px`;
          console.log("three to four participant : square "+gridTemplateColumns + "and "+gridTemplateRows);
        } 
        else 
        {

          if (itemsCount === 3) 
          {
            const thirdWidth = gridWidth / 3;
            const halfHeight = gridHeight / 2;
  
            if (thirdWidth < halfHeight) 
            {
              //2 by 2 square
              gridTemplateColumns = "repeat(2, 1fr)";
              gridTemplateRows = "repeat(2, 1fr)";
              itemWidth = itemHeight = `${halfHeight*spaceBetween}px`;
              console.log("three participant : square "+gridTemplateColumns + "and "+gridTemplateRows);
       
            } 
            else 
            {
              //horizontal 3
              gridTemplateColumns = "repeat(3, 1fr)";
              gridTemplateRows = "1fr";
              if(thirdWidth<gridHeight)
              {
                itemWidth = itemHeight = `${thirdWidth*spaceBetween}px`;
              }
              else
              {
                itemWidth = itemHeight = `${gridHeight*spaceBetween}px`;
              }
              
              console.log("three participant : horiz "+gridTemplateColumns + "and "+gridTemplateRows);
       
            }
          } 
          else 
          {
            const quarterWidth = gridWidth / 4;
            const halfHeight = gridHeight / 2;
  
            if (quarterWidth < halfHeight) 
            {
              //2 by 2 square
              gridTemplateColumns = "repeat(2, 1fr)";
              gridTemplateRows = "repeat(2, 1fr)";
              itemWidth = itemHeight = `${halfHeight*spaceBetween}px`;
              console.log("four participant : square "+gridTemplateColumns + "and "+gridTemplateRows);
       
            } else {

              //horizontal 4 
              gridTemplateColumns = "repeat(4, 1fr)";
              gridTemplateRows = "1fr";
              
              if(quarterWidth<gridHeight)
              {
                itemWidth = itemHeight = `${quarterWidth*spaceBetween}px`;
              }
              else
              {
                itemWidth = itemHeight = `${gridHeight*spaceBetween}px`;
              }
              console.log("four participant : horiz "+gridTemplateColumns + "and "+gridTemplateRows);
       
            }
          }
        }
      } else if (itemsCount === 5 || itemsCount === 6) 
      {
        if (gridHeight > gridWidth) {
          //no horizontal space... go vertical
          gridTemplateColumns = "repeat(2, 1fr)";
          gridTemplateRows = "repeat(3, 1fr)";
          itemWidth = itemHeight = `${(gridHeight / 3)*spaceBetween}px`;
          console.log("2 by 3 grid vertical");
        } 
        else 
        {
          //let's check horizontal space
          const thirdWidth = gridWidth / 3;
          const halfHeight = gridHeight / 2;
          const thirdHeight = gridHeight / 3;
  
          if (thirdWidth > thirdHeight) 
          {
            //bigger circles if grid is laying flat
            gridTemplateColumns = "repeat(3, 1fr)";
            gridTemplateRows = "repeat(2, 1fr)";
  
            if (thirdWidth > halfHeight) {
              itemWidth = itemHeight = `${halfHeight*spaceBetween}px`;
            } else {
              itemWidth = itemHeight = `${thirdWidth*spaceBetween}px`;
            }
  
            console.log("2 by 3 grid horizontal");
          } 
          else 
          {
            gridTemplateColumns = "repeat(2, 1fr)";
            gridTemplateRows = "repeat(3, 1fr)";
            itemWidth = itemHeight = `${thirdHeight*spaceBetween}px`;
            console.log("2 by 3 grid vertical");
          }
        }
      } 
      else if (itemsCount >= 6) 
      {
        if (gridHeight > gridWidth) {
          gridTemplateColumns = "repeat(2, 1fr)";
          gridTemplateRows = "repeat(4, 1fr)";
          itemWidth = itemHeight = `${(gridHeight / 4)*spaceBetween}px`;
          console.log("2 by 4 grid vertical");
        } else {
          if (gridWidth / 4 > gridHeight / 4) {
            gridTemplateColumns = "repeat(4, 1fr)";
            gridTemplateRows = "repeat(2, 1fr)";
  
            if (gridWidth / 4 > gridHeight / 2) {
              itemWidth = itemHeight = `${(gridHeight / 2)*spaceBetween}px`;
            } else {
              itemWidth = itemHeight = `${(gridWidth / 4)*spaceBetween}px`;
            }
            console.log("2 by 4 grid horizontal");
          } else {
            gridTemplateColumns = "repeat(2, 1fr)";
            gridTemplateRows = "repeat(4, 1fr)";
            itemWidth = itemHeight = `${(gridWidth / 4)*spaceBetween}px`;
            console.log("2 by 4 grid vertical");
          }
        }
      }
    // setGridStyle({
    //     display: 'none',
    //   });
    setGridStyle({
      display: 'grid',
      gridTemplateColumns,
      gridTemplateRows,
      gridGap: '1vw', 
    });

    setItemStyle({
      width: itemWidth,
      height: itemHeight,
    });

    forceReflow(gridContainerRef);

  }, [gridWidth, gridHeight, remoteParticipants]);


  
return(
    <div className="grid-container topbar-child-common" ref={gridContainerRef}>
        <div id="allpeople-grid" style={gridStyle}>
            {remoteParticipants.map((participant, index) => {
                

            return (
            <div key={index} className="grid-item" style={itemStyle}>
                <div className="other-div">
                {/* <VideoView stream={participant.stream} /> */}
                <Box ////----------------------- Actual Video
                borderColor={spotLitIds?.includes(participant.id)?("yellow"):("none")} 
                borderWidth={spotLitIds?.includes(participant.id)?("5px"):("0px")} 
                borderRadius={spotLitIds?.includes(participant.id)?("50%"):("0px")} 
                as={VideoView}
                key={participant.id}
                stream={participant.stream}
                w="100%"
                h="100%"
                objectFit="cover"
                />
                </div>
                <Box
                    position="absolute" 
                    bottom="5%"
                    zIndex="1" 
                ><Text fontSize='sm' color="yellow">{participant.displayName}</Text></Box>
                
                {!participant.isAudioEnabled?( ///--------------------micoff icon
                    <Icon //muted icon
                    as={IoMicOff} 
                    position="absolute" 
                    zIndex="1" 
                    // bottom="25%" 
                    // right="25%" 
                    color="red.500" 
                    style={{ opacity: 0.6 }}
                    boxSize="50%" 
                    />):null
                }
            </div>
            
            );
            })}
        </div>
    </div>
    );
  
  
//   return (
    
//     <div className="grid-container topbar-child-common" ref={gridContainerRef}>
//         <div id="allpeople-grid" style={gridStyle}>
//             {remoteParticipants.map((participant, index) => {
                
//             // if(spotLitIds && spotLitIds.includes(participant.id)) return null;
                
//             return (
//             <div key={index} className="grid-item" style={itemStyle}>
//                 <div className="other-div">
//                 {/* <VideoView stream={participant.stream} /> */}
//                 <Box ////----------------------- Actual Video
//                 as={VideoView}
//                 key={participant.id}
//                 stream={participant.stream}
//                 w="100%"
//                 h="100%"
//                 objectFit="cover"
//                 />
//                 </div>
//                 {/* <p>{participant.displayName}</p> */}
//             </div>);
//             })}
//         </div>
//     </div>
    
    
//   );
};

export default GridComponent;
