import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

global.URL.createObjectURL = vi.fn(() => 'blob:mock-object-url');
global.URL.revokeObjectURL = vi.fn();
