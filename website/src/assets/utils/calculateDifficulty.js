import { Apparatus } from "./apparatus";
import { FloorSkills, PommelSkills, PommelTypeSkills, RingsSkills, PbarSkills, HbarSkills } from "./skillTypes";

const SKILL_GROUP_LIMIT = 4;

const roundTo = (num, places) =>
  Math.round(num * 10 ** places) / 10 ** places;

export default function scoreRoutine(routine, apparatus) {   
    // routine : List of Skill Objects

    // Calculate the routine based on apparatus
    // each apparatus has a slightly different rule set
    switch (apparatus) {
        case Apparatus.FLOOR:
            return scoreFloor(routine);
        case Apparatus.POMMEL:
            return scorePommel(routine);
        case Apparatus.RINGS:
            return scoreRings(routine);
        case Apparatus.VAULT:
            return scoreVault(routine);
        case Apparatus.PBAR:
            return scorePbar(routine);
        case Apparatus.HBAR:
            return scoreHbar(routine);
        default:
            return null;
    }
};

// Function to calculate the starting execution of the routine
function calculateExecution(routine) {
    // filter out invalid skills or non-existing skills
    const numberOfSkills = routine.filter((skill) => skill !== null && !skill.invalid).length
    if (numberOfSkills >= 6){
        return 10.0;
    } else if (numberOfSkills == 0) {
        return 0.0;
    } else {
        return numberOfSkills + 2.0;
    }
}

// Function to calculate the total value of all skills combined
function calculateTotal(routine) {
    // Add all skill's difficulty values together
    const difficulty = routine.reduce((total, skill) => {
        let d = (!skill || skill.invalid) ? 0 : skill.difficulty;
        return total + d;
    }, 0);

    return roundTo(difficulty, 2);
}

// Function to count how skills are in each skill group
function countGroups(routine) {
    let groups = [0, 0, 0, 0];
    routine.map((skill) => {
        if (skill) {
            groups[skill.group - 1] = groups[skill.group - 1] + 1;
        }
    });
    return groups;
}

// Function to calculate the highest value skill in each group
function calculateGroups(routine) {
    let groups = [0, 0, 0, 0];
    for (let i = 0; i < routine.length; i++) {
        // skip uncounted skills
        if (routine[i] == null || routine[i].invalid) {
            continue;
        }
        // replace highest difficulty if new skill is bigger
        let skillGroup = routine[i].group - 1;
        if (routine[i].difficulty > groups[skillGroup]) {
            groups[skillGroup] = routine[i].difficulty;
        }
    }
    return groups;
}

// Function to make skills invalid if they fall under the following:
//  - Too many skills in a specific group
//  - Come after the dismount
function invalidateGroups(routine, apparatus) {
    const groups = countGroups(routine);

    // Floor has no dismount, disregard for rule 2
    if (apparatus !== Apparatus.FLOOR) {
        const dismountIndex = routine.findIndex(skill => skill && skill.group == 4);
        if (dismountIndex != -1) {
            for (let i = dismountIndex + 1; i < routine.length; i++) {
                if (routine[i]) {
                    routine[i].invalid = true;
                }
            }
        }
    }

    // Invalidate the smallest valued elements of each group, if more than 4 elements in the group
    for (let i = 0; i < groups.length; i++) {
        let currentGroup = i + 1;
        let hbarCondition = false;
        // for high bar, if 2 flights are connected, you can have 5 elements in group 3
        if (currentGroup == 2 && groups[i] == 5 && apparatus == Apparatus.HBAR) {
            const flightElements = routine.filter(skill => skill.group == 2);
            const connectedTotal = routine.reduce((total, skill) => {
                if (skill.connection) {
                    total += 1;
                }
                return total;
            }, 0);
            if (connectedTotal >= 2) {
                hbarCondition = true;
            }
        }

        // if we exceed 4 elements in one group, make lowest skills invalid
        if (groups[i] > SKILL_GROUP_LIMIT && !hbarCondition) {
            const invalidSkills = groups[i] - SKILL_GROUP_LIMIT;
            for (let j = 0; j < invalidSkills; j++) {
                // make lowest valued skill invalid
                const lowestSkill = routine.reduce((lowest, skill) => {
                    if (skill && !skill.invalid) {
                        return skill.group == currentGroup && skill.difficulty < lowest.difficulty ? skill : lowest;
                    } else {
                        return lowest;
                    }
                }, {"difficulty":2});
                let index = routine.findIndex(skill => skill == lowestSkill);
                routine[index].invalid = true;
            }
        }
    }
}

// Function to calculate a floor routine
function scoreFloor(routine) {
    let corrections = [];
    routine = routine.map(skill => {
        if (skill && skill.hasOwnProperty("invalid")) {
            delete skill.invalid;
        }
        return skill;
    })
    // mark skills as invalid / uncounted if they violate the rules
    invalidateGroups(routine, Apparatus.FLOOR);
    routine = routine.filter(skill => skill != null);

    // add any uncounted skills to corrections
    for (let i = 0; i < routine.length; i++) {
        if (routine[i].invalid) {
            corrections.push(`Skill ${i + 1} is not counted due to having more than 4 skills in group ${routine[i].group}`);
        }
    }

    // special repetitions
    // cannot do more than 1 strength skills
    const strengthSkills = routine.filter(skill => FloorSkills[skill.type] == FloorSkills.STRENGTH && !skill.invalid); 
    if (strengthSkills.length > 1) {
        let maxSkill = strengthSkills.reduce((max, skill) => {
            return skill.difficulty > max.difficulty ? skill : max;
        });
        routine.map((skill, index) => {
            if (skill && !skill.invalid && (FloorSkills[skill.type] == FloorSkills.STRENGTH && skill.id != maxSkill.id)) {
                skill.invalid = true;
                corrections.push(`Skill ${index + 1} is not counted due to too many strength elements performed`);
            }
        });
    }

    // cannot do more than 1 circle skill
    const circleSkills = routine.filter(skill => FloorSkills[skill.type] == FloorSkills.CIRCLE);
    if (circleSkills.length > 1) {
        let maxSkill = circleSkills.reduce((max, skill) => {
            return skill.difficulty > max.difficulty ? skill : max;
        });
        routine.map((skill, index) => {
            if (skill && !skill.invalid && (FloorSkills[skill.type] == FloorSkills.CIRCLE && skill.id != maxSkill.id)) {
                skill.invalid = true;
                corrections.push(`Skill ${index + 1} is not counted due to too many circle elements performed`);
            }
        });
    }

    // calculate the routine score

    const execution = calculateExecution(routine);
    const difficulty = calculateTotal(routine);
    const groups = calculateGroups(routine);

    if (execution < 10) {
        corrections.push("Need to have 6+ skills in order to receive full execution.")
    }

    // calculate the requirements
    let requirements = 0;

    // any skill in group 1 gains 0.5
    if (groups[0] > 0) {
        requirements += 0.5;
    } else {
        corrections.push("Add a group I element to fill requirement (+0.5)");
    }

    // D+ skills gain 0.5, <D gains partial requirement in groups 2-4
    for (let i = 1; i < groups.length; i++) {
        if (groups[i] >= 0.4) {
            requirements += 0.5;
        } else if (groups[i] > 0) {
            requirements += 0.3;
            corrections.push(`Group ${i + 1} only gains partial requirement, improve to a D+ rated skill (+0.2)`);
        } else {
            corrections.push(`Add a group ${i + 1} element to fill requirement (+0.5)`)
        }
    }

    if (groups[3] < 0.3) {
        corrections.push("Improve your dimount to a C+ to be able to get stick bonus.");
    }
    
    // Calculate bonus
    let bonus = 0;
    for (let i = 0; i < routine.length; i++) {
        // cannot connect to invalid skill
        if (routine[i].invalid || routine[i] == null) {
            continue;
        } else if (routine[i].connection) {
            // cannot connect at end of routine / to invalid skill
            if (i + 1 >= routine.length || routine[i + 1].invalid || routine[i + 1] == null){
                continue;
            }
            let skill1 = routine[i];
            let skill2 = routine[i + 1];

            // check if skills are valid connections (twisting salto into non-twisting)
            if (skill1.type == FloorSkills.SINGLE_TWIST && skill2.type == FloorSkills.SINGLE_TWIST) {
                continue;
            }
            // check for 0.1 connection
            if (skill1.difficulty >= 0.4 && skill2.difficulty >= 0.2 && skill2.difficulty < 0.4||
                skill1.difficulty >= 0.2 && skill1.difficulty < 0.4 && skill2.difficulty >= 0.4
            ) {
                bonus += 0.1;
            } 
            // check for 0.2 bonus
            else if (skill1.difficulty >= 0.4 && skill2.difficulty >= 0.4) {
                bonus += 0.2;
            }
        }
    }

    // Calculate Penalties
    // dismount element must be a double salto
    let penalty = 0.3;
    for (let i = routine.length - 1; i >= 0; i--) {
        if (routine[i] && !routine[i].invalid) {
            if (FloorSkills[routine[i].type] == FloorSkills.MULTI ||
                FloorSkills[routine[i].type] == FloorSkills.MULTI_TWIST
            ) {
                penalty = 0;
            }
            break;
        }
    }

    if (penalty == 0.3) {
        corrections.push("Receives 0.3 penalty for not ending on a double salto");
    }

    const score = roundTo(execution + difficulty + requirements + bonus - penalty, 2);

    const invalidIndexes = routine.reduce((acc, skill, index) => {
        if (skill.invalid) acc.push(skill.id);
        return acc;
    }, []);
    
    return {
        "score": score,
        "execution": execution,
        "difficulty": difficulty,
        "requirements": requirements,
        "bonus": roundTo(bonus, 2),
        "penalty": penalty,
        "corrections" : corrections,
        "invalid" : invalidIndexes
    };
}

// Function to calculate a pommel routine
function scorePommel(routine) {
    let corrections = [];
    routine = routine.map(skill => {
        if (skill && skill.hasOwnProperty("invalid")) {
            delete skill.invalid;
        }
        return skill;
    });
    // mark skills as invalid / uncounted if they violate the rules
    invalidateGroups(routine, Apparatus.POMMEL);
    routine = routine.filter(skill => skill != null);

    // add any uncounted skills to corrections
    for (let i = 0; i < routine.length; i++) {
        if (routine[i].invalid) {
            corrections.push(`Skill ${i + 1} is not counted due to having more than 4 skills in group ${routine[i].group}`);
        }
    }

    // check for special repetitions

    for (const type of Object.values(PommelSkills)) {
        const skills = routine.filter(skill => PommelSkills[skill.type] == type);
        // if more than 2 skills of each type present
        // make smallest valued skills invalid
        if (skills.length > 2) {

            const invalidSkills = skills.length - 2;
            // remove lowest skills violating rule
            for (let i = 0; i < invalidSkills; i++) {
                const lowestSkill = skills.reduce((lowest, skill) => {
                    return (skill && !skill.invalid && PommelSkills[skill.type] == type && skill.difficulty < lowest.difficulty) ? skill : lowest;
                }, {"difficulty": 2});

                const index = routine.findIndex(skill => skill == lowestSkill);
                routine[index].invalid = true;
                corrections.push(`Skill ${index + 1} is not counted as you have more than 2 ${type} type skills`);
            }
        }
    }

    for (const subtype of Object.values(PommelTypeSkills)) {
        const skills = routine.filter(skill => PommelTypeSkills[skill.subtype] == subtype);
        // if more than 1 skills of each sub type present
        // make smallest valued skills invalid
        if (skills.length > 1) {
            const invalidSkills = skills.length - 1;
            // remove lowest skills violating rule
            for (let i = 0; i < invalidSkills; i++) {
                const lowestSkill = routine.reduce((lowest, skill) => {
                    return (skill && !skill.invalid && PommelTypeSkills[skill.subtype] == subtype && skill.difficulty < lowest.difficulty) ? skill : lowest;
                });

                const index = routine.findIndex(skill => skill == lowestSkill);
                routine[index].invalid = true;
                corrections.push(`Skill ${index + 1} is not counted as you have more than 1 ${subtype} type skills`);
            }
        }
    }

    // calculate the routine score

    const execution = calculateExecution(routine);
    const difficulty = calculateTotal(routine);
    const groups = calculateGroups(routine);

    if (execution < 10) {
        corrections.push("Need to have 6+ skills in order to receive full execution.")
    }

    // calculate the requirements
    let requirements = 0;

    // any skill in group 1 gains 0.5
    if (groups[0] > 0) {
        requirements += 0.5;
    } else {
        corrections.push("Add a group I element to fill requirement (+0.5)");
    }

    // D+ skills gain 0.5, <D gains partial requirement in groups 2-4
    for (let i = 1; i < groups.length - 1; i++) {
        if (groups[i] >= 0.4) {
            requirements += 0.5;
        } else if (groups[i] > 0) {
            requirements += 0.3;
            corrections.push(`Group ${i + 1} only gains partial requirement, improve to a D+ rated skill (+0.2)`);
        } else {
            corrections.push(`Add a group ${i + 1} element to fill requirement (+0.5)`)
        }
    }

    // Dismount gains itself requirement
    requirements += groups[3];
    if (groups[3] == 0) {
        corrections.push("Add a dismount to gain extra requirement.");
    }

    const invalidIndexes = routine.reduce((acc, skill, index) => {
        if (skill.invalid) acc.push(skill.id);
        return acc;
    }, []);
    

    const score = execution + difficulty + requirements;
    return {
        "routine":routine,
        "score": score,
        "execution": execution,
        "difficulty": difficulty,
        "requirements": requirements,
        "corrections" : corrections,
        "invalid" : invalidIndexes
    };
}

// Function to claculate a rings routine
function scoreRings(routine) {
    let corrections = [];
    routine = routine.map(skill => {
        if (skill && skill.hasOwnProperty("invalid")) {
            delete skill.invalid;
        }
        return skill;
    });
    // mark skills as invalid / uncounted if they violate the rules
    invalidateGroups(routine, Apparatus.POMMEL);
    routine = routine.filter(skill => skill != null);

    // add any uncounted skills to corrections
    for (let i = 0; i < routine.length; i++) {
        if (routine[i].invalid) {
            corrections.push(`Skill ${i + 1} is not counted due to having more than 4 many skills in group ${routine[i].group}`);
        }
    }

    // special repetitions

    for (const type of Object.values(RingsSkills)) {
        for (let j = 0; j < 2; j++) {
            const skills = routine.filter(skill => RingsSkills[skill.type] == type && skill.group == j + 2);
            // if more than 2 skills of each type present
            // make smallest valued skills invalid
            if (skills.length > 1) {

                const invalidSkills = skills.length - 1;
                // remove lowest skills violating rule
                for (let i = 0; i < invalidSkills; i++) {
                    const lowestSkill = routine.reduce((lowest, skill) => {
                        return skill && !skill.invalid && RingsSkills[skill.type] == type && skill.difficulty < lowest.difficulty ? skill : lowest;
                    }, {"difficulty": 2});

                    const index = routine.findIndex(skill => skill == lowestSkill);
                    routine[index].invalid = true;
                    corrections.push(`Skill ${index + 1} is not counted as you have more than 1 skill ending in ${type} in group ${j + 1}`);
                }
            }
        }
    }

    // repeated strength elements - more than 3 in a row must be separated by counting B+ element
    let strengthSkills = 0;
    for (let i = 0; i < routine.length; i++) {
        if (routine[i].group == 2 ||
            routine[i].group == 3
        ) {
            strengthSkills += 1;
            if (strengthSkills > 3) {
                routine[i].invalid = true;
                corrections.push(`Skill ${i + 1} not counted. Cannot have more than 3 strength skills in a row without separating them with a B+ rated swinging element.`)
            }
        } else if (!routine[i].invalid &&routine[i].group == 1 && strengthSkills >= 3 && routine[i].difficulty >= 0.2) {
            strengthSkills = 0;
        }
    }

    // calculate the routine score

    const execution = calculateExecution(routine);
    const difficulty = calculateTotal(routine);
    const groups = calculateGroups(routine);

    if (execution < 10) {
        corrections.push("Need to have 6+ skills in order to receive full execution.")
    }

    // calculate the requirements
    let requirements = 0;

        // any skill in group 1 gains 0.5
    if (groups[0] > 0) {
        requirements += 0.5;
    } else {
        corrections.push("Add a group I element to fill requirement (+0.5)");
    }

    // D+ skills gain 0.5, <D gains partial requirement in groups 2-4
    for (let i = 1; i < groups.length - 1; i++) {
        if (groups[i] >= 0.4) {
            requirements += 0.5;
        } else if (groups[i] > 0) {
            requirements += 0.3;
            corrections.push(`Group ${i + 1} only gains partial requirement, improve to a D+ rated skill (+0.2)`);
        } else {
            corrections.push(`Add a group ${i + 1} element to fill requirement (+0.5)`)
        }
    }

    // Dismount gains itself requirement
    requirements += groups[3];
    if (groups[3] == 0) {
        corrections.push("Add a dismount to gain extra requirement.");
    } else if (groups[3] < 0.3) {
        corrections.push("Improve to a C+ dismount to be able to get stick bonus");
    }

    // calculate jonasson or yamawaki bonus
    let bonus = 0.0;
    for (let i = 0; i < routine.length; i++) {
        if (routine[i] == null || routine[i].invalid == true) {
            continue;
        }

        if (routine[i].connection) {
            if (i + 1 >= routine.length || routine[i + 1] == null || routine[i + 1].invalid) {
                continue;
            }
            if (RingsSkills[routine[i].type] == RingsSkills.YAMA_JON && RingsSkills[routine[i + 1].type] == RingsSkills.SWING_HANDSTAND) {
                bonus += 0.1;
            } 
        }
    }

    // calculate penalties
    // if there is no swing to handstand element in the counting elements, 0.3 penalty
    let penalty = 0.3;
    const handstandSkills = routine.filter(skill => RingsSkills[skill.type] == RingsSkills.SWING_HANDSTAND);
    if (handstandSkills.length > 0) {
        penalty = 0;
    } else {
        corrections.push("You have no swing to handstand skill, leading to a 0.3 penalty");
    }

    const invalidIndexes = routine.reduce((acc, skill, index) => {
        if (skill.invalid) acc.push(skill.id);
        return acc;
    }, []);
    

    const score = execution + difficulty + requirements + bonus - penalty;
    return {
        "score": score,
        "execution": execution,
        "difficulty": difficulty,
        "bonus" : bonus,
        "requirements": requirements,
        "penalty": penalty,
        "corrections" : corrections,
        "invalid": invalidIndexes
    };
}

// Function to calculate a vault routine
function scoreVault(routine) {
    let corrections = [];
    let invalidIndexes = []
    // invalidate 2nd vault if it is the same group
    let vault1 = routine[0] ? 10 + roundTo(routine[0].difficulty, 1) : 0;
    let vault2 = routine[1] ? 10 + roundTo(routine[1].difficulty, 1) : 0;

    if (routine[0] && routine[1] && routine[0].group == routine[1].group) {
        vault2 = 0;
        invalidIndexes.push(routine[1].id);
        corrections.push("You cannot have 2 vaults from the same group.");
    }

    // calculate scores
    let average = roundTo((vault1 + vault2) / 2, 2);
    
    return {
        "vault1" : vault1,
        "vault2" : vault2,
        "average" : average,
        "corrections" : corrections,
        "invalid":invalidIndexes
    };
}

// Function to calculate pbar routine
function scorePbar(routine) {
    let corrections = [];
    routine = routine.map(skill => {
        if (skill && skill.hasOwnProperty("invalid")) {
            delete skill.invalid;
        }
        return skill;
    });
    // mark skills as invalid / uncounted if they violate the rules
    invalidateGroups(routine, Apparatus.POMMEL);
    routine = routine.filter(skill => skill != null);

    // add any uncounted skills to corrections
    for (let i = 0; i < routine.length; i++) {
        if (routine[i].invalid) {
            corrections.push(`Skill ${i + 1} is not counted due to having more than 4 many skills in group ${routine[i].group}`);
        }
    }

    // check for special repetitions

    for (const type of Object.values(PbarSkills)) {
        const skills = routine.filter(skill => PbarSkills[skill.type] == type);
        let allowed;
        if (type == PbarSkills.FELGE || type == PbarSkills.GIANT || type == PbarSkills.UPRISE_HANDSTAND) {
            allowed = 2;
        } else {
            allowed = 1;
        }
        // if more than 2 skills of each type present
        // make smallest valued skills invalid
        if (skills.length > allowed) {

            const invalidSkills = skills.length - allowed;
            // remove lowest skills violating rule
            for (let i = 0; i < invalidSkills; i++) {
                const lowestSkill = routine.reduce((lowest, skill) => {
                    return PbarSkills[skill.type] == type && skill.difficulty < lowest.difficulty ? skill : lowest;
                }, {"difficulty": 2});

                const index = routine.findIndex(skill => skill == lowestSkill);
                routine[index].invalid = true;

                corrections.push(`Skill ${index + 1} is not counted as you have more than ${allowed} ${type} type skills`);
            }
        }
    }

   // calculate the routine score

    const execution = calculateExecution(routine);
    const difficulty = calculateTotal(routine);
    const groups = calculateGroups(routine);

    if (execution < 10) {
        corrections.push("Need to have 6+ skills in order to receive full execution.")
    }

    // calculate the requirements
    let requirements = 0;

    // any skill in group 1 gains 0.5
    if (groups[0] > 0) {
        requirements += 0.5;
    } else {
        corrections.push("Add a group I element to fill requirement (+0.5)");
    }

    // D+ skills gain 0.5, <D gains partial requirement in groups 2-4
    for (let i = 1; i < groups.length - 1; i++) {
        if (groups[i] >= 0.4) {
            requirements += 0.5;
        } else if (groups[i] > 0) {
            requirements += 0.3;
            corrections.push(`Group ${i + 1} only gains partial requirement, improve to a D+ rated skill (+0.2)`);
        } else {
            corrections.push(`Add a group ${i + 1} element to fill requirement (+0.5)`)
        }
    }

    // Dismount gains itself requirement
    requirements += groups[3];
    if (groups[3] == 0) {
        corrections.push("Add a dismount to gain extra requirement.");
    } else if (groups[3] < 0.3) {
        corrections.push("Improve to a C+ dismount to be able to get stick bonus");
    }

    const invalidIndexes = routine.reduce((acc, skill, index) => {
        if (skill.invalid) acc.push(skill.id);
        return acc;
    }, []);
    
    const score = execution + difficulty + requirements;
    return {
        "score": score,
        "execution": execution,
        "difficulty": difficulty,
        "requirements": requirements,
        "corrections": corrections,
        "invalid":invalidIndexes
    };
}

// Function to calculate hbar routine
function scoreHbar(routine) {
    let corrections = [];
    routine = routine.map(skill => {
        if (skill && skill.hasOwnProperty("invalid")) {
            delete skill.invalid;
        }
        return skill;
    });
    // mark skills as invalid / uncounted if they violate the rules
    invalidateGroups(routine, Apparatus.HBAR);
    routine = routine.filter(skill => skill != null);

    // add any uncounted skills to corrections
    for (let i = 0; i < routine.length; i++) {
        if (routine[i] && routine[i].invalid) {
            corrections.push(`Skill ${i + 1} is not counted due to having more than 4 many skills in group ${routine[i].group}`);
        }
    }

    // check for special repetitions

    for (const type of Object.values(HbarSkills)) {
        const skills = routine.filter(skill => HbarSkills[skill.type] == type);
        // if more than 2 skills of each type present
        // make smallest valued skills invalid
        if (skills.length > 2) {

            const invalidSkills = skills.length - 2;
            // remove lowest skills violating rule
            for (let i = 0; i < invalidSkills; i++) {

                const lowestSkill = skills.reduce((lowest, skill) => {
                    return skill && !skill.invalid && HbarSkills[skill.type] == type && skill.difficulty < lowest.difficulty ? skill : lowest;
                });

                const index = routine.findIndex(skill => skill == lowestSkill);
                routine[index].invalid = true;

                corrections.push(`Skill ${index + 1} is not counted as you have more than 2 ${type} type skills`);
            }
        }
    }

    // calculate the routine score

    const execution = calculateExecution(routine);
    const difficulty = calculateTotal(routine);
    const groups = calculateGroups(routine);

    if (execution < 10) {
        corrections.push("Need to have 6+ skills in order to receive full execution.")
    }

    // calculate the requirements
    let requirements = 0;

    // any skill in group 1 gains 0.5
    if (groups[0] > 0) {
        requirements += 0.5;
    } else {
        corrections.push("Add a group I element to fill requirement (+0.5)");
    }

    // D+ skills gain 0.5, <D gains partial requirement in groups 2-4
    for (let i = 1; i < groups.length - 1; i++) {
        if (groups[i] >= 0.4) {
            requirements += 0.5;
        } else if (groups[i] > 0) {
            requirements += 0.3;
            corrections.push(`Group ${i + 1} only gains partial requirement, improve to a D+ rated skill (+0.2)`);
        } else {
            corrections.push(`Add a group ${i + 1} element to fill requirement (+0.5)`)
        }
    }

    // Dismount gains itself requirement
    requirements += groups[3];
    if (groups[3] == 0) {
        corrections.push("Add a dismount to gain extra requirement.");
    } else if (groups[3] < 0.3) {
        corrections.push("Improve to a C+ dismount to be able to get stick bonus");
    }
    
    // Calculate bonus
    let bonus = 0;
    for (let i = 0; i < routine.length; i++) {
        // cannot connect to invalid skill
        if (routine[i].invalid || routine[i] == null) {
            continue;
        } else if (routine[i].connection) {
            // cannot connect at end of routine / to invalid skill
            if (i + 1 >= routine.length || routine[i + 1].invalid || routine[i + 1] == null){
                continue;
            }
            let skill1 = routine[i];
            let skill2 = routine[i + 1];

            // non-flight element connected to flight element
            if ((skill1.group == 1 || skill1.group == 3) && skill2.group == 2) {
                // D+ into D gives 0.1 bonus
                if (skill1.difficulty >= 0.4 && skill2.difficulty == 0.4) {
                    bonus += 0.1;
                } else if (skill1.difficulty >= 0.4 && skill2.difficulty >= 0.5) {
                    bonus += 0.2;
                }
            } 
            // flight element connected to flight element
            else if (skill1.group == 2 && skill2.group == 2) {
                if (skill1.difficulty == 0.3 && skill2.difficulty >= 0.4 ||
                    skill1.difficulty == 0.4 && skill2.difficulty == 0.4
                ) {
                    bonus += 0.1;
                } else if (skill1.difficulty >= 0.4 && skill2.difficulty >= 0.5) {
                    bonus += 0.2;
                }
            }
        }
    }

    const invalidIndexes = routine.reduce((acc, skill, index) => {
        if (skill.invalid) acc.push(skill.id);
        return acc;
    }, []);
    

    const score = execution + difficulty + requirements + bonus;
    return {
        "score": score,
        "execution": execution,
        "difficulty": difficulty,
        "requirements": requirements,
        "bonus": roundTo(bonus, 2),
        "corrections" : corrections,
        "invalid":invalidIndexes
    };
}