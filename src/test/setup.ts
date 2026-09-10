import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetMockData } from '../mocks/data';
import { server } from '../mocks/server';

// jsdom does not implement matchMedia; antd's responsive utilities need it.
window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// jsdom does not implement ResizeObserver; antd's layout-measuring components need it.
class ResizeObserverStub {
  observe = (): void => {};
  unobserve = (): void => {};
  disconnect = (): void => {};
}
window.ResizeObserver = ResizeObserverStub;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  resetMockData();
  cleanup();
});

afterAll(() => {
  server.close();
});
