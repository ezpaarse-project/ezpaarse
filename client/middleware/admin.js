export default async function (context) {
  const app = context.app

  if (app.$auth.user.group !== 'admin') {
    return app.router.push('/process')
  }
}