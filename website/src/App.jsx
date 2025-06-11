import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import ApparatusSelector from './assets/components/apparatusSelector';
import RoutineBuilder from './assets/components/routineBuilder';

export default function App() {
    return (
        <Router>
			<Routes>
				<Route path="/" element={<ApparatusSelector />} />
				<Route path="/routine-builder/:apparatus" element={<RoutineBuilder />} />
			</Routes>
		</Router>
    );
};
