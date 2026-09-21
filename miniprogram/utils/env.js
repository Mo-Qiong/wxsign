// 当前环境配置
export const env = 'mock'; // 'mock' | 'dev' | 'prod'

export const config = {
  mock: {
    baseURL: 'https://mock.apifox.com/m1/xxxxxx-xxxxxx-default' // 需要替换为实际的 Apifox mock url
  },
  dev: {
    baseURL: 'http://<你的服务器IP>:8080'
  },
  prod: {
    baseURL: 'https://api.yourdomain.com'
  }
};

export const getBaseURL = () => config[env].baseURL;
