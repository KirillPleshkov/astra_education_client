import { RefObject, useEffect, useRef, useState } from "react";

const useModal = <T extends HTMLElement>() => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef<T>(null);

  const [excludeRefs, setExcludeRefs] = useState<RefObject<HTMLElement>[]>([]);

  // const setExcludeRef = (excludeRef: RefObject<HTMLElement>) => {
  //   if (!excludeRefs.some((e) => e === excludeRef)) {
  //     setExcludeRefs((prev) => [...prev, excludeRef]);
  //   }
  // };

  useEffect(() => {
    const checkIfClickedOutside = (e: unknown) => {
      const isButtonClick = excludeRefs?.reduce(
        (prev, curr) => (!curr?.current?.contains(e.target) ? prev : true),
        false
      );

      if (isOpen && !modalRef.current?.contains(e.target) && !isButtonClick) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen, excludeRefs]);

  return { isOpen, setIsOpen, modalRef, setExcludeRefs };
};

export { useModal };
