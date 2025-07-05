import { useState, useEffect } from "react";
import { Apparatus } from "../utils/apparatus";
import { PommelSkills, PommelTypeSkills } from "../utils/skillTypes";
import { convertDifficultyLetterToValue } from "../utils/skillInfo";

const FlopForm = ({ isOpen, handleAddSkill, skillExists, handleClose }) => {
    const [ skills, setSkills ] = useState(["", "", "", ""]);
    const [ flopValue, setFlopValue ] = useState("N/A");
    const [ visibleDropdowns, setVisibleDropdowns ] = useState(3);
    const [ addDisabled, setAddDisabled ] = useState(true);
    const [ style, setStyle ] = useState("");
    const [ isAlertOpen, setAlertOpen ] = useState(false);
    const [ isDisabled, setIsDisabled ] = useState(false);

    const skillOptions = [
        ["Bertonceji", "Davtyan", "Circle", "DSB"],
        ["Circle", "DSB", "360 or 540 Russians", "720 or 960 Russians", "1080+ Russians"],
        ["Circle", "DSB", "180 or 270 Russians", "360 or 540 Russians", "720 or 960 Russians", "1080+ Russians", "DSA"],
        ["Circle", "DSB", "DSA"],
    ];

    const handleSkillAdded = (index, skill) => {
        setAlertOpen(false);
        const updatedSkills = [...skills];
        updatedSkills[index] = skill;
        setSkills(updatedSkills);

        calculateFlopValue();
    };

    const resetFlop = () => {
        setAlertOpen(false);
        setSkills(["", "", "", ""]);
    };
    
    const addFlop = () => {
        // get flop name
        const flopName = createFlopName();

        if (skillExists(flopName)) {
            setAlertOpen(true);
        } else {
            // create flop skill#
            const flop = {
                name: flopName,
                difficulty: flopValue,
                group : 2,
                apparatus: Apparatus.POMMEL,
                type: "FLOP",
                subtype : skills[0] === "Bertonceji" ||  skills[0] === "Davtyan" ? "SOHN_BEZ_FLOP" : "",
            };
            // call parent function to add skill
            handleAddSkill(flop);
            resetFlop();
        }
    };

    const handleCancel = () => {
        resetFlop();
        handleClose();
    };

    const createFlopName = () => {
        const flopName = skills.filter(skill => skill != "").slice(1).reduce((name, skill) => {return name + " + "  + skill}, skills[0]);
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
        let value = "N/A";

        // Calculate bertonceji or davtyan flops
        if ((customFlop[0] === "Bertonceji" || customFlop[0] === "Davtyan") && customFlop[1] === "Circle") {
            flopStyle += "sb";
            // Calculate for russian flops
            if (customFlop[2] === "180 or 270 Russians") {
                flopStyle += "ru";
                value = 0.5;
            } else if (customFlop[2] === "360 or 540 Russians") {
                flopStyle += "ru";
                value = 0.6;
            } else if (customFlop[2] === "720 or 960 Russians") {
                flopStyle += "ru";
                value = 0.7;
            } else if (customFlop[2] === "1080+ Russians") {
                flopStyle += "ru";
                value = 0.8;
            }
            // Calculate for stockli flops
            else if (countDSBs === 2) {
                flopStyle += "st";
                value = 0.6;
            } else if (countDSBs === 1) {
                flopStyle += "st";
                value = 0.5;
            }
        }
        // Calculate flops from circles or DSB
        else if (customFlop[0] === "Circle" || customFlop[0] === "DSB") {
            // Calculate for russian flops
            if (customFlop[1] === "Circle" || customFlop[1] === "DSB") {
                if (customFlop[2] === "180 or 270 Russians") {
                    flopStyle += "ru";
                    value = 0.4;
                } else if (customFlop[2] === "360 or 540 Russians") {
                    flopStyle += "ru";
                    value = 0.5;
                } else if (customFlop[2] === "720 or 960 Russians") {
                    flopStyle += "ru";
                    value = 0.6;
                } else if (customFlop[2] === "1080+ Russians") {
                    flopStyle += "ru";
                    value = 0.7;
                }
            } else {
                if (customFlop[1] === "360 or 540 Russians") {
                    flopStyle += "ru";
                    value = 0.4;
                } else if (customFlop[1] === "720 or 960 Russians") {
                    flopStyle += "ru";
                    value = 0.5;
                } else if (customFlop[1] === "1080+ Russians") {
                    flopStyle += "ru";
                    value = 0.6;
                }
            }

            if (countDSBs === 2) {
                if (countCircles > 0) {
                    flopStyle += "st";
                    value = 0.5;
                } else if (hasDSA) {
                    flopStyle += "st";
                    value = 0.4;
                }
            } else if (countDSBs === 1) {
                if (countCircles === 2 || (countCircles === 1 && hasDSA)) {
                    flopStyle += "st";
                    value = 0.4;
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
        <div className="fixed inset-0 z-40 w-screen h-screen" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <div className="fixed top-1/2 left-1/2 bg-[#242424] transform -translate-x-1/2 -translate-y-1/2 p-6 rounded shadow-lg z-50">
                {skillOptions.map((options, index) => {
                    return (
                        <select className="mb-2" key={index} value={skills[index]} onChange={(e) => handleSkillAdded(index, e.target.value)}>
                            <option value={""}>-- Select --</option>
                            {options.map((option, i) => {
                                return (
                                    <option key={i} value={option}>{option}</option>
                                );
                            })}
                        </select>
                    );
                })}

                <h5 className="p-2">Flop Value : {flopValue}</h5>
                {isAlertOpen ? (
                    <div>
                        <h6>Flop Already Exits!</h6>
                        <p>Please try a different combination of skills.</p>
                    </div>
                ) : null }

                <div className="flex flex-row items-center justify-center gap-2">
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={resetFlop}>Clear</button>
                    <button disabled={flopValue == "N/A"} onClick={addFlop}>Add Flop</button>
                </div>
            </div>
        </div>
    );
};

export default FlopForm;