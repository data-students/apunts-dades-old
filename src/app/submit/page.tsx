import { FC } from "react"
import { ProfileForm } from "@/components/Form"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return <ProfileForm PreselectedSubject={"AllSubjects"} />
}

export default page
