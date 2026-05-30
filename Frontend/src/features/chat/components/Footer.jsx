import React from 'react'

const Footer = () => {
    return (
        <footer className="flex items-center justify-between px-7 py-[14px] border-t border-outline text-xs text-muted">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-[7px] h-[7px] bg-success rounded-full" />
                    Systems Active
                </div>
                <div className="flex gap-5">
                    <a href="#" className="text-muted hover:text-secondary transition-colors">Privacy</a>
                    <a href="#" className="text-muted hover:text-secondary transition-colors">Terms</a>
                </div>
            </div>
            <div className="font-mono text-[11px] text-muted flex items-center gap-1">
                <span className="bg-surface border border-outline/50 rounded px-1.5 py-0.5 text-[11px]">⌘ K</span>
                to search threads
            </div>
        </footer>
    )
}

export default Footer

