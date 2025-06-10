import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import type { UploadProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import './styles.less';

const { Option } = Select;
const { TextArea } = Input;

interface ArticleFormValues {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  coverImage?: string;
}
const user = JSON.parse(localStorage.getItem('user') || '{}');

const ArticleCreatePage: React.FC = () => {
  const [form] = Form.useForm<ArticleFormValues>();
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState('');
  const [tags, setTags] = useState<string[]>([
    '前端',
    'React',
    'Ant Design',
    'Node.js',
  ]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入文章内容...',
    MENU_CONF: {
      uploadImage: {
        server: 'http://localhost:3000/api/upload/image', // 你的图片上传接口
        headers: {
          authorizationtoken: user.token,
        },
        fieldName: 'file',
        maxFileSize: 10 * 1024 * 1024, // 10M
        allowedFileTypes: ['image/*'],
        customInsert(res: any, insertFn: any) {
          console.log('上传成功---', res);
          // 处理上传结果
          if (res.code === 200) {
            insertFn(res.data.url, '', res.data.url);
          } else {
            message.error(res.message || '图片上传失败');
          }
        },
      },
    },
  };

  // 销毁编辑器
  useEffect(() => {
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  // 处理标签输入
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  // 封面图片上传
  const uploadProps: UploadProps = {
    name: 'file',
    action: 'http://localhost:3000/api/upload/image',
    headers: {
      authorizationtoken: user.token,
    },
    showUploadList: false,
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过10MB!');
      }
      return isImage && isLt10M;
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        const { code, data } = info.file.response;
        if (code === 200) {
          setImageUrl(data.url);
          form.setFieldsValue({ coverImage: data.url });
          message.success('上传成功');
        } else {
          message.error(info.file.response.message || '上传失败');
        }
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error('上传失败');
        setLoading(false);
      }
    },
  };

  // 提交表单
  const handleSubmit = async (values: ArticleFormValues) => {
    console.log('Received values:', values);
    try {
      // 这里替换为实际的API调用
      // await createArticle(values);
      message.success('文章提交成功');
      form.resetFields();
      setHtml('');
      setImageUrl(undefined);
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  return (
    <PageContainer
      header={{
        title: '新建文章',
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '文章管理', path: '/articles' },
            { title: '新建文章' },
          ],
        },
      }}
    >
      <Card>
        <Form<ArticleFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            category: 'technology',
            tags: ['前端', 'React'],
          }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="文章标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="请输入文章标题" size="large" />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item
                name="category"
                label="文章分类"
                rules={[{ required: true, message: '请选择文章分类' }]}
              >
                <Select placeholder="请选择分类">
                  <Option value="technology">技术文章</Option>
                  <Option value="design">设计相关</Option>
                  <Option value="life">生活随笔</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item
                name="tags"
                label="文章标签"
                rules={[
                  {
                    required: true,
                    message: '请至少选择一个标签',
                    type: 'array',
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <div style={{ padding: '0 8px', display: 'flex' }}>
                        {inputVisible ? (
                          <Input
                            size="small"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                            style={{ flex: 1 }}
                          />
                        ) : (
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => setInputVisible(true)}
                          >
                            添加标签
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                >
                  {tags.map((tag) => (
                    <Option key={tag} value={tag}>
                      {tag}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="summary"
                label="文章摘要"
                rules={[{ required: true, message: '请输入文章摘要' }]}
              >
                <TextArea rows={4} placeholder="请输入文章摘要" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="封面图片">
                <Upload {...uploadProps}>
                  {imageUrl ? (
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={imageUrl}
                        alt="封面"
                        style={{
                          width: '100%',
                          maxHeight: '300px',
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                        preview={false}
                      />
                      <Button
                        type="primary"
                        ghost
                        style={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl(undefined);
                          form.setFieldsValue({ coverImage: undefined });
                        }}
                      >
                        移除
                      </Button>
                    </div>
                  ) : (
                    <Button icon={<UploadOutlined />} loading={loading}>
                      上传封面
                    </Button>
                  )}
                </Upload>
                <Form.Item name="coverImage" noStyle>
                  <Input type="hidden" />
                </Form.Item>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="content"
                label="文章内容"
                rules={[
                  { required: true, message: '请输入文章内容' },
                  {
                    validator: (_, value) => {
                      if (value && value.trim() === '<p><br></p>') {
                        return Promise.reject('请输入文章内容');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                  <Toolbar
                    editor={editor}
                    // defaultConfig={{
                    //   excludeKeys: [
                    //     'group-video',
                    //     'fullScreen',
                    //     'insertTable',
                    //     'codeBlock',
                    //   ],
                    // }}
                    mode="default"
                    style={{ borderBottom: '1px solid #d9d9d9' }}
                  />
                  <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={(editor) => {
                      const html = editor.getHtml();
                      setHtml(html);
                      form.setFieldsValue({ content: html });
                    }}
                    style={{
                      height: window.innerHeight - 100 + 'px',
                      overflowY: 'hidden',
                    }}
                  />
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" size="large">
                    发布文章
                  </Button>
                  <Button
                    htmlType="button"
                    size="large"
                    onClick={() => form.resetFields()}
                  >
                    重置
                  </Button>
                  <Button
                    type="dashed"
                    size="large"
                    onClick={() => {
                      const values = form.getFieldsValue();
                      console.log('Form values:', values);
                      message.info('已打印表单数据到控制台');
                    }}
                  >
                    调试
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default ArticleCreatePage;
