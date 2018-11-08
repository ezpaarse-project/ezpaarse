import axios from 'axios'

const options = {}
// The server-side needs a full url to work
if (process.server) {
  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 59599

  options.baseURL = `http://${host}:${port}`

  if (process.env.http_proxy) {
    options.proxy = { host, port }
  }
}

export default axios.create(options)
