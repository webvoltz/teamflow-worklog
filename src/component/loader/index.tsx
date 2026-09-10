import { Loader2 } from 'lucide-react';
import { type ReactNode } from 'react';

interface SpinnerProps {
  children: ReactNode;
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ children, loading }) => {
  return (
    <div className="relative custom-spinner">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <Loader2 className="h-12 w-12 animate-spin text-[#183a5e]" />
        </div>
      )}
      {children}
    </div>
  );
};

export default Spinner;
