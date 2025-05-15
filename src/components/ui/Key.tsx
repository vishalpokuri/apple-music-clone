function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-2 py-1 text-sm font-mono bg-muted border rounded border-white text-white">
      {children}
    </kbd>
  );
}

export default Key;
