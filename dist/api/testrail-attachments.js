import { TestRailBase } from "./testrail-base.js";
export class TestRailAttachments extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Adds an attachment to a test case
     * Requires TestRail 6.5.2 or later
     * Maximum upload size: 256MB
     */
    async addAttachmentToCase(caseId, filePath, filename) {
        const endpoint = `add_attachment_to_case/${caseId}`;
        return this.uploadAttachment(endpoint, filePath, filename);
    }
    /**
     * Adds an attachment to a test plan
     * Requires TestRail 6.3 or later
     * Maximum upload size: 256MB
     */
    async addAttachmentToPlan(planId, filePath, filename) {
        const endpoint = `add_attachment_to_plan/${planId}`;
        return this.uploadAttachment(endpoint, filePath, filename);
    }
    /**
     * Adds an attachment to a test plan entry
     * Requires TestRail 6.3 or later
     * Maximum upload size: 256MB
     */
    async addAttachmentToPlanEntry(planId, entryId, filePath, filename) {
        const endpoint = `add_attachment_to_plan_entry/${planId}/${entryId}`;
        return this.uploadAttachment(endpoint, filePath, filename);
    }
    /**
     * Adds an attachment to a test result
     * Requires TestRail 5.7 or later
     * Maximum upload size: 256MB
     * Note: The ability to edit test results must be enabled under 'Site Settings'
     */
    async addAttachmentToResult(resultId, filePath, filename) {
        const endpoint = `add_attachment_to_result/${resultId}`;
        return this.uploadAttachment(endpoint, filePath, filename);
    }
    /**
     * Adds an attachment to a test run
     * Requires TestRail 6.3 or later
     * Maximum upload size: 256MB
     */
    async addAttachmentToRun(runId, filePath, filename) {
        const endpoint = `add_attachment_to_run/${runId}`;
        return this.uploadAttachment(endpoint, filePath, filename);
    }
    /**
     * Returns a list of attachments for a test case
     * Requires TestRail 5.7 or later
     */
    async getAttachmentsForCase(caseId, options) {
        let endpoint = `get_attachments_for_case/${caseId}`;
        const params = new URLSearchParams();
        if (options?.limit)
            params.append('limit', options.limit.toString());
        if (options?.offset)
            params.append('offset', options.offset.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        return this.makeRequest(endpoint);
    }
    /**
     * Returns a list of attachments for a test plan
     * Requires TestRail 6.3 or later
     */
    async getAttachmentsForPlan(planId, options) {
        let endpoint = `get_attachments_for_plan/${planId}`;
        const params = new URLSearchParams();
        if (options?.limit)
            params.append('limit', options.limit.toString());
        if (options?.offset)
            params.append('offset', options.offset.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        return this.makeRequest(endpoint);
    }
    /**
     * Returns a list of attachments for a test plan entry
     * Requires TestRail 6.3 or later
     */
    async getAttachmentsForPlanEntry(planId, entryId, options) {
        let endpoint = `get_attachments_for_plan_entry/${planId}/${entryId}`;
        const params = new URLSearchParams();
        if (options?.limit)
            params.append('limit', options.limit.toString());
        if (options?.offset)
            params.append('offset', options.offset.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        return this.makeRequest(endpoint);
    }
    /**
     * Returns a list of attachments for a test run
     * Requires TestRail 6.3 or later
     */
    async getAttachmentsForRun(runId, options) {
        let endpoint = `get_attachments_for_run/${runId}`;
        const params = new URLSearchParams();
        if (options?.limit)
            params.append('limit', options.limit.toString());
        if (options?.offset)
            params.append('offset', options.offset.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        return this.makeRequest(endpoint);
    }
    /**
     * Returns a list of attachments for a test result
     * Requires TestRail 5.7 or later
     */
    async getAttachmentsForResult(resultId, options) {
        let endpoint = `get_attachments_for_result/${resultId}`;
        const params = new URLSearchParams();
        if (options?.limit)
            params.append('limit', options.limit.toString());
        if (options?.offset)
            params.append('offset', options.offset.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        return this.makeRequest(endpoint);
    }
    /**
     * Returns a list of attachments for a test
     * Requires TestRail 5.7 or later
     */
    async getAttachmentsForTest(testId, options) {
        let endpoint = `get_attachments_for_test/${testId}`;
        const params = new URLSearchParams();
        if (options?.limit)
            params.append('limit', options.limit.toString());
        if (options?.offset)
            params.append('offset', options.offset.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        return this.makeRequest(endpoint);
    }
    /**
     * Downloads an attachment by ID
     * Returns the attachment content as ArrayBuffer
     */
    async getAttachment(attachmentId) {
        const endpoint = `get_attachment/${attachmentId}`;
        const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${this.auth}`,
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TestRail API error (${response.status}): ${errorText}`);
        }
        return response.arrayBuffer();
    }
    /**
     * Deletes an attachment by ID
     * Requires appropriate permissions
     */
    async deleteAttachment(attachmentId) {
        const endpoint = `delete_attachment/${attachmentId}`;
        return this.makeRequest(endpoint, { method: 'POST' });
    }
    /**
     * Private method to handle file uploads with multipart/form-data
     */
    async uploadAttachment(endpoint, filePath, filename) {
        const fs = await import('fs');
        const path = await import('path');
        // Read the file
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = filename || path.basename(filePath);
        // Create FormData
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(fileBuffer)]);
        formData.append('attachment', blob, fileName);
        // Use fetch for multipart uploads
        const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${this.auth}`,
                // Don't set Content-Type header - let the browser set it with boundary
            },
            body: formData
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TestRail API error (${response.status}): ${errorText}`);
        }
        return response.json();
    }
}
//# sourceMappingURL=testrail-attachments.js.map