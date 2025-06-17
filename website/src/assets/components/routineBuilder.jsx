import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import scoreRoutine from '../utils/calculateDifficulty';
import { useState, useRef  } from 'react';
import { FloorSkills, PommelSkills, RingsSkills } from '../utils/skillTypes';
import RoutineResult from './routineResult';
import SkillFilterForm from './skillFilterForm';
import FlopForm from './flopForm';
import HandstandDismountForm from './handstandDismountForm';
import DownloadPDFButton from './downloadButton';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const scoreTableRef = useRef(null);
    const skillFilterRef = useRef(null);
    const handstandDismountRef = useRef(null);
    const { apparatus } = useParams();
    const [ score, setScore ] = useState(0);
    const [ skills, setSkills ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isHdstOpen, setIsHdstOpen ] = useState(false);

    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    const [ routine, setRoutine ] = useState(apparatusName == Apparatus.VAULT ? [null, null] : [null, null, null, null, null, null, null, null]);

    useEffect(() => {
        updateSkills();
    }, [skillFilterRef]);

    const updateSkills = () => {
        setSkills(skillFilterRef.current.getFilteredSkills());
    };

    const checkSkillExistsByName = (skillName) => {
        return skillFilterRef.current.skillExistsByName(skillName);
    };

    const resetRoutine = () => {
        setRoutine(apparatusName == Apparatus.VAULT ? [null, null] : [null, null, null, null, null, null, null, null]);
        calculateScore();
    };

    const addSkill = (skill) => {
        setIsOpen(false);
        skillFilterRef.current.addSkill(skill);
    };

    const connectSkills = (index) => {
        if (routine[index].connection) {
            routine[index].connection = false;
        } else {
            routine[index].connection = true;
        }

        calculateScore();
    };

    const handleEditRoutine = (index, event) => {
        const skillId = parseInt(event.target.value, 10);
        const skill = skills.find(skill => skill.id === skillId);

        if (apparatusName == Apparatus.POMMEL && PommelSkills[skill.type] == PommelSkills.HANDSTAND_DISMOUNT) {
            handstandDismountRef.current.setThisSkill(index, skill);
            setIsHdstOpen(true);
        } else {
            routine[index] = skill;

            calculateScore();
        }
    };

    const removeSkill = (index) => {
        routine[index] = null;

        calculateScore();
    };

    const placeHandstandDismount = (index, skill) => {
        setIsHdstOpen(false);
        routine[index] = skill;

        calculateScore();
    };

    const calculateScore = () => {
        const newScore = scoreRoutine(routine, apparatusName);
        console.log(newScore.invalid);

        for (let skill of routine) {
            if (skill) {
                if (newScore.invalid.includes(skill.id)) {
                    skill.invalid = true;
                } else {
                    skill.invalid = false;
                }
            }
        }

        scoreTableRef.current.updateResult(newScore);
        setScore(newScore);
    };

    const canConnect = (index) => {
        if (apparatusName == Apparatus.FLOOR) {
            return routine[index] && index + 1 < routine.length && routine[index + 1] && routine[index].group != 1 && routine[index + 1].group != 1;
        } else if (apparatusName == Apparatus.RINGS) {
            return routine[index] && index + 1 < routine.length && routine[index + 1] && RingsSkills[routine[index].type] == RingsSkills.YAMA_JON;
        } else if (apparatusName == Apparatus.HBAR) {
            return routine[index] && index + 1 < routine.length && routine[index + 1] && routine[index].group != 4 && routine[index + 1].group != 4;
        } else {
            return false;
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            <h1>{apparatusName}</h1>
            <SkillFilterForm ref={skillFilterRef} apparatus={apparatusName} filterUpdated={() => updateSkills()} />

            <div className="flex flex-row justify-between">
                <div></div>
                <div></div>
                <div className="flex flex-row">
                    {apparatusName === Apparatus.POMMEL ? (
                        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Create Flop"}</button>
                    ) : null}
                    <button onClick={resetRoutine}>Clear Routine</button>
                </div>
                <DownloadPDFButton apparatus={apparatusName} routine={routine} routineResult={score} />
            </div>

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
                            <p>Difficulty : {routine[index] ? (routine[index].invalid ? "uncounted" : routine[index].difficulty): "-"}</p>
                            <button disabled={!routine[index]} onClick={() => removeSkill(index)}>x</button>
                            {canConnect(index) ? (
                                <button onClick={() => connectSkills(index)}>{routine[index].connection ? "-" : "+"}</button>
                            ) : null}

                        </div>
                    );
                })}
            </div>
            <RoutineResult ref={scoreTableRef} apparatus={apparatusName} />

            <FlopForm isOpen={isOpen} handleAddSkill={(skill) => addSkill(skill)} skillExists={checkSkillExistsByName}/>

            <HandstandDismountForm ref={handstandDismountRef} isOpen={isHdstOpen} addSkill={placeHandstandDismount} />
        </div>
    );
};

export default RoutineBuilder;