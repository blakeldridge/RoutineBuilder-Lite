import { Apparatus } from "./apparatus";

const SKILL_GROUP_LIMIT = 4;

export default function scoreRoutine(routine, apparatus) {
    // routine : List of Skill Objects

    // Calculate the routine based on apparatus
    // each apparatus has a slightly different rule set
    switch (apparatus) {
        case Apparatus.FLOOR:
            break;
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