export enum ColumnType {
	numeric = 'numeric',
	date = 'date',
	textShort = 'textShort',
	textLong = 'textLong'
}

export interface Column {
	text: string;
	dataIndex: string;
	columnType?: keyof typeof ColumnType;
	resizable?: boolean;
	sortable?: boolean;
	width?: number | string;
	renderer?: (value: any, record: any, rowIndex: number, columnIndex: number) => string;
	sorterFn?: (a: any, b: any) => number;
	el?: HTMLHeadingElement;
	isLast?: boolean;
}
