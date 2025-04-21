import { Routes, Route } from 'react-router-dom';
import LayoutManagerv3 from './pages/LayoutManagerv3';
import LayoutManagerv4 from './pages/LayoutManagerv4';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import Hasilv2 from './pages/Hasilv2';
import { isAuthenticated } from './services/authServices';
import { Navigate } from 'react-router-dom';
import Layout from '@/pages/Layout';

const ProtectedLoginRoute = ({ children }) => {
	return isAuthenticated() ? (
		<Navigate to='/layoutmanagerv4' />
	) : (
		children
	);
};

function App() {
	return (
		<Routes>
			<Route
				path='/login'
				element={
					<ProtectedLoginRoute>
						<Login />
					</ProtectedLoginRoute>
				}
			/>
			<Route
				path='/register'
				element={
					<ProtectedLoginRoute>
						<Register />
					</ProtectedLoginRoute>
				}
			/>

			<Route
				path='/layoutmanagerv3'
				element={
					// <ProtectedRoute>
					<LayoutManagerv3 />
					// </ProtectedRoute>
				}
			/>
			<Route
				path='/layoutmanagerv4'
				element={
					// <ProtectedRoute>
					<LayoutManagerv4 />
					// </ProtectedRoute>
				}
			/>
			<Route
				path='/layout'
				element={
					<Layout />
				}
			/>
			<Route
				path='/hasil'
				element={
					// <ProtectedRoute>
					<Hasilv2 />
					// </ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;

{
	/* <Route path="/swapydykocak" element={<SwapyKocak />} />
<Route path="/swapydynamic" element={<Swapydynamic />} />
<Route path="/swapysidebar" element={<SwapyWithSideBar />} />
<Route path="/swapysidebarv2" element={<SwapyWithSideBarV2 />} />
<Route path="/swapysidebarv3" element={<SwapyWithSideBarv3 />} />
<Route path="/swapysidebarv4" element={<SwapyWithSideBarv4 />} />
<Route path="/layoutmanager" element={<LayoutManager />} />

<Route path="/layoutmanagerv2" element={<LayoutManagerv2 />} />
<Route path="/modulcomponent" element={<ModulComponents />} />

<Route path="/hasil" element={<Hasil />} />

<Route path="/kocak" element={<KocakLayout />} />
<Route path="/swapylagi" element={<Swapylagi />} />
<Route path="/rating" element={<Rating />} /> */
}
