import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Priority } from "./testrail-types.js";

export class TestRailPrioritiesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getPriorities(): Promise<Priority[]> {
		return this.makeRequest<Priority[]>("get_priorities");
	}

	async getPriorityByShortName(shortName: string): Promise<Priority | null> {
		const priorities = await this.getPriorities();
		return priorities.find((p) => p.short_name === shortName) || null;
	}
}
