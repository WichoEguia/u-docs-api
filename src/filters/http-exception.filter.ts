import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json({
        statusCode: status,
        message: this.getErrorMessage(status, exception),
        path: request.url,
        timestamp: new Date().toISOString()
      });
  }

  private getErrorMessage(status: number, exception: HttpException) {
    switch (status) {
      case 500:
        return 'Ha ocurrido un error en el servidor';
        break;

      case 401:
        return 'Token no es valido';
        break;
    
      default:
        return typeof exception.getResponse() === 'object'
          ? (exception.getResponse() as any).message
          : exception.getResponse()
        break;
    }
  }
}