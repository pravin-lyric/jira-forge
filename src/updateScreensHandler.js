import api, { route } from '@forge/api';
import { addCustomFieldToAllScreens } from './api/updateScreens';

/**
 * Fetches all custom fields from Jira using the @forge/api package.
 */
async function fetchCustomFields() {
  const fieldsResponse = await api.asApp().requestJira(route`/rest/api/3/field`);
  if (!fieldsResponse.ok) {
    throw new Error(`Failed to fetch custom fields: ${fieldsResponse.status}`);
  }
  return await fieldsResponse.json();
}

/**
 * Handler function that:
 * 1. Fetches the list of all custom fields from Jira.
 * 2. Finds the custom field with the name "pravin-custom-field-ui-kit-2-hello-world".
 * 3. Uses its ID to add it to all screens.
 */
export async function handler(req, context) {
  const customFieldName = 'pravin';
  let customFieldId;

  try {
    const fields = await fetchCustomFields();

    // Find the custom field matching the name
    const customField = fields.find(field => field.name === customFieldName);

    if (!customField) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: `Custom field with name "${customFieldName}" not found.`
        })
      };
    }

    customFieldId = customField.id;
    const result = await addCustomFieldToAllScreens(customFieldId);

    return {
      statusCode: 200,
      body: result
    };
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
} 