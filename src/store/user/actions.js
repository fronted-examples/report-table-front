import { UPDATE_USER } from './constant'

const actions = {
  [UPDATE_USER]: function (context, payload) {
    context.commit(UPDATE_USER, payload)
  }
}

export default actions
