import { useRef } from "react";
import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

const FormWithPdf = () => {
  const { register, handleSubmit, reset } = useForm();
  const barcodeRef = useRef(null);
  const staticAwbNumber = "AWB123456789";
  const todayDate = new Date().toLocaleDateString(); // Get today's date

  const onSubmit = (data) => {
    // Generate the barcode using a static AWB number
    JsBarcode(barcodeRef.current, staticAwbNumber, {
      format: "CODE128",
      displayValue: true,
      width: 2,
      height: 40,
    });

    const doc = new jsPDF();

    // Add logo to the PDF (replace with your logo URL)
    const logoUrl = "/shiphtlogo.png";
    doc.addImage(logoUrl, "PNG", 150, 10, 40, 20);

    // Title formatting
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Express Service", 20, 30);

    // Add today's date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${todayDate}`, 20, 40);

    // Draw a border around the form
    doc.setLineWidth(0.5);
    doc.rect(10, 50, 190, 160);

    // From and To section
    const xOffset = 20;
    const yOffset = 60;
    const sectionWidth = 85; // Width for each section
    const verticalSpacing = 20;

    // From section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("From:", xOffset, yOffset);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${data.fromName}`, xOffset, yOffset + 10);
    doc.text(`Phone Number: ${data.fromPhoneNumber}`, xOffset, yOffset + 20);
    const fromLocationLines = doc.splitTextToSize(
      `Location: ${data.fromLocation}`,
      sectionWidth - 10
    );
    doc.text(fromLocationLines, xOffset, yOffset + 30);

    // To section
    doc.setFont("helvetica", "bold");
    doc.text("To:", xOffset + sectionWidth, yOffset);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${data.toName}`, xOffset + sectionWidth, yOffset + 10);
    doc.text(
      `Phone Number: ${data.toPhoneNumber}`,
      xOffset + sectionWidth,
      yOffset + 20
    );
    const toLocationLines = doc.splitTextToSize(
      `Location: ${data.toLocation}`,
      sectionWidth - 10
    );
    doc.text(toLocationLines, xOffset + sectionWidth, yOffset + 30);

    // Add weight section
    doc.setFont("helvetica", "bold");
    doc.text("Weight (kg):", xOffset, yOffset + 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.weight} kg`, xOffset + sectionWidth, yOffset + 50);

    // Content section
    doc.setFont("helvetica", "bold");
    doc.text("Content:", xOffset, yOffset + 70);
    const content = doc.splitTextToSize(data.items, 160);
    doc.setFont("helvetica", "normal");
    doc.text(content, xOffset, yOffset + 80);

    // Add barcode section
    doc.setFont("helvetica", "bold");
    doc.text(`AWB Number: ${staticAwbNumber}`, xOffset, yOffset + 120);

    const barcodeImage = barcodeRef.current.toDataURL();
    doc.addImage(barcodeImage, "PNG", xOffset, yOffset + 130, 100, 30);
    console.log(data.name);
    // Save the PDF
    doc.save(`${data.name}-client-form.pdf`);

    reset();
  };

  return (
    <div className="container mx-auto my-5">
      <h1 className="text-2xl font-bold mb-5">
        Generate Client PDF with Barcode
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-bold">From Name:</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            {...register("fromName")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">From Phone Number:</label>
          <input
            className="border p-2 rounded w-full"
            type="tel"
            {...register("fromPhoneNumber")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">From Location:</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            {...register("fromLocation")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">To Name:</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            {...register("toName")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">To Phone Number:</label>
          <input
            className="border p-2 rounded w-full"
            type="tel"
            {...register("toPhoneNumber")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">To Location:</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            {...register("toLocation")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">Weight (kg):</label>
          <input
            className="border p-2 rounded w-full"
            type="number"
            {...register("weight")}
            required
          />
        </div>

        <div>
          <label className="block font-bold">Content:</label>
          <textarea
            className="border p-2 rounded w-full"
            {...register("items")}
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-4 rounded"
        >
          Submit & Generate PDF
        </button>
      </form>

      <canvas ref={barcodeRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default FormWithPdf;
