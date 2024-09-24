import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/api/auth/callback/github", "/", "/login", "/dashboard/:path*"],
};

/////////////////////////////////////////////////////////

// export default withAuth(
//   async function middleware(req: NextRequest) {
//     const { pathname } = req.nextUrl;

//     // Check if the request is for the GitHub callback
//     if (pathname === "/api/auth/callback/github") {
//       const { searchParams } = req.nextUrl;

//       const code = searchParams.get("code");
//       // const state = searchParams.get("state");

//       // Validate the presence of the code
//       if (!code) {
//         return NextResponse.redirect("/error?message=Missing code");
//       }

//       try {
//         // Here, implement your logic to exchange the code for tokens
//         // If successful, you can set a cookie or session here

//         return NextResponse.redirect(
//           "https://memo-messanger.vercel.app/dashboard"
//         ); // Redirect to dashboard on success
//       } catch (error) {
//         console.error(error);
//         return NextResponse.redirect("https://memo-messanger.vercel.app");
//       }
//     }

//     // Pass-through for other routes
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       async authorized() {
//         return true;
//       },
//     },
//   }
// );
// // Optional: Specify the paths for which the middleware should run
// export const config = {
//   matcher: ["/api/auth/callback/github", "/", "/login", "/dashboard/:path*"], // Add other paths as needed
// };

// export const config = {
//   matcher: ["/api/auth/callback/github", "/", "/login", "/dashboard/:path*"], // Add other paths as needed
// };
