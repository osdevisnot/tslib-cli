import { sum } from 'template_full';

describe('template', () => {
  test('exports', () => {
    expect(sum).toBeDefined();
    expect(typeof sum).toEqual('function');
  });
});
