import { Router } from "express";

import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "../controllers/service.controller";
import { validateRequest } from "../middleware/validate-request.middleware";
import {
  createServiceSchema,
  serviceIdSchema,
  updateServiceSchema,
} from "../schemas/service.schema";

const serviceRouter = Router();

serviceRouter.route("/").get(listServices).post(validateRequest(createServiceSchema), createService);

serviceRouter
  .route("/:id")
  .get(validateRequest(serviceIdSchema), getService)
  .patch(validateRequest(updateServiceSchema), updateService)
  .delete(validateRequest(serviceIdSchema), deleteService);

export default serviceRouter;
