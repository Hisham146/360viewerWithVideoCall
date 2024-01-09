import React from 'react';
import View360Dynamic from './View360.jsx'
import JoinRoom from './JoinRoom.jsx';
import Room from './Room.jsx';
import { useHMSStore, selectIsConnectedToRoom } from '@100mslive/react-sdk';
import './App.css'; 

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  return (
    <div className="app-container">
       <View360Dynamic/> 
        {isConnected
        ?
         <Room /> 
        : 
         <JoinRoom /> 
      }
    </div>
  );
}
