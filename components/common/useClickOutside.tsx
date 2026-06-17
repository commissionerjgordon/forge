import { useEffect, RefObject } from 'react';

// Accept either a single RefObject or an array of RefObjects
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  callback: () => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const refArray = Array.isArray(refs) ? refs : [refs];

      // Check if the click target is inside ANY of the provided refs
      const clickedInsideAnyRef = refArray.some(
        (ref) => ref.current && ref.current.contains(target)
      );

      // If the click is outside all tracked refs, trigger the callback
      if (!clickedInsideAnyRef) {
        callback();
      }
    };

    // document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      //   document.addEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, callback]); // React treats arrays as new references on render; see optimization note below
}
