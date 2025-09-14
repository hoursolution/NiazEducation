import jsPDF from "jspdf";
import { api } from "./api";
import logoUrl from "../../../../public/pdflogo.jpg";
const checkmarkLogoUrl = `${window.location.origin}/checklogo.jpg`;

export const generateStudentInitialPDF = async (applicationId) => {
  try {
    const res = await api.get(
      `/applications/${applicationId}/admission-confirmation/`
    );
    const d = res.data;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const left = 20;
    const right = 20;
    const top = 20;
    const bottom = 20;
    const maxWidth = pageWidth - left - right;
    const lineHeight = 6;
    let y = top;

    // === Logo ===
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = logoUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const imgW = 35;
      const imgH = 35;
      doc.addImage(img, "PNG", (pageWidth - imgW) / 2, y, imgW, imgH);
      y += imgH + 6;
    } catch (e) {
      console.warn("Logo failed to load", e);
    }

    // === Title ===
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Student Initial Report", pageWidth / 2, y, { align: "center" });
    y += 12;
    doc.setFontSize(11);

    // helper for paragraphs
    const addParagraph = (text) => {
      doc.setFont("times", "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, left, y);
      y += lines.length * lineHeight + 3;
    };

    // helper heading
    const addHeading = (text) => {
      doc.setFont("times", "bold");
      doc.text(text, left, y);
      y += lineHeight;
    };

    // --- Student Info ---
    [
      ["Name", d.student_name],
      ["Father’s Name", d.father_name],
      ["B-Form Number", d.b_form],
      ["Age", d.age],
      ["Class/Grade", d.grade],
      ["Future Aspiration", d.aspiration],
      ["Location", d.location],
    ].forEach(([label, value]) => {
      doc.setFont("times", "bold");
      doc.text(`${label}:`, left, y);
      doc.setFont("times", "normal");
      doc.text(`${value || "N/A"}`, left + 50, y);
      y += lineHeight;
    });

    y += 4;

    // --- Scholarship Selection Criteria ---
    addHeading("Scholarship Selection Criteria:");
    addParagraph(
      "The student has been selected for the scholarship based on the following:"
    );
    addHeading("Eagerness to Learn:");
    addParagraph(
      "The student has expressed a strong desire to continue education, showing resilience and a sincere passion for learning despite financial and family challenges."
    );

    // --- Mentor Interview ---
    addHeading("Mentor Interview:");
    addParagraph(
      `A personal interview was conducted by our mentor, Ms. Fatima Mudassir, a professional educationist formerly associated with leading educational institutions, to assess the student’s motivation and circumstances.`
    );

    // Interview Result
    doc.setFont("times", "bold");
    doc.text("Interview Result:", left, y);
    // ✅ Checkmark image
    try {
      const chk = new Image();
      chk.crossOrigin = "Anonymous";
      chk.src = checkmarkLogoUrl;
      await new Promise((resolve, reject) => {
        chk.onload = resolve;
        chk.onerror = reject;
      });
      // doc.addImage(chk, "PNG", left + 50, y - 5, 5, 5);
      doc.setFont("times", "normal");
      doc.setTextColor(0, 128, 0);
      doc.text("Selected", left + 57, y);
      doc.setTextColor(0, 0, 0);
    } catch (e) {
      doc.setTextColor(0, 128, 0);
      doc.text("Selected", left + 50, y);
      doc.setTextColor(0, 0, 0);
    }
    y += lineHeight + 3;

    // Mentor Comments
    addHeading("Mentor Comments:");
    addParagraph(
      `${d.student_name} is a motivated and hardworking student, determined to do well in studies. The child has a clear goal of becoming a ${d.aspiration} in the future.`
    );

    // Family Background
    addHeading("Family Background:");
    addParagraph(
      `${d.student_name} comes from a family facing financial struggles due to a parent’s disability. ${d.student_name}’s parent has ${d.disability_type}, which makes it difficult for the family to support themselves. This makes it even more important for ${d.student_name} to receive support with education and healthcare.`
    );
    addParagraph(
      `Your support will give ${d.student_name} a better chance at a brighter future and help them become more independent. We will keep you updated on the student’s progress as they begin their educational journey.`
    );

    // Closing
    addParagraph("With sincere gratitude,");
    doc.setFont("times", "bold");
    doc.text("Niaz Support Team", left, y);
    y += lineHeight;
    doc.setFont("times", "italic");
    doc.text("A Subah Sehar Initiative", left, y);

    // Footer
    const footerText = "Niaz Support Team | www.niazsupport.org";
    const footerY = pageHeight - 10;
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(footerText, pageWidth / 2, footerY, { align: "center" });
    }

    doc.save(`Student_Initial_Report_${d.student_name || "student"}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  }
};
