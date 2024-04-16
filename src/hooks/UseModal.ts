import { RefObject, useEffect, useRef, useState } from "react";

const useModal = <T extends HTMLElement, L extends HTMLElement>() => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef<T>(null);

  const [buttonRefs, setButtonRefs] = useState<RefObject<L>[]>([]);

  const setButtonRef = (buttonRef: RefObject<L>) => {
    setButtonRefs((prev) => [...prev, buttonRef]);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      const isButtonClick = buttonRefs?.reduce(
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
  }, [isOpen]);

  return { isOpen, setIsOpen, modalRef, setButtonRef };
};

export { useModal };
