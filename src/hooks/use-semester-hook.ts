import { useState, useEffect } from "react"
import axios from "axios" // You might need to install axios
import { LAST_SEMESTER } from "@/config"

const useSemesterHook = (subjectAcronym: string) => {
  const [data, setData] = useState(LAST_SEMESTER)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      if (subjectAcronym === "") {
        setData(-1)
      } else {
        const response = await axios.get(
          `/api/semester?acronym=${subjectAcronym}`,
        )
        setData(response.data)
      }
      setIsLoading(false)
    }

    if (subjectAcronym !== null && subjectAcronym !== undefined) {
      // Assuming subjectAcronym can be null or undefined initially
      fetchData()
    }
  }, [subjectAcronym])

  return { data, isLoading, setIsLoading }
}

export default useSemesterHook
