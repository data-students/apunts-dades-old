import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { uploadFiles } from "@/lib/uploadthing";
import { useState } from 'react';

export function InputFile() {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    }
    const handleUpload = async () => {
        if (selectedFile) {
            return await uploadFiles([selectedFile], "fileUploader");
        }
    }
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="pdf-file">Fitxer Pdf</Label>
      <Input id="pdf-file" type="file" onChange={handleFileChange}/>
    </div>
  )
}

export default InputFile;