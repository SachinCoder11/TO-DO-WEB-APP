const Navbar = () => {
  return (
    <nav className="flex flex-col sm:flex-row justify-between bg-purple-500 text-black py-2 px-4">
      <div className="symbol">
        <span className="font-bold text-xl">Your Tasks</span>
      </div>
      <ul className=" flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2 sm:mt-0">
        
        <li className="cursor-pointer text-black font-bold transition-all duration-50">The secret of getting ahead is getting started</li>
      </ul>
    </nav>
  );
};

export default Navbar;
