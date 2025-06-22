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
  Switch,
} from 'antd'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {
  fetchPeopleData,
  createPerson,
  startPerson,
  banPerson,
  changePassword,
  deletePerson,
  editPerson
} from '../../api/people'
export default function People() {
  const [inputValue, setInputValue] = useState('');
  const [allData, setAllData] = useState([]) // 新增
  const [reallyAllData, setReallyAllData] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // 新增
  const [pageSize, setPageSize] = useState(10) // 新增
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)

  const handleEditConfirm = () => {
    form2.submit()
    setEditModalVisible(false)
  }
  const updateData = async () => { 
    const data = await fetchPeopleData()
    setReallyAllData(data)
    setAllData(data)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPeopleData()
        setReallyAllData(data)
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
  const handleStart = async (record) => {
    await startPerson(record.attributes.cn)
    const newData = await fetchPeopleData()
    setAllData(newData)
  }
  const handleReset = async () => { 
    setInputValue('')
    updateData()

  }
  const handleSearch = async () => {
    console.log(reallyAllData);
    
    const filteredData = reallyAllData.filter(item => 
      item.attributes.cn.includes(inputValue) ||
      item.attributes.cn.toLowerCase().includes(inputValue.toLowerCase())
    );
    setAllData(filteredData);
  };
  const handleBan = async (record) => {
    await banPerson(record.attributes.cn)
    const newData = await fetchPeopleData()
    setAllData(newData)
  }
  const handleDelete = async () => {
    await deletePerson(currentRecord.attributes.cn)
    setDeleteModalVisible(false)
    const newData = await fetchPeopleData()
    setAllData(newData)
  }
  const handleSubmit = () => {
    form.submit()
    setIsModalVisible(false)
    // form.resetFields();
  }
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }
  const handleAddSupplier = () => {
    setIsModalVisible(true)
  }

  const onFinish = async (values: any) => {
    try {
      // console.log(values);
      await createPerson(values)
      message.success('创建成功')
      // 刷新表格数据
      const newData = await fetchPeopleData()
      setAllData(newData)
      form.resetFields()
    } catch (error) {
      message.error('创建失败:' + error)
    }
  }
  const onFinishPassword = (values: any, record: any) => {
    const requestData = {
      ...values,
      cn: record.attributes.cn, // 假设record中包含cn字段
    }
    changePassword(requestData)
    setPasswordModalVisible(false)
    form1.resetFields()
  }
  const onFinishEdit=async (values: any, record: any)=>{
    const requestData = {
      ...values,
      cn: record.attributes.cn,
      description: values.description[0] // 取数组第一个元素作为字符串
    }
    console.log(requestData);
    
    await editPerson(requestData)
    setEditModalVisible(false)
    const newData = await fetchPeopleData()
    setAllData(newData)
    
    
  }
  const handlePasswordSubmit = async () => {
    form1.submit()
  }

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
      render: (_, record) => (
        <Switch
          defaultChecked={[66048, 66080].includes(record.attributes.userAccountControl)}
          checkedChildren="已启用"
          unCheckedChildren="已禁用"
          onChange={(checked) => {
            if (checked) {
              handleStart(record)
            } else {
              handleBan(record)
            }
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            color="cyan"
            variant="solid"
            onClick={() => {
              setCurrentRecord(record)
              setPasswordModalVisible(true)
            }}
          >
            修改密码
          </Button>
          <Button
            color="pink"
            variant="solid"
            onClick={() => {
              setCurrentRecord(record)
              form2.setFieldsValue({
                department: record.attributes.department,
                description: record.attributes.description,
                physicalDeliveryOfficeName: record.attributes.physicalDeliveryOfficeName
              });
              setEditModalVisible(true)
            }}
          >
            编辑信息
          </Button>
          <Button
            color="danger"
            variant="solid"
            onClick={() => {
              setCurrentRecord(record)
              setDeleteModalVisible(true)
            }}
          >
            删除账号
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <div>
      <Card variant="borderless" style={{}} className="rounded-none w-[100%]">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="relative">
              <Input placeholder="输入名字" className="pl-20" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<SearchOutlined />}
                className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 transition-colors"
              >
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
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
        title={<span className="text-lg font-semibold">添加人员</span>}
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
      <Modal
        title="修改密码"
        okText="确定"
        cancelText="取消"
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          form1.resetFields()
          setPasswordModalVisible(false)
        }}
      >
        <Form form={form1} onFinish={(value) => onFinishPassword(value, currentRecord)}>
          <Form.Item name="newpassword" label="新密码">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        okText="确定"
        cancelText="取消"
        title="确认删除账号"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        确定要删除账号 {currentRecord?.name} 吗？
      </Modal>
      <Modal
        okText="确定"
        cancelText="取消"
        title="编辑账号信息"
        open={editModalVisible}
        onOk={handleEditConfirm}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form layout="vertical" name="addSupplier" form={form2} onFinish={(value) => onFinishEdit(value, currentRecord)} className="mt-6">
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
        </Form>
      </Modal>
    </div>
  )
}
