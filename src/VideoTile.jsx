import { useVideo } from "@100mslive/react-sdk";
import React from "react";



function VideoTile({ peer, peers }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  })
  
  const numberOfBroadCasters = () => {
    const broadcasters = peers.filter((peer) => {
      return peer.roleName === 'broadcaster'
    })
    return broadcasters.length
  }

  return (
    <>
    <video
      ref={videoRef}
      className={numberOfBroadCasters() >= 2 ? 'video' : ''}
      autoPlay
      muted
      width={400}
      height={240}
      playsInline
      style={{border:"solid red 2px"}}
    />

    </>
  )
};

export default VideoTile