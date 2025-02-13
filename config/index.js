// custom field name and key should be same as in manifest.yml
const config = {
  customFieldList: {
    "custom-field-account-id": "Account ID",
    "custom-field-finding-id": "Finding ID",
  },
  customFieldToScreenMapping: {
    "custom-field-account-id": [
      "Default Screen",
      "Resolve Issue Screen",
      "SUP: Jira Service Management: Incident View/Edit Screen",
    ],
    "custom-field-finding-id": [
      "Default Screen",
      "Resolve Issue Screen",
      "Workflow Screen",
      "SAM: Kanban Default Issue Screen",
      "SUP: Jira Service Management: Incident View/Edit Screen",
    ],
  },
};
export default config;
