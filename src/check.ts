import { Redis } from "@upstash/redis/cloudflare";

export async function check(
	ip: string,
	url: string,
	token: string,
	apiKey: string,
) {
	const redis = new Redis({
		url,
		token,
	});

	const cache = await redis.get(ip);
	if (cache) {
		return cache;
	} else {
		const res = await fetch(
			`https://proxycheck.io/v2/${ip}?risk=1&vpn=3&asn=1&key=${apiKey}`,
		);
		if (!res.ok) {
			return new Error("Failed to fetch from proxycheck.io");
		}
		const data = await res.json();
		const dataWithTimestamp = {
			...data,
			cachedAt: new Date().toISOString(),
		};
		await redis.set(ip, JSON.stringify(dataWithTimestamp), {
			ex: 60 * 60 * 24 * 30,
		});
		return dataWithTimestamp;
	}
}
