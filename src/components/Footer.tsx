export function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-300/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <span className="font-brand text-lg text-amber-300/80">DeerDiary</span>
        <p className="max-w-md text-xs text-parchment/45">
          Field notes, moon &amp; weather patterns, and trophy scoring for hunters who keep a diary in the truck console.
        </p>
      </div>
    </footer>
  );
}
