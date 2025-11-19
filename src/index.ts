import { Elysia } from "elysia";
import Redis from "ioredis";
import { check } from "./check";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const app = new Elysia()
	.get("/check/:ip", async ({ params: { ip } }) => {
		try {
			const res = await check(
				ip,
				redis,
				process.env.PROXYCHECK_API_KEY || "",
			);
			return res;
		} catch (error) {
			return { error: "Failed to fetch data" };
		}
	})
	.listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
