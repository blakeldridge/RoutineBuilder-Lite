import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import getSkills from "../utils/getSkills";
import { Apparatus } from "../utils/apparatus";
import FlopForm from "./flopForm";

const SkillFilterForm = forwardRef(({ isOpen, apparatus, filterUpdated, selectSkill, cancelChoice }, ref) => {
    const [ skills, setSkills ] = useState(getSkills(apparatus))

    const [ groupFilter, setGroupFilter ] = useState(0);
    const [ difficultyFilter, setDifficultyFilter ] = useState(0);
    const [ nameFilter, setNameFilter ] = useState('');
    const [ filteredSkills, setFilteredSkills ] = useState(skills);
    const [ skillIndex, setSkillIndex ] = useState(-1);
    const [ isFlopFormOpen, setIsFlopFormOpen ] = useState(false);

    const resetFilter = () => {
        setGroupFilter(0);
        setDifficultyFilter(0);
        setNameFilter('');
    };

    useImperativeHandle(ref, () => ({
        getFilteredSkills : () => {
            return filteredSkills;
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
        if (apparatus == Apparatus.POMMEL && skill.group == 4) {
            
        }
        skill.id = skills.length + 1;
        setSkills([skill, ...skills]);
        setIsFlopFormOpen(false);
    };

    const checkSkillExistsByName = (skillName) => {
        let skillExists = false;
        for (let i = skills.length - 1; i >= 0; i--) {
            if (skillName == skills[i].name) {
                skillExists = true;
                break;
            }
        }  

        return skillExists;
    };

    useEffect(() => {
        filterSkills();
    }, [groupFilter, difficultyFilter, nameFilter, skills]);

    useEffect(() => {
        filterUpdated();
    }, [filteredSkills])

    const filterSkills = () => {
        const skillSet = skills.filter(skill => 
            (groupFilter == 0 || skill.group == groupFilter) && 
            (difficultyFilter == 0 || skill.difficulty == difficultyFilter) && 
            (nameFilter == '' || nameFilter.toLowerCase().split(" ").every(word => skill.name.toLowerCase().includes(word)))
        );
        setFilteredSkills(skillSet);
    };

    const handleSearch = (event) => {
        event.preventDefault();
    };

    if (!isOpen) {
        return;
    }

    return (
        <div className="flex flex-col h-screen fixed inset-0 z-40 w-screen" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <button onClick={cancelChoice} className="flex-none m-2 w-12 h-12">X</button>
            <div className="flex-none h-16 flex flex-row justify-center items-center gap-4 p-4">

                {apparatus === Apparatus.POMMEL ? (
                    <button onClick={() => setIsFlopFormOpen(true)}>Create Flop</button>
                ) : null}

                <div className="flex flex-row gap-2">
                    <select className="w-full min-w-[10-rem] sm:min-w-[5rem] md:min-w-[10rem] truncate px-2 py-1 border border-gray-300 rounded text-sm" value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
                        <option value={0}>All Groups</option>
                        <option value={1}>Group I</option>
                        <option value={2}>Group II</option>
                        <option value={3}>Group III</option>
                        <option value={4}>Group IV</option>
                        {apparatus == Apparatus.VAULT && (
                            <option value={5}>Group V</option>
                        )}
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

                <form className="flex flex-row gap-2">
                    <input type="text" placeholder="Search..." value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
                </form>

                <button className="truncate" onClick={resetFilter}>Clear Filters</button>
            </div>

            <div className="flex flex-col flex-grow gap-1 items-center overflow-y-auto">
                {filteredSkills.map((skill, index) => {
                    return (
                        <button key={skill.id} onClick={() => selectSkill(skill, skillIndex)} className="flex flex-row gap-2 max-w-[50%] min-w-[50%] rounded bg-gray-600 text-center">
                            <p className="w-[15%]">Group: {skill.group}</p>
                            <p className="w-[65%] text-left">{skill.name}</p>
                            <p className="w-[10%]">{skill.difficulty}</p>
                        </button>
                    );
                })}
            </div>

            <FlopForm isOpen={isFlopFormOpen} handleAddSkill={(skill) => addSkill(skill)} skillExists={checkSkillExistsByName} handleClose={() => setIsFlopFormOpen(false)}/>
        </div>
    );
});

export default SkillFilterForm;