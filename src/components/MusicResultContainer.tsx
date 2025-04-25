interface MusicResult {
  imgurl: string;
  title: string;
  artist: string;
  downloadUrl: string;
}

function MusicResultContainer({
  imgurl,
  title,
  artist,
  downloadUrl,
}: MusicResult) {
  console.log(downloadUrl);
  return (
    <>
      <div className="w-full flex flex-row h-16 my-2 px-2 items-center ">
        <div className="h-12 w-12 flex items-center justify-center mr-3">
          <img
            src={imgurl}
            alt={`${title} album cover`}
            className="min-w-full h-full rounded-sm object-cover"
          />
        </div>
        <div className="flex flex-col justify-center truncate">
          <p className="text-md font-lyrics text-[#d8d8d8] truncate">{title}</p>
          <p className="text-sm  font-interface text-[#ff4e6b] truncate">
            {artist}
          </p>
        </div>
      </div>
      <div className="w-[90%] h-[1px] bg-zinc-700 mx-auto"></div>
    </>
  );
}

export default MusicResultContainer;
