import { Response } from 'express';

interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  status: number,
  message: string,
  data?: T
): Response => {
  const response: ApiResponse<T> = {
    status: status,
    message,
    data,
  };
  return res.status(status).json(response);
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  error?: string
): Response => {
  const response: ApiResponse = {
    status: status,
    message,
    error,
  };
  return res.status(status).json(response);
};
