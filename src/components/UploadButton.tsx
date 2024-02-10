import { UploadButton } from "@uploadthing/react";

import type { OurFileRouter } from "@/app//api/uploadthing/core";

export const OurUploadButton = () => (
  <UploadButton<OurFileRouter>
    endpoint="fileUploader"
    onClientUploadComplete={(res) => {
      // Do something with the response
      console.log("Files: ", res);
      alert("Upload Completed");
    }}
    onUploadError={(error: Error) => {
      // Do something with the error.
      alert(`ERROR! ${error.message}`);
    }}
  />
);
