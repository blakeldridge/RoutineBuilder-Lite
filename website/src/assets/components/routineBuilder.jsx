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
    const [ isSkillsOpen, setIsSkillsOpen ] = useState(false);

    const isLoggedIn = localStorage.getItem("authToken");
    
    useEffect(() => {
        if (isLoggedIn !== "true") {
            navigate("/login");
        }
    })


    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    const [ routine, setRoutine ] = useState(apparatusName == Apparatus.VAULT ? [null, null] : [null, null, null, null, null, null, null, null]);

    useEffect(() => {
        updateSkills();
    }, [skillFilterRef]);

    useEffect(() => {
        calculateScore();
    }, [routine]);

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
        routine[index].connection = false;
        routine[index] = null;
        skillFilterRef.current.filterSkills();

        calculateScore();
    };

    const placeHandstandDismount = (index, skill) => {
        setIsHdstOpen(false);
        routine[index] = skill;

        calculateScore();
    };

    const calculateScore = () => {
        const newScore = scoreRoutine(routine, apparatusName);

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
            return routine[index] && index + 1 < routine.length && routine[index + 1] && routine[index].group != 4 && routine[index + 1].group != 4 && (routine[index].group == 2 || routine[index + 1].group == 2);
        } else {
            return false;
        }
    };
    
    const handleSkillChosen = (skill, index) => {
        setIsSkillsOpen(false);

        if (apparatusName == Apparatus.POMMEL && PommelSkills[skill.type] == PommelSkills.HANDSTAND_DISMOUNT) {
            handstandDismountRef.current.setThisSkill(index, skill);
            setIsHdstOpen(true);
        } else {
            routine[index] = skill;

            calculateScore();
        }      
    };

    return (
        <div>
            <button className="absolute top-10 left-10 p-4" onClick={() => navigate('/')}>Return</button>
            <h1>{apparatusName}</h1>
            <SkillFilterForm ref={skillFilterRef} isOpen={isSkillsOpen} apparatus={apparatusName} routine={routine} filterUpdated={() => updateSkills()} selectSkill={handleSkillChosen} cancelChoice={() => setIsSkillsOpen(false)} />

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                    <button onClick={resetRoutine}>Clear Routine</button>
                </div>
                <DownloadPDFButton apparatus={apparatusName} routine={routine} routineResult={score} />
            </div>

            <div className="w-full min-w-full flex flex-col mt-4">
                {routine.map((element, index) => {
                    return (
                        <div key={index} className="mb-4 flex flex-row text-center items-center gap-8">
                            <p>{index + 1}</p>
                            {routine[index] ? (
                                <button className="truncate max-w-[50vw] min-w-[50vw] px-2 py-1 border rounded text-sm" onClick={() => {setIsSkillsOpen(true); skillFilterRef.current.chooseSkill(index)}}>{routine[index].name}</button>
                            ) : (
                                <button className="truncate max-w-[50vw] min-w-[50vw] px-2 py-1 border rounded text-sm" onClick={() => {setIsSkillsOpen(true); skillFilterRef.current.chooseSkill(index)}}>-- Select Skill --</button>
                            )}
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-500">Group</span>
                                <span>{routine[index] ? routine[index].group : "-"}</span>
                            </p>
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-500">Difficulty</span>
                                <span>{routine[index] ? (routine[index].invalid ? "N/A" : routine[index].difficulty.toFixed(1)) : "-"}</span>
                            </p>
                            <button className="items-center justify-center" disabled={!routine[index]} onClick={() => removeSkill(index)}>X</button>
                            {canConnect(index) ? (
                                <button style={{"width":"120px"}} onClick={() => connectSkills(index)}>{routine[index].connection ? "disconnect" : "connect"}</button>
                            ) : null}

                        </div>
                    );
                })}
            </div>
            <RoutineResult ref={scoreTableRef} apparatus={apparatusName} />

            <HandstandDismountForm ref={handstandDismountRef} isOpen={isHdstOpen} addSkill={placeHandstandDismount} handleClose={() => setIsHdstOpen(false)} />
        </div>
    );
};

export default RoutineBuilder;