export default function StatBox({ title, value, subtitle, icon: Icon, bgColor = '#FFF9C4', textColor = '#B89000' }) {
  return (
    <div className="border border-gray-200 px-6 py-4 min-w-[280px]" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2" style={{ color: textColor }}>
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />} {title}
        </span>
        <span>{value}</span>
      </div>
      <div className="text-4xl font-['Bebas_Neue'] tracking-wider leading-none">
        {value}
      </div>
      {subtitle && <div className="text-xs text-gray-500 font-medium uppercase mt-1">{subtitle}</div>}
    </div>
  );
}
