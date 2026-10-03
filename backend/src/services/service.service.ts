import { serviceRepository } from "../repositories/service.repository";
import type { CreateServiceInput, Service, UpdateServiceInput } from "../types/service";
import { AppError } from "../utils/app-error";

class ServiceService {
  list(): Service[] {
    return serviceRepository.findAll();
  }

  getById(id: string): Service {
    const service = serviceRepository.findById(id);

    if (!service) {
      throw new AppError("Service was not found", 404);
    }

    return service;
  }

  create(input: CreateServiceInput): Service {
    return serviceRepository.create(input);
  }

  update(id: string, input: UpdateServiceInput): Service {
    const service = serviceRepository.update(id, input);

    if (!service) {
      throw new AppError("Service was not found", 404);
    }

    return service;
  }

  remove(id: string): void {
    if (!serviceRepository.delete(id)) {
      throw new AppError("Service was not found", 404);
    }
  }
}

export const serviceService = new ServiceService();
