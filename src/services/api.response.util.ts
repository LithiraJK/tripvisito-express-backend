import { Response } from 'express';

interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response => {
  const response: ApiResponse<T> = {
    status: statusCode,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
): Response => {
  const response: ApiResponse = {
    status: statusCode,
    message,
    error,
  };
  return res.status(statusCode).json(response);
};
