function MusicPlayer() {
  return (
    <div className="text-white w-[90%] flex flex-col items-center mx-auto mt-3">
      <div className="w-[100%] flex flex-row justify-between font-interface opacity-75 text-xs mb-1">
        <div>0:59</div>
        <div>-3:28</div>
      </div>
      {/* playbar */}
      <div className="w-[100%] h-[4px] bg-white rounded-full mb-2"></div>

      <div className="font-lyrics">Room for 2</div>
      <div className="font-interface opacity-75">Benson Boone</div>
    </div>
  );
}

export default MusicPlayer;
