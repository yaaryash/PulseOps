import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

import { AppError } from "../utils/app-error";

export function validateRequest(schema: ZodTypeAny): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
    });

    if (!result.success) {
      next(
        new AppError(
          "Request validation failed",
          400,
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    request.body = result.data.body;
    request.params = result.data.params;
    next();
  };
}
