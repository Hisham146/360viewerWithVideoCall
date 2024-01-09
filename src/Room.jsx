import Stream from './Stream';
import ChatNdParticipants from './ChatNdParticipants'
import Controls from './Controls'
import React from "react";
import './Room.css';
import OnlineUsers from './OnlineUsers';

function Room() {
  return (
    <>
     <div className='room'>
      <div className="chatPart"><ChatNdParticipants />
      </div>
      <div className='room__streamSpace'>
        
        <Stream />
        <Controls />
        <OnlineUsers />
      </div>
    </div> 
    </>
  );
}
export default Room