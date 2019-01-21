export default async function ({ app, redirect }) {
  if (app.$auth.user.group !== 'admin') {
    return redirect('/process')
  }
}