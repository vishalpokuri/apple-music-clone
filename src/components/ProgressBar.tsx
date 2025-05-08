import { useCurrentTimeStore, useSongDetailStore } from "../utils/store";

function ProgressBar() {
  const { duration } = useSongDetailStore();
  const { currentTime } = useCurrentTimeStore();
  //Need 4 forwardTime, backwardTime
  const forwardTimeMins = Math.floor(currentTime / 1000 / 60);
  const forwardTimeSecs = Math.floor((currentTime / 1000) % 60);
  const backwardTimeMins = Math.floor((duration - currentTime / 1000) / 60);
  const backwardTimeSecs = Math.floor((duration - currentTime / 1000) % 60);
  return (
    <div className="w-[100%] flex flex-row justify-between font-interface opacity-75 text-[12px] mb-1">
      <div>
        {forwardTimeMins}:{forwardTimeSecs}
      </div>
      <div>
        -{backwardTimeMins}:{backwardTimeSecs}
      </div>
    </div>
  );
}

export default ProgressBar;
