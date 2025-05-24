import { AnimatePresence, motion } from "framer-motion";
import Key from "./ui/Key";
import { useEffect } from "react";
import { DownArrow, LeftArrow, RightArrow, UpArrow } from "./ui/Arrows";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className=" w-[50vw] h-[65vh] bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col justify-between">
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
                  I'm a music player inspired by Apple Music.
                </p>
              </div>
              {/* Keybindings Section */}
              <div className="flex flex-col gap-4 text-white/90 mx-auto w-[50%] p-4 border border-white/20 rounded-lg mb-10">
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
                    <Key>
                      <UpArrow />
                    </Key>
                    {" / "}{" "}
                    <Key>
                      <DownArrow />
                    </Key>
                  </p>
                  <span className="text-sm text-white/70">
                    Volume Up / Down
                  </span>
                </section>
                <section className="flex flex-row gap-2 items-center  justify-between">
                  <p className="flex items-center gap-2">
                    <Key>
                      <LeftArrow />
                    </Key>
                    {" / "}{" "}
                    <Key>
                      <RightArrow />
                    </Key>
                  </p>
                  <span className="text-sm text-white/70">Seek -5s / +5s</span>
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
              {/* <div className="flex flex-row items-center justify-end w-[100%]">
                <a
                  href="https://github.com/vishalpokuri/apple-music-clone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <section className="flex flex-row items-center gap-2 bg-white/10 px-3 p-1 rounded-md border border-white/30 text-white/50 text-sm">
                    <p className="flex flex-row items-center gap-2 text-white/90 text-sm font-artist">
                      Like this?
                      <span>
                        <Star />
                      </span>
                      on
                    </p>

                    <img
                      src="/assets/Octicons-mark-github.svg.png"
                      alt="Github"
                      className="w-5 aspect-auto"
                    />
                    <p>vishalpokuri</p>
                  </section>
                </a>
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default IntroSection;
// function Star() {
//   return (
//     <div className="group w-4 h-4 cursor-pointer">
//       <svg
//         width="16px"
//         height="16px"
//         viewBox="0 0 24 24"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-full h-full"
//       >
//         <path
//           d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
//           stroke="white"
//           strokeWidth="1.5"
//           fill="#FFDF00"
//         />
//       </svg>
//     </div>
//   );
// }
