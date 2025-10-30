import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from './http.client.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: `${process.env.HTTP_CLIENT_BASE_URL}${process.env.HTTP_CLIENT_API_VERSION}`,
      timeout: Number(process.env.HTTP_CLIENT_TIMEOUT) || 5000,
    }),
  ],
  providers: [HttpClient],
  exports: [HttpClient],
})
export class HttpClientModule {}
