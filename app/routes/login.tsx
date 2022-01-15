import { TextInput, PasswordInput, Button, Paper, Text } from "@mantine/core";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
} from "remix";
import { commitSession, getSession } from "~/session.server";

interface LoginErrors {
  username?: boolean;
  password?: boolean;
}

export let action: ActionFunction = async ({ request }) => {
  let body = await request.formData();
  let username = body.get("username") as string;
  let password = body.get("password") as string;

  let errors: LoginErrors = {};
  if (!username) errors.username = true;
  if (!password) errors.password = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  let session = await getSession(request.headers.get("Cookie"));

  session.set("user", username);

  return redirect("/users", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));

  if (session) {
    return redirect("/users");
  }
  return redirect("/login");
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
            label="Username"
            required
            name="username"
            aria-required="true"
            sx={{ marginBottom: 10 }}
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
