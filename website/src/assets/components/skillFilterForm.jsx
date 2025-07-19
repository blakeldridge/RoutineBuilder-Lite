import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import getSkills from "../utils/getSkills";
import { Apparatus } from "../utils/apparatus";
import FlopForm from "./flopForm";
import getGroupNames from "../utils/getGroupNames";

const skillSynonymMap = {
    "fwdforwardfront": "forward",
    "backbackwardbwd": "backward",
    "full":"1/1",
    "half":"1/2",
    "double":"2/1",
    "triple":"3/1",
    "quadruple":"4/1",
    "y-scale": "standing scale",
    "balance": "standing scale",
    "arabesque": "standing scale",
    "flick to support": "jump backwards to front support",
    "flip": "salto",
    "shear": "scissor",
    "czech": "czechkehre",
    "check": "czechkehre",
    "cheque": "czechkehre",
    "sohn": "kehr",
    "stockli": "kehre",
    "tong fei": "vammen",
    "planche": "supportscale",
    "maltese": "swallow",
    "swallow": "maltese",
    "victorian": "inverted swallow",
    "undersomi": "felge",
    "turn": "pirouette",
    "longswing": "giant",
    "giantswing": "giant",
    "upstart": "glide kip",
    "short clear": "shoot up",
    "clear": "shoot up",
    "stalder": "stoop",
    "adler": "stoop",
    "endo": "stoop",
    "squat": "adler",
    "blind": "1/2 turn",
    "top": "1/2 turn",
    "tkatchev": "vault backwards",
    "kaz":"kasamatsu"
};

const SkillFilterForm = forwardRef(({ isOpen, apparatus, routine, filterUpdated, selectSkill, cancelChoice }, ref) => {
    const [ skills, setSkills ] = useState(getSkills(apparatus))

    const [ groupFilter, setGroupFilter ] = useState(0);
    const [ difficultyFilter, setDifficultyFilter ] = useState(0);
    const [ nameFilter, setNameFilter ] = useState('');
    const [ filteredSkills, setFilteredSkills ] = useState(skills);
    const [ skillIndex, setSkillIndex ] = useState(-1);
    const [ isFlopFormOpen, setIsFlopFormOpen ] = useState(false);
    const [ listOrder, setListOrder ] = useState("asc-d");

    const resetFilter = () => {
        setGroupFilter(0);
        setDifficultyFilter(0);
        setNameFilter('');
    };

    useImperativeHandle(ref, () => ({
        getFilteredSkills : () => {
            return filteredSkills;
        },

        filterSkills : () => {
            filterSkills();
        },

        chooseSkill : (index) => {
            setSkillIndex(index);
        },

        addSkill : (skill) => {
            skill.id = skills.length + 1;
            setSkills([skill, ...skills]);
        },

        skillExistsByName : (skillName) => {
            let skillExists = false;
            for (let i = skills.length - 1; i >= 0; i--) {
                if (skillName == skills[i].name) {
                    skillExists = true;
                    break;
                }
            }  

            return skillExists;
        }
    }));

    const addSkill = (skill) => {
        selectSkill(skill, skillIndex);
        filterSkills();
    };

    const checkSkillExistsByName = (skillName) => {
        let skillExists = false;
        for (let i = routine.length - 1; i >= 0; i--) {
            if (routine[i] && skillName == routine[i].name) {
                skillExists = true;
                break;
            }
        }  

        return skillExists;
    };

    useEffect(() => {
        filterSkills();
    }, [groupFilter, difficultyFilter, nameFilter, skills, listOrder]);

    useEffect(() => {
        filterUpdated();
    }, [filteredSkills])

    const filterSkills = () => {        
        const skillSet = skills.filter(skill => 
            (groupFilter == 0 || skill.group == groupFilter) && 
            (difficultyFilter == 0 || skill.difficulty == difficultyFilter) && 
            (nameFilter == '' || nameFilter.toLowerCase().split(/\b/).every(word => skill.name.toLowerCase().includes(word) || Object.keys(skillSynonymMap).some(key => key.includes(word)) && skill.name.toLowerCase().includes(skillSynonymMap[Object.keys(skillSynonymMap).filter(key => key.includes(word))[0]]))) &&
            (!routine.some(s => s && s.id === skill.id))
        );
        setFilteredSkills(sortSkills(skillSet));
    };

    const sortSkills = (skills) => {
        switch(listOrder) {
            case "asc-d":
                return skills.sort((skill1, skill2) => skill1.difficulty - skill2.difficulty);
            case "desc-d":
                return skills.sort((skill1, skill2) => skill2.difficulty - skill1.difficulty);
            case "asc-g":
                return skills.sort((skill1, skill2) => skill1.group - skill2.group);
            case "desc-g":
                return skills.sort((skill1, skill2) => skill2.group - skill1.group);
            case "asc-a":
                return skills.sort((skill1, skill2) => skill1.name.localeCompare(skill2.name, undefined, {sensitivity:"base"}));
            case "desc-a":
                return skills.sort((skill1, skill2) => skill2.name.localeCompare(skill1.name, undefined, {sensitivity:"base"}));
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
    };

    const addFlop = (skill) => {
        setIsFlopFormOpen(false);
        addSkill(skill);
    };

    if (!isOpen) {
        return;
    }

    return (
        <div className="flex flex-col h-screen fixed inset-0 z-40 w-screen" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <button onClick={cancelChoice} className="absolute top-5 left-5 md:flex md:flex-none md:m-2 w-12 h-12">X</button>
            <div className="flex-none mt-16 md:mt-16 md:h-16 flex flex-col md:flex-row justify-center items-center gap-4 p-4">
                <div className="flex flex-row gap-2">
                    <select className="w-full min-w-[10-rem] sm:min-w-[5rem] md:min-w-[10rem] truncate px-2 py-1 border border-gray-300 rounded text-sm" value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
                        <option value={0}>All Groups</option>
                        {getGroupNames(apparatus).map((groupName, index) => (
                            <option value={index + 1}>{groupName}</option>
                        ))}
                    </select>

                    {apparatus !== Apparatus.VAULT && (
                        <select className="w-full min-w-[10-rem] sm:min-w-[5rem] md:min-w-[10rem] truncate px-2 py-1 border border-gray-300 rounded text-sm" value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
                            <option value={0}>All Difficulties</option>
                            <option value={0.1}>A</option>
                            <option value={0.2}>B</option>
                            <option value={0.3}>C</option>
                            <option value={0.4}>D</option>
                            <option value={0.5}>E</option>
                            <option value={0.6}>F</option>
                            <option value={0.7}>G</option>
                            <option value={0.8}>H</option>
                            <option value={0.9}>I</option>
                            <option value={1.0}>J</option>
                        </select>
                    )}
                </div>
                <div className="flex flex-row justify-center gap-2">
                    <form className="flex flex-row gap-2 w-full">
                        <input type="text" placeholder="Search..." value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
                    </form>

                    <button className="truncate w-full" onClick={resetFilter}>Clear Filters</button>
                </div>
            </div>
            <div className="flex-none w-full lg:max-w-[50%] lg:min-w-[50%] m-auto h-16 flex flex-row justify-between items-center p-4">

                {apparatus === Apparatus.POMMEL ? (
                    <button onClick={() => setIsFlopFormOpen(true)}>Create Flop</button>
                ) : <div></div>}

                <div className="flex items-center gap-2">
                    <p>Sort: </p>
                    <select className="w-full min-w-[10-rem] sm:min-w-[5rem] md:min-w-[10rem] truncate px-2 py-1 border border-gray-300 rounded text-sm" value={listOrder} onChange={(event) => setListOrder(event.target.value)}>
                        <option value={"asc-d"}>Difficulty: low to high</option>
                        <option value={"desc-d"}>Difficulty: high to low</option>
                        <option value={"asc-g"}>Group: 1-4</option>
                        <option value={"desc-g"}>Group: 4-1</option>
                        <option value={"asc-a"}>Alphabetical: a-z</option>
                        <option value={"desc-a"}>Alphabetical: z-a</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col flex-grow gap-1 mx-5 lg:mx-0 items-center overflow-y-auto">
                {filteredSkills.map((skill, index) => {
                    return (
                        <button key={skill.id} onClick={() => addSkill(skill)} className="flex flex-row gap-2 w-full lg:max-w-[50%] lg:min-w-[50%] rounded bg-gray-600 text-center">
                            <p className="w-[15%]">Group: {skill.group}</p>
                            <p className="w-[65%] text-left">{skill.name}</p>
                            <p className="w-[10%]">{skill.difficulty}</p>
                        </button>
                    );
                })}
            </div>

            <FlopForm isOpen={isFlopFormOpen} handleAddSkill={(skill) => addFlop(skill)} skillExists={checkSkillExistsByName} handleClose={() => setIsFlopFormOpen(false)}/>
        </div>
    );
});

export default SkillFilterForm;