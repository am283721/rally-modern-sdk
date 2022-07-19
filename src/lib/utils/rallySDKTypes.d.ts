export type RallyDataContext = {
	workspace?: string;
	project?: string;
	projectScopeUp?: boolean;
	projectScopeDown?: boolean;
};

export type RallyBaseStoreConfig = {
	autoDestroy?: boolean;
	autoLoad?: boolean | Record<string, any>;
	autoSync?: boolean;
	batchUpdateMode?: string;
	buffered?: boolean;
	clearOnPageLoad?: boolean;
	clearRemovedOnPageLoad?: boolean;
	context?: RallyDataContext;
	data?: Record<string, any>[];
	defaultSortDirection?: string;
	fetch?: string[];
	fields?: Record<string, any>[];
	filterOnLoad?: boolean;
	filters?: Record<string, any>[] | (() => any)[];
	groupDir?: string;
	groupField?: string;
	groupers?: any;
	leadingBufferZone?: number;
	limit?: number;
	listeners?: Record<string, any>;
	model?: RallyModelName;
	pageSize?: number;
	proxy?: any;
	purgePageCount?: number;
	remoteFilter?: boolean;
	remoteGroup?: boolean;
	remoteSort?: boolean;
	sortOnFilter?: boolean;
	sortOnLoad?: boolean;
	sortRoot?: string;
	sorters?: { direction: string; property: string }[] | any[];
	statefulFilters?: boolean;
	storeId?: string;
	trailingBufferZone?: number;
};
export interface RallyWSAPIStoreConfig extends RallyBaseStoreConfig {
	enablePostGet?: boolean;
	compact?: boolean;
	enableRankFieldParameterAutoMapping?: boolean;
	includeSchema?: boolean;
	models?: string[] | Record<string, any>[];
	search?: string;
	useShallowFetch?: boolean;
	wsapiVersion?: string | number;
}

export interface RallyLookbackStoreConfig extends RallyBaseStoreConfig {
	compress?: boolean;
	exceptionHandler?: () => any;
	findConfig?: Record<string, any>;
	headers?: Record<string, any>;
	hydrate?: string[];
	removeUnauthorizedSnapshots?: boolean;
	sortConfig?: Record<string, any>;
	useHttpPost?: boolean;
	version?: string;
}

export type RallyModelName =
	| 'AllowedAttributeValue'
	| 'AllowedQueryOperator'
	| 'Artifact'
	| 'ArtifactNotification'
	| 'Attachment'
	| 'AttachmentContent'
	| 'AttributeDefinition'
	| 'Blocker'
	| 'Build'
	| 'BuildDefinition'
	| 'Change'
	| 'Changeset'
	| 'Connection'
	| 'ConversationPost'
	| 'CumulativeFlowData'
	| 'Defect'
	| 'DefectSuite'
	| 'DomainObject'
	| 'FlowState'
	| 'HierarchicalRequirement'
	| 'Investment'
	| 'Iteration'
	| 'IterationCumulativeFlowData'
	| 'Milestone'
	| 'ObjectiveConversationPost'
	| 'PersistableObject'
	| 'PortfolioItem'
	| `PortfolioItem/${string}`
	| 'PortfolioItemPredecessorRelationship'
	| 'Preference'
	| 'PreliminaryEstimate'
	| 'ProfileImage'
	| 'Project'
	| 'ProjectPermission'
	| 'PullRequest'
	| 'RankableArtifact'
	| 'RecycleBinEntry'
	| 'Release'
	| 'ReleaseCumulativeFlowData'
	| 'Requirement'
	| 'Revision'
	| 'RevisionHistory'
	| 'Risk'
	| 'SchedulableArtifact'
	| 'SCMRepository'
	| 'Scope'
	| 'ScopedAttributeDefinition'
	| 'Slice'
	| 'State'
	| 'Subscription'
	| 'Tag'
	| 'Task'
	| 'TestCase'
	| 'TestCaseResult'
	| 'TestCaseStep'
	| 'TestFolder'
	| 'TestSet'
	| 'TimeEntryItem'
	| 'TimeEntryValue'
	| 'TypeDefinition'
	| 'User'
	| 'UserIterationCapacity'
	| 'UserPermission'
	| 'UserProfile'
	| 'WebLinkDefinition'
	| 'Workspace'
	| 'WorkspaceConfiguration'
	| 'WorkspaceDomainObject'
	| 'WorkspacePermission';

export interface RallyUrlRequestParams {
	query?: string;
	fetch?: string;
	order?: string;
	limit?: number;
	start?: number;
	pagesize?: number;
	compact?: boolean;
	key?: string;
	restrictToEditAccess?: boolean;
	includePermissions?: boolean;
	project?: string;
	projectScopeUp?: boolean;
	projectScopeDown?: boolean;
}

export type RallyError = {
	message?: string;
	exception?: boolean;
	exceptions?: { error?: { statusText: string } }[];
	error?: {
		errors?: string[];
		response?: {
			status: string | number;
		};
	};
};

export interface Deferred {
	always: (callback: Record<string, any>, scope: Record<string, any>) => void;
	cancel: (reason: Record<string, any>) => void;
	getPromise: () => any;
	getState: () => any;
	otherwise: (callback: Record<string, any>, scope: Record<string, any>) => void;
	reject: (error: Record<string, any>) => void;
	resolve: (value: Record<string, any>) => void;
	then: (callbacks: Record<string, any>) => void;
	toString: () => string;
	update: (progress: Record<string, any>) => void;
}
