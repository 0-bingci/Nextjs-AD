import request from '@/utils/axios';

// GET请求
export const fetchData = async () => {
  try {
    const res = await request.get<{id: number, name: string}>('/data');
    console.log(res.data); // 类型安全的data
  } catch (error) {
    console.error(error);
  }
};

// POST请求
export const postData = async (data: any) => {
  try {
    const res = await request.post('/submit', data);
    return res;
  } catch (error) {
    throw error;
  }
};