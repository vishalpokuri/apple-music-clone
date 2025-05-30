import { useState, useEffect } from "react";

export default function StartupLoader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const steps = 100;
    const increment = 100 / steps;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => setShouldHide(true), 300);
          return 100;
        }
        return newProgress;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  if (shouldHide) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#18181b] flex items-center justify-center transition-opacity duration-300 ${
        isComplete ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-48 h-1 bg-[#27272a] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#52525b] rounded-full transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: isComplete ? "300ms" : "100ms",
          }}
        />
      </div>
    </div>
  );
}
