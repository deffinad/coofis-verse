/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/layout';
import Hasil from './pages/Hasil';

function App() {
	return (
		<Routes>
			<Route path='/layout' element={<Layout />} />
			<Route path='/hasil' element={<Hasil />} />
		</Routes>
	);
}

export default App;