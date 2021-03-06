import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		package: {
			exports: (filepath) => {
				return filepath.endsWith("index.js");
			},
			files: (filepath) => {
				return !filepath.endsWith(".test.ts");
			},
		},
	}
};

export default config;
