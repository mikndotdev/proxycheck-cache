import Redis from "ioredis";

export async function check(ip: string, redis: Redis, apiKey: string) {
	const cache = await redis.get(ip);
	if (cache) {
		return JSON.parse(cache);
	}

	const res = await fetch(
		`https://proxycheck.io/v2/${ip}?risk=1&vpn=3&asn=1&risk=1&key=${apiKey}`,
	);
	if (!res.ok) {
		throw new Error("Failed to fetch from proxycheck.io");
	}
	const data = await res.json();
	if (data.status !== "ok") {
		throw new Error("Failed to fetch from proxycheck.io");
	}
	const dataWithTimestamp = {
		...data,
		cachedAt: new Date().toISOString(),
	};
	await redis.setex(ip, 60 * 60 * 24 * 30, JSON.stringify(dataWithTimestamp));
	return dataWithTimestamp;
}
