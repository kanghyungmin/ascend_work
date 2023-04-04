import { Controller, Get } from '@nestjs/common';
import { DataAppService } from './data-app.service';

@Controller()
export class DataAppController {
  constructor(private readonly dataAppService: DataAppService) {}

  @Get()
  getHello(): string {
    return this.dataAppService.getHello();
  }
}
