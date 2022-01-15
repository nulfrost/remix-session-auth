import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { prisma } from "~/db.server";
import { Input, Paper, Button, Text } from "@mantine/core";
import {
  destroySession,
  getSession,
  requireUserSession,
} from "~/session.server";

type LoaderData = {
  id: number;
  name: string;
};

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let username = formData.get("name") as string;

  // fake delay
  await new Promise((res) => setTimeout(res, 1000));

  try {
    await prisma.user.create({
      data: {
        name: username,
      },
    });
  } catch (e) {
    return json("User already exists in the database", {
      status: 400,
    });
  }

  return redirect("/users");
};

export let loader: LoaderFunction = async ({ request }) => {
  return requireUserSession(request, async (session) => {
    const users = await prisma.user.findMany();
    return json(users);
  });
};

export default function Index() {
  let data = useLoaderData<LoaderData[]>();
  let transition = useTransition();
  let error = useActionData();

  return (
    <div>
      <Paper withBorder sx={{ width: 400, margin: 50 }} padding="md">
        <Form method="post" replace>
          {error && (
            <Text size="sm" color="red">
              {error}
            </Text>
          )}
          <label htmlFor="name">Name</label>
          <Input type="text" id="name" name="name" sx={{ marginBottom: 20 }} />
          <Button
            variant="gradient"
            gradient={{ from: "orange", to: "red" }}
            type="submit"
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting" ? "Adding user!" : "Add user"}
          </Button>
        </Form>
      </Paper>
      <Form method="post" action="/logout">
        <Button type="submit">Log out</Button>
      </Form>
      <ul>
        {data.map((user) => (
          <li key={user.id}>
            <a href={`/users/${user.name}`}>{user.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
