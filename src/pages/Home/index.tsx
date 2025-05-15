import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { request, useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const checkLogin = async () => {
    let res = await request('/checkLogin', {
      method: 'POST',
      data: {},
    });
    if (res.code === 200) {
      message.success('登录成功');
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Button type="primary" onClick={checkLogin}>
          检测登录
        </Button>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
