const { createProxyMiddleware} = require('http-proxy-middleware');
const config = require("./config.json")


module.exports = function (app) {
    app.use(createProxyMiddleware('/api',
        {
            target: 'https://' + config.server + '/',
            pathRewrite: {
                '^/api': '',
            },
            changeOrigin: true,
            secure: false,
            ws: true,
        }
    ));
};
