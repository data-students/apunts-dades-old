import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getToken } from "next-auth/jwt"

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
    pdf: { maxFileCount: 1, maxFileSize: "128MB" },
    text: { maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      const user = await getToken({ req })
      if (!user) throw new UploadThingError("Unauthorized")
      return { userId: user.id }
    })
    .onUploadComplete(async ({}) => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
