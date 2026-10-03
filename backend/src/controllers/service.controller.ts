import type { Request, Response } from "express";

import { serviceService } from "../services/service.service";
import type { CreateServiceInput, UpdateServiceInput } from "../types/service";

export function listServices(_request: Request, response: Response): void {
  const services = serviceService.list();

  response.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
}

export function getService(request: Request<{ id: string }>, response: Response): void {
  const service = serviceService.getById(request.params.id);

  response.status(200).json({
    success: true,
    data: service,
  });
}

export function createService(
  request: Request<Record<string, never>, unknown, CreateServiceInput>,
  response: Response,
): void {
  const service = serviceService.create(request.body);

  response.status(201).json({
    success: true,
    data: service,
  });
}

export function updateService(
  request: Request<{ id: string }, unknown, UpdateServiceInput>,
  response: Response,
): void {
  const service = serviceService.update(request.params.id, request.body);

  response.status(200).json({
    success: true,
    data: service,
  });
}

export function deleteService(request: Request<{ id: string }>, response: Response): void {
  serviceService.remove(request.params.id);
  response.status(204).send();
}
