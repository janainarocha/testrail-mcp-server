import { z } from "zod";

export interface TestRailConfig {
	baseUrl: string;
	username: string;
	apiKey: string;
}

export class TestRailBase {
	protected baseUrl: string;
	protected auth: string;

	constructor(config: TestRailConfig) {
		this.baseUrl = config.baseUrl.replace(/\/$/, "");
		this.auth = Buffer.from(`${config.username}:${config.apiKey}`).toString("base64");
	}

	protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
		const headers = {
			Authorization: `Basic ${this.auth}`,
			"Content-Type": "application/json",
			...options.headers,
		};
		try {
			const response = await fetch(url, {
				...options,
				headers,
			});
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`TestRail API error (${response.status}): ${errorText}`);
			}
			if (endpoint.startsWith("delete_")) {
				return undefined as T;
			}
			const contentLength = response.headers.get("content-length");
			if (contentLength === "0" || contentLength === null) {
				return undefined as T;
			}
			const text = await response.text();
			if (!text.trim()) {
				return undefined as T;
			}
			try {
				return JSON.parse(text) as T;
			} catch (parseError) {
				if (text.trim() === "") {
					return undefined as T;
				}
				throw parseError;
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`TestRail API request failed: ${error.message}`);
			}
			throw error;
		}
	}
}
