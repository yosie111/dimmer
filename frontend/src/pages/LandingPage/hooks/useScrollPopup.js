import { useEffect, useRef, useState } from "react";

export function useScrollPopup({ disabled = false, thresholdPercent = 40 } = {}) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (hasTriggeredRef.current || popupDismissed) return;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = (window.scrollY / docHeight) * 100;

      if (scrollPercent > thresholdPercent) {
        hasTriggeredRef.current = true;
        setShowPopup(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [popupDismissed, disabled, thresholdPercent]);

  const closePopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
  };

  const openPopup = () => setShowPopup(true);

  return { showPopup, setShowPopup, popupDismissed, closePopup, openPopup };
}
