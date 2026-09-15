import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

export type AsideType = 'cart' | 'mobile' | 'size' | 'closed';

type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * An overlay that either slides in from the right (`drawer`) or sits centred
 * (`modal`). Only one can be open at a time — the provider holds a single
 * active type rather than a flag per overlay.
 */
export function Aside({
  children,
  heading,
  type,
  variant = 'drawer',
}: {
  children?: ReactNode;
  type: AsideType;
  heading: ReactNode;
  variant?: 'drawer' | 'modal';
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;

    const abortController = new AbortController();

    document.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') close();
      },
      {signal: abortController.signal},
    );

    // Hold the page still behind the overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      abortController.abort();
      document.body.style.overflow = previousOverflow;
    };
  }, [close, expanded]);

  const panel = (
    <>
      <div className="overlay-head">
        <span id={id}>{heading}</span>
        <button
          className="overlay-close"
          onClick={close}
          aria-label="Close"
          ref={closeRef}
          type="button"
        >
          ✕
        </button>
      </div>
      {children}
    </>
  );

  return (
    <div className="overlay" role="dialog" aria-modal aria-labelledby={id} hidden={!expanded}>
      <button
        className="overlay-scrim"
        onClick={close}
        aria-label="Close"
        tabIndex={-1}
        type="button"
      />
      {variant === 'drawer' ? (
        <aside className="drawer">{panel}</aside>
      ) : (
        <div className="modal-centre">
          <div className="modal">{panel}</div>
        </div>
      )}
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const close = useCallback(() => setType('closed'), []);
  const value = useMemo(
    () => ({type, open: setType, close}),
    [type, close],
  );

  return (
    <AsideContext.Provider value={value}>{children}</AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
