import { useState, forwardRef, useImperativeHandle } from "react";

const HandstandDismountForm = forwardRef(({ isOpen, addSkill, handleClose }, ref) => {
    const [ skill, setSkill ] = useState(null);
    const [ index, setIndex ] = useState(-1); 
    const [ turns, setTurns ] = useState("No turns");
    const [ value, setValue ] = useState(0);

    const options = ["No turns", "3/3 travel", "w/450* turn", "3/3 travel w/450* turns"];
    const values = [0, 0.1, 0.1, 0.2];

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
        const newSkill = { ...skill };
        newSkill.difficulty = skill.difficulty + value;
        newSkill.name = skill.name + " + " +  turns;
        addSkill(index, newSkill);
        resetForm();
    };

    const resetForm = () => {
        setTurns("No turns");
        setValue(0);
    };

    const handleCancel = () => {
        resetForm();
        handleClose();
    };

    if (!isOpen) {
        return;
    }

    return (
        <div className="fixed inset-0 z-40 w-screen h-screen" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <div className="mx-auto fixed top-1/2 left-1/2 bg-[#242424] transform -translate-x-1/2 -translate-y-1/2 p-6 rounded shadow-lg z-50 text-center">
                <h3>Add Turns to dismount</h3>
                <select className="my-2" value={turns} onChange={handleChange}>
                    {options.map((option, index) => {
                        return (
                            <option key={index} value={option}>{option}</option>
                        );
                    })}
                </select>

                <p className="p-2">Dismount Value : {skill ? skill.difficulty.toFixed(1): 0}</p>
                <p className="p-2">New Value : {skill ? (skill.difficulty + value).toFixed(1) : 0}</p>
                <div className="flex flex-row gap-2 justify-center items-center">
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={addTurns}>Add</button>
                </div>
            </div>
        </div>
    );
});

export default HandstandDismountForm;