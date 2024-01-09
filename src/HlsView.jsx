import { selectHLSState, useHMSStore } from '@100mslive/react-sdk'
import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

function HlsView() {
    const videoRef = useRef(null)
    const hlsState = useHMSStore(selectHLSState)
    const hlsUrl = hlsState.variants[0]?.url

    useEffect(() => {
        if (videoRef.current && hlsUrl) {
            const browserHasNativeHLSSupport = videoRef.current.canPlayType(
                'application/vnd.apple.mpegurl'
            );

            if (Hls.isSupported()) {
                let hls = new Hls()
                hls.loadSource(hlsUrl)
                hls.attachMedia(videoRef.current)
            } else if (browserHasNativeHLSSupport) {
                videoRef.current.src = hlsUrl   //video source null 
            }
        }
    }, [hlsUrl])

    // Check if hlsUrl is empty and render accordingly
    if (!hlsUrl) {
        return <div style={{marginBottom:"20%", marginTop:"20%", fontSize:"2rem", color:"red", fontWeight:"bold"}}>No Live Sharing..</div>;
    }

    return (
        <video
            style={{ border: "solid 2px purple" }}
            width={400}
            height={240}
            ref={videoRef}
            autoPlay
            controls
        ></video>
    );
}

export default HlsView;
