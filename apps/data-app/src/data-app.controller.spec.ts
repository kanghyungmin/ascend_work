import { Test, TestingModule } from '@nestjs/testing';
import { DataAppController } from './data-app.controller';
import { DataAppService } from './data-app.service';

describe('DataAppController', () => {
  let dataAppController: DataAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DataAppController],
      providers: [DataAppService],
    }).compile();

    dataAppController = app.get<DataAppController>(DataAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dataAppController.getHello()).toBe('Hello World!');
    });
  });
});
