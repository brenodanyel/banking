import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SettingsService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRabbitMQUrl', () => {
    it('should return the RabbitMQ URL', () => {
      const rabbitMQUrl = 'amqp://localhost:5672';
      jest.spyOn(configService, 'get').mockReturnValueOnce(rabbitMQUrl);

      const result = service.getRabbitMQUrl();

      expect(result).toBe(rabbitMQUrl);
      expect(configService.get).toHaveBeenCalledWith('RABBITMQ_URL');
    });
  });
});
