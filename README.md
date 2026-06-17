Create a custom LWC for an enhanced version of the standard Salesforce Path component for displaying
picklist values in two paths and provide the ability for data source and custom visibility configuration.
Main features:
• Show up to two paths (each path is configured separately). The path is only shown if the object
API name and the field API name is specified.
• Define which object to take the data from - it can be any object.
• Define which record to take the data from (by specifying record id or specifying the lookup field
API name) - if the record id and lookup field API name is not specified, then the component takes
the record of the one where the component is placed (for example, from record page). If lookup
field api name value and a field api name from a parent object is specified, then component
displays a picklist values from that parent object record.
• Define which record type to take the data from. Different record types may have different picklist
values available.
• Define which field to take the data from - should be a picklist.
• Hide the ‘update’ button.
Try not to use any apex and handle everything from LWC.
