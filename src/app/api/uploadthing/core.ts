import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "@uploadthing/shared"
import { getToken } from "next-auth/jwt"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await getToken({ req })

      // If you throw, the user will not be able to upload
      if (!user)
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        })

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({}) => {}),

  // Another FileRoute (made by myself, not by the library)
  fileUploader: f({
    pdf: { maxFileCount: 1, maxFileSize: "128MB" },
    text: { maxFileCount: 5 },
  })
    .middleware(async (req) => {
      const user = await getToken({ req })
      if (!user) throw new UploadThingError({ code: "FORBIDDEN" })
      return { userId: user.id }
    })
    .onUploadComplete(async ({}) => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
