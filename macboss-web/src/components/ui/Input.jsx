/**
 * Campo de input padrão do Design System MACBOSS.
 */
export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rightSlot,
  topRightSlot,
  ...props
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        {topRightSlot}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="block w-full border border-[var(--color-border-default)] bg-transparent px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-border-strong)]"
          style={rightSlot ? { paddingRight: '3rem' } : undefined}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
