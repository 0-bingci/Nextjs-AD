'use client'
import React from 'react'
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Card,
  Row,
  Col,
  Pagination,
  Modal,
  Form,
  message,
  Switch
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { fetchPeopleData, createPerson, startPerson,banPerson } from '../../api/people'
export default function People() {
  const [allData, setAllData] = useState([]) // 新增
  const [currentPage, setCurrentPage] = useState(1) // 新增
  const [pageSize, setPageSize] = useState(10) // 新增
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPeopleData()
        setAllData(data)
      } catch (error) {
        message.error('获取数据失败:' + error)
      }
    }
    fetchData()
  }, [])
  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }
  const handleEdit = (record) => {
    setIsModalVisible(true);
    // 实现编辑逻辑
    console.log('编辑记录:', record);
    // 这里可以打开模态框或跳转到编辑页面
  };
  const handleStart = async (record) => {
    await startPerson(record.attributes.cn)
    const newData = await fetchPeopleData();
    setAllData(newData);
  };

  const handleBan = async (record) => {
    await banPerson(record.attributes.cn)
    const newData = await fetchPeopleData();
    setAllData(newData);
  };
  const handleSubmit=() => { 
    form.submit() 
    setIsModalVisible(false); 
    // form.resetFields();
  };
  const handleCancel = () => { 
    setIsModalVisible(false); 
    form.resetFields();
  };
  const handleAddSupplier = () => {
    setIsModalVisible(true);
  };
  const onFinish = async (values:any) => {
    try {
      // console.log(values);
      await createPerson(values);
      message.success('创建成功');
      // 刷新表格数据
    const newData = await fetchPeopleData();
    setAllData(newData);
      form.resetFields();
    } catch (error) {
      message.error('创建失败:'+error);
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: ['attributes', 'cn'],
      key: 'name',
      width: '8%',
    },
    {
      title: '学院',
      dataIndex: ['attributes', 'department'],
      key: 'department',
    },
    {
      title: '学号',
      dataIndex: ['attributes', 'description', '0'],
      key: 'studentId',
    },
    {
      title: '班级',
      dataIndex: ['attributes', 'physicalDeliveryOfficeName'],
      key: 'class',
      width: '8%',
    },
    {
      title: '账号',
      dataIndex: ['attributes', 'sAMAccountName'],
      key: 'account',
    },
    {
      title: '账号状态',
      dataIndex: ['attributes', 'userAccountControl'],
      key: 'userAccountControl',
      width: '10%',
      render: (_,record) => (
        <Switch defaultChecked={[66048, 66080].includes(record.attributes.userAccountControl)} checkedChildren="已启用" unCheckedChildren="已禁用" onChange={(checked) => {
          if (checked) {
            handleStart(record);
          }else { 
            handleBan(record);
          }
          
        }}/>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button color="cyan" variant="solid" onClick={() => handleEdit(record)}>
           修改密码
          </Button>
          <Button color="pink" variant="solid" onClick={() => handleEdit(record)}>
            编辑信息
          </Button>
        </Space>
      ),
    }
  ]
  return (
    <div>
      <Card variant="borderless" style={{}} className="rounded-none w-[100%]">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                供应商全称
              </span>
              <Input placeholder="输入名称" className="pl-20" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="全部"
              className="w-full"
              onChange={(value) => setSearchForm({ ...searchForm, category: value })}
            >
            </Select>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 transition-colors"
              >
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                className="hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 20 }} className="rounded-none w-[100%] min-h-[50vh] shadow-sm">
        <div className="mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSupplier}
            className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 transition-colors"
          >
            添加人员
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            pagination={false}
            scroll={{ x: 1200 }}
            size="middle"
            className="min-w-full"
            columns={columns}
            dataSource={allData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            rowKey={(record) => record.id || record.attributes.sAMAccountName}
          />
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={allData.length}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['10', '20', '50', '100']}
          />
        </div>
      </Card>

      {/* Add Supplier Modal */}
      <Modal
        title={<span className="text-lg font-semibold">添加供应商</span>}
        open={isModalVisible}
        width={600}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        className="top-8"
        okButtonProps={{
          className: 'bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600',
        }}
      >
        <Form layout="vertical" name="addSupplier" form={form} onFinish={onFinish} className="mt-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cn"
                label={<span className="font-medium">姓名</span>}
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input
                  placeholder="请输入姓名"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="department"
                label={<span className="font-medium">学院</span>}
                rules={[{ required: true, message: '请输入学院' }]}
              >
                <Input
                  placeholder="请输入学院"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="description"
                label={<span className="font-medium">学号</span>}
                rules={[{ required: true, message: '请输入学号' }]}
              >
                <Input
                  placeholder="请输入学号"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="physicalDeliveryOfficeName"
                label={<span className="font-medium">班级</span>}
                rules={[{ required: true, message: '请输入班级' }]}
              >
                <Input
                  placeholder="请输入班级"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="sAMAccountName"
                label={<span className="font-medium">账号</span>}
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input
                  placeholder="请输入账号"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="password"
                label={<span className="font-medium">密码</span>}
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input
                  placeholder="请输入密码"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
