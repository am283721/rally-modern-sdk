import { toast } from '$lib/components/Toast/store';
import { loadingMessage } from '$lib/components/LoadingMask/store';
import type { RallyLookbackStoreConfig, RallyModelName, RallyWSAPIStoreConfig, RallyError, Deferred } from './rallySDKTypes';

let app: any;

const storeDefaults: RallyWSAPIStoreConfig = {
	autoLoad: false,
	pageSize: 400,
	limit: Infinity,
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

	const results = (await promisify(store.load())) as any[];

	return results.map((r) => ({ ...r, ...r.getData(true) }));
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

	return request('FlowState', {
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

		const attributes = (await request(results[0].Attributes._ref, { fetch: 'ElementName,AllowedValues' })) as {
			ElementName: string;
			AllowedValues: { _ref: string };
		}[];

		const attribute = attributes.find((a) => a.ElementName === fieldName);

		if (!attribute) {
			throw new Error(`Unable to load allowed list for field ${fieldName}s`);
		}

		const allowedValues = (await request(attribute.AllowedValues._ref, { fetch: 'StringValue' })) as { StringValue: string }[];

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

const request = (endpoint: string, params = {}, method = 'GET') =>
	new Promise((resolve, reject) => {
		Ext.Ajax.request({
			url: buildUrl(endpoint),
			method,
			params: {
				key: Rally.env.IoProvider.getSecurityToken(),
				pagesize: 400,
				...params
			},
			success: function (response: XMLHttpRequest) {
				const data = JSON.parse(response.responseText).QueryResult;

				if (data.Errors && data.Errors.length > 0) {
					reject(data.Errors[0]);
				}

				resolve(data.Results);
			},
			failure: function (response: XMLHttpRequest) {
				reject(response.statusText || 'An error occurred while fetching data');
			}
		});
	});

const buildUrl = (input: string) => {
	if (input.indexOf('http://') === 0 || input.indexOf('https://') === 0) {
		return input;
	}

	if (input.indexOf('/') !== 0) {
		input = `/${input}`;
	}

	return `${Rally.environment.getServer().getWsapiUrl()}${input}`;
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
