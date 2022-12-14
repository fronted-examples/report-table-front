import { UPDATE_USER } from './constant'

const mutations = {
  [UPDATE_USER]: function(state, payload) {
    state.user = payload
  }
}

export default mutations