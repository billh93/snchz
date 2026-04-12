"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";
import { PROJECTS } from "@/lib/data";
import { Rocket, CheckCircle, Building } from "lucide-react";

const TIMELINE = [
  { title: "Riftmatch launched", date: "Apr 2026", icon: Rocket, desc: "Competitive gaming matchmaking platform" },
  { title: "Cue by Abriz shipped", date: "Jan 2026", icon: Rocket, desc: "AI-powered productivity tool" },
  { title: "Abriz founded", date: "Jan 2026", icon: Building, desc: "Frontier lab for emerging technology" },
  { title: "dope.link acquired", date: "2022", icon: CheckCircle, desc: "Link-in-bio product" },
  { title: "Web-Analytics.ai acquired", date: "2021", icon: CheckCircle, desc: "Privacy-first web analytics" },
  { title: "Up-Time.io acquired", date: "2021", icon: CheckCircle, desc: "Uptime monitoring platform" },
];

export function NotificationCenter() {
  const { notificationCenterOpen } = useDesktop();
  const dispatch = useDesktopDispatch();

  function close() {
    dispatch({ type: "TOGGLE_NOTIFICATION_CENTER" });
  }

  return (
    <AnimatePresence>
      {notificationCenterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300]"
            onClick={close}
          />
          <motion.div
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed right-0 top-7 bottom-0 z-[301] w-[340px] overflow-auto border-l border-white/8 bg-[#1e1e1e]/90 p-4 backdrop-blur-2xl"
          >
            <h2 className="mb-4 text-sm font-semibold text-white/80">Notifications</h2>

            <div className="space-y-3">
              {TIMELINE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl bg-white/5 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8">
                        <Icon size={14} className="text-white/50" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-white/80">{item.title}</p>
                        <p className="mt-0.5 text-[12px] text-white/40">{item.desc}</p>
                        <p className="mt-1 text-[11px] text-white/25">{item.date}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
