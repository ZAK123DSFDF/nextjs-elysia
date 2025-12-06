export function ServerFetchSkeleton({
  title = "Loading...",
  lines = 2,
}: {
  title?: string;
  lines?: number;
}) {
  return (
    <div className="p-4 border rounded-md bg-white shadow animate-pulse">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      {Array.from({ length: lines }).map((_, i) => (
        <p
          key={i}
          className={`h-4 bg-gray-200 rounded ${
            i === 0 ? "w-1/2 mb-2" : "w-1/3"
          }`}
        />
      ))}
    </div>
  );
}
