"use client";

import { api } from "@/lib/eden";
import { useAppMutation } from "@/hooks/useAppMutation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { SuccessBody, SuccessBodySchema } from "@/lib/validation/joke";

export default function RedirectClient() {
  // 1. Initialize Form with Shared Zod Schema
  const { register, handleSubmit, control, setError } = useForm<SuccessBody>({
    resolver: zodResolver(SuccessBodySchema),
    defaultValues: { rememberMe: false },
  });

  // 2. Watch the value for UI labels (replaces useState)
  const isRemembered = useWatch({
    control,
    name: "rememberMe",
    defaultValue: false,
  });

  // 3. Mutations
  const successMutation = useAppMutation(
    (data: SuccessBody) => api.success.post(data),
    {
      setError,
    },
  );

  const logoutMutation = useAppMutation(() => api.logout.post());
  const redirectMutation = useAppMutation(() => api.redirect.post());
  const errorMutation = useAppMutation(() => api.error.post());

  // 4. Submit Handler
  const onSubmit = (data: SuccessBody) => {
    successMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Cookie Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Handled via React Hook Form & Zod
        </p>
      </div>

      {/* Wrapping in Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Settings Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Session Persistence
              </span>
              <span className="text-xs text-slate-500">
                {isRemembered
                  ? "Persistent (1 Week)"
                  : "Session Only (On Close)"}
              </span>
            </div>

            {/* Switch Integrated with React Hook Form */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberMe")} // RHF Register
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Success Submit Button */}
        <button
          type="submit"
          disabled={successMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <CheckCircle2 size={18} />
          {successMutation.isPending ? "Setting Cookies..." : "Set Cookies"}
        </button>
      </form>

      {/* Other Utility Buttons (Outside the main success form) */}
      <div className="grid grid-cols-1 gap-3 mt-4">
        <button
          onClick={() => logoutMutation.mutate(undefined)}
          disabled={logoutMutation.isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all active:scale-[0.98]"
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

      {/* Footer Indicators */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-4">
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
          <ShieldCheck size={12} className="text-emerald-500" /> HttpOnly
        </div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
          <ShieldCheck size={12} className="text-emerald-500" /> Secure
        </div>
      </div>
    </div>
  );
}
