import { UPDATE_MESSAGE } from './constant'

const actions = {
  [UPDATE_MESSAGE]: function (context, payload) {
    context.commit(UPDATE_MESSAGE, payload)
  }
}

export default actions
