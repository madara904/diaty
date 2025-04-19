export default function Loading() {
  return (
    <div className="w-full space-y-4">
      {/* Dashboard title skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-7 w-7 rounded-md bg-muted animate-pulse"></div>
        <div className="h-8 w-56 rounded-md bg-muted animate-pulse"></div>
      </div>
      
      {/* Content skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="h-32 rounded-lg bg-muted animate-pulse"></div>
        <div className="h-32 rounded-lg bg-muted animate-pulse"></div>
        <div className="h-32 rounded-lg bg-muted animate-pulse"></div>
      </div>
      
      <div className="h-64 rounded-lg bg-muted animate-pulse mt-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="h-48 rounded-lg bg-muted animate-pulse"></div>
        <div className="h-48 rounded-lg bg-muted animate-pulse"></div>
      </div>
    </div>
  );
}