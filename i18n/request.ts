import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');

  const locale = languageCookie?.value || 'zh';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
