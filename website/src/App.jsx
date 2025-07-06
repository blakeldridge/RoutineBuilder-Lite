import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import ApparatusSelector from './assets/components/apparatusSelector';
import RoutineBuilder from './assets/components/routineBuilder';
import ErrorPage from './assets/components/errorPage';
import Login from './assets/components/login';

export default function App() {
    return (
        <Router>
			<Routes>
				<Route path="login" element={<Login />} />
				<Route path="/" element={<ApparatusSelector />} />
				<Route path="/routine-builder" element={<Navigate to="/404" replace />} />
				<Route path="/routine-builder/:apparatus" element={<RoutineBuilder />} />

				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</Router>
    );
};
