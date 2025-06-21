import {fetchAPI} from '../utils/api';
export const fetchPeopleData=async()=>{
  const response = await fetchAPI('/main');
  return response || []; // 确保返回数组格式
}