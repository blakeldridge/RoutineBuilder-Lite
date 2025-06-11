import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import getSkills from '../utils/getSkills';
import scoreRoutine from '../utils/calculateDifficulty';
import { useState } from 'react';

const RoutineBuilder = () => {
    const navigate = useNavigate();
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

        const scoringRoutine = updatedRoutine.map((skill, i) => 
            JSON.parse(skill)
        );
        const newScore = scoreRoutine(scoringRoutine, apparatusName);
        console.log(newScore);
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
            <h3>{score != 0 ? score.score : 0}</h3>
        </div>
    );
};

export default RoutineBuilder;