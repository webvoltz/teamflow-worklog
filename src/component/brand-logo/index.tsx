import logo from '../../assets/images/brand-mark.png';

interface BrandLogoProps {
  className?: string;
}

const BrandLogo = ({ className }: BrandLogoProps) => (
  <div className={`flex items-center gap-2 ${className ?? ''}`}>
    <img src={logo} alt="" className="h-8 w-auto shrink-0" />
    <span className="text-lg font-bold text-[#101828] leading-none">TeamFlow Worklog</span>
  </div>
);

export default BrandLogo;
