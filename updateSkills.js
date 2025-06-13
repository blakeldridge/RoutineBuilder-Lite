const fs = require('fs');

const groupMap = {
  "I:": 1,
  "II": 2,
  "III": 3,
  "IV": 4
};

const inputFile = './website/src/assets/data/skills/FloorSkills.json';
const outputFile = './website/src/assets/data/skills/FloorSkills.updated.json';

// 1. Read the file
const rawData = fs.readFileSync(inputFile, 'utf-8');
const data = JSON.parse(rawData);

// 2. Transform the data
const updatedData = data["Floor"].map((item, index) => ({
  id : index,
  name: item.Name,
  difficulty: item.difficulty,
  group: groupMap[item.group],
  apparatus: item.apparatus,
  type: item.type,
  subtype : item.subtype
}));

// 3. Optionally remove old keys like "Name"
updatedData.forEach((item) => {
  delete item.Name;
});

// 4. Write the file
fs.writeFileSync(outputFile, JSON.stringify(updatedData, null, 2));
console.log('Updated JSON written to', outputFile);
