import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <Link href="/login">Log in</Link>
      <br />
      <Link href="/signup">Sign up</Link>
    </div>
  );
}