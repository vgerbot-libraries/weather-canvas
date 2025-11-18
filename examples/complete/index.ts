import { hello } from '~/index';

// Basic example
document.getElementById('basic-demo')?.addEventListener('click', () => {
    const output = document.getElementById('basic-output');
    if (output) {
        const result = hello();
        output.textContent = `Result: ${result}`;
    }
});

// Advanced example
document.getElementById('advanced-demo')?.addEventListener('click', () => {
    const output = document.getElementById('advanced-output');
    if (output) {
        // Add more advanced feature demonstrations here
        const timestamp = new Date().toISOString();
        output.textContent = `Current time: ${timestamp}\nResult: ${hello()}`;
    }
});

console.log('Complete example loaded');
console.log('Library test:', hello());
