import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-[#E5E5E5]">
      <div className="container-main flex items-center justify-between h-14">
        <span className="text-[13px] text-[#6B6B6B]">
          &copy; 2026 ShortlistIQ
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            Terms
          </Link>
          <a
            href="mailto:contact@shortlistiq.com"
            className="text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
