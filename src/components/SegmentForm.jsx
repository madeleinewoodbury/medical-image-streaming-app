const SegmentForm = ({
	technique,
	imageDelay,
	thresholdRatio,
	kernelSize,
	xCood,
	yCood,
	radius,
	handleChange,
}) => {
	return (
		<form className='flex flex-col w-full max-w-lg items-center gap-6 mb-8'>
			<div className='flex gap-6 w-full'>
				<div className='flex flex-col gap-1 w-1/2'>
					<label className='text-gray-300 text-sm'>
						Segmentation Technique
					</label>
					<select
						value={technique}
						name='technique'
						onChange={handleChange}
						className='w-full bg-gray-800 text-gray-300 p-2 rounded'>
						<option value='watershed'>Watershed</option>
						<option value='snakes'>Active Contour (Snakes)</option>
					</select>
				</div>
				<div className='flex flex-col gap-1 w-1/2'>
					<label className='text-gray-300 text-sm'>Seconds per image</label>
					<input
						type='number'
						value={imageDelay}
						name='imageDelay'
						onChange={handleChange}
						className='w-full bg-gray-800 text-gray-300 p-2 rounded'
					/>
				</div>
			</div>

			{technique === 'watershed' ? (
				<div className='flex gap-6 w-full'>
					<div className='flex flex-col gap-1 w-1/2'>
						<label className='text-gray-300 text-sm'>Threshold Ratio</label>
						<input
							type='number'
							step='0.01'
							max={1.0}
							min={0.0}
							name='thresholdRatio'
							value={thresholdRatio}
							onChange={handleChange}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'
						/>
					</div>
					<div className='flex flex-col gap-1 w-1/2'>
						<label className='text-gray-300 text-sm'>Kernel Size</label>
						<select
							value={kernelSize}
							onChange={handleChange}
							name='kernelSize'
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'>
							<option value='watershed'>3</option>
							<option value='snakes'>5</option>
						</select>
					</div>
				</div>
			) : (
				<div className='flex gap-6 w-full'>
					<div className='flex flex-col gap-1'>
						<label className='text-gray-300 text-sm'>X-Coord</label>
						<input
							type='number'
							step='1'
							name='xCood'
							value={xCood}
							onChange={handleChange}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'
						/>
					</div>
					<div className='flex flex-col gap-1'>
						<label className='text-gray-300 text-sm'>Y-Coord</label>
						<input
							type='number'
							step='1'
							name='yCood'
							value={yCood}
							onChange={handleChange}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'
						/>
					</div>
					<div className='flex flex-col gap-1'>
						<label className='text-gray-300 text-sm'>Radius</label>
						<input
							type='number'
							step='1'
							name='radius'
							value={radius}
							onChange={handleChange}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'
						/>
					</div>
					<div className='flex flex-col gap-1 w-1/2'>
						<label className='text-gray-300 text-sm'>Kernel Size</label>
						<select
							value={kernelSize}
							name='kernelSize'
							onChange={handleChange}
							className='w-full bg-gray-800 text-gray-300 p-2 rounded'>
							<option value='watershed'>3</option>
							<option value='snakes'>5</option>
						</select>
					</div>
				</div>
			)}
		</form>
	)
}
export default SegmentForm
