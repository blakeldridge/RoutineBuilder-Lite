import { useState, useEffect } from "react";
import { Apparatus } from "../utils/apparatus";
import { PommelSkills, PommelTypeSkills } from "../utils/skillTypes";
import { convertDifficultyLetterToValue } from "../utils/skillInfo";

const FlopForm = ({ isOpen, handleAddSkill }) => {
    const [ skills, setSkills ] = useState(["", "", "", "", ""]);
    const [ flopValue, setFlopValue ] = useState("N/A");
    const [ visibleDropdowns, setVisibleDropdowns ] = useState(3);
    const [ addDisabled, setAddDisabled ] = useState(true);
    const [ style, setStyle ] = useState("");

    const skillOptions = [
        ["Bertonceji", "Davtyan", "Circle", "DSB"],
        ["Circle", "DSB", "360 or 540 Russians", "720 or 960 Russians", "1080+ Russians"],
        ["Circle", "DSB", "180 or 270 Russians", "360 or 540 Russians", "720 or 960 Russians", "1080+ Russians", "DSA"],
        ["Circle", "DSB", "DSA"],
        ["Circle", "DSB", "DSA"],
    ];

    const handleSkillAdded = (index, skill) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = skill;
        setSkills(updatedSkills);

        calculateFlopValue();
    };

    const resetFlop = () => {
        setSkills(["", "", "", "", ""]);
    };
    
    const addFlop = () => {
        // get flop name
        const flopName = createFlopName();
        // create flop skill#
        const flop = {
            name: flopName,
            difficulty: convertDifficultyLetterToValue(flopValue),
            group : 2,
            apparatus: Apparatus.POMMEL,
            type: PommelSkills.FLOP,
            subtype : skills[0] === "Bertonceji" ||  skills[0] === "Davtyan" ? PommelTypeSkills.SOHN_BEZ_FLOP : "",
        };
        // call parent function to add skill
        handleAddSkill(flop)
    };

    const createFlopName = () => {
        const flopName = skills.map((name, skill) => {return name + " + "  + skill}, "");
        return flopName;
    };

    useEffect(() => {
        calculateFlopValue();
    }, [skills]);

    const calculateFlopValue = () => {
        let customFlop = skills.filter(skill => skill); // Filter out empty skills
        let flopStyle = "";

        const countCircles = customFlop.filter(skill => skill === "Circle").length;
        const countDSBs = customFlop.filter(skill => skill === "DSB").length;
        const hasDSA = customFlop.includes("DSA");

        // Initialize value
        let value = "Can not identify flop sequence.";

        // Calculate bertonceji or davtyan flops
        if ((customFlop[0] === "Bertonceji" || customFlop[0] === "Davtyan") && customFlop[1] === "Circle") {
            flopStyle += "sb";
            // Calculate for russian flops
            if (customFlop[2] === "180 or 270 Russians") {
                flopStyle += "ru";
                value = "E";
            } else if (customFlop[2] === "360 or 540 Russians") {
                flopStyle += "ru";
                value = "F";
            } else if (customFlop[2] === "720 or 960 Russians") {
                flopStyle += "ru";
                value = "G";
            } else if (customFlop[2] === "1080+ Russians") {
                flopStyle += "ru";
                value = "H";
            }
            // Calculate for stockli flops
            else if (countDSBs === 2) {
                flopStyle += "st";
                value = "F";
            } else if (countDSBs === 1) {
                flopStyle += "st";
                value = "E";
            }
        }
        // Calculate flops from circles or DSB
        else if (customFlop[0] === "Circle" || customFlop[0] === "DSB") {
            // Calculate for russian flops
            if (customFlop[1] === "Circle" || customFlop[1] === "DSB") {
                if (customFlop[2] === "180 or 270 Russians") {
                    flopStyle += "ru";
                    value = "D";
                } else if (customFlop[2] === "360 or 540 Russians") {
                    flopStyle += "ru";
                    value = "E";
                } else if (customFlop[2] === "720 or 960 Russians") {
                    flopStyle += "ru";
                    value = "F";
                } else if (customFlop[2] === "1080+ Russians") {
                    flopStyle += "ru";
                    value = "G";
                }
            } else {
                if (customFlop[1] === "360 or 540 Russians") {
                    flopStyle += "ru";
                    value = "D";
                } else if (customFlop[1] === "720 or 960 Russians") {
                    flopStyle += "ru";
                    value = "E";
                } else if (customFlop[1] === "1080+ Russians") {
                    flopStyle += "ru";
                    value = "F";
                }
            }

            if (countDSBs === 2) {
                if (countCircles > 0) {
                    flopStyle += "st";
                    value = "E";
                } else if (hasDSA) {
                    flopStyle += "st";
                    value = "D";
                }
            } else if (countDSBs === 1) {
                if (countCircles === 2 || (countCircles === 1 && hasDSA)) {
                    flopStyle += "st";
                    value = "D";
                }
            }
        }
        setStyle(flopStyle);
        setFlopValue(value);
    };

    if (!isOpen) {
        return;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 w-vw h-vh" style={{"backgroundColor":"black"}}>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg z-50" style={{"backgroundColor":"#222222"}}>
                {skillOptions.map((options, index) => {
                    return (
                        <select key={index} value={skills[index]} onChange={(e) => handleSkillAdded(index, e.target.value)}>
                            <option value={""}>-- Select --</option>
                            {options.map((option, i) => {
                                return (
                                    <option key={i} value={option}>{option}</option>
                                );
                            })}
                        </select>
                    );
                })}

                <p>Flop Value : {flopValue}</p>

                <div>
                    <button onClick={resetFlop}>Clear</button>
                    <button onClick={addFlop}>Add Flop</button>
                </div>
            </div>
        </div>
    );
};

export default FlopForm;