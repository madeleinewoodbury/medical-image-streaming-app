const SnakesInputs = ({ xCood, yCood, radius, kernelSize, handleChange }) => {
	return (
		<div className='flex flex-wrap w-full gap-y-4 sm:flex-nowrap sm:gap-6'>
			<div className='flex flex-col gap-1 w-1/2 pr-2 sm:w-1/4 sm:p-0'>
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
			<div className='flex flex-col gap-1 w-1/2 pl-2 sm:w-1/4 sm:p-0'>
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
			<div className='flex flex-col gap-1 w-1/2 pr-2 sm:p-0 sm:w-1/4'>
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
			<div className='flex flex-col gap-1 w-1/2 pl-2 sm:p-0 sm:w-1/4'>
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
	)
}
export default SnakesInputs
