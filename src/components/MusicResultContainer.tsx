interface MusicResult {
  imgurl: string;
  title: string;
  artist: string;
}

function MusicResultContainer({ imgurl, title, artist }: MusicResult) {
  // const imgurlt =
  //   "https://i.scdn.co/image/ab67616d0000b273cc04ff3e70e146ba9abacf40";
  // const titlet = "In the stars";
  // const artistt = "Benson Boone";
  return (
    <>
      <div className="w-full flex flex-row h-16 my-2 px-2 items-center">
        <div className="h-12 w-12 flex items-center justify-center mr-3">
          <img
            src={imgurl}
            alt={`${title} album cover`}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-md font-lyrics text-[#d8d8d8] truncate">{title}</p>
          <p className="text-sm font-interface text-[#ff4e6b] truncate">
            {artist}
          </p>
        </div>
      </div>
      <div className="w-[90%] h-[1px] bg-zinc-700 mx-auto"></div>
    </>
  );
}

export default MusicResultContainer;
