import AboutContactMenu from "./nav/AboutContactMenu";

function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2 select-none">
        <div className="w-2 h-2 bg-green-500 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
        <div className="text-lg font-bold tracking-wide">
          <span className="text-white">R</span>
          <span className="text-green-500">Λ</span>
          <span className="text-white">CK</span>
          <span className="text-gray-500 font-medium ml-0.5">dcim</span>
        </div>
      </div>

      <AboutContactMenu />
    </nav>
  );
}

export default LandingNav;