import { default as Input } from './components/Input/Input.svelte';
import './styles/normalize.css';
import './styles/variables.css';
import { default as Combobox } from './components/Combobox/Combobox.svelte';
import { default as App } from './App.svelte';
import { createFilter, createSorter, getAllowedValues, getFlowStates, getScheduleStates, initRallyApp, promisify, query, queryLookback, app, showError, parseError, showMessage, showSuccess, showWarning, setLoading } from './utils/rally';

const SDK = {
    UI: { App, Input, Combobox },
    Rally: { initRallyApp, app, showMessage, showSuccess, showWarning, showError, parseError, setLoading },
    Data: { createFilter, createSorter, getAllowedValues, getFlowStates, getScheduleStates, promisify, query, queryLookback }
}

export default SDK;