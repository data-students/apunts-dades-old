"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Combobox } from "@/components/Combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { ApuntsPostCreationRequest } from "@/lib/validators/post";
import { uploadFiles } from "@/lib/uploadthing";

const formSchema = z.object({
  pdf: z.any(),
  title: z.string({
    required_error: "Selecciona un usuari",
  }),
  assignatura: z.string({
    required_error: "Selecciona una assignatura.",
  }),
  tipus: z.string({
    required_error: "Selecciona un tipus.",
  }),
  anonim: z.boolean().default(false).optional(),
});

const smallFormSchema = z.object({
  pdf: z.any(),
  title: z.string({
    required_error: "Selecciona un usuari",
  }),
  tipus: z.string({
    required_error: "Selecciona un tipus.",
  }),
  anonim: z.boolean().default(false).optional(),
});

// export function ComboboxForm() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   })

export function ProfileForm() {
  const router = useRouter();

  const { mutate: createApuntsPost } = useMutation({
    mutationFn: async ({
      pdf,
      title,
      assignatura,
      tipus,
      anonim,
    }: ApuntsPostCreationRequest) => {
      const payload: ApuntsPostCreationRequest = {
        pdf,
        title,
        assignatura,
        tipus,
        anonim,
      };
      const { data } = await axios.post("/api/subject/post/create", payload);
      return data;
    },
    onError: () => {
      toast({
        title: "Alguna cosa no ha anat bé",
        description: "No s'ha pogut crear el post. Torna-ho a provar més tard.",
        variant: "destructive",
      });
    },
    onSuccess: (subjectAcronym) => {
      router.push(`/${subjectAcronym}`);
      router.refresh();

      return toast({
        description: "El teu post s'ha creat correctament",
      });
    },
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  async function onSubmit(data: ApuntsPostCreationRequest) {
    const [res] = await uploadFiles([data.pdf], "fileUploader");
    const payload: ApuntsPostCreationRequest = {
      pdf: res.fileUrl,
      title: data.title,
      assignatura: data.assignatura,
      tipus: data.tipus,
      anonim: data.anonim,
    };

    createApuntsPost(payload);
  }
  // ------------------------------
  const assignatures = [
    {
      value: "alg",
      label: "ALG",
    },
    {
      value: "cal",
      label: "CAL",
    },
    {
      value: "lmd",
      label: "LMD",
    },
    {
      value: "ap1",
      label: "AP1",
    },
    {
      value: "ap2",
      label: "AP2",
    },
    {
      value: "ac2",
      label: "AC2",
    },
    {
      value: "pie1",
      label: "PIE1",
    },
    {
      value: "com",
      label: "COM",
    },
    {
      value: "sis",
      label: "SIS",
    },
    {
      value: "ap3",
      label: "AP3",
    },
    {
      value: "teoi",
      label: "TEOI",
    },
    {
      value: "pie2",
      label: "PIE2",
    },
    {
      value: "bd",
      label: "BD",
    },
    {
      value: "psd",
      label: "PSD",
    },
    {
      value: "ipa",
      label: "IPA",
    },
    {
      value: "om",
      label: "OM",
    },
    {
      value: "ad",
      label: "AD",
    },
    {
      value: "aa1",
      label: "AA1",
    },
    {
      value: "vi",
      label: "VI",
    },
    {
      value: "cai",
      label: "CAI",
    },
    {
      value: "bda",
      label: "BDA",
    },
    {
      value: "aa2",
      label: "AA2",
    },
    {
      value: "ei",
      label: "EI",
    },
    {
      value: "taed1",
      label: "TAED1",
    },
    {
      value: "poe",
      label: "POE",
    },
    {
      value: "piva",
      label: "PIVA",
    },
    {
      value: "pe",
      label: "PE",
    },
    {
      value: "taed2",
      label: "TAED2",
    },
    {
      value: "altres",
      label: "Altres",
    },
  ];
  const tipus = [
    {
      value: "apunts",
      label: "Apunts",
    },
    {
      value: "examens",
      label: "Exàmens",
    },
    {
      value: "exercicis",
      label: "Exercicis",
    },
    {
      value: "diapositives",
      label: "Diapositives",
    },
    {
      value: "altres",
      label: "Altres",
    },
  ];
  // ------------------------------
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="pdf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fitxers PDF</FormLabel>
              <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="pdf-file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Penja els teus apunts en format PDF.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: Nomes admins
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="WhoIsGraf?" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom dels Apunts</FormLabel>
              <FormControl>
                <Input placeholder="WhoIsGraf?" {...field} />
              </FormControl>
              <FormDescription>El nom dels teus apunts.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignatura"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignatura</FormLabel>
              <FormControl>
                <Combobox
                  options={assignatures}
                  value={field.value}
                  setValue={field.onChange}
                />
              </FormControl>
              <FormDescription>Tria l&apos;assignatura.</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipus</FormLabel>
              <FormControl>
                <Combobox
                  options={tipus}
                  value={field.value}
                  setValue={field.onChange}
                />
              </FormControl>
              <FormDescription>Tria el tipus de document.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anonim"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Penjar com a anònim</FormLabel>
                <FormDescription>
                  L&apos;AED guarda sempre l&apos;autor dels apunts.
                  L&apos;opció d&apos;anònim permet que no es mostrin als altres
                  usuaris.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default ProfileForm;

export const SmallProfileForm = ({
  subjectAcronym,
}: {
  subjectAcronym: string;
}) => {
  const router = useRouter();

  const { mutate: createApuntsPost } = useMutation({
    mutationFn: async ({
      pdf,
      title,
      assignatura,
      tipus,
      anonim,
    }: ApuntsPostCreationRequest) => {
      const payload: ApuntsPostCreationRequest = {
        pdf,
        title,
        assignatura,
        tipus,
        anonim,
      };
      const { data } = await axios.post("/api/subject/post/create", payload);
      return data;
    },
    onError: () => {
      toast({
        title: "Alguna cosa no ha anat bé",
        description: "No s'ha pogut crear el post. Torna-ho a provar més tard.",
        variant: "destructive",
      });
    },
    onSuccess: (subjectAcronym) => {
      router.push(`/${subjectAcronym}`);
      router.refresh();

      return toast({
        description: "El teu post s'ha creat correctament",
      });
    },
  });
  const form = useForm({
    resolver: zodResolver(smallFormSchema),
  });
  async function onSubmit(data: ApuntsPostCreationRequest) {
    const [res] = await uploadFiles([data.pdf], "fileUploader");
    const payload: ApuntsPostCreationRequest = {
      pdf: res.fileUrl,
      title: data.title,
      assignatura: subjectAcronym,
      tipus: data.tipus,
      anonim: data.anonim,
    };
    createApuntsPost(payload);
  }
  // ------------------------------
  const tipus = [
    {
      value: "apunts",
      label: "Apunts",
    },
    {
      value: "examens",
      label: "Exàmens",
    },
    {
      value: "exercicis",
      label: "Exercicis",
    },
    {
      value: "diapositives",
      label: "Diapositives",
    },
    {
      value: "altres",
      label: "Altres",
    },
  ];
  // ------------------------------
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="pdf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fitxers PDF</FormLabel>
              <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="pdf-file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Penja els teus apunts en format PDF.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: Nomes admins
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="WhoIsGraf?" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom dels Apunts</FormLabel>
              <FormControl>
                <Input placeholder="WhoIsGraf?" {...field} />
              </FormControl>
              <FormDescription>El nom dels teus apunts.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipus</FormLabel>
              <FormControl>
                <Combobox
                  options={tipus}
                  value={field.value}
                  setValue={field.onChange}
                />
              </FormControl>
              <FormDescription>Tria el tipus de document.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anonim"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Penjar com a anònim</FormLabel>
                <FormDescription>
                  L&apos;AED guarda sempre l&apos;autor dels apunts.
                  L&apos;opció d&apos;anònim permet que no es mostrin als altres
                  usuaris.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
