import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // 从 cookie 获取语言设置
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');

  const locale = languageCookie?.value || 'zh';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
