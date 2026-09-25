// 当前环境配置
export const env = 'mock'; // 'mock' | 'dev' | 'prod'

export const config = {
  mock: {
    baseURL: 'https://m1.apifoxmock.com/m1/8868203-8665104-default' // 需要替换为实际的 Apifox mock url
  },
  dev: {
    baseURL: 'http://<服务器IP>:8080'
  },
  prod: {
    baseURL: 'https://api.yourdomain.com'
  }
};

export const getBaseURL = () => config[env].baseURL;
