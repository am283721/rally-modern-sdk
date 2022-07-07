# rally-modern-sdk
An exploration of what a more modern SDK for Broadcom's Rally ALM could look like.

Rally's public SDK uses ExtJS 4, which is a crime against developers. Internally they're using a new React-based kit, which may never see the light of day for us.

This is an attempt to make something in Svelte that looks comparable to their React kit.

## Repo Structure

 `src/lib` houses all of the SDK code

 `src/routes` houses the testing app code

 ## SDK Structure

 A default `SDK` object is exported from the library. This object has 3 properties: `UI`, `App` and `Data`:

### UI

    Contains all of the UI components:
        - App: Include this in your main app to allow Toast and Loading Mask functionality
        - Input
        - Combobox


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

- AllowBlank for Combobox
- Grid pagination