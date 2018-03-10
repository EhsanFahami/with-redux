'use strict';

module.exports = {
    modify: (baseConfig, { target, dev }, webpack) => {
        const appConfig = Object.assign({}, baseConfig);

        appConfig.module.rules.push({
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules   : true,
                        sourceMap : true,
                    },
                }
            ]
        });


    return appConfig;
  }
};
