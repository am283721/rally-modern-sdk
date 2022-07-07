import type { Column } from './types.d';

type resizeColumnParams = { column: Column; minWidth: number; refreshColumns: () => void };

export const resizeColumn = (node: HTMLSpanElement, { column, minWidth, refreshColumns }: resizeColumnParams) => {
	const header = node.parentNode as HTMLHeadingElement;

	const onMouseMove = (e: MouseEvent) =>
		requestAnimationFrame(() => {
			const horizontalScrollOffset = header.closest('table')?.scrollLeft || 0;
			const width = horizontalScrollOffset + e.clientX - header.offsetLeft;
			column.width = Math.max(minWidth, width) + 'px';

			if (column.isLast) {
				column.width = `minmax(${column.width}, 1fr)`;
			}

			refreshColumns();
		});

	const onMouseUp = () => {
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
		header.classList.remove('header-being-resized');
	};

	const initResize = () => {
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		header.classList.add('header-being-resized');
	};

	node.addEventListener('mousedown', initResize);

	return {
		destroy() {
			node.removeEventListener('mousedown', initResize);
		}
	};
};
