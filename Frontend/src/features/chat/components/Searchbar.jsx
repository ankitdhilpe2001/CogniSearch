import React from 'react'

const Searchbar = ({ value, onChange, onSubmit, loading = false }) => {
  return (
    <div
    className="
      w-full max-w-[720px]
      bg-surface border border-surface-bright/70 rounded-2xl
      px-5 pt-[18px] pb-[14px] flex flex-col gap-[14px]
      transition-all duration-200
      focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]
    "
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit?.()}
      placeholder="Ask anything…"
      className="
          bg-transparent border-none outline-none
          text-base text-foreground placeholder:text-placeholder
          w-full
        "
    />

    <div className="flex items-center gap-2">


      {/* Send */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="
            w-10 h-10 bg-surface-bright border-none rounded-[10px]
            flex items-center justify-center cursor-pointer text-foreground
            transition-all duration-200 hover:bg-accent hover:shadow-glow
            disabled:cursor-not-allowed disabled:opacity-50
          "
      >
        <i className="ri-arrow-right-line text-[16px]" aria-hidden="true" />
      </button>
    </div>
  </div>
  )
}

export default Searchbar


