'use server';

import { redirect } from 'next/navigation';

export async function handleSearchAction(formData: FormData) {
  const query = formData.get('query') as string;
  if (query && query.trim()) {
    redirect(`/products?searchQuery=${encodeURIComponent(query.trim())}`);
  }
}
