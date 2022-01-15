import { createCookieSessionStorage, LoaderFunction, redirect } from "remix";

let { commitSession, destroySession, getSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["mysecret"],
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export async function requireUserSession(
  request: Request,
  next: (session: unknown) => ReturnType<LoaderFunction>
) {
  let session = await getSession(request.headers.get("Cookie"));
  if (!session.get("user")) {
    return redirect("/login");
  }
  return next(session.get("user"));
}

export { commitSession, destroySession, getSession };
