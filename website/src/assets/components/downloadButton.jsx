import { jsPDF } from "jspdf";
import { useState } from "react";
import { Apparatus } from "../utils/apparatus";

function DownloadPDFButton({ apparatus, routine, routineResult }) {
    const [ fileName, setFileName ] = useState("");

    const handleDownload = async (e) => {
        e.preventDefault();

        let saveName;
        if (fileName == "") {
            saveName = "unnamed";
        } else {
            saveName = fileName.replace(/\s/g, "-");
        }

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        routine = routine.filter(skill => skill != null);

        doc.setFontSize(12);

        // Add text content
        doc.text(apparatus, 10, 10);

        if (apparatus == Apparatus.VAULT) {
            doc.text(`Average Vault : ${routineResult.average}`, 10, 20);
            doc.text(`Vault 1 : ${routineResult.vault1} (Counted in the all around competition)`, 10, 30);
            doc.text(`Vault 2 : ${routineResult.vault2}`, 10, 40);
        } else {
            doc.text(`Start Value : ${routineResult.score}`, 10, 20);
            doc.text(`Difficulty : ${routineResult.difficulty}`, 10, 30);
            doc.text(`Requirements : ${routineResult.requirements}`, 10, 40);
            if (routineResult.bonus) {
                doc.text(`Bonus : ${routineResult.bonus}`, 10, 50);
            }

            if (routineResult.penalty) {
                doc.text(`Penalty : ${routineResult.penalty}`, 10, 60);
            }
        }

        for (let i = 0; i < routine.length; i++) {
            doc.text(`${i + 1}  ${routine[i].name}     Group : ${routine[i].group}  Difficulty : ${routine[i].difficulty}`, 10, 70 + (i * 10));
        }

        // Save the PDF to user's device
        doc.save(saveName + ".pdf");
    };

    return (
        <div className="flex flex-row">
            <form onSubmit={handleDownload}>
                <input type="text" placeholder="File Name..." value={fileName} onChange={(event) => setFileName(event.target.value)} />
                <button type="submit">Download Routine</button>
            </form>
        </div>
    );
}

export default DownloadPDFButton;
