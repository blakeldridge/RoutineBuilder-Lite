import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import scoreRoutine from '../utils/calculateDifficulty';
import { useState, useRef  } from 'react';
import { FloorSkills } from '../utils/skillTypes';
import RoutineResult from './routineResult';
import SkillFilterForm from './skillFilterForm';
import FlopForm from './flopForm';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const scoreTableRef = useRef(null);
    const skillFilterRef = useRef(null);
    const { apparatus } = useParams();
    const [ score, setScore ] = useState(0);
    const [ routine, setRoutine ] = useState([null, null, null, null, null, null, null, null]);
    const [ skills, setSkills ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);

    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    useEffect(() => {
        updateSkills();
    }, [skillFilterRef])

    const updateSkills = () => {
        setSkills(skillFilterRef.current.getFilteredSkills());
    };

    const checkSkillExistsByName = (skillName) => {
        return skillFilterRef.current.skillExistsByName(skillName);
    };

    const addSkill = (skill) => {
        setIsOpen(false);
        skillFilterRef.current.addSkill(skill);
    };

    const connectSkills = (index) => {
        if (routine[index].conection) {
            routine[index].connection = false;
        } else {
            routine[index].connection = true;
        }
    };

    const handleEditRoutine = (index, event) => {
        const skillId = parseInt(event.target.value, 10);
        const skill = skills.find(skill => skill.id === skillId);

        routine[index] = skill;

        console.log(routine);


        const newScore = scoreRoutine(routine, apparatusName);
        scoreTableRef.current.updateResult(newScore);
        setScore(newScore);
    };

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            <h1>{apparatusName}</h1>
            <SkillFilterForm ref={skillFilterRef} apparatus={apparatusName} filterUpdated={() => updateSkills()} />

            {apparatusName === Apparatus.POMMEL ? (
                <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Create Flop"}</button>
            ) : null}
            <div className="flex flex-col">
                {routine.map((element, index) => {
                    return (
                        <div className="flex flex-row" style={{"gap":"2em"}}>
                            <p>{index + 1}</p>
                            <select key={index} id={`select-${index}`} value={routine[index]? routine[index].id.toString() : -1} onChange={(event) => handleEditRoutine(index, event)}>
                                <option  value={-1}>-- Select --</option>
                                {routine[index] ? (
                                    <option key={routine[index].id} value={routine[index].id}>{routine[index].name}</option>
                                ) : null}
                                {skills.map((skill, i) => {
                                    if (routine.includes(skill) || (routine[index] && routine[index] == skill)) {
                                        return null;
                                    }
                                    return  (
                                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                                    )
                                })}
                            </select>
                            <p>Group : {routine[index] ? routine[index].group : "-"}  </p>
                            <p>Difficulty : {routine[index] ? routine[index].difficulty: "-"}</p>
                            {routine[index] && index + 1 < routine.length && routine[index + 1] && apparatusName == Apparatus.FLOOR ? (
                                <button onClick={() => connectSkills(index)}>{routine[index].connection ? "-" : "+"}</button>
                            ) : null}
                        </div>
                    );
                })}
            </div>
            <RoutineResult ref={scoreTableRef} apparatus={apparatusName} />

            <FlopForm isOpen={isOpen} handleAddSkill={(skill) => addSkill(skill)} skillExists={checkSkillExistsByName}/>
        </div>
    );
};

export default RoutineBuilder;