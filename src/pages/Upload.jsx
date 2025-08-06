import { useState } from 'react'
import { Link } from 'react-router-dom'

const disabledButton =
	'w-full bg-blue-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed'
const enabledButton =
	'w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'

const Upload = () => {
	const [selectedFiles, setSelectedFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleFileChange = (event) => {
		setSelectedFiles(event.target.files)
	}

	const handleSubmit = async (event) => {
		setError('')
		setSuccess('')

		event.preventDefault()
		if (selectedFiles.length === 0) {
			setError('Please select files to upload')
			return
		}

		setLoading(true)

		const formData = new FormData()
		for (let i = 0; i < selectedFiles.length; i++) {
			formData.append('files', selectedFiles[i])
		}

		try {
			const response = await fetch('/api/images', {
				method: 'POST',
				body: formData,
			})
			if (response.ok) {
				setSuccess('Files uploaded successfully')
				setSelectedFiles([])
			} else {
				setError('Failed to upload files')
			}
		} catch (error) {
			setError('Failed to upload files')
			console.error('Error uploading files:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex flex-col items-center justify-center mt-4'>
			<h1 className='text-3xl font-bold mb-6 text-white'>Upload DICOM Files</h1>
			<form
				onSubmit={handleSubmit}
				className='bg-neutral-800 p-6 rounded-lg shadow-md w-full max-w-md'>
				<div className='mb-4'>
					<label
						htmlFor='fileInput'
						className='block text-gray-100 font-bold mb-2'>
						Select DICOM Files
					</label>
					<input
						type='file'
						id='fileInput'
						accept='.dcm'
						multiple
						onChange={handleFileChange}
						className='w-full px-3 py-2 text-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>
				<button
					type='submit'
					className={
						selectedFiles.length === 0 ? disabledButton : enabledButton
					}
					disabled={selectedFiles.length === 0}>
					Upload
				</button>
			</form>

			{loading && <p className='mt-4 text-white'>Uploading files...</p>}

			{error && <p className='mt-4 text-red-500'>{error}</p>}
			{success && <p className='mt-4 text-green-500'>{success}</p>}
			{success && (
				<Link to='/'>
					<button className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4'>
						Go to steaming
					</button>
				</Link>
			)}
		</div>
	)
}

export default Upload
