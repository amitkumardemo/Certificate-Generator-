const userName = document.getElementById("name");
const dobInput = document.getElementById("dob");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb } = PDFLib;

// Capitalize function
const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const nameVal = capitalize(userName.value);
  const dobVal = dobInput.value.trim();

  // Check if all fields are filled and valid
  if (nameVal && dobVal && userName.checkValidity() && dobInput.checkValidity()) {
    generatePDF(nameVal, dobVal);
  } else {
    userName.reportValidity();
    dobInput.reportValidity();
  }
});

const generatePDF = async (name, dob) => {
  const existingPdfBytes = await fetch("Techiehelp OfferLetter.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  // Get font
  const fontBytes = await fetch("./Sanchez-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );
  const sanChezFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw the name on the PDF
  firstPage.drawText(name, {
    x: 130,
    y: 610,
    size: 10,
    font: sanChezFont,
    color: rgb(0, 0, 0), // Set color to black
  });

  // Draw the DOB below the name
  firstPage.drawText(`DOB: ${dob}`, {
    x: 130,
    y: 580,
    size: 10,
    font: sanChezFont,
    color: rgb(0, 0, 0), // Set color to black
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating PDF");

  // Create and download the PDF file
  const file = new File([pdfBytes], "Techiehelp_OfferLetter.pdf", { type: "application/pdf;charset=utf-8" });
  saveAs(file);
};
