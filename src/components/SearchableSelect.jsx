import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X, Plus, Check } from 'lucide-react'

/**
 * SearchableSelect
 * Props:
 *   options: string[]           — the full list of options
 *   value: string               — current selected value
 *   onChange: (val) => void     — called when selection changes
 *   placeholder: string         — placeholder text
 *   allowAdd?: boolean          — allow adding custom entries (default true)
 *   fallbackOptions?: string[]  — shown when search has no results
 *   className?: string
 */
export const SearchableSelect = ({
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    allowAdd = true,
    fallbackOptions = [],
    className = '',
}) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const containerRef = useRef(null)
    const inputRef = useRef(null)

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false)
                setQuery('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Focus search input when opening
    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus()
    }, [open])

    const filtered = query.trim()
        ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
        : options

    const showAdd = allowAdd &&
        query.trim().length > 1 &&
        !options.find(o => o.toLowerCase() === query.toLowerCase())

    const select = (val) => {
        onChange(val)
        setOpen(false)
        setQuery('')
    }

    const clear = (e) => {
        e.stopPropagation()
        onChange('')
    }

    return (
        <div
            className={`ss-wrapper ${className}`}
            ref={containerRef}
        >
            {/* Trigger */}
            <button
                type="button"
                className={`ss-trigger ${!value ? 'ss-trigger--placeholder' : ''} ${open ? 'ss-trigger--open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="ss-trigger__label">
                    {value || placeholder}
                </span>
                <span className="ss-trigger__icons">
                    {value && (
                        <span className="ss-clear" onClick={clear} title="Clear">
                            <X size={14} />
                        </span>
                    )}
                    <ChevronDown size={16} className={`ss-chevron ${open ? 'ss-chevron--open' : ''}`} />
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="ss-dropdown" role="listbox">
                    {/* Search */}
                    <div className="ss-search">
                        <Search size={14} className="ss-search__icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="ss-search__input"
                            placeholder="Search..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Escape') { setOpen(false); setQuery('') }
                                if (e.key === 'Enter' && showAdd) select(query.trim())
                            }}
                        />
                    </div>

                    {/* Options list */}
                    <div className="ss-options">
                        {/* No results: show fallbackOptions or generic message */}
                        {filtered.length === 0 && !showAdd && (
                            fallbackOptions.length > 0 ? (
                                <>
                                    <div className="ss-empty">No match — try one of these:</div>
                                    {fallbackOptions.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            role="option"
                                            aria-selected={value === opt}
                                            className={`ss-option ${value === opt ? 'ss-option--active' : ''}`}
                                            onClick={() => select(opt)}
                                        >
                                            <span>{opt}</span>
                                            {value === opt && <Check size={14} className="ss-option__check" />}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="ss-empty">No results</div>
                            )
                        )}
                        {filtered.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                role="option"
                                aria-selected={value === opt}
                                className={`ss-option ${value === opt ? 'ss-option--active' : ''}`}
                                onClick={() => select(opt)}
                            >
                                <span>{opt}</span>
                                {value === opt && <Check size={14} className="ss-option__check" />}
                            </button>
                        ))}
                        {showAdd && (
                            <button
                                type="button"
                                className="ss-add-btn"
                                onClick={() => select(query.trim())}
                            >
                                <Plus size={14} />
                                <span>Add "<strong>{query.trim()}</strong>"</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
