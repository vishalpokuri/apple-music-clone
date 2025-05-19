import { useSongDetailStore } from "../../utils/store";
function TitleDesc() {
  const { artist, title } = useSongDetailStore();
  return (
    <div>
      <div className="font-title opacity-90 sm:text-sm/4 text-md">{title}</div>
      <div className="font-artist opacity-75 mb-0 sm:mb-2 text-sm/5">
        {artist}
      </div>
    </div>
  );
}

export default TitleDesc;
