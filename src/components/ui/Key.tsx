function Key({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) {
  return (
    <kbd
      className={`px-2 py-1 text-sm font-mono bg-muted border rounded border-white text-white ${classes}`}
    >
      {children}
    </kbd>
  );
}

export default Key;
