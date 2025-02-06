import api, { route } from "@forge/api";
import { addCustomFieldToAllScreens } from "./api/updateScreens";

import config from "../config";

/**
 * Fetches all custom fields from Jira using the @forge/api package.
 */
async function fetchCustomFields() {
  const fieldsResponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/field`);
  if (!fieldsResponse.ok) {
    throw new Error(`Failed to fetch custom fields: ${fieldsResponse.status}`);
  }
  return await fieldsResponse.json();
}

/**
 * Handler function that:
 * 1. Fetches the list of all custom fields from Jira.
 * 2. Finds the custom field with the name "Finding ID" and "Account ID".
 * 3. Uses its ID to add it to all screens.
 */
export async function handler(req, context) {
  let customFieldId;

  try {
    const fields = await fetchCustomFields();

    console.log(fields);

    const customFieldList = Object.keys(config.customFieldList);

    const customFields = fields.filter((field) =>
      customFieldList.find((customField) => field.key.includes(customField))
    );

    console.log(customFields);

    if (!customFields.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: `Custom field with name "${customFieldList.join(", ")}" not found.`,
        }),
      };
    }

    customFields.forEach(async (field) => {
      customFieldId = field.id;
      const result = await addCustomFieldToAllScreens(customFieldId);
    });
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message,
      }),
    };
  }
}
