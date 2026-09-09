type BrandLogoProps = {
    className?: string;
};

const BrandLogo = ({ className }: BrandLogoProps) => (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill="#155EEF" />
            <path d="M8 19V9h4.5a3.5 3.5 0 0 1 0 7H10v3H8Zm2-5h2.5a1.5 1.5 0 0 0 0-3H10v3ZM16 19v-3.5L19.5 9H22l-4 7.2V19h-2Z" fill="#fff" />
        </svg>
        <span className="text-lg font-bold text-[#101828] leading-none">TeamFlow Worklog</span>
    </div>
);

export default BrandLogo;
