import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Context } from '../context/context.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class HttpClient {
  private username: string;
  private password: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly context: Context,
    private readonly logger: LoggerService,
  ) {}

  defaultHeaders(): Record<string, string> {
    const requestId = this.context.get('requestId');
    const userId = this.context.get('userId');
    return {
      'X-Request-Id': requestId || '',
      'X-User-Id': userId || '',
      Authorization: this.setAuthorizartion(),
    };
  }

  //Override de API default credentials
  setCredentials(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  private setAuthorizartion() {
    let basicAuth = '';
    if (this.username && this.password) {
      basicAuth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    } else {
      basicAuth = Buffer.from(
        `${process.env.HTTP_CLIENT_BASIC_USERNAME}:${process.env.HTTP_CLIENT_BASIC_PASSWORD}`,
      ).toString('base64');
    }

    return `Basic ${basicAuth}`;
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      const response = await this.httpService.axiosRef.get<T>(path, {
        params,
        headers: this.defaultHeaders(),
      });
      return response;
    } catch (error) {
      const msg = `GetError path:${path} status: ${error?.response?.status}`;
      this.logger.error(msg, { error });
      throw new HttpException(msg, error.status);
    }
  }

  async post<T>(path: string, data: any, timeout?: number): Promise<AxiosResponse<T>> {
    try {
      const response = await this.httpService.axiosRef.post<T>(path, data, {
        headers: this.defaultHeaders(),
        timeout: timeout ?? this.httpService.axiosRef.defaults.timeout,
      });
      return response;
    } catch (error) {
      const msg = `PostError path:${path} status: ${error?.response?.status}`;
      this.logger.error(msg, { error, requestBody: data });
      throw new HttpException(
        {
          statusCode: error.status ?? error.response?.status,
          message: msg,
          data: error?.response?.data,
        },
        error.status,
      );
    }
  }

  async put<T>(path: string, data: any): Promise<AxiosResponse<T>> {
    try {
      const response = await this.httpService.axiosRef.put<T>(path, data, {
        headers: this.defaultHeaders(),
      });
      return response;
    } catch (error) {
      const msg = `PutError path:${path} status: ${error?.response?.status}`;
      this.logger.error(msg, { error, requestBody: data });
      throw new HttpException(
        {
          statusCode: error.status || error.response?.status,
          message: msg,
          data: error?.response?.data,
        },
        error.status,
      );
    }
  }

  async patch<T>(path: string, data: any): Promise<AxiosResponse<T>> {
    try {
      const response = await this.httpService.axiosRef.patch<T>(path, data, {
        headers: this.defaultHeaders(),
      });
      return response;
    } catch (error) {
      const msg = `PatchError path:${path} status: ${error?.response?.status}`;
      this.logger.error(msg, { error, requestBody: data });
      throw new HttpException(
        {
          statusCode: error.status || error.response?.status,
          message: msg,
          data: error?.response?.data,
        },
        error.status,
      );
    }
  }

  async delete<T>(path: string): Promise<AxiosResponse<T>> {
    try {
      const response = await this.httpService.axiosRef.delete<T>(path, {
        headers: this.defaultHeaders(),
      });
      return response;
    } catch (error) {
      const msg = `DeleteError path:${path} status: ${error?.response?.status}`;
      this.logger.error(msg, { error });
      throw new HttpException(msg, error.status);
    }
  }
}
