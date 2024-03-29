import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getToken } from "next-auth/jwt"
import { MAX_FILE_COUNT, MAX_FILE_SIZE_MB } from "@/config"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getToken({ req })
      if (!user) throw new UploadThingError("Unauthorized")
      return { userId: user.id }
    })
    .onUploadComplete(async ({}) => {}),

  fileUploader: f({
    pdf: { maxFileCount: MAX_FILE_COUNT, maxFileSize: `${MAX_FILE_SIZE_MB}MB` },
    text: {
      maxFileCount: MAX_FILE_COUNT,
      maxFileSize: `${MAX_FILE_SIZE_MB}MB`,
    },
  })
    .middleware(async ({ req }) => {
      const user = await getToken({ req })
      if (!user) throw new UploadThingError("Unauthorized")
      return { userId: user.id }
    })
    .onUploadComplete(async ({}) => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
