export default ({ app, redirect }) => {
  if (app.$auth.user.group !== 'admin') {
    return redirect('/process');
  }
  return true;
};
