export default function SkeletonLoader({ rows = 3 }: { rows?: number }) {
  return (
    <div className='animate-pulse space-y-4'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='glass-card p-6'>
          <div className='h-4 bg-emerald-100 rounded-full w-1/3 mb-3' />
          <div className='h-3 bg-slate-100 rounded-full w-full mb-2' />
          <div className='h-3 bg-slate-100 rounded-full w-4/5' />
        </div>
      ))}
    </div>
  );
}
