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
    <li className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user?.name || null,
              image: session?.user?.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
        </div>
        {/* form */}
        <Editor subjectId={subjectId} contentType={"question"}/>

        <div className="w-full flex justify-end">
          <Button type="submit" className="w-full" form="subject-question-form">
            Compartir
          </Button>
        </div>
      </div>
    </li>
  );
};

export default MiniCreateQuestion;
