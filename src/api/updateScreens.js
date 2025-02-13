import { fetchTabs, addCustomFieldToTab, getCustomFieldsOfTab } from "./api";

export async function addCustomFieldToScreen(screenId, customFieldId) {
  try {
    const tabsData = await fetchTabs(screenId);
    for (const tab of tabsData) {
      const tabId = tab.id;
      const customFields = await getCustomFieldsOfTab(screenId, tabId);
      const customField = (customFields || []).find(
        (field) => field.id === customFieldId
      );
      if (!customField) {
        await addCustomFieldToTab(screenId, tabId, customFieldId);
      } else {
        console.log("customField already exists");
      }
    }
  } catch (error) {
    console.error("Error updating screens:", error);
    return { success: false, error: error.toString() };
  }
}

export async function addCustomFieldToAllScreens(customFieldId) {
  try {
    const screens = await fetchScreens();
    for (const screen of screens) {
      const screenId = screen.id;
      const tabsData = await fetchTabs(screenId);
      for (const tab of tabsData) {
        const tabId = tab.id;
        await addCustomFieldToTab(screenId, tabId, customFieldId);
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating screens:", error);
    return { success: false, error: error.toString() };
  }
}
