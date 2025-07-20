import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import scoreRoutine from '../utils/calculateDifficulty';
import { useState, useRef  } from 'react';
import { PommelSkills, RingsSkills } from '../utils/skillTypes';
import RoutineResult from './routineResult';
import SkillFilterForm from './skillFilterForm';
import HandstandDismountForm from './handstandDismountForm';
import DownloadPDFButton from './downloadButton';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            routine[index].connectionColour = null;
        } else {
            routine[index].connection = true;
        }

        let connectionColours = ["#6525ae", "#3f37c9", "#b052ef", "#4895ef"];

        for (let i = 0; i < routine.length; i++) {
            let skill = routine[i];
            if (skill && skill.connection) {
                if (i - 1 >= 0 && routine[i - 1]?.connection){
                    skill.connectionColour = routine[i - 1].connectionColour;
                } else {
                    skill.connectionColour = connectionColours[0];
                    connectionColours.splice(0, 1);
                }
            }
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
        if (index - 1 >= 0 && routine[index - 1]?.connection) {
            routine[index - 1].connection = false;
        }
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
            return routine[index] && index + 1 < routine.length && routine[index + 1] && RingsSkills[routine[index].type] == RingsSkills.YAMA_JON && RingsSkills[routine[index + 1].type] == RingsSkills.SWING_HANDSTAND;
        } else if (apparatusName == Apparatus.HBAR) {
            return routine[index] && index + 1 < routine.length && routine[index + 1] && routine[index].group != 4 && routine[index + 1].group != 4 && 
            ((routine[index].group == 2 && routine[index].difficulty >= 0.4 && routine[index + 1].group != 2 && routine[index + 1].difficulty >= 0.4) || 
            (routine[index].group != 2 && routine[index].difficulty >= 0.4 && routine[index + 1].group == 2 && routine[index + 1].difficulty >= 0.4) || 
            (routine[index].group == 2 && routine[index + 1].group == 2));
        } else {
            return false;
        }
    };
    
    const handleSkillChosen = (skill, index) => {
        setIsSkillsOpen(false);

        if (apparatusName == Apparatus.POMMEL && PommelSkills[skill.type] == PommelSkills.HANDSTAND_DISMOUNT && skill.id != 95 && skill.id != 94) {
            handstandDismountRef.current.setThisSkill(index, skill);
            setIsHdstOpen(true);
        } else {
            routine[index] = skill;

            calculateScore();
        }      
    };

    const downloadRoutinePopup = (fileName) => {
        toast.success(`Successfully saved routine to ${fileName}`, { autoClose : 1000 })
    };

    return (
        <div>
            <ToastContainer position="bottom-center" hideProgressBar="true" toastStyle={{backgroundColor: "green", color: "white"}}/>
            <button className="flex justify-start m-2 md:m-4 md:m-0 md:absolute md:top-5 md:left-5  p-4" onClick={() => navigate('/')}>Return</button>
            <h1 className="m-auto">{apparatusName}</h1>
            <SkillFilterForm ref={skillFilterRef} isOpen={isSkillsOpen} apparatus={apparatusName} routine={routine} filterUpdated={() => updateSkills()} selectSkill={handleSkillChosen} cancelChoice={() => setIsSkillsOpen(false)} />

            <div className="flex flex-row gap-4 mt-4 max-w-[90vw] lg:max-w-[65vw] mx-auto justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                    <button onClick={resetRoutine}>Clear Routine</button>
                </div>
                <DownloadPDFButton apparatus={apparatusName} routine={routine} routineResult={score} downloadPopup={(filename) => downloadRoutinePopup(filename)} />
            </div>
            <div className="w-full min-w-full flex flex-col mt-4 lg:mx-auto items-center">
                {routine.map((element, index) => (
                    <div key={index} className="mb-4 w-full flex flex-row justify-between items-center max-w-[90vw] lg:max-w-[65vw] mx-auto">
                        <div className="flex flex-row text-center items-center gap-2 md:gap-4 lg:gap-8 flex-grow justify-center">
                            <p className={`${routine[index] && routine[index].invalid ? "font-semibold !text-red-500 text-lg" : 
                            (routine[index] && routine[index].connection) || (index - 1 >= 0 && routine[index - 1] && routine[index - 1].connection) ? `font-semibold` : "" }`}
                            
                            style={{
                                color: routine[index] ? routine[index].invalid ? "red" : routine[index].connection ? routine[index].connectionColour : index - 1 >= 0 && routine[index - 1] && routine[index - 1].connection ? routine[index - 1].connectionColour : "" : "",
                            }}>
                                {routine[index] && routine[index].invalid ? "!": index + 1}
                            </p>
                            <button
                                className={`${routine[index] && routine[index].invalid  ? "!border-2 !border-solid !border-red-500" : 
                                    (routine[index] && routine[index].connection) || (index - 1 >= 0 && routine[index - 1] && routine[index - 1].connection) ? `!border-1 !border-solid` : ""} truncate max-w-[50vw] md:max-w-[60vw] lg:max-w-[50vw] min-w-[50vw] md:min-w-[60vw] lg:min-w-[50vw] px-2 py-1 rounded text-sm`}
                                
                                style={{
                                    borderColor: routine[index] ? routine[index].invalid ? "red" : routine[index].connection ? routine[index].connectionColour : index - 1 >= 0 && routine[index - 1] && routine[index - 1].connection ? routine[index - 1].connectionColour : "" : "",
                                }}
                                onClick={() => {
                                    setIsSkillsOpen(true);
                                    skillFilterRef.current.chooseSkill(index);
                                }}
                            >
                                {routine[index] ? routine[index].name : "-- Select Skill --"}
                            </button>
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-500">Group</span>
                                <span>{routine[index] ? routine[index].group : "-"}</span>
                            </p>
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-500">Difficulty</span>
                                <span>{routine[index] ? (routine[index].invalid ? "N/A" : routine[index].difficulty.toFixed(1)) : "-"}</span>
                            </p>
                            <button
                                className="flex items-center justify-center w-[10px] md:w-auto"
                                disabled={!routine[index]}
                                onClick={() => removeSkill(index)}
                            >
                                X
                            </button>
                            {!canConnect(index) && (apparatusName === Apparatus.FLOOR || apparatusName === Apparatus.RINGS || apparatusName === Apparatus.HBAR) ? (
                                <div className="w-[30px]"></div>
                            ) : null}
                        </div>
                            <div className="flex-shrink-0 ml-1 md:ml-2">
                            {canConnect(index) ? (
                                <div className="hidden lg:flex">
                                    <button className="w-[90px] border px-2 py-1 rounded text-sm flex justify-center" onClick={() => connectSkills(index)}>
                                        {routine[index].connection ? "disconnect" : "connect"}
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden lg:flex w-[90px]"></div> // placeholder
                            )}

                            {/* Mobile button */}
                            {canConnect(index) && (
                                <div className="lg:hidden flex">
                                    <button className="w-[20px] border w-[10px] md:w-auto py-1 rounded text-sm flex justify-center"  onClick={() => connectSkills(index)}>
                                        {routine[index].connection ? "-" : "+"}
                                    </button>
                                </div>
                            )}
                            </div>
                    </div>
                ))}
            </div>


            <RoutineResult ref={scoreTableRef} apparatus={apparatusName} />

            <HandstandDismountForm ref={handstandDismountRef} isOpen={isHdstOpen} addSkill={placeHandstandDismount} handleClose={() => setIsHdstOpen(false)} />
        </div>
    );
};

export default RoutineBuilder;