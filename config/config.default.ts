import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578724854413_2648';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // mogonDB
  config.mongoose = {
    client: {
      url: 'mongodb://localhost:27017/eggServer',  //你的数据库地址，不要端口
      options: {
        useNewUrlParser: true,
      }
    }
  }

  config.jwt = {
    secret: "liangzhi"//自定义 token 的加密条件字符串
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
      ignore: ['/login', '/uploadAvatar', '/addComment']
    },
    // domainWhiteList: ['http://localhost:8080'],//允许访问接口的白名单
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  config.multipart = {
    mode: 'stream',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
