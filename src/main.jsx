// main.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { RoomProvider } from './RoomContext';
import App from './App';
import './index.css';
ReactDOM.render(
  <React.StrictMode>
    <HMSRoomProvider>
      <RoomProvider>
       <App />
      </RoomProvider>
    </HMSRoomProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
