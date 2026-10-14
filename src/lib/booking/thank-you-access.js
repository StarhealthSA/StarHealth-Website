const THANK_YOU_ACCESS_KEY = 'star_health_thank_you_access';

export function grantThankYouAccess() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(THANK_YOU_ACCESS_KEY, '1');
  } catch {
    // sessionStorage may be blocked
  }
}

export function hasThankYouAccess() {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(THANK_YOU_ACCESS_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearThankYouAccess() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(THANK_YOU_ACCESS_KEY);
  } catch {
    // ignore
  }
}

/** Mark booking success and navigate to the gated thank-you page. */
export function redirectToThankYou() {
  grantThankYouAccess();
  window.location.assign('/thank-you');
}
