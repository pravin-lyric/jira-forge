import api, { route } from '@forge/api';

/**
 * Adds the custom field to all screens and their tabs in Jira.
 *
 * @param {string} customFieldId - The identifier of your custom field.  
 * For Forge custom fields, this is often the value used in your manifest (e.g., "finding-id", "account-id").
 *
 * @returns {Promise<Object>} An object indicating success or error details.
 */


export async function addCustomFieldToAllScreens(customFieldId) {
  try {
    // Fetch screens (adjust maxResults as necessary, and note that pagination may need to be handled in production)
    const screensResponse = await api.asApp().requestJira(route`/rest/api/3/screens?maxResults=100`);
    if (!screensResponse.ok) {
      const errorMsg = `Failed to fetch screens. Status: ${screensResponse.status}`;
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }
    const screensData = await screensResponse.json(); // expect screensData.values to contain screens

    // Iterate over each screen
    for (const screen of screensData.values) {
      const screenId = screen.id;
      // Retrieve the tabs (each screen may have multiple tabs)
      const tabsResponse = await api.asApp().requestJira(route`/rest/api/3/screens/${screenId}/tabs`);
      if (!tabsResponse.ok) {
        console.error(`Failed to fetch tabs for screen ${screenId}`);
        continue;
      }
      const tabsData = await tabsResponse.json();
      console.log(`Tabs data for screen ${screenId}:`, tabsData);

      

      // Iterate over tabs and add the custom field
      for (const tab of tabsData) {
        const tabId = tab.id;
        const addFieldResponse = await api.asApp().requestJira(
          route`/rest/api/3/screens/${screenId}/tabs/${tabId}/fields`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fieldId: customFieldId })
          }
        );
        if (!addFieldResponse.ok) {
          console.error(`Failed to add custom field ${customFieldId} to screen ${screenId} tab ${tabId}. Status: ${addFieldResponse.status}`);
          continue;
        }
        console.log(`Successfully added custom field ${customFieldId} to screen ${screenId} tab ${tabId}`);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating screens:', error);
    return { success: false, error: error.toString() };
  }
} 