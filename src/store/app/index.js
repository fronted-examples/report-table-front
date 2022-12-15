import states from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const app = {
  namespaced: true,
  state: states,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default app
