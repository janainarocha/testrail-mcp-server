import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export interface Attachment {
    id: string | number;
    name: string;
    filename?: string;
    size: number;
    created_on: number;
    project_id: number;
    case_id?: number;
    result_id?: number;
    user_id: number;
    entity_type?: string;
    entity_id?: string;
    data_id?: string;
    filetype?: string;
    legacy_id?: number;
    is_image?: boolean;
    icon?: string;
    client_id?: number;
}
export interface AttachmentsResponse {
    offset: number;
    limit: number;
    size: number;
    _links?: {
        next: string | null;
        prev: string | null;
    };
    _link?: {
        next: string | null;
        prev: string | null;
    };
    attachments: Attachment[];
}
export interface AttachmentUploadResponse {
    attachment_id: number | string;
}
export declare class TestRailAttachments extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Adds an attachment to a test case
     * Requires TestRail 6.5.2 or later
     * Maximum upload size: 256MB
     */
    addAttachmentToCase(caseId: number, filePath: string, filename?: string): Promise<AttachmentUploadResponse>;
    /**
     * Adds an attachment to a test plan
     * Requires TestRail 6.3 or later
     * Maximum upload size: 256MB
     */
    addAttachmentToPlan(planId: number, filePath: string, filename?: string): Promise<AttachmentUploadResponse>;
    /**
     * Adds an attachment to a test plan entry
     * Requires TestRail 6.3 or later
     * Maximum upload size: 256MB
     */
    addAttachmentToPlanEntry(planId: number, entryId: number, filePath: string, filename?: string): Promise<AttachmentUploadResponse>;
    /**
     * Adds an attachment to a test result
     * Requires TestRail 5.7 or later
     * Maximum upload size: 256MB
     * Note: The ability to edit test results must be enabled under 'Site Settings'
     */
    addAttachmentToResult(resultId: number, filePath: string, filename?: string): Promise<AttachmentUploadResponse>;
    /**
     * Adds an attachment to a test run
     * Requires TestRail 6.3 or later
     * Maximum upload size: 256MB
     */
    addAttachmentToRun(runId: number, filePath: string, filename?: string): Promise<AttachmentUploadResponse>;
    /**
     * Returns a list of attachments for a test case
     * Requires TestRail 5.7 or later
     */
    getAttachmentsForCase(caseId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<AttachmentsResponse>;
    /**
     * Returns a list of attachments for a test plan
     * Requires TestRail 6.3 or later
     */
    getAttachmentsForPlan(planId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<AttachmentsResponse>;
    /**
     * Returns a list of attachments for a test plan entry
     * Requires TestRail 6.3 or later
     */
    getAttachmentsForPlanEntry(planId: number, entryId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<AttachmentsResponse>;
    /**
     * Returns a list of attachments for a test run
     * Requires TestRail 6.3 or later
     */
    getAttachmentsForRun(runId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<AttachmentsResponse>;
    /**
     * Returns a list of attachments for a test result
     * Requires TestRail 5.7 or later
     */
    getAttachmentsForResult(resultId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<AttachmentsResponse>;
    /**
     * Returns a list of attachments for a test
     * Requires TestRail 5.7 or later
     */
    getAttachmentsForTest(testId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<AttachmentsResponse>;
    /**
     * Downloads an attachment by ID
     * Returns the attachment content as ArrayBuffer
     */
    getAttachment(attachmentId: string | number): Promise<ArrayBuffer>;
    /**
     * Deletes an attachment by ID
     * Requires appropriate permissions
     */
    deleteAttachment(attachmentId: string | number): Promise<void>;
    /**
     * Private method to handle file uploads with multipart/form-data
     */
    private uploadAttachment;
}
