// JoinRoom.jsx
import React, { useState, useEffect } from 'react';
import { useHMSActions } from '@100mslive/react-sdk';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import { useRoom } from './RoomContext';
import './JoinRoom.css';

function JoinRoom() {
  const ENDPOINT = 'https://prod-in2.100ms.live/hmsapi/virtual-room.app.100ms.live/';
  const ROOMS = ['6543646363663gfe', '658149ea3412d193e842022e', '658aad073412d193e842038c', '658e5e30fceb80c525e6bca4', '658e5e5cfceb80c525e6bca5',
  '658e674f7811c6f89a7997d4', '658e675c7811c6f89a7997d5', '658e6768fceb80c525e6bca6', '658e67767811c6f89a7997d6', '658e6786fceb80c525e6bca7', '658e6792fceb80c525e6bca8'];

  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('broadcaster');
  const hmsActions = useHMSActions();// Use the context hook
  const [broadcasterCount, setBroadcasterCount] = useState(0);
  const [roomId, setRoomId] = useState('');
  const { selectedRoomId, setSelectedRoomId } = useRoom();

  // Load the broadcaster count from localStorage on component mount
  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('broadcasterCount')) || 0;
    setBroadcasterCount(storedCount);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();


    let selectedRoomId;

    if (selectedRole === 'broadcaster') {
      // Increment the broadcaster count
      const nextBroadcasterCount = broadcasterCount + 1;
      setBroadcasterCount(nextBroadcasterCount);

      // Use the room corresponding to the broadcaster count
      selectedRoomId = ROOMS[nextBroadcasterCount % ROOMS.length];
      console.log("room id", selectedRoomId);
      setSelectedRoomId(ROOMS[nextBroadcasterCount % ROOMS.length]);
      // Save the updated broadcaster count to localStorage
      localStorage.setItem('broadcasterCount', nextBroadcasterCount.toString());

      // Send a message to other tabs to update their localStorage
      window.postMessage({ type: 'updateBroadcasterCount', value: nextBroadcasterCount }, '*');
    }


    if(selectedRole === 'broadcaster'){
    const response = await fetch(`${ENDPOINT}api/token`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: `${Date.now()}`,
        role: selectedRole, // broadcaster, hls-viewer
        type: 'app',
        room_id: selectedRoomId,
      }),
    });
    const { token } = await response.json();
    // Joining the room
    if (token !== null) {
      hmsActions.join({
        userName: username,
        authToken: token,
      });
    } else {
      console.log('token is empty');
    }
  };

  if(selectedRole === 'hls-viewer'){
    const response = await fetch(`${ENDPOINT}api/token`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: `${Date.now()}`,
        role: selectedRole, // broadcaster, hls-viewer
        type: 'app',
        room_id: roomId,
      }),
    });
    const { token } = await response.json();
    // Joining the room
    if (token !== null) {
      hmsActions.join({
        userName: username,
        authToken: token,
      });
    } else {
      console.log('token is empty');
    }
  };
}

  // Listen for messages from other tabs to update the broadcaster count
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'updateBroadcasterCount') {
        setBroadcasterCount(event.data.value);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <Box className="join" component="form" onSubmit={handleSubmit} sx={{ p: 3, borderRadius: 4, boxShadow: 1, width: '80%', maxWidth: '400px', margin: 'auto' }}>
      <TextField
        label="Enter name"
        variant="outlined"
        fullWidth
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Role</InputLabel>
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          label="Select Role"
          variant="outlined"
        >
          <MenuItem value="broadcaster">Broadcaster</MenuItem>
          <MenuItem value="hls-viewer">HLS Viewer</MenuItem>
        </Select>
      </FormControl>
      {selectedRole === 'hls-viewer' && (
        <TextField
          label="ROOM ID"
          variant="outlined"
          fullWidth
          required
           value={roomId}
           onChange={(e) => setRoomId(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      <Button
        type="submit"
        variant="contained"
        fullWidth
      >
        Join
      </Button>
    </Box>
  );
}

export default JoinRoom;
