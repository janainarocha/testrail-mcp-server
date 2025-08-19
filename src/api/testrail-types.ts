export interface TestCase {
	id?: number;
	title: string;
	section_id: number;
	suite_id?: number;
	template_id?: number;
	type_id?: number;
	priority_id?: number;
	estimate?: string;
	estimate_forecast?: string;
	milestone_id?: number;
	refs?: string;
	created_by?: number;
	created_on?: number;
	updated_by?: number;
	updated_on?: number;
	display_order?: number;
	is_deleted?: number;
	labels?: Array<{
		id: number;
		title: string;
		created_by?: string;
		created_on?: string;
	}>;
	custom_preconds?: string;
	custom_steps?: string;
	custom_expected?: string;
	custom_steps_separated?: Array<{
		content: string;
		expected: string;
		shared_step_id?: number;
	}>;
	custom_mission?: string;
	custom_goals?: string;
	custom_automation_type?: number | string;
	[key: string]: any;
}

export interface Project {
	id: number;
	name: string;
	announcement?: string;
	show_announcement?: boolean;
	is_completed?: boolean;
	completed_on?: number;
	suite_mode?: number;
	default_role_id?: number;
}

export interface Section {
	id: number;
	name: string;
	description?: string;
	suite_id?: number;
	parent_id?: number;
	display_order?: number;
}

export interface Suite {
	id: number;
	name: string;
	description?: string;
	project_id: number;
	is_master?: boolean;
	is_baseline?: boolean;
	is_completed?: boolean;
	completed_on?: number;
}

export interface CaseType {
	id: number;
	name: string;
	is_default?: boolean;
}

export interface Priority {
	id: number;
	name: string;
	short_name?: string;
	is_default?: boolean;
}

export interface Template {
	id: number;
	name: string;
	is_default: boolean;
}

export interface Test {
	id: number;
	assignedto_id?: number;
	case_id: number;
	estimate?: string;
	estimate_forecast?: string;
	milestone_id?: number;
	priority_id?: number;
	refs?: string;
	run_id: number;
	status_id: number;
	title: string;
	type_id?: number;
	labels?: Array<{
		id: number;
		title: string;
	}>;
	custom_expected?: string;
	custom_preconds?: string;
	custom_steps_separated?: Array<{
		content: string;
		expected: string;
	}>;
	[key: string]: any; // For additional custom fields
}

export interface Variable {
	id: number;
	name: string;
}
