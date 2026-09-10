import { HiMail, HiOutlineArrowRight } from 'react-icons/hi';
import logo from '../../assets/images/brand-mark.png';
import { type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Alert } from '../../component/ui/alert';
import { Button } from '../../component/ui/button';
import { Card } from '../../component/ui/card';
import { Checkbox } from '../../component/ui/checkbox';
import { Input, PasswordInput } from '../../component/ui/input';
import { Label } from '../../component/ui/label';

export interface UserDetail {
  userName: string;
  password: string;
}
interface LoginProps {
  userDetail: UserDetail;
  setUserDetail: (userDetail: UserDetail) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  remeberMe: boolean;
  setRememberMe: (e: boolean) => void;
  error?: string | null | undefined;
}

const Login = ({
  userDetail,
  setUserDetail,
  handleSubmit,
  isLoading,
  remeberMe,
  setRememberMe,
  error,
}: LoginProps) => {
  const handleInputChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>) => {
    setUserDetail({ ...userDetail, [name]: value });
  };
  const renderIcon = (visible: boolean) => (visible ? <Eye /> : <EyeOff />);

  return (
    <div className="max-w-md mx-auto w-full px-3">
      <Card className="bg-white rounded-lg border-gray-200 border shadow-md p-6 sm:p-8">
        <form
          className="flex flex-col gap-6 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="Logo" />
            <h2 className="text-center text-2xl font-bold text-text-color">
              Login to TeamFlow Worklog
            </h2>
          </div>
          {error && (
            <Alert
              variant="error"
              className="w-full transition-all duration-300 starting:-translate-y-1 starting:opacity-0"
            >
              {error}
            </Alert>
          )}
          <div className="w-full flex flex-col gap-5">
            <div className="w-full space-y-1.5">
              <Label htmlFor="email" className="font-semibold">
                Username/Email<span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="userName"
                leftIcon={<HiMail />}
                placeholder="name@teamflow.dev"
                required
                className="bg-gray-50 "
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full space-y-1.5">
              <Label htmlFor="password1" className="font-semibold">
                Password<span className="text-destructive">*</span>
              </Label>
              <PasswordInput
                renderIcon={renderIcon}
                id="password1"
                required
                placeholder="••••••••"
                name="password"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-start w-full">
            <Checkbox
              id="remember"
              onCheckedChange={() => {
                setRememberMe(!remeberMe);
              }}
            >
              <span className="text-[#111928]">Remember Me</span>
            </Checkbox>
          </div>
          <Button
            variant="primary"
            size="large"
            type="submit"
            className="justify-center item-center transition ease-in-out w-full font-bold text-sm login-btn"
            loading={isLoading}
          >
            Sign in <HiOutlineArrowRight />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
