import { TextInput, PasswordInput, Button, Paper, Text } from "@mantine/core";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
} from "remix";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";

interface LoginErrors {
  username?: boolean;
  password?: boolean;
}

export let action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate("form", request, {
    successRedirect: "/users",
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/users",
  });
};

export default function Login() {
  let errors = useActionData<LoginErrors>();
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 300 }}>
      <Paper sx={{ maxWidth: 500, flex: 1 }} padding={10} withBorder>
        <Form method="post">
          {errors?.username && (
            <Text color="red" aria-live="assertive" size="sm">
              Username is required
            </Text>
          )}
          <TextInput
            label="E-mail"
            required
            name="email"
            type="email"
            aria-required="true"
            sx={{ marginBottom: 10 }}
            description="Use any username and password"
          />
          {errors?.password && (
            <Text color="red" aria-live="assertive" size="sm">
              Password is required
            </Text>
          )}
          <PasswordInput
            label="Password"
            name="password"
            required
            aria-required="true"
            sx={{ marginBottom: 10 }}
          />
          <Button type="submit">Log in</Button>
        </Form>
      </Paper>
    </div>
  );
}
