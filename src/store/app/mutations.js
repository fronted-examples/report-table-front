import { UPDATE_MESSAGE } from './constant'

const mutations = {
  [UPDATE_MESSAGE]: function (state, payload) {
    state.message = payload
  }
}

export default mutations
