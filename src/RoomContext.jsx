// RoomContext.js
import React, { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  return (
    <RoomContext.Provider value={{ selectedRoomId, setSelectedRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
