module.exports = {
    publicPath: './',
    // 开发配置
    devServer: {
      proxy: {
        '/api': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api'
          }
        },
        '/file': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/file': '/file'
          }
        },
        '/create': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/create': '/create'
          }
        },
        '/user': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/user': '/user'
          }
        },
        '/avatar': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/avatar': '/avatar'
          }
        },
        '/home': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/home': '/home'
          }
        },
        '/newadmin': {
          // target: 'http://192.168.1.104:8888/', // 在这里输入代理地址
          target: 'http://localhost:8888/', // 必须加上http
          changeOrigin: true,
          pathRewrite: {
            '^/newadmin': '/newadmin'
          }
        },
        '/gt': {
          target: 'http://localhost:8888/',
          changeOrigin: true,
          pathRewrite: {
            '^/gt': '/gt'
          }
        }
      },
      host: '0.0.0.0',  // 开发时运行的地址
      port: 80,       // 开发时运行地址的端口
    }
  }