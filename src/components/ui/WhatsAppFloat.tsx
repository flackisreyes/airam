"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/utils";
import { WhatsAppIcon } from "./SocialIcons";

/** Botón flotante de WhatsApp visible en toda la página. */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 800);
    const t2 = setTimeout(() => setHint(true), 4000);
    const t3 = setTimeout(() => setHint(false), 11000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 md:bottom-8 md:right-8"
        >
          <AnimatePresence>
            {hint && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-lg sm:block"
              >
                ¿Agendamos tu cita? ✨
              </motion.span>
            )}
          </AnimatePresence>
          <a
            href={whatsappUrl("¡Hola Estética Airam! Me gustaría recibir información. ✨")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            onMouseEnter={() => setHint(true)}
            onMouseLeave={() => setHint(false)}
            className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-110 md:size-16"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden />
            <WhatsAppIcon className="relative size-7 md:size-8" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
