const WatershedInputs = ({ thresholdRatio, kernelSize, handleChange }) => {
	return (
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
	)
}
export default WatershedInputs
