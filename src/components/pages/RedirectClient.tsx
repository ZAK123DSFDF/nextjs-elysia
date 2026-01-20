"use client";

import { api } from "@/lib/eden";
import { useAppMutation } from "@/hooks/useAppMutation";
import { useState } from "react";
import {
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react"; // Optional: npm i lucide-react

export default function RedirectClient() {
  const [rememberMe, setRememberMe] = useState(false);

  const redirectMutation = useAppMutation(() => api.redirect.post());
  const successMutation = useAppMutation(() =>
    api.success.post({ rememberMe }),
  );
  const errorMutation = useAppMutation(() => api.error.post());
  const logoutMutation = useAppMutation(() => api.logout.post());

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Cookie Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Test Elysia HttpOnly cookies with Eden Treaty
        </p>
      </div>

      {/* Settings Section */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Session Persistence
            </span>
            <span className="text-xs text-slate-500">
              {rememberMe ? "Persistent (1 Week)" : "Session Only (On Close)"}
            </span>
          </div>

          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => successMutation.mutate(undefined)}
          disabled={successMutation.isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <CheckCircle2 size={18} />
          {successMutation.isPending ? "Setting Cookies..." : "Set Cookies"}
        </button>

        <button
          onClick={() => logoutMutation.mutate(undefined)}
          disabled={logoutMutation.isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <LogOut size={18} />
          {logoutMutation.isPending ? "Clearing..." : "Remove nextjs_check"}
        </button>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => redirectMutation.mutate(undefined)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm transition-all"
          >
            <ExternalLink size={16} />
            Redirect
          </button>

          <button
            onClick={() => errorMutation.mutate(undefined)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm transition-all border border-rose-100"
          >
            <AlertCircle size={16} />
            Test Error
          </button>
        </div>
      </div>

      {/* Footer Status Indicators */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-4">
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
          <ShieldCheck size={12} className="text-emerald-500" /> HttpOnly
        </div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
          <ShieldCheck size={12} className="text-emerald-500" /> Secure
        </div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
          <ShieldAlert size={12} className="text-amber-500" /> Lax
        </div>
      </div>
    </div>
  );
}
