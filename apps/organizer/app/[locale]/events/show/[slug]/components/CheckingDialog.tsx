"use client";
import PageLoader from "@/components/Loaders/PageLoader";
import { Event, User } from "@workspace/typescript-config";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/Inputs";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import { Scanner, Camera } from "iconsax-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function CheckingDialog({
  event,
  user,
}: {
  event: Event;
  user: User;
}) {
  const t = useTranslations("Events.single_event");
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [ticketID, setTicketID] = useState("");
  const [ticketIdError, setTicketIdError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  // Cleanup scanner on unmount or when scanning stops
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const stopScanning = () => {
    // Stop all video tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    codeReaderRef.current = null;
    setIsScanning(false);
    setScanError("");
  };

  const startScanning = async () => {
    try {
      setScanError("");
      setIsScanning(true);

      // Initialize the code reader
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Use undefined to let browser choose default, or use constraints
      // On mobile, this will prefer the back camera
      await codeReader.decodeFromVideoDevice(
        undefined, // Let browser choose default camera
        videoRef.current!,
        (result, error) => {
          if (result) {
            const scannedText = result.getText();
            setTicketID(scannedText);
            stopScanning();

            if (navigator.vibrate) {
              navigator.vibrate(200);
            }

            toast.success("QR code scanned successfully!");
          }

          if (error && error.name !== "NotFoundException") {
            console.error("Scan error:", error);
          }
        }
      );

      // Store the stream for cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        streamRef.current = videoRef.current.srcObject as MediaStream;
      }
    } catch (error) {
      console.error("Failed to start scanner:", error);

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setScanError(
            "Camera permission denied. Please enable camera access."
          );
        } else if (error.name === "NotFoundError") {
          setScanError("No camera found.");
        } else if (error.name === "NotReadableError") {
          setScanError("Camera is in use by another app.");
        } else if (error.name === "NotSupportedError") {
          setScanError(
            "Camera not supported. Please ensure you're using HTTPS."
          );
        } else {
          setScanError("Failed to access camera: " + error.message);
        }
      }

      setIsScanning(false);
    }
  };

  async function CheckTicketID() {
    setIsLoading(true);
    if (ticketID.trim()) {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checking/event/${event.eventId}/ticket-id/${ticketID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const response = await request.json();
      if (response.status === "success") {
        toast.success("success");
        setTicketID("");
      } else {
        toast.error(response.message);
      }
    } else {
      setTicketIdError("Enter TicketID");
    }
    setIsLoading(false);
  }

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <Dialog
        onOpenChange={(open) => {
          if (!open) stopScanning();
        }}
      >
        <DialogTrigger>
          <span className="px-[15px] py-[7.5px] border-2 border-transparent rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 bg-neutral-100 text-neutral-700">
            <Scanner variant={"Bulk"} color={"#737C8A"} size={20} />
            {t("check_in")}
          </span>
        </DialogTrigger>
        <DialogContent className={"w-[360px] lg:w-[520px] "}>
          <DialogHeader>
            <DialogTitle
              className={
                "font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary"
              }
            >
              {t("check_in")}
            </DialogTitle>
            <DialogDescription className={"sr-only"}>
              <span>User checkIn</span>
            </DialogDescription>
          </DialogHeader>
          <div
            className={
              "flex flex-col w-auto justify-center items-center gap-[30px]"
            }
          >
            <p
              className={
                "font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full"
              }
            >
              {t("check_in_description")}
            </p>

            {/* QR Scanner Section */}
            {isScanning ? (
              <div className="w-full flex flex-col gap-4">
                <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-blue-500 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                  </div>
                </div>
                {scanError && (
                  <p className="text-red-500 text-center text-sm">
                    {scanError}
                  </p>
                )}
                <button
                  onClick={stopScanning}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Stop Scanning
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={startScanning}
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Camera size={20} />
                  Scan QR Code
                </button>

                <div className="w-full relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">
                      or enter manually
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <Input
                    value={ticketID}
                    onChange={(e) => setTicketID(e.target.value)}
                    error={ticketIdError}
                  >
                    {t("ticketID")}
                  </Input>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <ButtonPrimary
              onClick={CheckTicketID}
              disabled={isLoading || isScanning}
              className="w-full"
            >
              {isLoading ? <LoadingCircleSmall /> : t("check_in")}
            </ButtonPrimary>
            <DialogClose ref={closeRef} className="sr-only"></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
