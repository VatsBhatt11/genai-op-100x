import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/src/lib/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
