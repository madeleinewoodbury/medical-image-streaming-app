import { useRef, useState } from 'react'

const WebRTCImageStream = () => {
	const videoRef = useRef()
	const [streaming, setStreaming] = useState(false)
	let pc = null

	// Establish WebRTC peer connection and handle the offer/answer exchange
	async function startWebRTC() {
		try {
			pc = new RTCPeerConnection()
			if (streaming) {
				pc.close()
				setStreaming(false)
				if (videoRef.current) {
					videoRef.current.srcObject = null
				}
				console.log('Stream stopped')
				return
			}

			// Handle incoming stream by seting it to the video element
			pc.ontrack = (event) => {
				if (videoRef.current) {
					console.log('streaming', event.streams[0])
					videoRef.current.srcObject = event.streams[0]
					setStreaming(true)
					videoRef.current.play().catch((error) => {
						console.error('Error attempting to play video:', error)
					})
				}
			}

			// Log when connection state changes
			pc.onconnectionstatechange = () => {
				console.log(pc.connectionState)
				if (pc.connectionState === 'connected') {
					console.log('Connection opened')
				} else if (
					pc.connectionState === 'disconnected' ||
					pc.connectionState === 'closed'
				) {
					console.log('Connection closed')
					setStreaming(false)
					videoRef.current.srcObject = null
				}
			}

			// Add a blank media track
			const canvas = document.createElement('canvas')
			canvas.width = 640
			canvas.height = 480
			const stream = canvas.captureStream()
			stream.getTracks().forEach((track) => pc.addTrack(track, stream))

			// Create an offer and set it as the local description
			const offer = await pc.createOffer()
			await pc.setLocalDescription(offer)

			console.log('Created offer')
			// Get the offer from the server
			const response = await fetch('/api/offer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					type: pc.localDescription.type,
					sdp: pc.localDescription.sdp,
				}),
			})
			const { sdp, type } = await response.json()

			console.log('Received answer from server')

			// Set the remote description with the offer from the server
			const answer = new RTCSessionDescription({ sdp, type })
			await pc.setRemoteDescription(answer)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className='flex flex-col items-center mt-8'>
			<h1 className='text-3xl font-bold text-white py-4'>
				WebRTC Video Stream
			</h1>
			<p className='text-lg text-gray-300 pb-4'>
				Click the button below to start streaming images.
			</p>
			{!streaming ? (
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={startWebRTC}>
					Start Image Stream
				</button>
			) : (
				<button
					className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
					onClick={startWebRTC}>
					Stop Image Stream
				</button>
			)}
			<div className='mt-4 w-full max-w-md'>
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className='w-full h-auto aspect-w-1 aspect-h-1'
				/>
			</div>
			{streaming && <p className='text-lg text-green-600'>Streaming...</p>}
		</div>
	)
}

export default WebRTCImageStream
