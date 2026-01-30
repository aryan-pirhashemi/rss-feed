/* eslint-disable prettier/prettier */
declare module '@ioc:Services/Worker' {
  import WorkerHandler from 'providers/WorkerHandlerProvider/WorkerHandler'
  const Worker: WorkerHandler
  export default Worker
}
