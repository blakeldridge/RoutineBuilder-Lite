import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import getSkills from "../utils/getSkills";

const SkillFilterForm = forwardRef(({ apparatus, filterUpdated }, ref) => {
    const skills = getSkills(apparatus);

    const [ groupFilter, setGroupFilter ] = useState(0);
    const [ difficultyFilter, setDifficultyFilter ] = useState(0);
    const [ nameFilter, setNameFilter ] = useState('');
    const [ filteredSkills, setFilteredSkills ] = useState(skills);

    const resetFilter = () => {
        setGroupFilter(0);
        setDifficultyFilter(0);
        setNameFilter('');
    };

    useImperativeHandle(ref, () => ({
        getFilteredSkills : () => {
            return filteredSkills;
        }
    }));

    useEffect(() => {
        const skillSet = skills.filter(skill => 
            (groupFilter == 0 || skill.group == groupFilter) && 
            (difficultyFilter == 0 || skill.difficulty == difficultyFilter) && 
            (nameFilter == '' || nameFilter.toLowerCase().split(" ").every(word => skill.name.toLowerCase().includes(word)))
        );
        setFilteredSkills(skillSet);
    }, [groupFilter, difficultyFilter, nameFilter]);

    useEffect(() => {
        filterUpdated();
    }, [filteredSkills])

    const handleSearch = (event) => {
        event.preventDefault();
    };

    return (
        <div className="flex flex-row justify-center items-center" style={{"gap":"1em", "margin":"1em"}}>
            <span>Filter Skills : </span>

            <div className="flex flex-col">
                <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
                    <option value={0}>All Groups</option>
                    <option value={1}>Group I</option>
                    <option value={2}>Group II</option>
                    <option value={3}>Group III</option>
                    <option value={4}>Group IV</option>
                </select>

                <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
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
            </div>

            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Search..." value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
                <button type="submit">Search</button>
            </form>

            <button onClick={resetFilter}>Clear Filters</button>
        </div>
    );
});

export default SkillFilterForm;