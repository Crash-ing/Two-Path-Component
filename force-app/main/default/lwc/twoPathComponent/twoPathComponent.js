import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

export default class TwoPathComponent extends LightningElement {
    @api recordId; // Current record ID from the page context
    @api objectApiName; // Current object API name from the page context

    // Path 1 properties
    @api path1ObjectApiName;
    @api path1FieldApiName;
    @api path1RecordId
    @api path1LookupFieldApiName;
    @api path1RecordTypeId;

    // Path 2 properties
    @api path2ObjectApiName;
    @api path2FieldApiName;
    @api path2RecordId;
    @api path2LookupFieldApiName;
    @api path2RecordTypeId;

    // Data for HTML rendering
    currentPath1Value = undefined;
    @track path1Steps = [];
    @track activePath1RecordTypeId;
    @track path1ParentRecordId;

    currentPath2Value = undefined;
    @track path2Steps = [];
    @track activePath2RecordTypeId;
    @track path2ParentRecordId;

    // Computed properties to determine visibility of paths
    get isPath1Visible() {
        return this.path1ObjectApiName && this.path1FieldApiName;
    }

    get isPath2Visible() {
        return this.path2ObjectApiName && this.path2FieldApiName;
    }

    get hasAnyPath() {
        return this.isPath1Visible || this.isPath2Visible;
    }

    // ==================
    // Data for path 1
    // ==================

    // Computed properties to get the full field names for the paths
    get path1FieldName() {
        // Return the full API name of the field for path 1, e.g., 'Account.StageName'
        if (this.path1ObjectApiName && this.path1FieldApiName) {
            return `${this.path1ObjectApiName}.${this.path1FieldApiName}`;
        }
        return undefined;   // If not specified, return undefined
    }

    get path1FieldArray() {
        return this.path1FieldName ? [this.path1FieldName] : undefined; // Return an array with the field name if specified, otherwise undefined
    }

    get path1LookupFieldName() {
        if (this.path1LookupFieldApiName && this.objectApiName) {
            return `${this.objectApiName}.${this.path1LookupFieldApiName}`;
        }
        return undefined;
    }

    get path1LookupFieldArray() {
        return this.path1LookupFieldName ? [this.path1LookupFieldName] : undefined;
    }

    // Wire to get object info for path 1
    @wire(getObjectInfo, { objectApiName: '$path1ObjectApiName'})
    wiredPath1ObjectInfo({ error, data }) {
        if (data) {
            this.activePath1RecordTypeId = this.path1RecordTypeId ? this.path1RecordTypeId : data.defaultRecordTypeId;
        } else if (error) {
            console.log('Error fetching path 1 object info: ', error);
        }
    }

    // Wire to get picklist values for path 1 based on the active Record Type ID and the specified field API name and populate the path1Steps array for rendering
    @wire(getPicklistValues, { recordTypeId: '$activePath1RecordTypeId', fieldApiName: '$path1FieldName' })
    wiredPath1Picklist({ error, data }) {
        if (data) {
            this.path1Steps = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            console.error('Error fetching picklist values for path 1:', error);
        }
    }

    // Computed property to determine the target record ID for path 1, which is used to fetch the current value of the picklist field. 
    // If a specific record ID is provided for path 1, use that; otherwise, use the record ID from the page context.
    get targetPath1RecordId() {
        if (this.path1RecordId) {
            return this.path1RecordId; // Use the specified record ID for path 1 if provided
        }
        if (this.path1ParentRecordId) {
            return this.path1ParentRecordId; // Use the parent record ID if a lookup field is specified
        }
        return this.recordId; // Fallback to the current page record ID
    }

    // Wire to get the current value of the picklist field for path 1 from the target record and store it in currentPath1Value for rendering.
    @wire(getRecord, { recordId: '$targetPath1RecordId', fields: '$path1FieldArray' })
    wiredPath1Record({ error, data }) {
        if (data) {
            this.currentPath1Value = data.fields[this.path1FieldApiName].value;
        } else if (error) {
            console.error('Error fetching path 1 record: ', error);
        }

    }

    // Retrieve the parent record ID for path 1 if a lookup field is specified.
    @wire(getRecord, { recordId: '$recordId', fields: '$path1LookupFieldArray' })
    wiredPath1ParentRecord({ error, data }) {
        if (data) {
            this.path1ParentRecordId = data.fields[this.path1LookupFieldApiName].value;
        } else if (error) {
            console.error('Error fetching path 1 parent record: ', error);
        }
    }

    // ==================
    // Data for path 2
    // ==================

    // Computed properties to get the full field names for the paths
    get path2FieldName() {
        // Return the full API name of the field for path 2, e.g., 'Account.StageName'
        if (this.path2ObjectApiName && this.path2FieldApiName) {
            return `${this.path2ObjectApiName}.${this.path2FieldApiName}`;
        }
        return undefined;   // If not specified, return undefined
    }

    get path2FieldArray() {
        return this.path2FieldName ? [this.path2FieldName] : undefined; // Return an array with the field name if specified, otherwise undefined
    }

    get path2LookupFieldName() {
        if (this.path2LookupFieldApiName && this.objectApiName) {
            return `${this.objectApiName}.${this.path2LookupFieldApiName}`;
        }
        return undefined;
    }

    get path2LookupFieldArray() {
        return this.path2LookupFieldName ? [this.path2LookupFieldName] : undefined;
    }

    // Wire to get object info for path 2
    @wire(getObjectInfo, { objectApiName: '$path2ObjectApiName'})
    wiredPath2ObjectInfo({ error, data }) {
        if (data) {
            this.activePath2RecordTypeId = this.path2RecordTypeId ? this.path2RecordTypeId : data.defaultRecordTypeId;
        } else if (error) {
            console.log('Error fetching path 2 object info: ', error);
        }
    }

    // Wire to get picklist values for path 2 based on the active Record Type ID and the specified field API name and populate the path2Steps array for rendering
    @wire(getPicklistValues, { recordTypeId: '$activePath2RecordTypeId', fieldApiName: '$path2FieldName' })
    wiredPath2Picklist({ error, data }) {
        if (data) {
            this.path2Steps = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            console.error('Error fetching picklist values for path 2:', error);
        }
    }

    // Computed property to determine the target record ID for path 2, which is used to fetch the current value of the picklist field. 
    // If a specific record ID is provided for path 2, use that; otherwise, use the record ID from the page context.
    get targetPath2RecordId() {
        if (this.path2RecordId) {
            return this.path2RecordId; // Use the specified record ID for path 2 if provided
        }
        if (this.path2ParentRecordId) {
            return this.path2ParentRecordId; // Use the parent record ID if a lookup field is specified
        }
        return this.recordId; // Fallback to the current page record ID
    }

    // Wire to get the current value of the picklist field for path 2 from the target record and store it in currentPath2Value for rendering.
    @wire(getRecord, { recordId: '$targetPath2RecordId', fields: '$path2FieldArray' })
    wiredPath2Record({ error, data }) {
        if (data) {
            this.currentPath2Value = data.fields[this.path2FieldApiName].value;
        } else if (error) {
            console.error('Error fetching path 2 record: ', error);
        }
    }

    // Retrieve the parent record ID for path 2 if a lookup field is specified.
    @wire(getRecord, { recordId: '$recordId', fields: '$path2LookupFieldArray' })
    wiredPath2ParentRecord({ error, data }) {
        if (data) {
            this.path2ParentRecordId = data.fields[this.path2LookupFieldApiName].value;
        } else if (error) {
            console.error('Error fetching path 2 parent record: ', error);
        }
    }
}