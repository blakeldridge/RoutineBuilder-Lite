import floorSkills from "../data/skills/FloorSkills.updated.json";
import pommelSkills from "../data/skills/PommelSkills.updated.json";

import { Apparatus } from "./apparatus";

export default function getSkills(apparatus) {
    switch (apparatus) {
        case Apparatus.FLOOR:
            return getFloorSkills();
        case Apparatus.POMMEL:
            return getPommelSkills();
        default:
            return [];
    }
} 

function getFloorSkills() {
    return floorSkills;
}

function getPommelSkills() {
    return pommelSkills;
}