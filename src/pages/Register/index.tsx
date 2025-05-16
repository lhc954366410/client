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
      request('/register', {
        method: 'POST',
        data: {
          userName: values.userName,
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
        backgroundImage: 'url(/login_bg.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 110px',
        backgroundSize: '100%',
      }}
    >
      <div style={{ 
        width: '392px', 
        margin: '0 auto' ,
        boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09) '}}>
        
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
                label: '账户注册',
              },
            ]}
          />
          <>
            <ProFormText
              name="userName"
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
                  min: 2,
                  max: 16,
                  message: '用户名长度为2-16个字符',
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
                // {
                //   type: 'email',
                //   message: '请输入有效的邮箱地址',
                // },
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