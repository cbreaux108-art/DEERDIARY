import { useRef } from "react";

export function PhotoInput({ value, onChange }: { value: string | null; onChange: (dataUrl: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-amber-300/15">
          <img src={value} alt="Uploaded" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-ink-900/80 px-2.5 py-1 text-xs text-parchment hover:bg-rust-500"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-amber-300/25 text-parchment/55 transition hover:border-amber-300/45 hover:text-amber-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 17.5V6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="m4 15 4.5-4.5a1.5 1.5 0 0 1 2 0L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="15.5" cy="9" r="1.4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-xs">Add a photo</span>
        </button>
      )}
    </div>
  );
}
