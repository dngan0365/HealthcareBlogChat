import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Hook
export const useMenu = () => useContext(MenuContext);
