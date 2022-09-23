import type { RequestOptions } from 'https'
import https from 'https'

export function downloadProjects(projects: string[], cookie: string) {
  return Promise.all(projects.map(projectId => fetchInIconfont(
    `https://www.iconfont.cn/api/project/detail.json?pid=${projectId}}`,
    cookie,
  )))
}

async function fetchInIconfont(url: string, cookie: string) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      cookie,
    },
  }
  const data = await fetch(url, options)
  const json = JSON.parse(data)
  return json.code === 200
    ? json.data
    : Promise.reject(data)
}

function fetch(url: string, options: RequestOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      const { statusCode } = res
      if (!(statusCode && statusCode >= 200 && statusCode < 300)) {
        reject(res)
        return
      }
      let data = ''
      res.on('data', chunk => data += chunk)
        .on('end', () => resolve(data))
        .on('error', e => reject(e))
    })
    req.end()
  })
}
