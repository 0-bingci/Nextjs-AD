"use client"

import { useState } from "react"
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Pagination,
  Tooltip,
  Modal,
  Form,
  message,
} from "antd"
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography
const { Option } = Select

interface SupplierData {
  key: string
  warehouseNumber: string
  supplierName: string
  type: string
  category: string
  email: string
  purchaser: string
  addTime: string
  status: string
}

const mockData: SupplierData[] = [
  {
    key: "1",
    warehouseNumber: "SI23090901",
    supplierName: "测试供应商1",
    type: "普通",
    category: "美日▲美日▲美日",
    email: "821trg03@163.com",
    purchaser: "张三 (11108899)",
    addTime: "2023-09-09",
    status: "已审核",
  },
  {
    key: "2",
    warehouseNumber: "SI23090902",
    supplierName: "测试供应商2",
    type: "普通",
    category: "美日▲美日▲美日",
    email: "821trg03@163.com",
    purchaser: "张三 (11108899)",
    addTime: "2023-09-09",
    status: "已审核",
  },
  {
    key: "3",
    warehouseNumber: "SI23090903",
    supplierName: "测试供应商3",
    type: "普通",
    category: "美日▲美日▲美日",
    email: "821trg03@163.com",
    purchaser: "张三 (11108899)",
    addTime: "2023-09-09",
    status: "已入库",
  },
  {
    key: "4",
    warehouseNumber: "SI23090905",
    supplierName: "测试供应商5",
    type: "普通",
    category: "美日▲美日▲美日",
    email: "821trg03@163.com",
    purchaser: "张三 (11108899)",
    addTime: "2023-09-09",
    status: "已暂停",
  },
  {
    key: "5",
    warehouseNumber: "SI23090901",
    supplierName: "测试供应商1",
    type: "普通",
    category: "美日▲美日▲美日",
    email: "821trg03@163.com",
    purchaser: "张三 (11108899)",
    addTime: "2023-09-09",
    status: "已删除",
  },
]

export default function SupplierManagement() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SupplierData[]>(mockData)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(800)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Search form state
  const [searchForm, setSearchForm] = useState({
    supplierName: "",
    category: "",
    purchaser: "",
    status: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已审核":
        return "success"
      case "已入库":
        return "processing"
      case "已暂停":
        return "warning"
      case "已删除":
        return "error"
      default:
        return "default"
    }
  }

  const columns: ColumnsType<SupplierData> = [
    {
      title: "入库单号",
      dataIndex: "warehouseNumber",
      key: "warehouseNumber",
      render: (text: string) => <a className="text-orange-500 hover:text-orange-600 transition-colors">{text}</a>,
    },
    {
      title: "供应商名称",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "采购类目",
      dataIndex: "category",
      key: "category",
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span className="truncate">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "邮箱地址",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "采购员",
      dataIndex: "purchaser",
      key: "purchaser",
    },
    {
      title: "添加时间",
      dataIndex: "addTime",
      key: "addTime",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button type="text" icon={<EyeOutlined />} size="small" className="hover:text-blue-500 hover:bg-blue-50" />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="hover:text-green-500 hover:bg-green-50"
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" danger icon={<DeleteOutlined />} size="small" className="hover:bg-red-50" />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleSearch = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      message.success("查询完成")
    }, 1000)
  }

  const handleReset = () => {
    setSearchForm({
      supplierName: "",
      category: "",
      purchaser: "",
      status: "",
    })
    message.info("已重置搜索条件")
  }

  const handleAddSupplier = () => {
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values)
        setIsModalVisible(false)
        form.resetFields()
        message.success("供应商添加成功")
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Search Filter Card */}
      <Card className="mb-4 shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                供应商全称
              </span>
              <Input
                placeholder="输入名称"
                value={searchForm.supplierName}
                onChange={(e) => setSearchForm({ ...searchForm, supplierName: e.target.value })}
                className="pl-20"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="美日采购类目配置"
              className="w-full"
              value={searchForm.category}
              onChange={(value) => setSearchForm({ ...searchForm, category: value })}
            >
              <Option value="">全部</Option>
              <Option value="美日采购类目配置">美日采购类目配置</Option>
              <Option value="其他类目">其他类目</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">采购员</span>
              <Input
                placeholder="输入姓名/工号"
                value={searchForm.purchaser}
                onChange={(e) => setSearchForm({ ...searchForm, purchaser: e.target.value })}
                className="pl-16"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="已审核"
              className="w-full"
              value={searchForm.status}
              onChange={(value) => setSearchForm({ ...searchForm, status: value })}
            >
              <Option value="">全部状态</Option>
              <Option value="已审核">已审核</Option>
              <Option value="已入库">已入库</Option>
              <Option value="已暂停">已暂停</Option>
              <Option value="已删除">已删除</Option>
            </Select>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading}
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

      {/* Main Content Card */}
      <Card className="shadow-sm">
        <div className="mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSupplier}
            className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 transition-colors"
          >
            添加供应商
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={false}
            scroll={{ x: 1200 }}
            size="middle"
            className="min-w-full"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => <span className="text-gray-600">共 {total} 条</span>}
            onChange={(page, size) => {
              setCurrentPage(page)
              setPageSize(size || 10)
            }}
            pageSizeOptions={["10", "20", "50", "100"]}
            className="flex flex-wrap items-center justify-center gap-2"
          />
        </div>
      </Card>

      {/* Add Supplier Modal */}
      <Modal
        title={<span className="text-lg font-semibold">添加供应商</span>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="确定"
        cancelText="取消"
        className="top-8"
        okButtonProps={{
          className: "bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600",
        }}
      >
        <Form form={form} layout="vertical" name="addSupplier" className="mt-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label={<span className="font-medium">供应商名称</span>}
                rules={[{ required: true, message: "请输入供应商名称" }]}
              >
                <Input placeholder="请输入供应商名称" className="hover:border-orange-400 focus:border-orange-500" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label={<span className="font-medium">类型</span>}
                rules={[{ required: true, message: "请选择类型" }]}
              >
                <Select placeholder="请选择类型" className="hover:border-orange-400">
                  <Option value="普通">普通</Option>
                  <Option value="重要">重要</Option>
                  <Option value="战略">战略</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label={<span className="font-medium">采购类目</span>}
                rules={[{ required: true, message: "请选择采购类目" }]}
              >
                <Select placeholder="请选择采购类目" className="hover:border-orange-400">
                  <Option value="美日采购类目配置">美日采购类目配置</Option>
                  <Option value="其他类目">其他类目</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={<span className="font-medium">邮箱地址</span>}
                rules={[
                  { required: true, message: "请输入邮箱地址" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input placeholder="请输入邮箱地址" className="hover:border-orange-400 focus:border-orange-500" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="purchaser"
            label={<span className="font-medium">采购员</span>}
            rules={[{ required: true, message: "请输入采购员信息" }]}
          >
            <Input placeholder="请输入采购员姓名和工号" className="hover:border-orange-400 focus:border-orange-500" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
