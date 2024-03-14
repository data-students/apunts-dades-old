import { getAuthSession } from "@/lib/auth"
import { ProfileForm } from "@/components/Form"
import { notFound } from "next/navigation"

const page = async ({}) => {
  const session = await getAuthSession()
  const isAdmin = session?.user?.isAdmin
  if (!isAdmin) return notFound()
  return <ProfileForm PreselectedSubject={"AllSubjects"} isAdmin={isAdmin} />
}

export default page
