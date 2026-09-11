import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_CONST } from '../../constants/route-constant';
import { LOGIN_MUTATION, VERIFY_OTP_MUTATION } from '../../graphql/auth.graphql';
import { setLocalStorageItem } from '../../utils/local-storage';
import { notify } from '../../utils/notify';
import Login from './login';
import OtpVerification from './otpVerification';

const toGraphQLError = (error: unknown): { message: string } => ({
  message: error instanceof Error ? error.message : 'An unknown error occurred',
});

export default function Authentication() {
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState({ userName: '', password: '' });
  const [temporaryToken, setTemporaryToken] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [login, { loading: isLoginLoading }] = useMutation(LOGIN_MUTATION);
  const [verifyOtp, { loading: isOtpLoading }] = useMutation(VERIFY_OTP_MUTATION);

  const handleStorage = (token: string, refreshToken: string) => {
    setLocalStorageItem('token', token);
    setLocalStorageItem('ref_token', refreshToken);
    setLocalStorageItem('last_login_time', new Date().toISOString());
    setLocalStorageItem('remeber_me', rememberMe ? 'true' : 'false');
    void navigate(ROUTE_CONST.INITIAL_ROUTE);
  };

  const requestOtp = async () => {
    // requestOtp doubles as "resend" once the OTP screen is showing, so a
    // failure here must surface on whichever form is currently on screen.
    const isResend = Boolean(temporaryToken);
    if (isResend) {
      setOtpError(null);
    } else {
      setLoginError(null);
    }

    const { data, error } = await login({
      variables: { username: userDetail.userName, password: userDetail.password },
    }).catch((error: unknown) => ({ data: null, error: toGraphQLError(error) }));

    if (error || !data?.login.tempToken) {
      const message = error?.message ?? 'Unable to sign in with those credentials.';
      if (isResend) {
        setOtpError(message);
      } else {
        setLoginError(message);
      }
      return;
    }
    setTemporaryToken(data.login.tempToken);
    notify.success(data.login.message);
  };

  // antd's <Form onFinish> calls this with the form values, not a DOM event.
  const handleSubmit = async () => {
    await requestOtp();
  };

  const resentOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await requestOtp();
  };

  const handleOtpSubmit = async (otp: string) => {
    setOtpError(null);
    const { data, error } = await verifyOtp({
      variables: { tempToken: temporaryToken, otp },
    }).catch((error: unknown) => ({ data: null, error: toGraphQLError(error) }));

    if (error || !data?.verifyOtp) {
      setOtpError(error?.message ?? 'Unable to verify OTP.');
      return;
    }
    if (!data.verifyOtp.success || !data.verifyOtp.token || !data.verifyOtp.refreshToken) {
      setOtpError(data.verifyOtp.message);
      return;
    }
    handleStorage(data.verifyOtp.token, data.verifyOtp.refreshToken);
  };

  return (
    <div className="w-full mx-auto flex items-center h-screen login">
      {temporaryToken ? (
        <OtpVerification
          handleOtpSubmit={(otp) => void handleOtpSubmit(otp)}
          isLoading={isOtpLoading}
          resentOtp={(e) => void resentOtp(e)}
          error={otpError}
        />
      ) : (
        <Login
          userDetail={userDetail}
          setUserDetail={setUserDetail}
          handleSubmit={() => void handleSubmit()}
          isLoading={isLoginLoading}
          remeberMe={rememberMe}
          setRememberMe={setRememberMe}
          error={loginError}
        />
      )}
    </div>
  );
}
