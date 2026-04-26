"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import EnquiryModal from "@/components/enquiry/EnquiryModal";

export type OpenEnquiryOptions = {
  /** Matches ContactForm / modal select values: trevana, citywalk, square, avenue-iv, other */
  project?: string;
};

type EnquiryContextValue = {
  openEnquiry: (opts?: OpenEnquiryOptions) => void;
  closeEnquiry: () => void;
  isOpen: boolean;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used within EnquiryProvider");
  }
  return ctx;
}

export function EnquiryProvider({
  children,
  brandLogoSrc,
  brandLogoAlt,
}: {
  children: ReactNode;
  brandLogoSrc?: string;
  brandLogoAlt?: string;
}) {
  const [isOpen, setOpen] = useState(false);
  const [defaultProject, setDefaultProject] = useState("");

  const openEnquiry = useCallback((opts?: OpenEnquiryOptions) => {
    setDefaultProject(opts?.project ?? "");
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ openEnquiry, closeEnquiry, isOpen }),
    [openEnquiry, closeEnquiry, isOpen]
  );

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal
        isOpen={isOpen}
        onClose={closeEnquiry}
        defaultProject={defaultProject}
        logoSrc={brandLogoSrc}
        logoAlt={brandLogoAlt}
      />
    </EnquiryContext.Provider>
  );
}

/** Button (or styled trigger) that opens the global enquiry modal. */
export function EnquiryTrigger({
  project,
  className = "",
  children,
}: {
  project?: string;
  className?: string;
  children: ReactNode;
}) {
  const { openEnquiry } = useEnquiry();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openEnquiry(project ? { project } : undefined)}
    >
      {children}
    </button>
  );
}
