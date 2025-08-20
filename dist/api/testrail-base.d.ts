export interface TestRailConfig {
    baseUrl: string;
    username: string;
    apiKey: string;
}
export declare class TestRailBase {
    protected baseUrl: string;
    protected auth: string;
    constructor(config: TestRailConfig);
    protected makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;
}
