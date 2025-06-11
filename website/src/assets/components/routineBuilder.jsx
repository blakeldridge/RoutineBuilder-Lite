import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import getSkills from '../utils/getSkills';
import scoreRoutine from '../utils/calculateDifficulty';
import { useState, useRef  } from 'react';
import { FloorSkills } from '../utils/skillTypes';
import RoutineResult from './routineResult';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const scoreTableRef = useRef(null);
    const { apparatus } = useParams();
    const [ score, setScore ] = useState(0);
    const [ routine, setRoutine ] = useState([null, null, null, null, null, null, null, null]);

    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    const skills = getSkills(apparatusName);

    const handleEditRoutine = (index, skill) => {
        const updatedRoutine = routine.map((rskill, i) => 
            i === index ? skill : rskill
        );

        const scoringRoutine = updatedRoutine.map(rskill => {
            if (rskill) {
                rskill = JSON.parse(rskill);
                rskill.type = FloorSkills[rskill.type];
            } 
            return rskill;
        });

        const newScore = scoreRoutine(scoringRoutine, apparatusName);
        scoreTableRef.current.updateResult(newScore);
        setScore(newScore);
        setRoutine(updatedRoutine);
    };

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            <h1>{apparatusName}</h1>
            <div className="flex flex-col">
                {routine.map((element, index) => {
                    return (
                        <select key={index} id={`select-${index}`} value={element} onChange={(event) => handleEditRoutine(index, event.target.value)}>
                            <option value={null}>-- Select --</option>
                            {skills.map(((skill, index) => (
                                <option key={index} value={JSON.stringify(skill)}>{skill.name}</option>
                            )))}
                        </select>
                    );
                })}
            </div>
            <RoutineResult ref={scoreTableRef} apparatus={apparatusName} />
        </div>
    );
};

export default RoutineBuilder;