export default ({ store }) => {
  try {
    store.dispatch('LOAD_PKBS')
  } catch (e) { }
}