// --- Contact Synchronization & Phone Hashing Utility ---

export interface ContactItem {
  name: string;
  phone: string;
  phoneHash: string;
}

// 1. Normalize Phone Number to international 84xxx format
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '84' + cleaned.substring(1);
  }
  return cleaned;
};

// 2. SHA-256 Phone Number Hashing (Web Crypto API - Zero Dependency)
export const hashPhoneNumber = async (phone: string): Promise<string> => {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 3. Read Device Contacts (Supports Capacitor Native Contacts & Web Contact Picker API)
export const readDeviceContacts = async (): Promise<ContactItem[]> => {
  const resultContacts: ContactItem[] = [];

  // Check if Capacitor Native Contacts plugin is available
  try {
    const win = window as any;
    if (win.Capacitor && win.Capacitor.isPluginAvailable('Contacts')) {
      const Contacts = win.Capacitor.Plugins.Contacts;
      const permission = await Contacts.requestPermissions();
      if (permission.contacts === 'granted') {
        const res = await Contacts.getContacts({
          projection: { name: true, phones: true }
        });
        if (res && res.contacts) {
          for (const c of res.contacts) {
            const name = c.name?.displayName || c.name?.given || 'Bạn bè';
            if (c.phones && c.phones.length > 0) {
              for (const p of c.phones) {
                const phoneVal = p.number || p.value || '';
                if (phoneVal) {
                  const phoneHash = await hashPhoneNumber(phoneVal);
                  resultContacts.push({ name, phone: phoneVal, phoneHash });
                }
              }
            }
          }
          return resultContacts;
        }
      }
    }
  } catch (e) {
    console.warn('Capacitor native contacts plugin not available, falling back to Web API', e);
  }

  // Fallback to Web Contact Picker API (Android Chrome / Edge)
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const props = ['name', 'tel'];
      const opts = { multiple: true };
      const selected = await (navigator as any).contacts.select(props, opts);
      if (selected && Array.isArray(selected)) {
        for (const item of selected) {
          const name = (item.name && item.name[0]) ? item.name[0] : 'Bạn bè';
          const tels = item.tel || [];
          for (const tel of tels) {
            if (tel) {
              const phoneHash = await hashPhoneNumber(tel);
              resultContacts.push({ name, phone: tel, phoneHash });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Web Contacts Picker cancelled or unavailable', e);
    }
  }

  return resultContacts;
};
