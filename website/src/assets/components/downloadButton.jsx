import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useState } from "react";
import { Apparatus } from "../utils/apparatus";

function DownloadPDFButton({ apparatus, routine, routineResult }) {
    const [ fileName, setFileName ] = useState("");

    const handleDownload = async (e) => {
        // e.preventDefault();

        let saveName = fileName.trim() === "" ? "unnamed" : fileName.replace(/\s/g, "-");

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const marginLeft = 10;
        let y = 15;

        // Title
        doc.setFontSize(32);
        doc.text(apparatus, marginLeft, y);
        y += 10;

        // Score Summary
        doc.setFontSize(14);
        if (apparatus === Apparatus.VAULT) {
            doc.text(`Average Vault: ${routineResult.average}`, marginLeft, y);
            y += 8;
            doc.setFontSize(12);
            doc.text(`Vault 1: ${routineResult.vault1} (Counted in all-around)`, marginLeft, y);
            y += 6;
            doc.text(`Vault 2: ${routineResult.vault2}`, marginLeft, y);
            y += 10;
        } else {
            let baseX = 10;
            // Set base positions
            doc.setFontSize(20); // Bigger font for "Start Value"
            doc.setTextColor(0, 0, 0);
            doc.text(`SV: ${routineResult.score}`, baseX, y);
            y += 8;

            // Smaller blue labels + values below
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128); // light blue

            const labels = ['Execution', 'Difficulty', 'Requirements', 'Bonus', 'Penalty'];
            const values = [
                routineResult.execution ?? '-',
                routineResult.difficulty ?? '-',
                routineResult.requirements ?? '-',
                routineResult.bonus ?? '-',
                routineResult.penalty ?? '-',
            ];
            const spacing = [0, 20, 18, 26, 14];

            let x = baseX;
            // Draw each label + value in a column
            labels.forEach((label, i) => {
                x += spacing[i];
                doc.text(label, x, y);         // label above
                doc.setTextColor(0);               // black for value
                doc.text(values[i].toString(), x, y + 6); // value below
                doc.setTextColor(107, 114, 128);   // reset color for next label
            });
            y += 10
        }

        // Table of Skills
        const filteredRoutine = routine.filter(skill => skill != null);

        const tableBody = filteredRoutine.map((skill, index) => [
            index + 1,
            skill.name,
            skill.group,
            skill.difficulty
        ]);

        autoTable(doc, {
            startY: y,
            head: [["#", "Skill Name", "Group", "Difficulty"]],
            body: tableBody,
            theme: "striped",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] } // Optional: blue header
        });

        doc.save(saveName + ".pdf");
    };

    return (
        <div>
            <form onSubmit={handleDownload} className="flex flex-row items-center gap-2">
                <input className="px-2 py-1 border rounded text-sm" type="text" placeholder="File Name..." value={fileName} onChange={(event) => setFileName(event.target.value)} />
                <button disabled={routine.filter(skill => skill != null).length == 0} className="px-4 py-2 rounded bg-blue-600 text-white text-sm" type="submit">Download</button>
            </form>
        </div>
    );
}

export default DownloadPDFButton;
