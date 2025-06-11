import floorSkills from "../data/skills/FloorSkills.updated.json";

import { Apparatus } from "./apparatus";

export default function getSkills(apparatus) {
    switch (apparatus) {
        case Apparatus.FLOOR:
            return getFloorSkills();
        default:
            return [];
    }
} 

function getFloorSkills() {
    return floorSkills;
}