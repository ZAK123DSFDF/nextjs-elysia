import React from "react";
import { EdenError, ExtractEdenData, ExtractEdenError } from "@/lib/eden/types";

interface ServerFetchProps<TFetcher extends () => Promise<any>> {
  fetcher: TFetcher;
  errorTitle?: string;
  render: (
    data: ExtractEdenData<Awaited<ReturnType<TFetcher>>>,
  ) => React.ReactNode;
}

export default async function ServerFetch<TFetcher extends () => Promise<any>>({
  fetcher,
  render,
  errorTitle = "Error",
}: ServerFetchProps<TFetcher>) {
  type TData = ExtractEdenData<Awaited<ReturnType<TFetcher>>>;
  type TError = ExtractEdenError<Awaited<ReturnType<TFetcher>>>;

  const res = await fetcher();
  const raw = res.data ?? res.error?.value ?? null;

  if (!raw) {
    const fallbackError = {
      message: "Unknown server response",
      error: "Unknown",
      status: 500,
    } as EdenError;

    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-xl text-red-600 font-semibold">{errorTitle}</h2>
        <p className="text-red-500">{fallbackError.message}</p>
      </div>
    );
  }

  if (raw.ok !== true) {
    const err = raw as EdenError;
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-xl font-semibold text-red-600">{errorTitle}</h2>
        <p className="text-red-500">{err.message}</p>
      </div>
    );
  }

  return <>{render(raw.data as TData)}</>;
}
