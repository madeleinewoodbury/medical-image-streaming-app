import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import StreamPage from './pages/StreamPage'
import Upload from './pages/Upload'

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path='/' element={<MainLayout />}>
				<Route index element={<StreamPage />} />
				<Route path='/' element={<StreamPage />} />
				<Route path='/upload' element={<Upload />} />
			</Route>
		)
	)

	return <RouterProvider router={router} />
}

export default App
