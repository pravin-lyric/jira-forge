import api, { route } from "@forge/api";

export async function fetchScreens() {
  const screensResponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/screens?maxResults=100`);
  if (!screensResponse.ok) {
    const errorMsg = `Failed to fetch screens. Status: ${screensResponse.status}`;
    throw new Error(errorMsg);
  }
  const screensData = await screensResponse.json();
  return screensData.values;
}

export async function fetchTabs(screenId) {
  const tabsResponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/screens/${screenId}/tabs`);
  return tabsResponse.json();
}

export async function getCustomFieldsOfTab(screenId, tabId) {
  const getFieldResponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/screens/${screenId}/tabs/${tabId}/fields`);
  if (!getFieldResponse.ok) {
    throw new Error(
      `Failed to get custom fields of screen ${screenId} tab ${tabId}. Status: ${getFieldResponse.status}`
    );
  }
  const getFieldData = await getFieldResponse.json();
  return getFieldData;
}

export async function addCustomFieldToTab(screenId, tabId, customFieldId) {
  const addFieldResponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/screens/${screenId}/tabs/${tabId}/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fieldId: customFieldId }),
    });
  if (!addFieldResponse.ok) {
    throw new Error(
      `Failed to add custom field ${customFieldId} to screen ${screenId} tab ${tabId}. Status: ${addFieldResponse.status}`
    );
  }
  const addFieldData = await addFieldResponse.json();
  return addFieldData;
}

export async function fetchCustomFields() {
  const fieldsResponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/field`);
  if (!fieldsResponse.ok) {
    throw new Error(`Failed to fetch custom fields: ${fieldsResponse.status}`);
  }
  const fieldsData = await fieldsResponse.json();
  return fieldsData;
}
