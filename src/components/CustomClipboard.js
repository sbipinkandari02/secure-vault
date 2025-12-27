import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import "../styles/Clipboard.css";

export default function CustomClipboard({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    // Auto-clear clipboard after 5 seconds
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText("");
      } catch {}
      setCopied(false);
    }, 5000);
  };

  if (!value) return null;

  return (
    <CopyToClipboard text={value} onCopy={handleCopy}>
      <span
        className={`clipboard-icon ${copied ? "copied" : ""}`}
        title={copied ? "Copied" : "Copy to clipboard"}
      >
        {copied ? <AiOutlineCheck /> : <AiOutlineCopy />}
      </span>
    </CopyToClipboard>
  );
}
