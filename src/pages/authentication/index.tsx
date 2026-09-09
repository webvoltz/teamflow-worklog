import { useMutation } from '@apollo/client';
import { notification } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CONST } from '../../constants/route-constant';
import { LOGIN_MUTATION, VERIFY_OTP_MUTATION } from '../../graphql/auth.graphql';
import { setLocalStorageItem } from '../../utils/local-storage';
import Login from './login';
import OtpVerification from './otpVerification';

interface LoginResult {
  login: {
    tempToken: string;
    message: string;
  };
}

interface LoginVariables {
  username: string;
  password: string;
}

interface VerifyOtpResult {
  verifyOtp: {
    success: boolean;
    token: string | null;
    refreshToken: string | null;
    message: string;
  };
}

interface VerifyOtpVariables {
  tempToken: string;
  otp: string;
}

const toGraphQLError = (error: unknown): { message: string } => ({
  message: error instanceof Error ? error.message : 'An unknown error occurred',
});

export default function Authentication() {
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState({ userName: '', password: '' });
  const [temporaryToken, setTemporaryToken] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { loading: isLoginLoading }] = useMutation<LoginResult, LoginVariables>(
    LOGIN_MUTATION,
  );
  const [verifyOtp, { loading: isOtpLoading }] = useMutation<VerifyOtpResult, VerifyOtpVariables>(
    VERIFY_OTP_MUTATION,
  );

  const handleStorage = (token: string, refreshToken: string) => {
    setLocalStorageItem('token', token);
    setLocalStorageItem('ref_token', refreshToken);
    setLocalStorageItem('last_login_time', new Date().toISOString());
    setLocalStorageItem('remeber_me', rememberMe ? 'true' : 'false');
    void navigate(ROUTE_CONST.INITIAL_ROUTE);
  };

  const requestOtp = async () => {
    const { data, errors } = await login({
      variables: { username: userDetail.userName, password: userDetail.password },
    }).catch((error: unknown) => ({ data: null, errors: [toGraphQLError(error)] }));

    if ((errors && errors.length > 0) || !data?.login.tempToken) {
      notification.error({
        message: errors?.[0]?.message ?? 'Unable to sign in with those credentials.',
      });
      return;
    }
    setTemporaryToken(data.login.tempToken);
    notification.success({ message: data.login.message });
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
    const { data, errors } = await verifyOtp({
      variables: { tempToken: temporaryToken, otp },
    }).catch((error: unknown) => ({ data: null, errors: [toGraphQLError(error)] }));

    if ((errors && errors.length > 0) || !data?.verifyOtp) {
      notification.error({ message: errors?.[0]?.message ?? 'Unable to verify OTP.' });
      return;
    }
    if (!data.verifyOtp.success || !data.verifyOtp.token || !data.verifyOtp.refreshToken) {
      notification.error({ message: data.verifyOtp.message });
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
        />
      ) : (
        <Login
          userDetail={userDetail}
          setUserDetail={setUserDetail}
          handleSubmit={() => void handleSubmit()}
          isLoading={isLoginLoading}
          remeberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
      )}
    </div>
  );
}
