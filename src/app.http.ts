import * as fs from 'fs'
import http from 'http'

const server = http.createServer((req, res) => {
  console.log(req.url)

  if (req.url === '/') {
    const htmlFile = fs.readFileSync('./public/index.html', 'utf-8')
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(htmlFile)
    return
  }
  if (req.url?.endsWith('.js')) {
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
  } else if (req.url?.endsWith('.css')) {
    res.writeHead(200, { 'Content-Type': 'text/css' })
  }
  const responseContent = fs.readFileSync(`./public/${req.url}`, 'utf-8')
  res.end(responseContent)
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
//   res.writeHead(200, { 'Content-Type': 'text/html' })
//   res.write(`<h1>URL${req.url}</h1>`)
//   res.end()
//   const data = { name: 'John Doe', age: 30, city: 'San Francisco' }
//   res.writeHead(200, { 'Content-Type': 'application/json' })
//   res.end(JSON.stringify(data))
