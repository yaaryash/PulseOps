import { randomUUID } from "node:crypto";

import type { CreateServiceInput, Service, UpdateServiceInput } from "../types/service";

export class ServiceRepository {
  private readonly services = new Map<string, Service>();

  create(input: CreateServiceInput): Service {
    const timestamp = new Date().toISOString();
    const service: Service = {
      id: randomUUID(),
      ...input,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.services.set(service.id, service);
    return service;
  }

  findAll(): Service[] {
    return [...this.services.values()].sort((first, second) =>
      second.createdAt.localeCompare(first.createdAt),
    );
  }

  findById(id: string): Service | undefined {
    return this.services.get(id);
  }

  update(id: string, input: UpdateServiceInput): Service | undefined {
    const existingService = this.services.get(id);

    if (!existingService) {
      return undefined;
    }

    const updatedService: Service = {
      ...existingService,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.services.set(id, updatedService);
    return updatedService;
  }

  delete(id: string): boolean {
    return this.services.delete(id);
  }
}

export const serviceRepository = new ServiceRepository();
