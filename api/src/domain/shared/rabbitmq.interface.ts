export interface IRabbitMQ<T> {
  services: {
    users: T;
    transactions: T;
  };

  send(
    service: keyof IRabbitMQ<T>['services'],
    pattern: string,
    data: unknown,
  ): Promise<unknown>;

  emit(
    service: keyof IRabbitMQ<T>['services'],
    pattern: string,
    data: unknown,
  ): void;
}
