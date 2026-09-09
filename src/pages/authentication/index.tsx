import { useMutation } from "@apollo/client";
import { notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONST } from "../../constants/route-constant";
import { LOGIN_MUTATION, VERIFY_OTP_MUTATION } from "../../graphql/auth.graphql";
import { setLocalStorageItem } from "../../utils/local-storage";
import Login from "./login";
import OtpVerification from "./otpVerification";

export default function Authentication() {
    const navigate = useNavigate();
    const [userDetail, setUserDetail] = useState({ userName: "", password: "" });
    const [temporaryToken, setTemporaryToken] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [login, { loading: isLoginLoading }] = useMutation(LOGIN_MUTATION);
    const [verifyOtp, { loading: isOtpLoading }] = useMutation(VERIFY_OTP_MUTATION);

    const handleStorage = (token: string, refreshToken: string) => {
        setLocalStorageItem("token", token);
        setLocalStorageItem("ref_token", refreshToken);
        setLocalStorageItem("last_login_time", `${new Date()}`);
        setLocalStorageItem("remeber_me", `${rememberMe}`);
        navigate(`${ROUTE_CONST.INITIAL_ROUTE}`);
    };

    const requestOtp = async () => {
        const { data, errors } = await login({
            variables: { username: userDetail.userName, password: userDetail.password },
        }).catch((error) => ({ data: null, errors: [error] }));

        if (errors?.length || !data?.login?.tempToken) {
            notification.error({ message: errors?.[0]?.message ?? "Unable to sign in with those credentials." });
            return;
        }
        setTemporaryToken(data.login.tempToken);
        notification.success({ message: data.login.message ?? "OTP sent successfully." });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await requestOtp();
    };

    const resentOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await requestOtp();
    };

    const handleOtpSubmit = async (otp: string) => {
        const { data, errors } = await verifyOtp({ variables: { tempToken: temporaryToken, otp } }).catch((error) => ({
            data: null,
            errors: [error],
        }));

        if (errors?.length || !data?.verifyOtp) {
            notification.error({ message: errors?.[0]?.message ?? "Unable to verify OTP." });
            return;
        }
        if (!data.verifyOtp.success || !data.verifyOtp.token) {
            notification.error({ message: data.verifyOtp.message ?? "Invalid OTP." });
            return;
        }
        handleStorage(data.verifyOtp.token, data.verifyOtp.refreshToken);
    };

    return (
        <div className="w-full mx-auto flex items-center h-screen login">
            {temporaryToken ? (
                <OtpVerification handleOtpSubmit={handleOtpSubmit} isLoading={isOtpLoading} resentOtp={resentOtp} />
            ) : (
                <Login
                    userDetail={userDetail}
                    setUserDetail={setUserDetail}
                    handleSubmit={handleSubmit}
                    isLoading={isLoginLoading}
                    remeberMe={rememberMe}
                    setRememberMe={setRememberMe}
                />
            )}
        </div>
    );
}
