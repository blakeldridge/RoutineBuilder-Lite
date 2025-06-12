import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import scoreRoutine from '../utils/calculateDifficulty';
import { useState, useRef  } from 'react';
import { FloorSkills } from '../utils/skillTypes';
import RoutineResult from './routineResult';
import SkillFilterForm from './skillFilterForm';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const scoreTableRef = useRef(null);
    const skillFilterRef = useRef(null);
    const { apparatus } = useParams();
    const [ score, setScore ] = useState(0);
    const [ routine, setRoutine ] = useState([null, null, null, null, null, null, null, null]);
    const [ skills, setSkills ] = useState([]);

    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    useEffect(() => {
        setSkills(skillFilterRef.current.getFilteredSkills());
    }, [skillFilterRef])

    const updateSkills = () => {
        setSkills(skillFilterRef.current.getFilteredSkills());
    };

    const handleEditRoutine = (index, event) => {
        const skill = event.target.value;

        routine[index] = skill;

        const scoringRoutine = routine.map(rskill => {
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
            <SkillFilterForm ref={skillFilterRef} apparatus={apparatusName} filterUpdated={() => updateSkills()} />
            <div className="flex flex-col">
                {routine.map((element, index) => {
                    return (
                        <div className="flex flex-row" style={{"gap":"2em"}}>
                            <p>{index + 1}</p>
                            <select key={index} id={`select-${index}`} value={element} onChange={(event) => handleEditRoutine(index, event)}>
                                <option  value={null}>-- Select --</option>
                                {routine[index] ? (
                                    <option value={routine[index]}>{JSON.parse(routine[index]).name}</option>
                                ) : null}
                                {skills.map((skill, i) => {
                                    if (routine.includes(JSON.stringify(skill)) || (routine[index] && routine[index] == JSON.stringify(skill))) {
                                        return null;
                                    }
                                    return  (
                                        <option key={i} value={JSON.stringify(skill)}>{skill.name}</option>
                                    )
                                })}
                            </select>
                            <p>Group : {routine[index] ? JSON.parse(routine[index]).group : "-"}  </p>
                            <p>Difficulty : {routine[index] ? JSON.parse(routine[index]).difficulty: "-"}</p>
                        </div>
                    );
                })}
            </div>
            <RoutineResult ref={scoreTableRef} apparatus={apparatusName} />
        </div>
    );
};

export default RoutineBuilder;