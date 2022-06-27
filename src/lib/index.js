import { default as Input } from './components/Input/Input.svelte';
import './styles/normalize.css';
import './styles/variables.css';
import { default as Combobox } from './components/Combobox/Combobox.svelte';
import { createFilter, createSorter, getAllowedValues, getFlowStates, getScheduleStates, initRallyApp, promisify, query, queryLookback, app, showError, parseError } from './utils/rally';

const SDK = {
    UI: { Input, Combobox },
    Rally: { initRallyApp, app, showError, parseError },
    Data: { createFilter, createSorter, getAllowedValues, getFlowStates, getScheduleStates, promisify, query, queryLookback }
}

export default SDK;