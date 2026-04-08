"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, Calendar, ToggleLeft, ToggleRight } from "lucide-react";
import type { Schedule } from "@/hooks/useScheduledPlay";

interface SchedulePanelProps {
  schedules: Schedule[];
  onAdd: (schedule: Omit<Schedule, "id">) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function SchedulePanel({
  schedules,
  onAdd,
  onRemove,
  onToggle,
}: SchedulePanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState("07:00");
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [newLabel, setNewLabel] = useState("아침 방송");

  const handleAdd = () => {
    if (!newTime) return;
    onAdd({
      time: newTime,
      days: newDays,
      enabled: true,
      label: newLabel || `예약 ${newTime}`,
    });
    setIsAdding(false);
    setNewTime("07:00");
    setNewDays([1, 2, 3, 4, 5]);
    setNewLabel("아침 방송");
  };

  const toggleDay = (day: number) => {
    setNewDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">예약 청취 (AEST)</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAdding(!isAdding)}
          className="w-7 h-7 rounded-full bg-indigo-600/50 hover:bg-indigo-600 flex items-center justify-center transition-colors"
        >
          <Plus size={14} className="text-white" />
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-4 space-y-3">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="이름 (예: 아침 뉴스)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-1.5">
                {DAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-1 text-xs rounded-lg transition-colors ${
                      newDays.includes(day)
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 text-xs text-gray-400 glass rounded-lg hover:bg-white/5"
                >
                  취소
                </button>
                <button
                  onClick={handleAdd}
                  disabled={newDays.length === 0}
                  className="flex-1 py-2 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {schedules.length === 0 ? (
            <p className="text-center text-xs text-gray-600 py-4">
              예약된 청취가 없습니다
            </p>
          ) : (
            schedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 glass rounded-xl"
              >
                <button
                  onClick={() => onToggle(schedule.id)}
                  className={`flex-shrink-0 ${
                    schedule.enabled ? "text-indigo-400" : "text-gray-600"
                  }`}
                >
                  {schedule.enabled ? (
                    <ToggleRight size={20} />
                  ) : (
                    <ToggleLeft size={20} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    schedule.enabled ? "text-white" : "text-gray-500"
                  }`}>
                    {schedule.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {schedule.time} AEST &nbsp;|&nbsp;
                    {schedule.days.map((d) => DAY_LABELS[d]).join("·")}
                  </p>
                </div>

                <button
                  onClick={() => onRemove(schedule.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
