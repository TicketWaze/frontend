"use client";

import Event from "@/types/Event";
import Ticket from "@/types/Ticket";
import { useRef, useState } from "react";
import UpcomingTicket from "./UpcomingTicket";
import { ArrowLeft2, ArrowRight2, DocumentDownload } from "iconsax-react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Capitalize from "@workspace/ui/lib/Capitalize";
import FormatDate from "@/lib/FormatDate";
import TimesTampToDateTime from "@/lib/TimesTampToDateTime";

export default function TicketViewer({
  tickets,
  event,
}: {
  tickets: Ticket[];
  event: Event;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("Event");
  const isFree = event.eventTicketTypes[0].ticketTypePrice == 0;

  // Mock data if no tickets provided
  const mockTickets = tickets;

  //   const mockEvent = Object.keys(event).length > 0 ? event : { name: 'Sample Event Series' };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mockTickets.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < mockTickets.length - 1 ? prev + 1 : 0));
  };

  if (mockTickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No tickets available</p>
      </div>
    );
  }

  const ticketRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a color is a lab() function
  const isLabColor = (colorValue: string): boolean => {
    return (
      colorValue.includes("lab(") ||
      colorValue.includes("lch(") ||
      colorValue.includes("oklab(") ||
      colorValue.includes("oklch(")
    );
  };

  // Helper function to convert problematic colors to safe alternatives
  const getSafeColor = (colorValue: string, fallback: string): string => {
    if (isLabColor(colorValue)) {
      return fallback;
    }
    return colorValue;
  };

  // Function to handle canvas elements (like QR codes)
  const handleCanvasElements = (
    element: HTMLElement,
    originalElement: HTMLElement
  ) => {
    const canvases = element.querySelectorAll("canvas");
    const originalCanvases = originalElement.querySelectorAll("canvas");

    canvases.forEach((canvas, index) => {
      if (originalCanvases[index]) {
        const originalCanvas = originalCanvases[index];
        const ctx = canvas.getContext("2d");
        if (ctx && originalCanvas) {
          // Copy the original canvas content
          canvas.width = originalCanvas.width;
          canvas.height = originalCanvas.height;
          ctx.drawImage(originalCanvas, 0, 0);
        }
      }
    });
  };

  // Function to apply inline styles and fix problematic CSS
  const applyInlineStyles = (
    element: HTMLElement,
    originalElement: HTMLElement
  ) => {
    const computed = window.getComputedStyle(element);

    // Fix background color
    const bgColor = computed.backgroundColor;
    if (isLabColor(bgColor)) {
      element.style.backgroundColor = bgColor.includes("neutral")
        ? "#f5f5f5"
        : "#ffffff";
    } else if (
      bgColor &&
      bgColor !== "rgba(0, 0, 0, 0)" &&
      bgColor !== "transparent"
    ) {
      element.style.backgroundColor = bgColor;
    }

    // Fix text color
    const textColor = computed.color;
    if (isLabColor(textColor)) {
      element.style.color = textColor.includes("neutral")
        ? "#666666"
        : textColor.includes("primary")
          ? "#E45B00"
          : textColor.includes("deep")
            ? "#0D0D0D"
            : "#000000";
    } else if (textColor) {
      element.style.color = textColor;
    }

    // Fix border color
    const borderColor = computed.borderColor;
    if (isLabColor(borderColor)) {
      element.style.borderColor = borderColor.includes("primary")
        ? "#E45B00"
        : borderColor.includes("neutral")
          ? "#e5e5e5"
          : "#cccccc";
    } else if (borderColor && borderColor !== "rgba(0, 0, 0, 0)") {
      element.style.borderColor = borderColor;
    }

    // Copy other important styles
    element.style.fontSize = computed.fontSize;
    element.style.fontFamily = computed.fontFamily;
    element.style.fontWeight = computed.fontWeight;
    element.style.padding = computed.padding;
    element.style.margin = computed.margin;
    element.style.borderRadius = computed.borderRadius;
    element.style.borderWidth = computed.borderWidth;
    element.style.borderStyle = computed.borderStyle;
    element.style.display = computed.display;
    element.style.flexDirection = computed.flexDirection;
    element.style.alignItems = computed.alignItems;
    element.style.justifyContent = computed.justifyContent;
    element.style.gap = computed.gap;
    element.style.width = computed.width;
    element.style.height = computed.height;
    element.style.textAlign = computed.textAlign;

    // Handle canvas elements (QR codes)
    handleCanvasElements(element, originalElement);

    // Recursively apply to children
    Array.from(element.children).forEach((child, index) => {
      if (child instanceof HTMLElement) {
        const originalChild = originalElement.children[index] as HTMLElement;
        applyInlineStyles(child, originalChild);
      }
    });
  };

  // Download as Image with style preprocessing
  const downloadImage = async () => {
    if (!ticketRef.current) return;

    try {
      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      document.body.appendChild(tempContainer);

      // Clone the element (deep clone)
      const clonedElement = ticketRef.current.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedElement);

      // Wait for any dynamic content to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Apply inline styles to override problematic CSS
      applyInlineStyles(clonedElement, ticketRef.current);

      // Generate canvas
      const canvas = await html2canvas(clonedElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return false;
        },
      });

      // Clean up
      document.body.removeChild(tempContainer);

      // Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `ticket-${tickets[currentIndex].ticketName}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);

      // Fallback: try with original element and different options
      try {
        const canvas = await html2canvas(ticketRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scale: 1,
          logging: false,
        });

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `ticket-${tickets[currentIndex].ticketName}.png`;
        link.click();
      } catch (fallbackError) {
        console.error("Fallback image generation failed:", fallbackError);
        alert(
          "Failed to generate ticket image. Please try again or contact support."
        );
      }
    }
  };

  // Download as PDF with style preprocessing
  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      document.body.appendChild(tempContainer);

      // Clone the element to avoid modifying the original (deep clone)
      const clonedElement = ticketRef.current.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedElement);

      // Wait for any dynamic content to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Apply inline styles to override problematic CSS
      applyInlineStyles(clonedElement, ticketRef.current);

      // Generate canvas from the processed clone
      const canvas = await html2canvas(clonedElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality for PDF
        logging: false,
        width: clonedElement.offsetWidth,
        height: clonedElement.offsetHeight,
      });

      // Clean up the temporary container
      document.body.removeChild(tempContainer);

      // Generate PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Center the image if it's smaller than the page
      const xOffset = 0;
      const yOffset =
        pdfHeight < pdf.internal.pageSize.getHeight()
          ? (pdf.internal.pageSize.getHeight() - pdfHeight) / 2
          : 0;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, pdfWidth, pdfHeight);
      pdf.save(`ticket-${tickets[currentIndex].ticketName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Fallback: try with simpler options
      try {
        const canvas = await html2canvas(ticketRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scale: 1,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ticket-${tickets[currentIndex].ticketName}.pdf`);
      } catch (fallbackError) {
        console.error("Fallback PDF generation failed:", fallbackError);
        alert("Failed to generate PDF. Please try again or contact support.");
      }
    }
  };

  return (
    <>
      <UpcomingTicket ticket={tickets[currentIndex]} event={event} />

      <div className="absolute -left-[9999px] opacity-0 pointer-events-none">
        <div
          ref={ticketRef}
          className="bg-white shadow-lg p-6 rounded-xl w-full text-center flex flex-col gap-8 items-center"
        >
          <div
            className={
              "w-full h-[250px] lg:h-[296px]  bg-neutral-100 p-[15px] text-center font-mono text-[1.4rem] flex flex-col justify-between items-center "
            }
          >
            <div className={"flex items-center justify-between gap-4 w-full"}>
              <span className="text-neutral-600">
                1x {Capitalize(tickets[currentIndex].ticketType)}
              </span>
              {isFree ? (
                <span className="text-deep-100 font-medium">{t("free")}</span>
              ) : (
                `${tickets[currentIndex].ticketPrice} ${event.currency}`
              )}
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="h-[2px] w-full rounded-[10px] bg-neutral-200"></div>
              <div className={"flex items-center justify-between gap-4 w-full"}>
                <span className="text-neutral-600">{t("ticketId")}</span>
                <span className="text-primary-500 font-medium">
                  {tickets[currentIndex].ticketName}
                </span>
              </div>
              <div className={"flex items-center justify-between gap-4 w-full"}>
                <span className="text-neutral-600">{t("name")}</span>
                <span className="text-deep-100 font-medium">
                  {tickets[currentIndex].fullName}
                </span>
              </div>
              <div className={"flex items-center justify-between gap-4 w-full"}>
                <span className="text-neutral-600">{t("email")}</span>
                <span className="text-deep-100 font-medium">
                  {tickets[currentIndex].email}
                </span>
              </div>
              <div className="h-[2px] w-full rounded-[10px] bg-neutral-200"></div>
              <div className={"flex items-center justify-between gap-4 w-full"}>
                <span className="text-neutral-600">{t("date")}</span>
                <span className="text-deep-100 font-medium">
                  {FormatDate(event.eventDays[0].startDate)}
                </span>
              </div>
              <div className={"flex items-center justify-between gap-4 w-full"}>
                <span className="text-neutral-600">{t("time")}</span>
                <span className="text-deep-100 font-medium">
                  {`${TimesTampToDateTime(event.eventDays[0]?.startDate ?? "").hour}:${TimesTampToDateTime(event.eventDays[0]?.startDate ?? "").minute}`}{" "}
                  -{" "}
                  {`${TimesTampToDateTime(event.eventDays[0]?.endTime ?? "").hour}:${TimesTampToDateTime(event.eventDays[0]?.endTime ?? "").minute}`}
                </span>
              </div>
              <div className={"flex items-center justify-between gap-4 w-full"}>
                <span className="text-neutral-600">{t("location")}</span>
                <span className="text-deep-100 font-medium text-right">
                  {event.address}
                </span>
              </div>
            </div>
          </div>
          <QRCodeCanvas
            value={tickets[currentIndex].ticketId}
            size={128}
            level="H"
          />
        </div>
      </div>

      <div className="border border-neutral-100 rounded-[100px] py-4 px-[1.5rem] flex justify-between">
        <div className="flex items-center gap-[18px]">
          <button
            onClick={goToPrevious}
            disabled={mockTickets.length <= 1}
            className="w-[35px] cursor-pointer h-[35px] disabled:cursor-not-allowed rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <ArrowLeft2 variant="Bulk" size={20} color="#0D0D0D" />
          </button>
          <span className="text-[2.2rem] leading-12 text-neutral-600">
            <span className="text-primary-500">{currentIndex + 1}</span>/
            {mockTickets.length}
          </span>
          <button
            onClick={goToNext}
            disabled={mockTickets.length <= 1}
            className="w-[35px] cursor-pointer h-[35px] disabled:cursor-not-allowed rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <ArrowRight2 variant="Bulk" size={20} color="#0D0D0D" />
          </button>
        </div>
        <button
          onClick={downloadPDF}
          className="border-2 cursor-pointer border-primary-500 px-12 py-[7.5px] bg-[#FFEFE2] rounded-[100px] flex gap-4 items-center justify-center"
        >
          <DocumentDownload
            variant="Bulk"
            size={20}
            color="#E45B00"
            className="hidden lg:block"
          />
          <span className="text-[1.5rem] text-primary-500">
            {t("download")}
          </span>
        </button>
      </div>
    </>
  );
}
