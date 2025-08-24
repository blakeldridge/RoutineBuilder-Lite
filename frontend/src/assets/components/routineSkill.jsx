const RoutineSkill = ({ skill }) => {
    return (
        <div>
            <select key={index} id={`select-${index}`} value={element} onChange={(event) => handleEditRoutine(index, event)}>
                <option value={null}>-- Select --</option>
                {filteredSkills.map(((skill, index) => (
                    <option key={index} value={JSON.stringify(skill)}>{skill.name}</option>
                )))}
            </select>
        </div>
    );
};

export default RoutineSkill;