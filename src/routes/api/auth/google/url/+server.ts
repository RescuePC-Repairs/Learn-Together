import { json } from '@sveltejs/kit';
import { generateAuthUrl } from '$lib/server/googleAuth';

export const GET = async () => {
  const url = generateAuthUrl();
  return json({ url });
};
