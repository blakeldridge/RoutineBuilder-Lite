const fs = require('fs');

const File = './website/src/assets/data/skills/PommelSkills.updated.json';

const nameMap = {
    "hdst.":"handstand",
    "strad.":"straddle",
    "s.":"secs",
    "str.":"straight",
    "sup.":"support",
    "½":"1/2",
    "bwd.":"backwards",
    "fwd.":"forwards",
    "t.": "twists",
    "thr.":"through",
    "p.":"piked",
    "dbl.":"double",
    "w.":"with"
};

const rawData = fs.readFileSync(File, 'utf-8');
const data = JSON.parse(rawData);

console.log(data[0].name.split(/[ \t\r\n]/));

// 2. Transform the data
const updatedData = data.map((item, index) => ({
  id : index,
  name: item.name.replace("¼", ""),
  difficulty: item.difficulty,
  group: item.group,
  apparatus: item.apparatus,
  type:item.type
}));

fs.writeFileSync(File, JSON.stringify(updatedData, null, 2));
console.log('Updated JSON written to', File);