import { hello } from '~/index';

// Call library function
const result = hello();

// Output to console
console.log('Library function result:', result);

// Display on page
const outputElement = document.getElementById('output');
if (outputElement) {
    outputElement.textContent = `Library function called successfully!\nResult: ${result}`;
}
