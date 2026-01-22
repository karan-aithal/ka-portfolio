import { useEffect } from "react";

export function useStickWhenTopReached(
  ref: React.RefObject<HTMLElement>,
  setFixed: (v: boolean) => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
const wantsFix = rect.top <= 0 && rect.bottom > 0;
  const wantsRelease = rect.bottom <= 0;
      if (wantsFix) {
    setFixed(true);
  }

  if (wantsRelease) {
    setFixed(false);
    };}

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
