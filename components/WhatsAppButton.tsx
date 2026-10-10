import { getSettings } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

export default async function WhatsAppButton({ locale }: { locale: Locale }) {
  const settings = await getSettings();
  // wa.me requires an international number without punctuation or a leading 00.
  const phone = String(settings.whatsapp || '').replace(/[^0-9]/g, '').replace(/^00/, '');
  if (!/^[1-9][0-9]{6,14}$/.test(phone)) return null;
  const label = locale === 'ar' ? 'تواصل معنا على واتساب' : 'Chat with us on WhatsApp';
  return (
    <a className="whatsapp-float" href={`https://wa.me/${phone}`}
      target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.04 0C5.43 0 .05 5.38.05 12c0 2.12.55 4.19 1.6 6.02L0 24l6.13-1.61a11.96 11.96 0 0 0 5.9 1.5h.01c6.61 0 11.99-5.38 11.99-12a11.9 11.9 0 0 0-3.51-8.41ZM12.04 21.87h-.01a9.93 9.93 0 0 1-5.06-1.38l-.36-.21-3.64.96.97-3.55-.24-.37a9.94 9.94 0 0 1-1.52-5.32c0-5.5 4.47-9.98 9.98-9.98a9.9 9.9 0 0 1 7.06 2.93 9.9 9.9 0 0 1 2.92 7.06c0 5.5-4.48 9.98-9.98 9.98Zm5.48-7.47c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
      </svg>
    </a>
  );
}
