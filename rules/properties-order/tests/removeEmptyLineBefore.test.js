const removeEmptyLinesBefore = require('../removeEmptyLinesBefore');
const postcss = require('postcss');

function removeEmptyLine(css, lineEnding) {
	const root = postcss.parse(css);

	removeEmptyLinesBefore(root.nodes[1], lineEnding);

	return root.toString();
}

describe('removeEmptyLinesBefore', () => {
	it('removes single newline from the newline at the beginning', () => {
		expect(removeEmptyLine('a {}\n\n  b{}', '\n')).toBe('a {}\n  b{}');
	});

	it('removes single newline from newline at the beginning with CRLF', () => {
		expect(removeEmptyLine('a {}\r\n\r\n  b{}', '\r\n')).toBe('a {}\r\n  b{}');
	});

	it('removes single newline from newline at the end', () => {
		expect(removeEmptyLine('a {}\t\n\nb{}', '\n')).toBe('a {}\t\nb{}');
	});

	it('removes single newline from newline at the end with CRLF', () => {
		expect(removeEmptyLine('a {}\t\r\n\r\nb{}', '\r\n')).toBe('a {}\t\r\nb{}');
	});

	it('removes single newline from newline in the middle', () => {
		expect(removeEmptyLine('a {}  \n\n\tb{}', '\n')).toBe('a {}  \n\tb{}');
	});

	it('removes single newline to newline in the middle with CRLF', () => {
		expect(removeEmptyLine('a {}  \r\n\r\n\tb{}', '\r\n')).toBe('a {}  \r\n\tb{}');
	});

	it('removes two newlines if there are three newlines', () => {
		expect(removeEmptyLine('a {}\n\n\n  b{}', '\n')).toBe('a {}\n  b{}');
	});

	it('removes two newlines if there are three newlines with CRLF', () => {
		expect(removeEmptyLine('a {}\r\n\r\n\r\n  b{}', '\r\n')).toBe('a {}\r\n  b{}');
	});

	it('removes three newlines if there are four newlines', () => {
		expect(removeEmptyLine('a {}\n\n\n\n  b{}', '\n')).toBe('a {}\n  b{}');
	});

	it('removes three newlines if there are four newlines with CRLF', () => {
		expect(removeEmptyLine('a {}\r\n\r\n\r\n\r\n  b{}', '\r\n')).toBe('a {}\r\n  b{}');
	});
});
