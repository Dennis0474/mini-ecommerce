import Link from "next/link";
import { checkout } from "@/app/actions/checkout";

async function handleTestCheckout() {
  "use server";
  await checkout("cmucj47x00000e0twutf5vyww", 1, "cmudhq4c80002e0twzyrq3hh6");
}

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <Link href="/login">Log in</Link>
      <br />
      <Link href="/signup">Sign up</Link>

      <form action={handleTestCheckout}>
        <button type="submit">Test Checkout</button>
      </form>
    </div>
  );
}