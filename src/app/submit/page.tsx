import { getAuthSession } from "@/lib/auth"
import { ProfileForm } from "@/components/Form"
import { notFound } from "next/navigation"
import { GCED_START } from "@/config"

const page = async ({}) => {
  const session = await getAuthSession()
  const isAdmin = session?.user?.isAdmin
  if (isAdmin === undefined) return notFound()
  return (
    <ProfileForm
      PreselectedSubject={"AllSubjects"}
      isAdmin={isAdmin}
      generacio={session ? Number(session.user.generacio) : GCED_START}
    />
  )
}

export default page
