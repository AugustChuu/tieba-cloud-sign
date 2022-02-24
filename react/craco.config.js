const CracoPlugin = require('craco');

module.exports = {
    plugins: [
        {
            plugin: CracoPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#51b1ff' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
