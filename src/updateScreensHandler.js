import { fetchCustomFields, fetchScreens } from "./api/api";
import { addCustomFieldToScreen } from "./api/updateScreens";

import config from "../config";

/**
 * Handler function that:
 * 1. Fetches the list of all custom fields from Jira.
 * 2. Finds the custom field with the name "Finding ID" and "Account ID".
 * 3. Uses its ID to add it to all screens.
 */
export async function handler(req, context) {
  try {
    const fields = await fetchCustomFields();
    const customFieldList = Object.keys(config.customFieldList);
    const customFields = [];

    for (const field of fields) {
      const customField = customFieldList.find((customField) =>
        field.key.includes(customField)
      );
      if (customField) {
        field.internalKey = customField;
        customFields.push(field);
      }
    }

    if (!customFields.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: `Custom field with key '${customFieldList.join(
            ", "
          )}' not found.`,
        }),
      };
    }

    const screens = await fetchScreens();
    customFields.forEach(async (field) => {
      const screensToUpdate =
        config.customFieldToScreenMapping[field.internalKey];
      for (const screen of screensToUpdate) {
        const screenId = screens.find((s) => s.name === screen);
        const result = await addCustomFieldToScreen(screenId.id, field.id);
      }

      // const result = await addCustomFieldToAllScreens(customFieldId);
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
