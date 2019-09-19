import { sum } from '../src/template';

describe('template', () => {
	test('exports', () => {
		expect(sum).toBeDefined();
		expect(typeof sum).toEqual('function');
	});
});
