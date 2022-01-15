import { json, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";

type LoaderData = {
  users: string;
};

export let loader: LoaderFunction = ({ params }) => {
  const { users } = params;
  return json({ users });
};

export default function User() {
  let { users } = useLoaderData<LoaderData>();

  return <h1>Hello {users}</h1>;
}
