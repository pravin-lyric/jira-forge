import { fetchTabs, addCustomFieldToTab } from "./api";

export async function addCustomFieldToScreen(screenId, customFieldId) {
  const tabsData = await fetchTabs(screenId);

  for (const tab of tabsData) {
    const tabId = tab.id;
    await addCustomFieldToTab(screenId, tabId, customFieldId);
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
