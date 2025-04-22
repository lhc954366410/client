import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Tabs, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { request } from 'umi';
const LoginPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    console.log('Received values of form: ', values);
    try {
      request('/login', {
        method: 'POST',
        data: {
          username: values.username,
          password: values.password,
          email: values.email,
          confirmPassword: values.confirmPassword,
        },

      }).then((res) => {
        console.log("----", res);

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
                label: '账户注册',
              },
            ]}
          />
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
                {
                  min: 4,
                  max: 16,
                  message: '用户名长度为4-16个字符',
                },
              ]}
            />
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined />,
              }}
              placeholder="请输入邮箱"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱!',
                },
                {
                  type: 'email',
                  message: '请输入有效的邮箱地址',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  min: 6,
                  max: 18,
                  message: '密码长度为6-18个字符',
                },
              ]}
            />
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="请确认密码"
              rules={[
                {
                  required: true,
                  message: '请确认密码！',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
            />
          </>
          <div
            style={{
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <a></a>
            <a onClick={() => navigate('/login')}>已有账号，去登录</a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default LoginPage;