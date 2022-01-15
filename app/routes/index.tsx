import { Link } from "remix";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>This is my new remix app</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}
