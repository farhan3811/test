import api from '@/lib/axios';
import { LoginInput } from '@/types/auth';

export const loginUser = async (data: LoginInput) => {
  const res = await api.post('/auth/login', data)
  return res.data;
};
