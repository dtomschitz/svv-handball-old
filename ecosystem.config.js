module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/api/main.js',
      watch: true,
      watch_delay: 100,
      watch_options: {
        "followSymlinks": false
      },
      ignore_watch: ['node_modules', 'images'],
    },
    {
      name: 'website',
      script: './dist/website/server/main.js',
      watch: true,
      watch_delay: 100,
      watch_options: {
        "followSymlinks": false
      },
      ignore_watch: ['node_modules', 'images'],
    },
  ],
};
