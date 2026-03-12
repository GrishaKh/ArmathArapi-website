"use client"

interface ProgressBarProps {
  percent: number
  size?: "sm" | "md"
  showLabel?: boolean
}

export function ProgressBar({ percent, size = "sm", showLabel = true }: ProgressBarProps) {
  const heightClass = size === "sm" ? "h-1.5" : "h-2.5"

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex-1 ${heightClass} bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-armath-blue to-armath-blue/70 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 tabular-nums w-8 text-right">{percent}%</span>
      )}
    </div>
  )
}
