export const fetchAPI = async (endpoint: string) => {
    // 获取环境变量中的基础URL，若未设置则默认使用'/api'
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';
    
    // 拼接完整URL并发送fetch请求
    const response = await fetch(`${baseURL}${endpoint}`);
    
    // 将响应体解析为JSON格式并返回
    return response.json();
  };
  export const postAPI = async (endpoint: string, data: Record<string, unknown>) => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';
    
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  };