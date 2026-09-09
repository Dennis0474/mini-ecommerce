import { signup } from "@/app/actions/signup";

async function handleSignup(formData: FormData) {
  await signup(formData);
}

export default function SignupPage() {
  return (
    <form action={handleSignup}>
      <input name="username"/>
      <input name="password"/>
      <select name="role">
  <option value="BUYER">Buyer</option>
  <option value="SELLER">Seller</option>
  <option value="ADMIN">Admin</option>
</select>
      <button type="submit">Sign Up</button>
    </form>
  );
}

