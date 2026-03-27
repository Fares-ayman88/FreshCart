export default function Loading() {
  return (
    <div className="grid gap-6">
      <div className="h-16 animate-pulse rounded-[2rem] bg-white/70" />
      <div className="h-[28rem] animate-pulse rounded-[2rem] bg-white/70" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-[2rem] bg-white/70"
          />
        ))}
      </div>
    </div>
  );
}
