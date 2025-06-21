'use client'
import React from 'react'
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
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { fetchPeopleData } from '../../api/people'
export default function People() {
  const [allData, setAllData] = useState([]) // 新增
  const [currentPage, setCurrentPage] = useState(1) // 新增
  const [pageSize, setPageSize] = useState(10) // 新增
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
  const getPaginatedData = () => {
    const start = (currentPage - 1) * pageSize
    return allData.slice(start, start + pageSize)
  }
  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }
  const columns = [
    {
      title: '姓名',
      dataIndex: ['attributes', 'cn'],
      key: 'name',
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
    },
    {
      title: '账号',
      dataIndex: ['attributes', 'sAMAccountName'],
      key: 'account',
    },
    {
      title: '邮箱',
      dataIndex: ['attributes', 'userPrincipalName'],
      key: 'email',
    },
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
              <Option value="">全部</Option>
              <Option value="美日采购类目配置">美日采购类目配置</Option>
              <Option value="其他类目">其他类目</Option>
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
        width={600}
        okText="确定"
        cancelText="取消"
        className="top-8"
        okButtonProps={{
          className: 'bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600',
        }}
      >
        <Form layout="vertical" name="addSupplier" className="mt-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label={<span className="font-medium">供应商名称</span>}
                rules={[{ required: true, message: '请输入供应商名称' }]}
              >
                <Input
                  placeholder="请输入供应商名称"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label={<span className="font-medium">类型</span>}
                rules={[{ required: true, message: '请选择类型' }]}
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
                rules={[{ required: true, message: '请选择采购类目' }]}
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
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input
                  placeholder="请输入邮箱地址"
                  className="hover:border-orange-400 focus:border-orange-500"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="purchaser"
            label={<span className="font-medium">采购员</span>}
            rules={[{ required: true, message: '请输入采购员信息' }]}
          >
            <Input
              placeholder="请输入采购员姓名和工号"
              className="hover:border-orange-400 focus:border-orange-500"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
