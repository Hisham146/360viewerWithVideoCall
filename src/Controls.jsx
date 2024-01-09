import {
  VideocamOutlined,
  VideocamOffOutlined,
  MicNoneOutlined,
  MicOffOutlined,
  LogoutOutlined,
  PodcastsOutlined,
  StopCircleOutlined,
  ScreenShareOutlined,
  StopScreenShareOutlined
} from '@mui/icons-material';
import { IconButton, Button } from '@mui/material';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import { selectHLSState, useHMSActions, useHMSStore,selectPeers } from '@100mslive/react-sdk'
import { selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, selectLocalPeer, selectIsLocalScreenShared, selectIsPeerAudioEnabled } from '@100mslive/react-sdk'
import { useRef } from 'react';
import { useRoom } from './RoomContext';

//import './Controls.css'


function Controls() {
   const peersRef = useRef("");
  const hmsActions = useHMSActions()
  const hlsState = useHMSStore(selectHLSState)
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled)
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled)
  const screenEnabled = useHMSStore(selectIsLocalScreenShared);
  const localPeer = useHMSStore(selectLocalPeer);
  const otherpeers = useHMSStore(selectPeers);
  const peers = otherpeers.filter(peer => peer.id !== localPeer.id);
  const audioEnabledHLS = !useHMSStore(selectIsPeerAudioEnabled(peersRef.current));
  const { selectedRoomId } = useRoom();
  console.log("audio", audioEnabledHLS)
  console.log("roomid paassed", selectedRoomId);

 peers.forEach(peer => {
  const peerId = peer.id;
  peersRef.current = peerId;
});

const copyRoomIdToClipboard = () => {
  navigator.clipboard.writeText(selectedRoomId)
    .then(() => {
      console.log('Room ID copied to clipboard:', selectedRoomId);
      // Optionally, you can show a success message to the user
      alert('Room ID copied to clipboard');
    })
    .catch((err) => {
      console.error('Failed to copy Room ID to clipboard', err);
      // Optionally, you can show an error message to the user
      alert('Failed to copy Room ID to clipboard');
    });
};

  const startHLSStreaming = async () => {
    try {
      await hmsActions.startHLSStreaming()
    } catch (err) {
        alert(`failed to start hls ${err}`)
    }
  }

  const stopHLSStreaming = async () => { 
    try {
      await hmsActions.stopHLSStreaming()
    } catch (err) {
        alert(`failed to stop hls ${err}`)
    }
  }

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!audioEnabled);
  }

  const toggleAudioHSL =  () => {
      audioEnabledHLS ? !audioEnabledHLS : audioEnabledHLS
  }


  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!videoEnabled);
  }

  const toggleScreen = async () => {
  try {
    await hmsActions.setScreenShareEnabled(!screenEnabled);
    } catch (error) {
        console.log("screenshare error", error);
    }
  }

  const leaveRoom = async () => {
    if(localPeer.roleName === 'broadcaster'){
      hmsActions.leave()
      await hmsActions.stopHLSStreaming()
    }else{
      hmsActions.leave()
    }
  }

  
  return (
    <div className='controls'>
      {localPeer.roleName === 'broadcaster'
        ? <>
              <Button
            variant="outlined"
            disableElevation
            size='small'
            startIcon={<FileCopyOutlinedIcon />}
            onClick={copyRoomIdToClipboard}
          >
            Room ID
          </Button>
            <IconButton onClick={toggleAudio}>
              {audioEnabled
                ? <MicNoneOutlined />
                : <MicOffOutlined />
              }
            </IconButton>
            <IconButton onClick={toggleVideo}>
              {videoEnabled
                ? <VideocamOutlined />
                : <VideocamOffOutlined />
              }
            </IconButton>
            <IconButton onClick={toggleScreen}>
              {screenEnabled
                ? <ScreenShareOutlined />
                : <StopScreenShareOutlined />
              }
            </IconButton>
            <Button 
              variant="outlined" 
              disableElevation
              color='error'
              size='small'
              style={{marginRight:"2px"}}
              className='leave'
              onClick={leaveRoom}
            >
              <LogoutOutlined /> Leave Room
            </Button>
            {hlsState.running
              ? <Button 
                  variant="outlined" 
                  disableElevation
                  className='leave'
                  color='error'
                  size='small'
               
                  onClick={stopHLSStreaming}
                >
                  <StopCircleOutlined /> Stop Streaming
                </Button>
              : <Button 
                  variant="outlined"
                  disableElevation
                  size='small'
                  onClick={startHLSStreaming}
                 
                >
                  <PodcastsOutlined /> Go Live 
                </Button>
            }
          </>
        : <>
        <IconButton onClick={toggleAudioHSL} >
        {audioEnabledHLS 
          ? <MicNoneOutlined />
          : <MicOffOutlined />
        }
      </IconButton>
        <Button 
            variant="outlined" 
            disableElevation
            className='leave'
            color='error'
            onClick={leaveRoom}
            
          >
            <LogoutOutlined /> Leave Room
          </Button>
          </>
      }
    </div>
  )
}

export default Controls