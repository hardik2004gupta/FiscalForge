interface TopBarProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function TopBar({ title, subtitle, children }: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      <div>
        {subtitle && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 leading-none mb-1">
            {subtitle}
          </p>
        )}
        <h1 className="text-[15px] font-semibold text-foreground leading-none">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
