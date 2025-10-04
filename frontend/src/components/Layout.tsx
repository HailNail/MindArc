import { useEffect, useRef, useState } from "react";
import Navigation from "../pages/Auth/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileVersion, setMobileVersion] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 780px)");
    const handleResize = (e: MediaQueryListEvent) => {
      setMobileVersion(e.matches);

      if (!e.matches) {
        setIsSidebarOpen(false);
      }
    };

    setMobileVersion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileVersion || !isSidebarOpen) {
        return;
      }

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, mobileVersion]);

  useEffect(() => {
    // Determine the threshold for when the header should disappear (e.g., 50 pixels)
    const SCROLL_THRESHOLD = 50;

    const handleScroll = () => {
      const currentPositionIsTop = window.scrollY < SCROLL_THRESHOLD;

      if (currentPositionIsTop !== isAtTop) {
        setIsAtTop(currentPositionIsTop);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAtTop]);
  return (
    <>
      <Navigation
        isOpen={isSidebarOpen}
        setIsOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        mobileVersion={mobileVersion}
        isAtTop={isAtTop}
        sidebarRef={sidebarRef}
      />
      <main className="py-3">
        <AppHeader
          isSidebarOpen={isSidebarOpen}
          isAtTop={isAtTop}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
