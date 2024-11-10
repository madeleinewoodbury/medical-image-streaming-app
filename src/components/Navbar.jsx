import { NavLink } from 'react-router-dom'

const Navbar = () => {
	const linkClass = ({ isActive }) =>
		isActive
			? 'border-b-2 border-fuchsia-400 text-blue-300'
			: 'border-b-2 border-transparent hover:text-fuchsia-400'

	return (
		<nav className='py-6 px-4 flex justify-center text-white container mx-auto'>
			<div className='flex gap-8 font-mono'>
				<NavLink to='/' className={linkClass}>
					Stream
				</NavLink>
				<NavLink to='/upload' className={linkClass}>
					Upload
				</NavLink>
			</div>
		</nav>
	)
}
export default Navbar
