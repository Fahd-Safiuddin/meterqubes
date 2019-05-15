const { NODE_ENV } = process.env

const url = {
  // local: 'http://mq_socket:4337/api/notification',// to test with socket server run on local PC
  development: 'https://mq-socket-dev.scenario-projects.com',
  test: 'https://mq-socket-dev.scenario-projects.com',
  staging: 'https://mq-socket-stage.scenario-projects.com',
  production: '',

}

export const socketUri = `${url[NODE_ENV]}/api/notification`
