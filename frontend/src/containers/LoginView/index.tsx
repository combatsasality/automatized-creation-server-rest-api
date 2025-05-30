import { Button } from 'antd';
import { useOutletContext } from 'react-router';

export const LoginView = () => {
  const { messageApi } = useOutletContext<OutletProps>();

  return (
    <>
      <Button onClick={() => messageApi.error('test')}>t</Button>
    </>
  );
};
