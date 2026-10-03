export const serviceStatuses = [
  "operational",
  "degraded",
  "outage",
  "maintenance",
] as const;

export type ServiceStatus = (typeof serviceStatuses)[number];

export type Service = {
  id: string;
  name: string;
  description?: string;
  url?: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceInput = {
  name: string;
  description?: string;
  url?: string;
  status: ServiceStatus;
};

export type UpdateServiceInput = Partial<CreateServiceInput>;
