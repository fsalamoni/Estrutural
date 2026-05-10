const DEFAULT_SITE_URL = 'https://fsalomone.web.app';

function getSiteUrl() {
	const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

	if (!configuredUrl) {
		return DEFAULT_SITE_URL;
	}

	try {
		const normalizedUrl = new URL(configuredUrl);

		if (!['http:', 'https:'].includes(normalizedUrl.protocol)) {
			return DEFAULT_SITE_URL;
		}

		return normalizedUrl.toString().replace(/\/$/, '');
	} catch {
		return DEFAULT_SITE_URL;
	}
}

export const SITE_URL = getSiteUrl();
export const SITE_ORIGIN = new URL(SITE_URL).origin;