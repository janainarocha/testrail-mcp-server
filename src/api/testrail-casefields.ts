import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export class TestRailCaseFieldsAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getCaseFields(): Promise<any[]> {
		return await this.makeRequest("get_case_fields");
	}

	async addCaseField(fieldData: {
		type: string;
		name: string;
		label: string;
		description?: string;
		include_all?: boolean;
		template_ids?: number[];
		configs: Array<{
			context: {
				is_global: boolean;
				project_ids: number[] | string | null;
			};
			options: Record<string, any>;
		}>;
	}): Promise<any> {
		return await this.makeRequest("add_case_field", {
			method: "POST",
			body: JSON.stringify(fieldData),
		});
	}
}
