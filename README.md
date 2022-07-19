# rally-modern-sdk
An exploration of what a more modern SDK for Broadcom's Rally ALM could look like.

Rally's public SDK uses ExtJS 4, which is a crime against developers. Internally they're using a new React-based kit, which may never see the light of day for us.

This is an attempt to make something in Svelte that looks comparable to their React kit.

**This is currently BETA software. Many breaking changes will occur**

## Repo Structure

 `src/lib` houses all of the SDK code

 `src/routes` houses the testing app code

 ## SDK Structure

 A default `SDK` object is exported from the library. This object has 3 properties: `UI`, `App` and `Data`:

### UI

    Contains all of the UI components:
        - App: Include this in your main app to allow Notification and Loading Mask functionality
        - Input
        - Combobox
        - Grid


### App

    App functions
        - initRallyApp
        - showMessage
        - showSuccess
        - showWarning
        - showError
        - parseError
        - setLoading
        - getContext
        - getDataContext


### Data

    Functions for working with Rally data
        - query
        - queryLookback
        - promisify
        - getScheuleStates
        - getFlowStates
        - getAllowedValues
        - createFilter
        - createSorter







## TODO

- Grid pagination
- Ability to pass data promise to components and show appropriate loading UI
    - Need to manage pageSize, paging, fetching more data
- Combobox and Input labels
- Package components for use in non-svelte projects
- Consider refactoring how modules are imported and used in projects
- No results message for combobox
- Factory for Combobox display values (e.g. Name should inlude formatted ID for artifacts)