import { AnimatePresence, motion } from "framer-motion";
import Key from "./ui/Key";
import { useEffect } from "react";

function IntroSection({
  help,
  setHelp,
}: {
  help: boolean;
  setHelp: (help: boolean) => void;
}) {
  useEffect(() => {
    if (!window.localStorage.getItem("new-user")) {
      setHelp(true);
      window.localStorage.setItem("new-user", "true");
    }
  }, []);
  const width = window.screen.width;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHelp(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {help && width > 1024 && (
        <>
          <motion.div
            className="fixed top-0 left-0 z-30 w-full h-full backdrop-blur-sm bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            onClick={() => setHelp(false)}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 p-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <div className=" w-[50vw] h-[60vh] bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col justify-between">
              <img
                src="/assets/Apple_logo_grey.svg.png"
                alt="Apple Logo"
                className="w-5 absolute top-5 right-5 opacity-50 aspect-auto"
              />
              {/* Intro Section */}
              <div>
                <h1 className="text-white text-3xl font-semibold font-lyrics mb-2">
                  Heyaa 👋
                </h1>
                <p className="text-white/90 text-base font-title mb-4">
                  I’m a music player inspired by Apple Music.
                </p>
              </div>
              {/* Keybindings Section */}
              <div className="flex flex-col gap-4 text-white/90 mx-auto w-[50%] p-4 border border-white/20 rounded-lg">
                <p className="text-white/80 text-sm font-title">
                  Use these shortcuts to move around faster:
                </p>
                <section className="flex flex-row gap-2 items-center  justify-between">
                  <p className="flex items-center gap-2">
                    <Key>Ctrl</Key> + <Key>K</Key>{" "}
                  </p>
                  <span className="text-sm text-white/70">Search </span>
                </section>
                <section className="flex flex-row gap-2 items-center  justify-between">
                  <p className="flex items-center gap-2">
                    <Key>Space</Key>{" "}
                  </p>
                  <span className="text-sm text-white/70"> Play / Pause</span>
                </section>
                <section className="flex flex-row gap-2 items-center  justify-between">
                  <p className="flex items-center gap-2">
                    <Key>F11</Key>{" "}
                  </p>
                  <span className="text-sm text-white/70">Immersive mode</span>
                </section>
                <div className="flex flex-row gap-2 items-center  justify-between">
                  <p className="flex items-center gap-2">
                    <span className="bg-white/10 px-3 p-1 rounded-md border border-white/30">
                      ?
                    </span>
                    <span className="text-sm text-white/70">
                      at the bottom right
                    </span>
                  </p>
                  <span className="text-sm text-white/70"> Help</span>
                </div>
              </div>
              {/* My Section */}
              <div className="flex flex-row items-center justify-between w-[100%]">
                <p className=" text-white/90 text-sm font-artist">
                  Like this? Star it on GitHub!
                </p>
                <a
                  href="https://github.com/vishalpokuri/apple-music-clone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <section className="flex flex-row items-center gap-2 bg-white/10 px-3 p-1 rounded-md border border-white/30 text-white/50 text-sm">
                    <p>vishalpokuri</p>

                    <img
                      src="/assets/Octicons-mark-github.svg.png"
                      alt="Github"
                      className="w-5 aspect-auto"
                    />
                  </section>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default IntroSection;
