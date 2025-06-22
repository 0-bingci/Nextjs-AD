import {fetchAPI, postAPI} from '../utils/api';
export const fetchPeopleData=async()=>{
  const response = await fetchAPI('/main');
  return response || []; // 确保返回数组格式
}
export const createPerson = async (personData: any) => {
  const response = await postAPI('/create', personData);
  return response;
};
export const startPerson = async (personData: any) => {
  const response = await postAPI('/start', personData);
  return response;
};
export const banPerson = async (personData: any) => {
  const response = await postAPI('/delete', personData);
  return response;
};
export const changePassword = async (personData: any) => {
  const response = await postAPI('/remake',personData);
  return response;
};
export const deletePerson = async (personData: any) => {
  const response = await postAPI('/deletePeople', personData);
  return response;
};
export const editPerson = async (personData: any) => {
  const response = await postAPI('/remakeInfo', personData);
  return response;
};