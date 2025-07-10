'use client'
import { Button, Form, Input } from 'antd'
import React from 'react'

export default function Login() {
  const onFinish = (values: any) => {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.account,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 获取返回的token
        const token = data.token
        // 存储token
        localStorage.setItem('token', token)
        window.location.href = '/'
      })
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>登录</h2>
      <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="用户名"
          name="account"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
