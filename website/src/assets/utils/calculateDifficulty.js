import { Apparatus } from "./apparatus";
import { FloorSkills } from "./skillTypes";

const SKILL_GROUP_LIMIT = 4;

export default function scoreRoutine(routine, apparatus) {
    // routine : List of Skill Objects

    // Calculate the routine based on apparatus
    // each apparatus has a slightly different rule set
    switch (apparatus) {
        case Apparatus.FLOOR:
            return scoreFloor(routine);
        case Apparatus.POMMEL:
            break;
        case Apparatus.RINGS:
            break;
        case Apparatus.VAULT:
            break;
        case Apparatus.PBAR:
            break;
        case Apparatus.HBAR:
            break;
        default:
            break;
    }
};


// Function to calculate the starting execution of the routine
function calculateExecution(routine) {
    // filter out invalid skills or non-existing skills
    const numberOfSkills = routine.filter((skill) => skill !== null && !skill.invalid).length()
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
        return total + skill.difficulty;
    }, 0);

    return difficulty;
}

// Function to count how skills are in each skill group
function countGroups(routine) {
    let groups = [0, 0, 0, 0];
    routine.map((skill) => groups[skill.group - 1] + 1);
    return groups;
}

// Function to calculate the highest value skill in each group
function calculateGroups(routine) {
    let groups = [0, 0, 0, 0];
    for (let i = 0; i < routine.length(); i++) {
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
        const dismountIndex = routine.findIndex(skill => skill.group == 4);
        for (let i = dismountIndex; i < routine.length(); i++) {
            routine[i].invalid = true;
        }
    }

    // Invalidate the smallest valued elements of each group, if more than 4 elements in the group
    for (let i = 0; i < groups.length(); i++) {
        let currentGroup = i + 1;
        let hbarCondition = false;
        // for high bar, if 2 flights are connected, you can have 5 elements in group 3
        if (currentGroup == 3 && groups[i] == 5 && apparatus == Apparatus.HBAR) {
            const flightElements = routine.filter(skill => skill.group == 3);
            const connectedTotal = flightElements.reduce((total, skill) => { return total + skill.connected ? 1 : 0 }, 0);
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
                    return skill.group == currentGroup && skill.difficulty < lowest.difficulty ? skill : lowest;
                });

                lowestSkill.invalid = true;
            }
        }
    }
}

function scoreFloor(routine) {
    // mark skills as invalid / uncounted if they violate the rules
    invalidateGroups(routine, Apparatus.FLOOR);

    // special repetitions
    // cannot do more than 1 strength skills
    const strengthSkills = routine.filter(skill => skill.type == FloorSkills.STRENGTH); 
    if (strengthSkills.length() > 1) {
        let maxSkill = strengthSkills.reduce((max, skill) => {
            return skill.difficulty < max.difficulty ? skill : max;
        });
        routine.map(skill => 
            skill.invalid = skill.type == FloorSkills.STRENGTH && skill != maxSkill ? true : false
        );
    }

    // calculate the routine score

    const execution = calculateExecution(routine);
    const difficulty = calculateTotal(routine);
    const groups = calculateGroups(routine);

    // calculate the requirements
    let requirements = 0;

    // any skill in group 1 gains 0.5
    if (groups[0] > 0) {
        requirements += 0.5;
    }

    // D+ skills gain 0.5, <D gains partial requirement in groups 2-4
    for (let i = 1; i < groups.length(); i++) {
        if (groups[i] >= 0.4) {
            requirements += 0.5;
        } else if (groups[i] > 0) {
            requirements += 0.3;
        }
    }


    // cannot do more than 1 circle skill
    const circleSkills = routine.filter(skill => skill.type == FloorSkills.CIRCLE); 
    if (circleSkills.length() > 1) {
        let maxSkill = circleSkills.reduce((max, skill) => {
            return skill.difficulty < max.difficulty ? skill : max;
        });
        routine.map(skill => 
            skill.invalid = skill.type == FloorSkills.CIRCLE && skill != maxSkill ? true : false
        );
    }
    
    // Calculate bonus
    let bonus = 0;
    for (let i = 0; i < routine.length(); i++) {
        // cannot connect to invalid skill
        if (routine[i].invalid || routine[i] == null) {
            continue;
        } else if (routine[i].connection) {
            // cannot connect at end of routine / to invalid skill
            if (i + 1 <= routine.length() || routine[i + 1].invalid || routine[i + 1] == null){
                continue;
            }
            let skill1 = routine[i];
            let skill2 = routine[i + 1];

            // check if skills are valid connections (twisting salto into non-twisting)
            if (skill1.type == FloorSkills.SINGLE_TWIST && skill2.type == FloorSkills.SINGLE_TWIST) {
                continue;
            }
            // check for 0.1 connection
            if (skill1.difficulty == 0.4 && skill2.difficulty == 0.4 ||
                skill1.difficulty >= 0.4 && skill2.difficulty >= 0.2 && skill2.difficulty < 0.4||
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
        if (routine[i] != null && routine[i].invalid == false) {
            if (routine[i].type == FloorSkills.MUTLI ||
                routine[i].type == FloorSkills.MULTITWIST
            ) {
                penalty = 0;
            }
            break;
        }
    }

    const score = execution + difficulty + requirements + bonus - penalty;
    return {
        "score": score,
        "execution": execution,
        "difficulty": difficulty,
        "requirements": requirements,
        "bonus": bonus,
        "penalties": penalties
    };
}