import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Tabs, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import {request} from 'umi';
const LoginPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const handleSubmit = async (values:any) => {
    console.log('Received values of form: ', values);
    try {
        request('/login', {
            method: 'POST',
            data: {
                username: values.username,
                password: values.password,
            },

        }).then((res) => {
            console.log("----",res);
            
        })



    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 110px',
        backgroundSize: '100%',
      }}
    >
      <div style={{ width: '392px', margin: '0 auto' }}>
        <LoginForm
          title="管理系统"
          // subTitle="欢迎使用管理系统"
          onFinish={handleSubmit}
          logo={<img alt="logo" src="https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg" />}
        >
          <Tabs
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <a>忘记密码</a>
            <a onClick={() => navigate('/register')}>注册账户</a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default LoginPage;