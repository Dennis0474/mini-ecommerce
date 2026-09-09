import { signup } from "@/app/actions/signup";

async function handleSignup(formData: FormData) {
  "use server";
  await signup(formData);
}

export default function SignupPage() {
  return (
    <form action={handleSignup}>
      <input name="username" placeholder="Username" className="border p-2 block mb-2" />
<input name="password" type="password" placeholder="Password" className="border p-2 block mb-2" />
      <select name="role">
  <option value="BUYER">Buyer</option>
  <option value="SELLER">Seller</option>
  <option value="ADMIN">Admin</option>
</select>
      <button type="submit">Sign Up</button>
    </form>
  );
}

