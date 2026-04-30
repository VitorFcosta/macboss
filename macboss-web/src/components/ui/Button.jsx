/**
 * Botão padrão do Design System MACBOSS.
 */
export default function Button({ children, isLoading, loadingText = 'AGUARDE...', disabled, ...props }) {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className="flex w-full items-center justify-center gap-2 bg-[var(--color-bg-inverse)] py-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-inverse)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
