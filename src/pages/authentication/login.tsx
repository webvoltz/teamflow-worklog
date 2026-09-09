import { HiMail, HiOutlineArrowRight } from "react-icons/hi";
import logo from "../../assets/images/brand-mark.png";
import { ChangeEvent } from "react";
import { Button, Card, Checkbox, Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export interface UserDetail {
    userName: string;
    password: string;
}
type LoginProps = {
    userDetail: UserDetail;
    setUserDetail: (userDetail: UserDetail) => void;
    handleSubmit: () => void;
    isLoading: boolean;
    remeberMe: boolean;
    setRememberMe: (e: boolean) => void;
};

const Login = ({ userDetail, setUserDetail, handleSubmit, isLoading, remeberMe, setRememberMe }: LoginProps) => {
    const handleInputChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>) => {
        setUserDetail({ ...userDetail, [name]: value });
    };
    const renderIcon = (visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

    return (
        <div className="max-w-sm mx-auto w-full px-3">
            <Card className=" bg-white rounded-lg border-gray-200 border shadow-md p-1.5">
                <Form className="flex flex-col gap-4 items-center" onFinish={handleSubmit}>
                    <img src={logo} alt="Logo" />
                    <h2 className="text-center text-2xl font-bold text-text-color">Login to TeamFlow Worklog</h2>
                    <div className="w-full">
                        <div className="block">
                            <Form.Item label="Username/Email" name="email" className="block" />
                        </div>
                        <Input
                            id="email"
                            name="userName"
                            prefix={<HiMail />}
                            placeholder="name@teamflow.dev"
                            required
                            className="bg-gray-50 "
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-full">
                        <div className="block">
                            <Form.Item label="Password" name="password" className="text-gray-500" />
                        </div>
                        <Input.Password
                            iconRender={renderIcon}
                            id="password1"
                            type="password"
                            required
                            placeholder="••••••••"
                            name="password"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex items-center gap-2 justify-start w-full ">
                        <Checkbox id="remember" onChange={() => setRememberMe(!remeberMe)}>
                            <Form.Item htmlFor="remember" className="text-[#111928]">
                                {" "}
                                Remember Me{" "}
                            </Form.Item>
                        </Checkbox>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        className="justify-center item-center transition ease-in-out w-full font-bold text-sm login-btn"
                        loading={isLoading}
                    >
                        Sign in <HiOutlineArrowRight />
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
