"use client"

import { Session } from "next-auth"
import { FC } from "react"
import UserAvatar from "./UserAvatar"
import Editor from "@/components/Editor"

interface CreateQuestionProps {
  session: Session | null
  subjectId: string
}
const CreateQuestion: FC<CreateQuestionProps> = ({ session, subjectId }) => {
  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-auto px-6 py-4 flex flex-col justify-between">
        <div className="flex items-start gap-6">
          <div className="relative">
            <UserAvatar
              user={{
                name: session?.user?.name || null,
                image: session?.user?.image || null,
              }}
            />
            <span className="absolute bottom-1 right-1 transform translate-x-1/2 translate-y-1/2 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
          </div>
          {/* form */}
          <Editor
            subjectId={subjectId}
            contentType={"question"}
            formId="subject-question-form"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateQuestion
