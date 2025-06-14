import { useState, forwardRef, useImperativeHandle } from "react";

const HandstandDismountForm = forwardRef(({ isOpen, addSkill }, ref) => {
    const [ skill, setSkill ] = useState(null);
    const [ index, setIndex ] = useState(-1); 
    const [ turns, setTurns ] = useState("");
    const [ value, setValue ] = useState(0);

    const options = ["", "No turns", "3/3 travel", "w/450* turn", "3/3 travel w/450* turns"];
    const values = [0, 0, 0.1, 0.1, 0.2];

    useImperativeHandle(ref, () => ({
        setThisSkill : (index, skill) => {
            setSkill(skill);
            setIndex(index);
        }
    }));

    const handleChange = (e) => {
        const newTurn = e.target.value;
        setTurns(newTurn);
        const newValue = values[options.indexOf(newTurn)];
        setValue(newValue);
    };

    const addTurns = () => {
        skill.difficulty = skill.difficulty + value;
        skill.name = skill.name + turns;
        addSkill(index, skill);
    };

    if (!isOpen) {
        return;
    }

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg z-50" style={{"backgroundColor":"#222222"}}>
            <h3>Add Turns to dismount</h3>
            <select value={turns} onChange={handleChange}>
                {options.map((option, index) => {
                    return (
                        <option key={index} value={option}>{option}</option>
                    );
                })}
            </select>

            <p>The value of this dismount : {skill ? skill.difficulty + value : 0}</p>
            <div>
                <button>Cancel</button>
                <button onClick={addTurns}>Add</button>
            </div>
        </div>
    );
});

export default HandstandDismountForm;