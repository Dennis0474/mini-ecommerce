import { createListing } from "@/app/actions/createListing";

async function handleCreateListing(formData: FormData) {
  "use server";
  await createListing(formData);
}

export default function CreateListingPage() {
  return (
    <form action={handleCreateListing}>
      <input name="name" placeholder="Product name" className="border p-2 block mb-2" />
      <input name="description" placeholder="Description" className="border p-2 block mb-2" />
      <input name="price" type="number" placeholder="Price (in cents)" className="border p-2 block mb-2" />
      <input name="stock" type="number" placeholder="Stock" className="border p-2 block mb-2" />
      <button type="submit">Create Listing</button>
    </form>
  );
}