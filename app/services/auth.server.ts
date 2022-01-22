import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";

export let authenticator = new Authenticator(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    let username = form.get("username");
    let password = form.get("password");

    let user = {
      username,
      password,
    };

    return user;
  })
);
