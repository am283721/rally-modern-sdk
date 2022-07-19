import { toast } from '$lib/components/Toast/store';
import { loadingMessage } from '$lib/components/LoadingMask/store';
import type { RallyLookbackStoreConfig, RallyModelName, RallyWSAPIStoreConfig, RallyError, Deferred, RallyUrlRequestParams } from './rallySDKTypes';

let app: any;

const storeDefaults: RallyWSAPIStoreConfig = {
	autoLoad: false,
	pageSize: 400,
	limit: 400,
	fetch: ['ObjectID'],
	context: undefined
};

export const initRallyApp = async (appName = 'custom-app') => {
	return new Promise((resolve) => {
		Ext.define(appName, {
			extend: 'Rally.app.App',
			hidden: true,
			// launch: function () {},
			listeners: {
				afterrender: function () {
					app = Rally.getApp();
					storeDefaults.context = app.getContext().getDataContext();
					resolve(app);
				}
			}
		});

		Rally.launchApp(appName, {
			name: appName,
			parentRepos: '',
			version: '0.1.0'
		});
	});
};

export const query = async (modelName: RallyModelName, storeConfig: RallyWSAPIStoreConfig = {}) => {
	if (!app) throw new Error('Rally SDK is not initialized');

	const store = Ext.create('Rally.data.wsapi.Store', {
		...storeDefaults,
		model: modelName,
		...storeConfig
	});

	let results = (await promisify(store.load())) as any[];
	results = results.map((r) => ({ ...r, ...r.getData(true) }));

	// Note that $store will be lost any time the user manipulates the array of results (e.g.: slice)
	Object.defineProperty(results, '$store', { enumerable: false, writable: true });
	results.$store = store;

	return results;
};

export const queryLookback = async (storeConfig: RallyLookbackStoreConfig = {}) => {
	if (!app) throw new Error('Rally SDK is not initialized');

	const store = Ext.create('Rally.data.lookback.SnapshotStore', {
		...storeDefaults,
		...storeConfig
	});

	const results = (await promisify(store.load())) as any[];

	return results.map((r) => ({ ...r, ...r.getData(true) }));
};

export const getFlowStates = async (projectRef?: string) => {
	if (!app) throw new Error('Rally SDK is not initialized');

	const ref = projectRef || app.getContext().getProjectRef();

	return urlRequest('FlowState', {
		query: `(project = "${ref}")`,
		fetch: 'Name,ObjectID,AgeThreshold,ExitPolicy,WIPLimit,OrderIndex,ScheduleStateMapping',
		order: 'OrderIndex'
	}) as Promise<
		{ Name: string; ObjectID: number; AgeThreshold: number; ExitPolicy: string; OrderIndex: number; ScheduleStateMapping: string; WIPLimit: number }[]
	>;
};

export const getAllowedValues = async (artifactType: string, fieldName: string) => {
	return query('TypeDefinition', { filters: [createFilter('TypePath', '=', artifactType)], fetch: ['Attributes'] }).then(async (results) => {
		if (!results.length) {
			throw new Error(`Unable to load allowed list for field ${fieldName}s`);
		}

		const attributes = (await urlRequest(results[0].Attributes._ref, { fetch: 'ElementName,AllowedValues' })) as {
			ElementName: string;
			AllowedValues: { _ref: string };
		}[];

		const attribute = attributes.find((a) => a.ElementName === fieldName);

		if (!attribute) {
			throw new Error(`Unable to load allowed list for field ${fieldName}s`);
		}

		const allowedValues = (await urlRequest(attribute.AllowedValues._ref, { fetch: 'StringValue' })) as { StringValue: string }[];

		return allowedValues.map((v) => v.StringValue);
	});
};

export const getScheduleStates = async () => {
	return getAllowedValues('HierarchicalRequirement', 'ScheduleState');
};

export const createFilter = (property: string, operator = '=', value: string | number | (string | number)[]) => {
	return new Rally.data.wsapi.Filter({ property, operator, value });
};

export const createSorter = (property: string, direction = 'ASC') => {
	return Ext.util.Sorter({ property, direction });
};

export const urlRequest = (endpoint: string, params: RallyUrlRequestParams = {}, method = 'GET'): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		Ext.Ajax.request({
			url: buildUrl(endpoint),
			method,
			params: {
				key: Rally.env.IoProvider.getSecurityToken(),
				pagesize: params.pagesize || 400,
				...params
			},
			success: function (response: XMLHttpRequest) {
				const data = JSON.parse(response.responseText).QueryResult;

				if (data.Errors && data.Errors.length > 0) {
					reject(data.Errors[0]);
				}

				data.Results.$TotalResultCount = data.TotalResultCount;

				resolve(data.Results);
			},
			failure: function (response: XMLHttpRequest) {
				reject(response.statusText || 'An error occurred while fetching data');
			}
		});
	});
};

const buildUrl = (input: string) => {
	if (input.indexOf('http://') === 0 || input.indexOf('https://') === 0) {
		return input;
	}

	if (input.indexOf('/') !== 0) {
		input = `/${input}`;
	}

	return `${Rally.environment.getServer().getWsapiUrl()}${input}`;
};

enum artifactColorPalette {
	'#105cab' = 'Dark Blue',
	'#21a2e0' = 'Blue',
	'#107c1e' = 'Green',
	'#4a1d7e' = 'Purple',
	'#df1a7b' = 'Pink',
	'#ee6c19' = 'Burnt Orange',
	'#f9a814' = 'Orange',
	'#fce205' = 'Yellow',
	'#848689' = 'Grey'
}

const createDetailLink = (record: Record<string, any>) => {
	const options = {
		record,
		text: record.FormattedID || '',
		showHover: true,
		projectOid: undefined as unknown,
		onclick: undefined as unknown,
		showTooltip: true
	};

	const ref = Rally.util.Ref.getRelativeUri(record);
	const type = Rally.util.Ref.getTypeFromRef(ref);

	if (type === 'testset') {
		if (ref) {
			options.onclick = "Rally.nav.Manager.edit('" + ref + "'); return false;";
		}
	} else if (type === 'milestone') {
		const projectToNavigateTo = record.TargetProject || record.context.getProject();
		options.projectOid = Rally.util.Ref.getOidFromRef(projectToNavigateTo);
	}

	return Rally.nav.DetailLink.getLink(options);
};

export const getFieldDisplayValue = (record: Record<string, any>, field: string, delimiter = ', ') => {
	if (!record || !field || !Object.prototype.hasOwnProperty.call(record, field) || record[field] === undefined || record[field] === null) {
		return '';
	}

	let val = record[field];

	if (field === 'FormattedID') {
		if (record.Recycled) return val;

		return createDetailLink(record);
	}

	if (typeof val === 'boolean') {
		return val.toString();
	}

	if (Ext.isDate(val)) {
		return Rally.util.DateTime.formatWithDefaultDateTime(val);
	}

	if (field === 'DisplayColor') {
		return artifactColorPalette[val as keyof typeof artifactColorPalette] || val;
	}

	if (field === 'Parent') {
		if (val && val.FormattedID && val.Name) {
			return val.FormattedID + ': ' + val.Name;
		}

		if (val && val._refObjectName) {
			return val._refObjectName;
		}

		if (record.Feature && record.Feature.FormattedID && record.Feature.Name) {
			return record.Feature.FormattedID + ': ' + record.Feature.Name;
		}

		return 'No Parent';
	}

	if (field === 'Release') {
		return (val && val.Name) || 'Unscheduled';
	}

	if (field === 'Project') {
		return (val && val.Name) || 'Failed to convert project field';
	}

	if (field === 'Predecessors' || field === 'Successors') {
		return typeof val === 'object' && typeof val.Count === 'number' ? val.Count : '';
	}

	if (field === 'PredecessorsAndSuccessors') {
		return typeof val.Predecessors === 'number' ? `Predecessors: ${val.Predecessors}; Successors: ${val.Successors}` : '';
	}

	if (field === 'Owner' || field === 'CreatedBy') {
		val = (val && (val.DisplayName || (val.FirstName && val.LastName && `${val.FirstName} ${val.LastName}`) || val._refObjectName)) || '';

		if (!val && field === 'Owner') {
			return 'No Owner';
		}

		return val;
	}

	if (field === 'PreliminaryEstimate') {
		return `${val.Name} (${val.Value})`;
	}

	if (field === 'Milestones') {
		if (val.Count) {
			return val._tagsNameArray.map((m: { FormattedID: string; Name: string }) => `${m.FormattedID}: ${m.Name}`).join(delimiter);
		}

		return 'None';
	}

	if (field.toLowerCase().indexOf('portfolioitem/') > -1 || field === 'Feature') {
		return (val && `${val.FormattedID}: ${val.Name}`) || 'None';
	}

	if (Ext.isArray(val)) {
		return val.join(delimiter);
	}

	if (typeof val === 'object') {
		if (val._tagsNameArray) {
			return val._tagsNameArray.map((m: { Name: string; Value: string }) => m.Name || m.Value).join(delimiter);
		}

		return val.Name || val.value || val._refObjectName || 'Unable to convert field for export';
	}

	return val;
};

export const promisify = async (deferred: Deferred) => {
	if (!deferred || !(deferred.then instanceof Function)) {
		return Promise.reject(new Error('Promisify was passed an invalid deferred object'));
	}
	return new Promise((resolve, reject) => {
		deferred.then({
			success(result: unknown) {
				resolve(result);
			},
			failure(error: RallyError) {
				reject(error);
			}
		});
	});
};

export const parseError = (e: string | RallyError, defaultMessage = 'An unknown error has occurred') => {
	if (typeof e === 'string') {
		return e || defaultMessage;
	}

	if (e.message && e.message.length) {
		return e.message;
	}
	if (e.exception && e.error && e.error.errors && e.error.errors.length) {
		if (e.error.errors[0].length) {
			return e.error.errors[0];
		}
		if (e.error && e.error.response && e.error.response.status) {
			return `${defaultMessage} (Status ${e.error.response.status})`;
		}
	}
	if (e.exceptions && e.exceptions.length && e.exceptions[0].error) {
		return e.exceptions[0].error.statusText;
	}
	return defaultMessage;
};

export const showMessage = (msg: string, durationMs: number) => toast.show(msg, durationMs);
export const showSuccess = (msg: string, durationMs: number) => toast.showSuccess(msg, durationMs);
export const showWarning = (msg: string, durationMs: number) => toast.showWarning(msg, durationMs);

export const showError = (msg: string | RallyError, defaultMessage?: string, durationMs = 5000) => {
	toast.showError(parseError(msg, defaultMessage), durationMs);
};

export const setLoading = (msg: string | boolean) => {
	if (typeof msg === 'boolean') {
		loadingMessage.set(msg ? 'Loading...' : '');
	} else {
		loadingMessage.set(msg);
	}
};

export const getContext = () => app.getContext();
export const getDataContext = () => app.getContext().getDataContext();
