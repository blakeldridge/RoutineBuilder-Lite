export const convertDifficulty = (value) => {
    let asciiCode = (value * 10) + 65
    return String.fromCharCode(asciiCode);
};

export const convertGroup = (groupNum) => {
    switch(groupNum) {
        case 1:
            return "I";
        case 2:
            return "II";
        case 3:
            return "III";
        case 4:
            return "IV";
        case 5:
            return "V";
    }
};