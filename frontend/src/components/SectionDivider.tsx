interface SectionDividerProps {
    accent?: string;
    className?: string;
}

export default function SectionDivider({ accent, className = '' }: SectionDividerProps) {
    return (
        <div className={'ornamental-divider py-1 ' + className}>
            {accent && (
                <span className="font-devanagari text-text-muted text-xs tracking-widest select-none">
                    {accent}
                </span>
            )}
        </div>
    );
}
