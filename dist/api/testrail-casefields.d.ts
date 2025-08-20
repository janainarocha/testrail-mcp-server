import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export declare class TestRailCaseFieldsAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getCaseFields(): Promise<any[]>;
    addCaseField(fieldData: {
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
    }): Promise<any>;
}
