import api, { route } from "@forge/api";

// Step 1: Get all projects in Jira
const getAllProjects = async () => {
  const response = await api.asApp().requestJira(route`/rest/api/3/project/search`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error fetching projects:", error);
    throw new Error(error);
  }

  const data = await response.json();
  return data.values.map(project => project.id);
};

// Step 2: Get the issue type screen scheme for a project
const getIssueTypeScreenScheme = async (projectId) => {
  const response = await api.asApp().requestJira(
    route`/rest/api/3/issuetypescreenscheme/project?projectId=${projectId}`,
    { method: "GET" }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`Error fetching issue type screen scheme for project ${projectId}:`, error);
    throw new Error(error);
  }

  return await response.json();
};

// Step 3: Add the custom field to a screen
const addFieldToScreen = async (screenId, customFieldId) => {
  const response = await api.asApp().requestJira(
    route`/rest/api/3/screens/${screenId}/tabs/1/fields`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldId: customFieldId }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`Error adding field to screen ${screenId}:`, error);
    throw new Error(error);
  }

  console.log(`Successfully added custom field to screen ${screenId}`);
};

// Step 4: Automate Adding the Field to All Projects
export const addCustomFieldToAllProjects = async (customFieldId) => {
  try {
    const projectIds = await getAllProjects();
    console.log("Project IDs:", projectIds);

    for (const projectId of projectIds) {
      console.log(`Processing project: ${projectId}`);
      const issueTypeScheme = await getIssueTypeScreenScheme(projectId);

      console.log(`Issue Type Scheme for project ${projectId}:`, issueTypeScheme);
      
      // Extract screen IDs
      const screenIds = issueTypeScheme.values.map(scheme => scheme.screenSchemeId);
      console.log(`Screen IDs for project ${projectId}:`, screenIds);

      for (const screenId of screenIds) {
        await addFieldToScreen(screenId, customFieldId);
      }
    }

    console.log("Successfully added custom field to all project screens.");
  } catch (error) {
    console.error("Error adding custom field to all projects:", error);
  }
};