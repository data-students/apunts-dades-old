"use client"

import { useCustomToasts } from "@/hooks/use-custom-toasts"
import { AnswerAcceptedRequest } from "@/lib/validators/vote"
import { usePrevious } from "@mantine/hooks"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "../../hooks/use-toast"
import { Button } from "../ui/Button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"
import { Answer, AnswerVote, User } from "@prisma/client"
import { useSession } from "next-auth/react"

interface AnswerAcceptClientProps {
  questionAuthorId: string
  answerId: string
  initialAccepted: boolean | undefined
  answer: Answer & {
    author: User
    votes: AnswerVote[]
  }
}

const AnswerAcceptClient = ({
  questionAuthorId,
  answerId,
  initialAccepted,
  answer,
}: AnswerAcceptClientProps) => {
  const { loginToast } = useCustomToasts()
  const [currentAccepted, setCurrentAccepted] = useState(initialAccepted)
  const prevAccepted = usePrevious(currentAccepted)

  // ensure sync with server
  useEffect(() => {
    setCurrentAccepted(initialAccepted)
  }, [initialAccepted])

  const { mutate: accept } = useMutation({
    mutationFn: async (accepted: boolean) => {
      const payload: AnswerAcceptedRequest = {
        accepted: accepted,
        answerId: answerId,
      }

      await axios.patch("/api/subject/answer/accept", payload)
    },
    onError: (err) => {
      // reset current acceptation
      setCurrentAccepted(prevAccepted)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your acceptation was not registered. Please try again.",
        variant: "destructive",
      })
    },
    onMutate: (accepted: boolean) => {
      if (currentAccepted === accepted) {
        // User is voting the same way again, so remove their acceptation
        setCurrentAccepted(undefined)
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentAccepted(accepted)
      }
    },
  })

  const debouncedAccepted = debounce(accept, 1000, {
    leading: true,
    trailing: false,
  })

  const { data: session } = useSession()

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      {questionAuthorId === session?.user.id ? (
        <Button
          onClick={() => debouncedAccepted(true)}
          size="sm"
          variant="ghost"
          aria-label="accept"
        >
          <Check
            strokeWidth={3}
            className={cn("h-5 w-5 text-zinc-700", {
              "text-emerald-500": currentAccepted,
            })}
          />
        </Button>
      ) : (
        <Check
          strokeWidth={3}
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500": answer.accepted,
          })}
        />
      )}
    </div>
  )
}

export default AnswerAcceptClient
