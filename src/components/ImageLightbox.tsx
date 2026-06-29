'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Renders an image inside a clickable trigger; clicking opens the full image in
 * a dismissible overlay (backdrop click, Escape, or the close button all close it).
 */
export function ImageLightbox({
  src,
  alt,
  triggerClassName,
  imgClassName,
}: {
  src: string
  alt: string
  triggerClassName?: string
  imgClassName?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — büyütmek için tıklayın`}
        className={triggerClassName}
      >
        <img src={src} alt={alt} className={imgClassName} />
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-navy/85 p-4 backdrop-blur-sm [animation:lightboxIn_.2s_ease]"
          >
            {/* stop propagation so clicking the image itself doesn't close it */}
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[94vw] cursor-default rounded-[14px] shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/95 text-[24px] font-bold leading-none text-navy shadow-lg transition hover:bg-cream"
            >
              ×
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
