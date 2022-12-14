import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const user = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default user