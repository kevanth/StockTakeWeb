export function getCookieValue(
	req: Request,
	key: string
): string | null {
	const cookieHeader = req.headers.get("cookie");
	if (!cookieHeader) return null;

	const match = cookieHeader.match(
		new RegExp(`(^|;\\s*)${key}=([^;]*)`)
	);
	return match ? decodeURIComponent(match[2]) : null;
}
