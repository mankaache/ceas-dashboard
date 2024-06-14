import { useLayoutEffect, useState } from "react";

export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isXl, setIsXl] = useState(false);
  const [isXxl, setIsXxl] = useState(false);

  const checkScreenSize = () => {
    const mobileMediaQuery = window.matchMedia("(max-width: 575px)");
    const smMediaQuery = window.matchMedia(
      "(min-width: 576px) and (max-width: 767px)"
    );
    const mdMediaQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 991px)"
    );
    const xlMediaQuery = window.matchMedia(
      "(min-width: 992px) and (max-width: 1199px)"
    );
    const xxlMediaQuery = window.matchMedia("(min-width: 1200px)");

    setIsMobile(mobileMediaQuery.matches);
    setIsSm(smMediaQuery.matches);
    setIsMd(mdMediaQuery.matches);
    setIsXl(xlMediaQuery.matches);
    setIsXxl(xxlMediaQuery.matches);
  };

  useLayoutEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return { isMobile, isSm, isMd, isXl, isXxl };
};
