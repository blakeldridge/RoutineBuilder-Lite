export function convertDifficultyLetterToValue(difficultyLetter) {
    const ascii = difficultyLetter.charCodeAt(0);
    const difficulty = (ascii - 64) / 10;
    return difficulty;
}