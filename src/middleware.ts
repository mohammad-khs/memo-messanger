import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathName = req.nextUrl.pathname;
    console.log("pathName : ", pathName);

    // Manange route protection
    const isAuth = await getToken({ req });
    console.log("isAuth : ", isAuth);
    const isLogingPage = pathName.startsWith("/login");
    console.log("isLogingPage : ", isLogingPage);

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathName.startsWith(route)
    );
    console.log("isAccessingSensitiveRoute : ", isAccessingSensitiveRoute);
    if (isLogingPage) {
      if (isAuth) {
        console.log("isLogingPage & isAuth : ", new URL("/dashboard", req.url));
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      console.log("NextResponse.next : ", NextResponse.next());
      return NextResponse.next();
    }
    if (!isAuth && isAccessingSensitiveRoute) {
      console.log(
        "!isAuth && isAccessingSensitiveRoute : ",
        new URL("/login", req.url)
      );
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathName === "/") {
      console.log("pathName === '/'", new URL("/login", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
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

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Check if the request is for the GitHub callback
//   if (pathname === "/api/auth/callback/github") {
//     const { searchParams } = req.nextUrl;

//     const code = searchParams.get("code");
//     // const state = searchParams.get("state");

//     // Validate the presence of the code
//     if (!code) {
//       return NextResponse.redirect("/error?message=Missing code");
//     }

//     try {
//       // Here, implement your logic to exchange the code for tokens
//       // If successful, you can set a cookie or session here

//       return NextResponse.redirect("http://localhost:3000/dashboard"); // Redirect to dashboard on success
//     } catch (error) {
//       console.error(error);
//       return NextResponse.redirect("http://localhost:3000");
//     }
//   }

//   // Pass-through for other routes
//   return NextResponse.next();
// }

// // Optional: Specify the paths for which the middleware should run
// export const config = {
//   matcher: ["/api/auth/callback/github", "/", "/login", "/dashboard/:path*"], // Add other paths as needed
// };

// export const config = {
//   matcher: ["/", "/login", "/dashboard/:path*"],
// };
