import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function DownloadPDFButton({ apparatus, routine, routineResult }) {
  const handleDownload = async () => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    routine = routine.filter(skill => skill != null);

    doc.setFontSize(12);

    // Add text content
    doc.text(apparatus, 10, 10);

    doc.text(`Start Value : ${routineResult.score}`, 10, 20);
    doc.text(`Difficulty : ${routineResult.difficulty}`, 10, 30);
    doc.text(`Requirements : ${routineResult.requirements}`, 10, 40);
    if (routineResult.bonus) {
        doc.text(`Bonus : ${routineResult.bonus}`, 10, 50);
    }

    if (routineResult.penalty) {
        doc.text(`Penalty : ${routineResult.penalty}`, 10, 60);
    }

    for (let i = 0; i < routine.length; i++) {
        doc.text(`${i + 1}  ${routine[i].name}     Group : ${routine[i].group}  Difficulty : ${routine[i].difficulty}`, 10, 70 + (i * 10));
    }

    // Save the PDF to user's device
    doc.save("example.pdf");
  };

  return (
    <button onClick={handleDownload}>
      Download Routine
    </button>
  );
}

export default DownloadPDFButton;
