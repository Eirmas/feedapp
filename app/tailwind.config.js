/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/index.html',
    './app/src/**/*.{vue,scss,css,ts}',
    './app/.storybook/**/*.{vue,scss,css,ts}',
    './.storybook/**/*.{vue,scss,css,ts}',
  ],
  presets: [require('../packages/styles/tailwind.config')],
};
