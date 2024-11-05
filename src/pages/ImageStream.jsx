import { useState, useRef, useEffect } from 'react'

const ImageStream = () => {
	const [pc, setPc] = useState(null)
	const [canvasStream, setCanvasStream] = useState(null)
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const signalingSocket = useRef(null)

	useEffect(() => {
		// Set up WebSocket connection
		signalingSocket.current = new WebSocket('ws://127.0.0.1:8000/ws/signaling')

		signalingSocket.current.onopen = () => {
			console.log('Connected to signaling server')
		}

		signalingSocket.current.onmessage = async (event) => {
			const data = JSON.parse(event.data)

			// await createPeerConnection()

			if (data.type === 'offer') {
				await pc.setRemoteDescription(new RTCSessionDescription(data))
				const answer = await pc.createAnswer()
				await pc.setLocalDescription(answer)
				signalingSocket.current.send(JSON.stringify(answer))
			} else if (data.type === 'answer') {
				await pc.setRemoteDescription(new RTCSessionDescription(data))
			} else if (data.type === 'candidate') {
				await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
			}
		}

		return () => {
			signalingSocket.current.close()
		}
	}, [pc])

	useEffect(() => {
		// Create peer connection as soon as the component mounts
		createPeerConnection()
	}, [])

	const createPeerConnection = async () => {
		if (pc) return
		console.log('creating peer connection')

		const newPc = new RTCPeerConnection()

		newPc.onicecandidate = (event) => {
			if (event.candidate) {
				signalingSocket.current.send(
					JSON.stringify({ type: 'candidate', candidate: event.candidate })
				)
			}
		}

		newPc.ontrack = (event) => {
			console.log('Received remote stream', event.streams[0])
			remoteVideoRef.current.srcObject = event.streams[0]
			remoteVideoRef.current.play().catch(console.error)
		}

		setPc(newPc)
	}

	const handleImageUpload = (event) => {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = async () => {
				if (!pc) {
					await createPeerConnection() // Ensure peer connection exists
				}

				const img = new Image()
				img.src = reader.result

				img.onload = () => {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					canvas.width = img.width
					canvas.height = img.height

					// Draw the uploaded image on the canvas
					ctx.drawImage(img, 0, 0, img.width, img.height)

					// Capture the stream from the canvas at 1 fps and store it in state
					const stream = canvas.captureStream(1)
					setCanvasStream(stream)

					// Display the local preview
					localVideoRef.current.srcObject = stream

					// Redraw every second to keep the stream alive
					setInterval(() => {
						ctx.drawImage(img, 0, 0, img.width, img.height)
					}, 1000)
				}
			}
			reader.readAsDataURL(file)
		}
	}

	const startStreaming = async () => {
		if (!pc) {
			await createPeerConnection()
		}

		if (canvasStream) {
			// Add tracks from the canvas stream to the peer connection
			canvasStream
				.getTracks()
				.forEach((track) => pc.addTrack(track, canvasStream))
		}

		const offer = await pc.createOffer()
		await pc.setLocalDescription(offer)
		signalingSocket.current.send(JSON.stringify(offer))
	}

	return (
		<div className='text-white py-8'>
			<h1 className='text-lg pb-4'>WebRTC Image Streaming</h1>
			<div className='flex gap-16 justify-center mb-8'>
				<div className='flex flex-col gap-4'>
					<video
						ref={remoteVideoRef}
						autoPlay
						playsInline
						muted
						className='border-2 border-white'
					/>
					<p className='text-center'>Remote Stream</p>
				</div>
				<div className='flex flex-col gap-4'>
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className='border-2 border-white'
					/>
					<p className='text-center'>Local Stream</p>
				</div>
			</div>
			<input type='file' accept='image/*' onChange={handleImageUpload} />
			<button
				onClick={startStreaming}
				className='rounded bg-blue-600 px-4 py-2'>
				Start Streaming
			</button>
		</div>
	)
}

export default ImageStream
