import { Hono } from "hono";
import { Bindings } from "./bindings";
import { check } from "./check";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/check/:ip", async (c) => {
	const ip = c.req.param("ip");
	try {
		const res = await check(
			ip,
			c.env.UPSTASH_REDIS_REST_URL,
			c.env.UPSTASH_REDIS_REST_TOKEN,
			c.env.PROXYCHECK_API_KEY,
		);
		return c.json(res);
	} catch (error) {
		return c.json({ error: "Failed to fetch data" }, 500);
	}
});

export default app;
