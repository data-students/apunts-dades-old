import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware (req) {
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname && req.nextUrl.pathname.includes('/accountrequest')){
          return false
        }
        if (
          req.nextUrl.pathname &&
          req.nextUrl.pathname.startsWith('/') &&
          !req.nextUrl.pathname.startsWith('/sign-in') &&
          token === null
        ) {
          return false
        }
        return true
      }
    }
  }
)