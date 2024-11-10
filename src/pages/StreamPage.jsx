import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WebRTCStream from '../components/WebRTCStream'

const StreamPage = () => {
	const [canStream, setCanStream] = useState(false)

	useEffect(() => {
		const checkForImages = async () => {
			const response = await fetch('/api/images')
			if (response.ok) {
				setCanStream(true)
			}
		}

		checkForImages()
	}, [])

	return (
		<div className='flex flex-col items-center'>
			<h1 className='text-3xl font-bold mb-2 text-white pt-4 pb-8'>
				WebRTC Image Stream
			</h1>
			{canStream ? (
				<WebRTCStream />
			) : (
				<div className='text-white text-center'>
					<p>There are no images to stream</p>
					<p>Upload some DICOM files to start streaming</p>
					<Link to='/upload'>
						<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
							Upload Files
						</button>
					</Link>
				</div>
			)}
		</div>
	)
}
export default StreamPage
