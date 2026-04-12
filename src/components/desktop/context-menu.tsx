"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";

export function ContextMenu() {
  const { contextMenu } = useDesktop();
  const dispatch = useDesktopDispatch();

  function close() {
    dispatch({ type: "SET_CONTEXT_MENU", menu: null });
  }

  return (
    <AnimatePresence>
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[600]" onClick={close} onContextMenu={(e) => { e.preventDefault(); close(); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[601] min-w-[200px] overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a]/95 py-1 shadow-xl backdrop-blur-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.items.map((item, i) =>
              item.separator ? (
                <div key={i} className="my-1 h-px bg-white/8" />
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    item.action?.();
                    close();
                  }}
                  disabled={item.disabled}
                  className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-white/70 transition-colors hover:bg-blue-600/40 hover:text-white disabled:text-white/20 disabled:hover:bg-transparent"
                >
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
