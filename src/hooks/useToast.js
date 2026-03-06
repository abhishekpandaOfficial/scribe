import { useCallback, useRef, useState } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);
  const toastSeq = useRef(0);

  const show = useCallback((message, type = "success") => {
    toastSeq.current += 1;
    const id = `${Date.now()}-${toastSeq.current}`;
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  const remove = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  return { toasts, show, remove };
}
