module.exports = {
  content: ["./src/**/*.mjs", "./config/**/*.json"],
  theme: { extend: {} },
  safelist: [
    // If plugins produce class names dynamically, list them here.
    // e.g. 'grid-cols-4','col-span-2','text-sm','dark','bg-*'
  ]
};

