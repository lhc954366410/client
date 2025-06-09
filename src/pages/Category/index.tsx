import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  Procomments,
  ProcommentsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Form, FormInstance, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import { addApi, deleteApi, selectListApi, updateApi } from './services';




const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const editFormRef = useRef<FormInstance>();
  const [currentItem, setCurrentItem] = useState<any>(null)
  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: any) => {
    const hide = message.loading('正在添加');
    const res = await addApi({ ...fields });
    if (res.code == 200) {
      hide();
      message.success('添加成功');
      return true;
    } else {
      hide();
      return false;
    }
  };

  const deleteItem = async (id: number) => {
    const res = await deleteApi(id)
    if (res.code == 200) {
      message.success("删除成功")
      actionRef.current?.reload()
    }
  }

  const columns: ProcommentsItemProps<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '别名',
      dataIndex: 'slug',
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'comment',
      valueType: 'text',

    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      hideInForm: true,
      hideInSearch: true

    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      hideInForm: true,
      hideInSearch: true

    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => {
            handleModalVisible(true);
            setCurrentItem(record)

          }}>更改</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="删除"
            comment="确定删除当前分类？"

            onConfirm={() => { deleteItem(record.id) }}
          >
            <Button danger>删除</Button>
          </Popconfirm>


        </>
      ),
    },
  ];

  useEffect(() => {
    if(createModalVisible && currentItem){
      editFormRef.current?.setFieldsValue(currentItem)
    }else if(createModalVisible){
      editFormRef.current?.resetFields()
    }
  }, [createModalVisible])
  

  return (
    <PageContainer
      header={{
        title: 'CRUD 示例',
      }}
    >
      <ProTable<any>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          console.log(params, sorter, filter);
          const { current, pageSize, ...other } = params
          const { data, code } = await selectListApi({
            page: current,
            pageSize: pageSize,
            orderBy: 'id desc',
            ...other

          });
          return {
            data: data?.list || [],
            success: code == 200,
            total:data.total||0
          };
        }}
        columns={columns}

      />
      <CreateForm
        onCancel={() =>{ handleModalVisible(false);setCurrentItem(null) }}
        modalVisible={createModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {


            const hide = message.loading("正在提交！")
            const submitFun = currentItem?updateApi:addApi;
            const subData = {
              
              ...value
            }
            if(currentItem){
              subData.id=currentItem.id
            }

            const res = await submitFun(subData)
            hide()
            if(res.code!=200){
              return false
            }else{
              handleModalVisible(false);
              setCurrentItem(null)
              if (actionRef.current) {
                actionRef.current.reload();
              }
              return true
            }

          }}
          rowKey="id"
          type="form"
          formRef={editFormRef}
          columns={columns}
        />
      </CreateForm>
    </PageContainer>
  );
};

export default TableList;
