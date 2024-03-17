"use client"

import { FC, useCallback, useEffect, useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { useForm } from "react-hook-form"
import {
  QuestionCreationRequest,
  QuestionValidator,
  AnswerCreationRequest,
  AnswerValidator,
} from "@/lib/validators/question"
import { zodResolver } from "@hookform/resolvers/zod"
import type EditorJS from "@editorjs/editorjs"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/Button"

type FormData = QuestionCreationRequest | AnswerCreationRequest

interface EditorProps {
  subjectId: string
  contentType: "question" | "answer"
  questionId?: string
  formId: string
}

const Editor: FC<EditorProps> = ({
  subjectId,
  contentType,
  questionId,
  formId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      contentType === "question" ? QuestionValidator : AnswerValidator,
    ),
    defaultValues: {
      subjectId,
      title: "",
      content: null,
      questionId: questionId || "", // Add questionId as a value in the form
    },
  })

  const ref = useRef<EditorJS>()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const Code = (await import("@editorjs/code")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    // const ImageTool = (await import("@editorjs/image")).default; TODO: do this later

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        minHeight: 200,
        onReady() {
          ref.current = editor
        },
        placeholder: `Esciu aquí la teva ${
          contentType === "question" ? "pregunta" : "resposta"
        }...`,
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Alguna cosa no ha anat bé...",
          description: (value as { message: string }).message,
          variant: "destructive",
        })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: createContent, isLoading } = useMutation({
    mutationFn: async ({ title, content, subjectId }: FormData) => {
      const payload: FormData = {
        title,
        content,
        subjectId,
        ...(contentType === "answer" && { questionId: questionId }),
      }
      const apiPath =
        contentType === "question"
          ? "/api/subject/question/create"
          : "/api/subject/answer/create"
      const { data } = await axios.post(apiPath, payload)
      return data
    },
    onError: () => {
      toast({
        title: "Alguna cosa no ha anat bé",
        description: `No s'ha pogut crear la ${
          contentType === "question" ? "pregunta" : "reposta"
        }. Torna-ho a provar més tard.`,
        variant: "destructive",
      })
    },
    onSuccess: (data) => {
      // return new Response(JSON.stringify(createdQuestionId), { status: 201 });
      if (contentType === "question") {
        const questionId = data as string
        const newPathname = pathname.replace("/q", `/q/${questionId}`)
        router.push(newPathname)
        router.refresh()
      } else {
        ref.current?.clear()
        _titleRef.current!.value = ""
        window.location.reload()
      }

      return toast({
        description: `La teva ${
          contentType === "question" ? "pregunta" : "resposta"
        } s'ha creat correctament`,
      })
    },
  })

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save()

    const payload: FormData = {
      title: data.title,
      content: blocks,
      subjectId: subjectId,
      ...(contentType === "answer" && { questionId: questionId }),
    }
    createContent(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register("title")
  return (
    <div className="flex-grow">
      <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
        <form
          id={formId}
          className="w-full h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert h-full">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e)
                // @ts-ignore
                _titleRef.current = e
              }}
              {...rest}
              placeholder="Títol"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-xl font-bold focus:outline-none h-12"
            />
            <div id="editor" className="min-h-[100px] h-full"></div>
          </div>
        </form>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="w-full sm:w-auto mt-2"
          form={formId}
          isLoading={isLoading}
        >
          Compartir
        </Button>
      </div>
    </div>
  )
}

export default Editor
