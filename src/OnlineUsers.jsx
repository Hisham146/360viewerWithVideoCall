import React from 'react';
import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import './OnlineUsers.css'
import Avatar1 from './assets/baldmanvr.png';
import Avatar2 from './assets/shortmanvr.png';
import Avatar3 from './assets/hairman.png';


const OnlineUsers = () => {
  const peers = useHMSStore(selectPeers);

  // Array of avatars
  const avatars = [Avatar1, Avatar2, Avatar3];

  // Function to get a random avatar
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
  };

  return (
    <div className='Avatars'>
      {peers.map((peer) => (
        <div key={peer.id}>
          <img
            src={getRandomAvatar()}
            alt={`Avatar for ${peer.name}`}
            style={{ width: '80px', height: '80px'}}
          />
          <p>{peer.name}</p>
        </div>
      ))}
    </div>
  );
};

export default OnlineUsers;
