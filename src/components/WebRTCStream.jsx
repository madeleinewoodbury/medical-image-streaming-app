import { useRef, useState } from 'react'
import WatershedInputs from '../components/WatershedInputs'
import SnakesInputs from '../components/SnakesInputs'

const WebRTCImageStream = () => {
	const videoRef = useRef()
	const [streaming, setStreaming] = useState(false)
	const [technique, setTechnique] = useState('snakes')
	const [thresholdRatio, setThresholdRatio] = useState(0.5)
	const [kernelSize, setKernelSize] = useState(3)
	const [xCood, setXCoord] = useState(100)
	const [yCood, setYCoord] = useState(100)
	const [radius, setRadius] = useState(50)
	const [imageDelay, setImageDelay] = useState(1)
	let pc = null

	const handleFormUpdate = (event) => {
		event.preventDefault()

		switch (event.target.name) {
			case 'technique':
				setTechnique(event.target.value)
				break
			case 'thresholdRatio':
				setThresholdRatio(event.target.value)
				break
			case 'kernelSize':
				setKernelSize(event.target.value)
				break
			case 'xCood':
				setXCoord(event.target.value)
				break
			case 'yCood':
				setYCoord(event.target.value)
				break
			case 'radius':
				setRadius(event.target.value)
				break
			case 'imageDelay':
				setImageDelay(event.target.value)
				break
			default:
				break
		}
	}

	const getUrl = () => {
		let url = '/api'
		if (technique === 'watershed') {
			url += `/watershed?threshold_ratio=${thresholdRatio}&image_delay=${imageDelay}&kernel_size=${kernelSize}`
		} else {
			url += `/snakes?x=${xCood}&y=${yCood}&radius=${radius}&image_delay=${imageDelay}`
		}

		return url
	}

	// Establish WebRTC peer connection and handle the offer/answer exchange
	async function startWebRTC() {
		try {
			const stopStream = async () => {
				try {
					await fetch('/api/stop-stream', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					})
					console.log('Notified server to stop stream')
				} catch (error) {
					console.error('Failed to notify server:', error)
				}
			}

			pc = new RTCPeerConnection()
			if (streaming) {
				await stopStream()
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
			const url = getUrl()
			// Get the offer from the server
			const response = await fetch(url, {
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
		<>
			<form className='flex flex-col w-full max-w-lg items-center gap-6 mb-8'>
				<div className='flex flex-col gap-6 w-full sm:flex-row'>
					<div className='flex flex-col gap-1 w-full sm:w-1/2'>
						<label className='text-gray-300 text-sm'>
							Segmentation Technique
						</label>
						<select
							value={technique}
							name='technique'
							onChange={handleFormUpdate}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'>
							<option value='watershed'>Watershed</option>
							<option value='snakes'>Active Contour (Snakes)</option>
						</select>
					</div>
					<div className='flex flex-col gap-1 w-full sm:w-1/2'>
						<label className='text-gray-300 text-sm'>Seconds per image</label>
						<input
							type='number'
							value={imageDelay}
							name='imageDelay'
							onChange={handleFormUpdate}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'
						/>
					</div>
				</div>

				{technique === 'watershed' ? (
					<WatershedInputs
						thresholdRatio={thresholdRatio}
						kernelSize={kernelSize}
						handleChange={handleFormUpdate}
					/>
				) : (
					<SnakesInputs
						xCood={xCood}
						yCood={yCood}
						radius={radius}
						kernelSize={kernelSize}
						handleChange={handleFormUpdate}
					/>
				)}
			</form>
      {!streaming && 
			  <p className='text-lg text-gray-300 pb-4'>
				  Click the button below to start streaming images.
			  </p>  
      }
			{!streaming ? (
				<button
					className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
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
		</>
	)
}

export default WebRTCImageStream
