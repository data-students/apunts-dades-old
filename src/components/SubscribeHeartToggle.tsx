"use client"

import { FC, startTransition } from "react"
import { Button } from "./ui/Button"
import { SubscribeToSubjectPayload } from "@/lib/validators/subject"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useCustomToasts } from "@/hooks/use-custom-toasts"
import { Heart, HeartIcon } from "lucide-react"

interface SubscribeLeaveToggleProps {
  subjectId: string
  subjectName: string
  isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subjectId,
  subjectName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToasts()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubjectPayload = {
        subjectId,
      }
      const { data } = await axios.post("/api/subject/subscribe", payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "S'ha produït un error desconegut.",
        description:
          "No s'ha pogut subscriure a l'assignatura. Siusplau, torna a intentar-ho més tard.",
        variant: "destructive",
      })
    },
    onSuccess: ({}) => {
      startTransition(() => {
        router.refresh()
      })

      const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i
      const subjectArticle = subjectName.match(startsWithVowel) ? "d'" : "de "

      return toast({
        title: `T'has subscrit als apunts ${subjectArticle}${subjectName}!`,
        description: "",
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubjectPayload = {
        subjectId,
      }
      const { data } = await axios.post("/api/subject/unsubscribe", payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "S'ha produït un error desconegut.",
        description:
          "No s'ha pogut donar de baixa la subscripció a l'assignatura. Siusplau, torna a intentar-ho més tard.",
        variant: "destructive",
      })
    },
    onSuccess: ({}) => {
      startTransition(() => {
        router.refresh()
      })

      const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i
      const subjectArticle = subjectName.match(startsWithVowel) ? "d'" : "de "

      return toast({
        title: `Has donat de baixa la teva subscripció als apunts ${subjectArticle}${subjectName}!`,
        description: "",
      })
    },
  })

  return isSubscribed ? (
    <Button
      isLoading={isUnsubLoading}
      onClick={(e) => {
        e.preventDefault()
        unsubscribe()
      }}
      size="sm"
      variant="ghost"
      aria-label="unsubscribe"
    >
      <Heart fill="red" strokeWidth={0} className="h-5 w-5" />
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={(e) => {
        e.preventDefault()
        subscribe()
      }}
      size="sm"
      variant="ghost"
      aria-label="subscribe"
    >
      <HeartIcon className="h-5 w-5" />
    </Button>
  )
}

export default SubscribeLeaveToggle
