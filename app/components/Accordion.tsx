import {useId, useState} from 'react';

export type AccordionItem = {
  key: string;
  label: string;
  body: string;
};

/**
 * Single-open accordion. Used for the PDP detail tabs and the FAQ list, which
 * differ only in type scale — see `.faq` in app.css.
 */
export function Accordion({
  items,
  defaultOpen = null,
  className = '',
}: {
  items: AccordionItem[];
  /** Key of the item open on first render, or null for all closed. */
  defaultOpen?: string | null;
  className?: string;
}) {
  const [openKey, setOpenKey] = useState<string | null>(defaultOpen);
  const id = useId();

  return (
    <div className={`accordion${className ? ` ${className}` : ''}`}>
      {items.map((item) => {
        const isOpen = openKey === item.key;
        const panelId = `${id}-${item.key}`;

        return (
          <div className="accordion-item" key={item.key}>
            <h3>
              <button
                className="accordion-trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenKey(isOpen ? null : item.key)}
              >
                {item.label}
                <span className="glyph" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            {/*
              Always rendered and toggled with `hidden` rather than unmounted:
              keeps the FAQ answers in the document for crawlers and in-page
              find, and keeps aria-controls pointing at a real element.
            */}
            <p className="accordion-panel" id={panelId} hidden={!isOpen}>
              {item.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
