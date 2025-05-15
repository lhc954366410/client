import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Tabs, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { request } from 'umi';

const LoginPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    let res = await request('/login', {
      method: 'POST',
      data: {
        email: values.email,
        password: values.password,
      },
    });
    if (res.code === 200) {
      localStorage.setItem('user', JSON.stringify(res.data));
      message.success('登录成功');
      navigate('/');
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
        backgroundImage: `url(/login_bg.svg)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 110px',
        backgroundSize: '100%',
      }}
    >
      <div
        style={{
          width: '392px',
          margin: '0 auto',
          boxShadow:
            '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09) ',
        }}
      >
        <LoginForm
          title="达美"
          // subTitle="欢迎使用管理系统"
          onFinish={handleSubmit}
          logo={<img alt="logo" src="/logo.svg" />}
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
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="邮箱"
            rules={[
              {
                required: true,
                message: '请输入邮箱!',
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
