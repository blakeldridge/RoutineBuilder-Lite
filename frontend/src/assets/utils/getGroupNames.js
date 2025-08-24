import { Apparatus } from "./apparatus"

export default function getGroupNames(apparatus) {
    switch (apparatus) {
        case Apparatus.FLOOR:
            return [
                "Group 1 : Non-acrobatic elements",
                "Group 2 : Saltos forwards",
                "Group 3 : Saltos backwards",
                "Group 4 : Single salto 1+ twist"
            ]
        case Apparatus.POMMEL:
            return [
                "Group 1 : Scissors",
                "Group 2 : Circles, flairs and handstands",
                "Group 3 : Travel type elements",
                "Group 4 : Dismounts"
            ]
        case Apparatus.RINGS:
            return [
                "Group 1 : Swinging elements",
                "Group 2 : Strength elements",
                "Group 3 : Swings to strength",
                "Group 4 : Dismounts"
            ]
        case Apparatus.VAULT:
            return [
                "Group 1 : Single salto with complex twists",
                "Group 2 : Handspring into salto",
                "Group 3 : Tsukahara/Kaz into salto",
                "Group 4 : Yuchenko with complex twists",
                "Group 5 : Yuchenko into no/double salto"
            ]
        case Apparatus.PBAR:
            return [
                "Group 1 : Elements in upperarm",
                "Group 2 : Elements in support",
                "Group 3 : Under bar elements",
                "Group 4 : Dismounts"
            ]
        case Apparatus.HBAR:
            return [
                "Group 1 : Swinging elements",
                "Group 2 : Release and catches",
                "Group 3 : In-bar elements",
                "Group 4 : Dismounts"
            ]
        default:
            return [
                "Group 1",
                "Group 2",
                "Group 3",
                "Group 4"
            ];
    }
} 
