import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { type ReactNode } from 'react';

interface SpinnerProps {
  children: ReactNode;
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ children, loading }) => {
  return (
    // <div className="flex justify-center items-center min-h-screen absolute left-0 right-0 mr-auto top-0 bottom-0 custom-spinner">
    <Spin
      spinning={loading}
      indicator={<LoadingOutlined style={{ fontSize: 48, color: '#183a5e' }} spin />}
    >
      {children}
    </Spin>
    // </div>
  );
};

export default Spinner;
