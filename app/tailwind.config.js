/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/index.html', './app/src/**/*.{vue,js,ts}', './app/.storybook/**/*.{vue,js,ts}', './.storybook/**/*.{vue,scss}'],
  presets: [require('../packages/styles/tailwind.config')],
};
