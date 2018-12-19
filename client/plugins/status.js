export default ({ store }) => {
  store.dispatch('GET_APP_VERSION')
  store.dispatch('LOAD_PKBS')
  store.dispatch('LOAD_STATUS')
}
