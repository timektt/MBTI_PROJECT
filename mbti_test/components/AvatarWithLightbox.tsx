import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react"; // ใช้ icon X

export default function AvatarWithLightbox({ imageUrl }: { imageUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const processedUrl = imageUrl.includes("/upload/")
    ? imageUrl.replace("/upload/", "/upload/c_fill,w_40,h_40,r_max/")
    : imageUrl;

  const closeLightbox = () => setIsOpen(false);

  // Block background scroll when Lightbox open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Close on ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="focus:outline-none"
        aria-label="Open profile image"
      >
        <Image
          src={processedUrl}
          alt="profile"
          width={40}
          height={40}
          className="rounded-full border hover:ring-2 hover:ring-blue-400 transition"
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            <Image
              src={imageUrl}
              alt="profile full size"
              width={600}
              height={600}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />
          </div>,
          document.body
        )}
    </>
  );
}
