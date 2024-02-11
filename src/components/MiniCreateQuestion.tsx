"use client";

import { Session } from "next-auth";
import { Button } from "@/components/ui/Button";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import Editor from "@/components/Editor";

interface MiniCreateQuestionProps {
  session: Session | null;
  subjectId: string;
}
const MiniCreateQuestion: FC<MiniCreateQuestionProps> = ({
  session,
  subjectId,
}) => {
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
          <div className="flex-grow">
            <div className="h-full">
              <Editor subjectId={subjectId} contentType={"question"}/>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto mt-2" form="subject-question-form">
            Compartir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniCreateQuestion;
