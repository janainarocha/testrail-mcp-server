export class TestRailBase {
    baseUrl;
    auth;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.auth = Buffer.from(`${config.username}:${config.apiKey}`).toString("base64");
    }
    async makeRequest(endpoint, options = {}) {
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
                return undefined;
            }
            const contentLength = response.headers.get("content-length");
            if (contentLength === "0" || contentLength === null) {
                return undefined;
            }
            const text = await response.text();
            if (!text.trim()) {
                return undefined;
            }
            try {
                const result = JSON.parse(text);
                return result;
            }
            catch (parseError) {
                if (text.trim() === "") {
                    return undefined;
                }
                throw parseError;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`TestRail API request failed: ${error.message}`);
            }
            throw error;
        }
    }
}
//# sourceMappingURL=testrail-base.js.map