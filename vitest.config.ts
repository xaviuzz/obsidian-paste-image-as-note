import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
	},
	resolve: {
		alias: {
			obsidian: path.resolve(__dirname, 'src/test-utils/obsidian-mock.ts'),
		},
	},
});
