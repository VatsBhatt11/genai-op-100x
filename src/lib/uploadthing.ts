import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import type { Session } from "next-auth";

const f = createUploadthing({
  token: process.env.UPLOADTHING_TOKEN,
});

export const ourFileRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      try {
        const session = (await getServerSession(authOptions)) as Session | null;
        if (!session?.user) {
          throw new Error("Unauthorized");
        }
        return { userId: session.user.id };
      } catch (error) {
        console.error("Middleware error:", error);
        throw new Error("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
