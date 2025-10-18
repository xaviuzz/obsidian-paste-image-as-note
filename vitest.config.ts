import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: './vitest.setup.ts',
	},
	resolve: {
		alias: {
			obsidian: path.resolve(__dirname, 'src/test-utils/obsidian-mock.ts'),
		},
	},
});
