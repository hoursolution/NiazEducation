import jsPDF from "jspdf";
import { api } from "./api";

import logoUrl from "../../../../public/pdflogo.jpg";

export const generateAdmissionPDF = async (applicationId) => {
  try {
    const res = await api.get(
      `/applications/${applicationId}/admission-confirmation/`
    );
    const { donor_name, student_name, disability, school, grade } = res.data;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // layout settings
    const left = 20;
    const right = 20;
    const top = 20;
    const bottom = 20;
    let y = top;
    const maxWidth = pageWidth - left - right;
    const lineHeight = 6; // tighter line spacing
    const paragraphSpacing = 4;

    // load logo
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
      console.warn("Logo failed to load, continuing without it", e);
    }

    // Title
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Admission Confirmation", pageWidth / 2, y, { align: "center" });
    y += 12;

    doc.setFontSize(11);

    // Helper: styled paragraph (no indentation, compact)
    // Helper: styled paragraph (no indentation, keeps bold parts, optional spacing)
    const addStyledParagraph = (parts, addSpacing = true) => {
      const combined = parts.map((p) => p.text).join("");
      if (!combined.trim()) {
        if (addSpacing) y += paragraphSpacing;
        return;
      }

      let line = "";
      let lineParts = [];
      const lines = [];

      parts.forEach((part) => {
        const words = part.text.split(/\s+/);
        words.forEach((word, i) => {
          const chunk = i < words.length - 1 ? word + " " : word;
          const testLine = line + chunk;
          const testWidth = doc.getTextWidth(testLine);

          if (testWidth > maxWidth) {
            lines.push(lineParts);
            line = chunk;
            lineParts = [{ text: chunk, bold: part.bold }];
          } else {
            line += chunk;
            lineParts.push({ text: chunk, bold: part.bold });
          }
        });
      });
      if (lineParts.length) lines.push(lineParts);

      // Draw lines
      lines.forEach((lineParts) => {
        if (y + lineHeight > pageHeight - bottom) {
          doc.addPage();
          y = top;
        }
        let x = left;
        lineParts.forEach((seg) => {
          doc.setFont("times", seg.bold ? "bold" : "normal");
          doc.text(seg.text, x, y);
          x += doc.getTextWidth(seg.text);
        });
        y += lineHeight;
      });

      if (addSpacing) y += paragraphSpacing;
    };

    // Paragraphs
    addStyledParagraph([
      { text: `Dear ${donor_name || "Donor"},`, bold: true },
    ]);

    addStyledParagraph([
      { text: "We are pleased to inform you that ", bold: false },
      { text: student_name || "Student", bold: true },
      {
        text: ", a promising student whose parent is living with ",
        bold: false,
      },
      { text: disability || "N/A", bold: true },
      { text: ", has been successfully enrolled at ", bold: false },
      { text: school || "School", bold: true },
      { text: " in grade ", bold: false },
      { text: grade || "N/A", bold: true },
      { text: " for the current academic year.", bold: false },
    ]);

    addStyledParagraph([
      {
        text: "All essential academic materials—including uniforms, textbooks, and stationery—have been provided to ensure a smooth transition.",
        bold: false,
      },
    ]);

    addStyledParagraph([
      { text: "In addition, we have appointed ", bold: false },
      { text: "Ms. Rahima Naz", bold: true },
      {
        text: ", an active professional in the field of social enrichment, as ",
        bold: false,
      },
      { text: student_name || "Student", bold: true },
      {
        text: "’s dedicated guardian. She will maintain regular contact with the student to provide ongoing personal, emotional, moral, and social support.",
        bold: false,
      },
    ]);

    addStyledParagraph([
      { text: "Meanwhile, ", bold: false },
      { text: "Ms. Fatima Mudassir", bold: true },
      {
        text: ", a seasoned educationist formerly associated with leading educational institutions, will oversee ",
        bold: false,
      },
      { text: student_name || "Student", bold: true },
      {
        text: "’s educational progress as mentor, conducting regular sessions to assess motivation, academic development, and personal grooming.",
        bold: false,
      },
    ]);

    addStyledParagraph([
      {
        text: "We also plan to celebrate significant occasions such as Eid and birthdays with the student, and we will share photographs and detailed updates of these events with you.",
        bold: false,
      },
    ]);

    addStyledParagraph([
      { text: "We are glad to report that ", bold: false },
      { text: student_name || "Student", bold: true },
      {
        text: " has begun attending classes regularly and is adapting well to the new academic environment. This opportunity has been made possible through your generous support, and we remain committed to keeping you informed of the student’s academic progress and overall well-being.",
        bold: false,
      },
    ]);

    addStyledParagraph([{ text: "With sincere gratitude,", bold: false }]);
    addStyledParagraph([{ text: "Niaz Support Team", bold: true }]);
    addStyledParagraph([{ text: "A Subah Sehar Initiative", bold: false }]);

    // Footer
    // doc.setFontSize(9);
    // doc.setFont("helvetica", "italic");
    // doc.text(
    //   "Niaz Support Team | www.niazsupport.org | info@niazsupport.org",
    //   pageWidth / 2,
    //   pageHeight - 12,
    //   { align: "center" }
    // );

    // Save
    doc.save(`Admission_Confirmation_${student_name || "student"}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  }
};
