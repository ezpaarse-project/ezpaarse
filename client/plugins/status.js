export default ({ store }) => {
  store.dispatch('LOAD_PKBS')
  store.dispatch('LOAD_STATUS')
}
