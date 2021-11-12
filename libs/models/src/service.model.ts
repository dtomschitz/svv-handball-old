export enum ServiceStatus {
  OPERATIONAL = 'Operational',
  DOWN = 'Down',
}

export interface Service {
  name: string;
  status: ServiceStatus;
}
