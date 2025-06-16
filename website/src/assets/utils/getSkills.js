import floorSkills from "../data/skills/FloorSkills.updated.json";
import pommelSkills from "../data/skills/PommelSkills.updated.json";
import vaultSkills from "../data/skills/VaultSkills.updated.json";
import hbarSkills from "../data/skills/HbarSkills.updated.json";

import { Apparatus } from "./apparatus";

export default function getSkills(apparatus) {
    switch (apparatus) {
        case Apparatus.FLOOR:
            return getFloorSkills();
        case Apparatus.POMMEL:
            return getPommelSkills();
        case Apparatus.VAULT:
            return getVaultSkills();
        case Apparatus.HBAR:
            return getHbarSkills();
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

function getVaultSkills() {
    return vaultSkills;
}

function getHbarSkills() {
    return hbarSkills;
}