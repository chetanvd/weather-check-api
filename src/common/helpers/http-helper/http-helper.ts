import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { HttpException, Injectable, Logger, HttpStatus } from '@nestjs/common';

@Injectable()
export class HttpHelper {
  private readonly logger = new Logger(HttpHelper.name);

  constructor(private readonly httpService: HttpService) {}

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res$: Observable<T> = this.httpService
        .get<T>(url, config)
        .pipe(map((response: AxiosResponse<T>) => response.data));
      return await lastValueFrom(res$);
    } catch (error) {
      this.handleRequestError(error, 'GET', url);
      throw HttpHelper.handleError(error);
    }
  }

  // POST request
  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const res$: Observable<T> = this.httpService
        .post<T>(url, data, config)
        .pipe(map((response: AxiosResponse<T>) => response.data));
      return await lastValueFrom(res$);
    } catch (error) {
      this.handleRequestError(error, 'POST', url);
      throw HttpHelper.handleError(error);
    }
  }

  // PUT request
  async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const res$: Observable<T> = this.httpService
        .put<T>(url, data, config)
        .pipe(map((response: AxiosResponse<T>) => response.data));
      return await lastValueFrom(res$);
    } catch (error) {
      this.handleRequestError(error, 'PUT', url);
      throw HttpHelper.handleError(error);
    }
  }

  // Private method to log errors
  private handleRequestError(
    error: AxiosError,
    method: string,
    url: string,
  ): void {
    this.logger.error(
      {
        method,
        url,
        error: error.response ? error.response.data : error.message,
        status: error.response ? error.response.status : 'N/A',
        stack: error.stack,
      },
      `************ Axios ${method} Method Error ************`,
    );
  }

  private static handleError(error: AxiosError): Error {
    const errorData: any = error?.response?.data;

    if (errorData?.error?.message) {
      return new HttpException(
        errorData.error.message,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.response) {
      return new HttpException(
        `Request failed with status ${error.response.status}`,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      return new HttpException(
        'Request failed: No response received from server',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      return new HttpException(
        `Request failed: Could not establish connection. ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
