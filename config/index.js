// custom field name and key should be same as in manifest.yml
const config = {
  customFieldList: {
    "finding-id": "Finding ID",
    "account-id": "Account ID",
  },
  customFieldToScreenMapping: {
    "finding-id": ["PRAV: Kanban Default Issue Screen", "PRAV: Kanban Bug Screen"],
    "account-id": ["Resolve Issue Screen"],
  },
};

export default config;
