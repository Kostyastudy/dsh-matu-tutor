import http from 'node:http'
import { URL } from 'node:url'
import {
  parseHtml, rowsOf, directCells, textOf, textLines, find, findLink,
  findByTag, attr, findAll,
} from './html.js'

const BASE = 'http://matu.uestc.edu.cn'
const LOGIN_PATH = '/aptat/user/login.action'
const CONNECT_TIMEOUT = 8000
const RESPONSE_TIMEOUT = 25000
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) C-Lab/1.0',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
}

function describeNetworkError(error, url) {
  const code = String(error?.code || '')
  const host = url.hostname
  const port = url.port || 80
  if (code === 'ETIMEDOUT' || code === 'EHOSTUNREACH' || code === 'ENETUNREACH') {
    return `连接码图超时：${host}:${port} 没有响应。请确认当前网络能打开 http://${host}（校园网或 VPN），或稍后重试`
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return `无法解析码图域名 ${host}，请检查 DNS 或网络连接`
  }
  if (code === 'ECONNREFUSED') {
    return `码图拒绝连接（${host}:${port}），服务器可能正在维护，请稍后重试`
  }
  if (code === 'ECONNRESET') {
    return `与码图的连接被重置（${host}:${port}），请重试`
  }
  return `无法连接码图：${error?.message || String(error)}`
}

function normalise(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function intOf(value) {
  const m = String(value || '').match(/-?\d+/)
  return m ? Number(m[0]) : null
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function mapLimit(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const index = next
      next += 1
      results[index] = await worker(items[index], index)
    }
  }
  const runners = Array.from({ length: Math.min(limit, items.length) }, run)
  return Promise.all(runners).then(() => results)
}

function makeBoundary() {
  return `----AptatLab${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
}

function encodeMultipart(fields) {
  const boundary = makeBoundary()
  const parts = []
  for (const [name, value] of Object.entries(fields)) {
    parts.push(Buffer.from(`--${boundary}\r\n`))
    parts.push(Buffer.from(`Content-Disposition: form-data; name="${name}"\r\n\r\n`))
    parts.push(Buffer.from(String(value ?? ''), 'utf8'))
    parts.push(Buffer.from('\r\n'))
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`))
  return { boundary, body: Buffer.concat(parts) }
}

function parseSetCookie(header) {
  if (!header) return []
  const list = Array.isArray(header) ? header : [header]
  return list.map((line) => {
    const [pair, ...attributes] = line.split(';')
    const eq = pair.indexOf('=')
    const name = (eq < 0 ? pair : pair.slice(0, eq)).trim()
    const value = eq < 0 ? '' : pair.slice(eq + 1).trim()
    const expired = attributes.some((item) => {
      const [key, raw] = item.trim().split('=')
      if (/^max-age$/i.test(key)) return Number(raw) <= 0
      if (/^expires$/i.test(key)) return Date.parse(raw) < Date.now()
      return false
    })
    return { name, value, expired }
  }).filter((item) => item.name)
}

export class AptatError extends Error {
  constructor(message, code = 'APTAT_ERROR', details = undefined) {
    super(message)
    this.name = 'AptatError'
    this.code = code
    this.details = details
  }
}

export class AptatClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || BASE
    this.cookies = new Map()
    this.connected = false
    this.username = ''
    this.classId = options.classId || null
    this.loginPromise = null
  }

  cookieHeader() {
    return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
  }

  absorbCookies(response) {
    for (const cookie of parseSetCookie(response.headers['set-cookie'])) {
      if (cookie.expired) this.cookies.delete(cookie.name)
      else this.cookies.set(cookie.name, cookie.value)
    }
  }

  request(path, options = {}) {
    const method = options.method || 'GET'
    const url = new URL(path, this.baseUrl)
    const headers = { ...DEFAULT_HEADERS, ...(options.headers || {}) }
    if (this.cookies.size) headers.Cookie = this.cookieHeader()
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (options.body) headers['Content-Length'] = Buffer.byteLength(options.body)
    const connectTimeout = options.connectTimeout || CONNECT_TIMEOUT
    const responseTimeout = options.timeout || RESPONSE_TIMEOUT

    return new Promise((resolve, reject) => {
      let settled = false
      let responded = false
      let connectTimer = null

      const fail = (error) => {
        if (settled) return
        settled = true
        if (connectTimer) clearTimeout(connectTimer)
        reject(error)
      }

      const req = http.request({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 80,
        path: `${url.pathname}${url.search}`,
        method,
        headers,
      }, (res) => {
        responded = true
        if (connectTimer) clearTimeout(connectTimer)
        req.setTimeout(responseTimeout, () => {
          req.destroy(new AptatError(
            `码图响应超时（${responseTimeout / 1000} 秒没有返回内容），请稍后重试`,
            'TIMEOUT',
          ))
        })
        this.absorbCookies(res)
        const chunks = []
        let size = 0
        res.on('data', (chunk) => {
          size += chunk.length
          if (size > (options.maxBytes || 8 * 1024 * 1024)) {
            req.destroy(new AptatError('服务器返回内容过大', 'RESPONSE_TOO_LARGE'))
            return
          }
          chunks.push(chunk)
        })
        res.on('end', () => {
          if (settled) return
          settled = true
          const body = Buffer.concat(chunks).toString('utf8')
          resolve({ status: res.statusCode || 0, headers: res.headers, body })
        })
        res.on('error', (error) => fail(new AptatError(describeNetworkError(error, url), 'NETWORK', error)))
      })

      connectTimer = setTimeout(() => {
        if (responded || settled) return
        req.destroy()
        fail(new AptatError(
          `连接码图超时：${url.hostname}:${url.port || 80} 在 ${connectTimeout / 1000} 秒内没有响应。请确认当前网络能打开 http://${url.hostname}（校园网或 VPN），或稍后重试`,
          'CONNECT_TIMEOUT',
        ))
      }, connectTimeout)

      req.on('error', (error) => {
        if (error instanceof AptatError) fail(error)
        else fail(new AptatError(describeNetworkError(error, url), 'NETWORK', error))
      })
      if (options.body) req.write(options.body)
      req.end()
    })
  }

  async requestWithRetry(path, options = {}) {
    const method = String(options.method || 'GET').toUpperCase()
    // 只对幂等的 GET 自动重试，避免重复提交代码或重复登录
    const attempts = options.retries ?? (method === 'GET' ? 1 : 0)
    let lastError = null
    for (let attempt = 0; attempt <= attempts; attempt += 1) {
      try {
        return await this.request(path, options)
      } catch (error) {
        lastError = error
        const retryable = error instanceof AptatError
          && (error.code === 'CONNECT_TIMEOUT' || error.code === 'NETWORK')
          && !/ECONNREFUSED/.test(error.message)
        if (!retryable || attempt === attempts) break
        await sleep(600 * (attempt + 1))
      }
    }
    throw lastError
  }

  async requestFollow(path, options = {}, redirects = 0) {
    const response = await this.requestWithRetry(path, options)
    if (redirects < 6 && response.status >= 300 && response.status < 400 && response.headers.location) {
      const next = new URL(response.headers.location, new URL(path, this.baseUrl)).pathname
        + new URL(response.headers.location, new URL(path, this.baseUrl)).search
      const method = response.status === 303 ? 'GET' : (options.method || 'GET')
      const body = method === 'GET' ? undefined : options.body
      return this.requestFollow(next, { ...options, method, body }, redirects + 1)
    }
    return response
  }

  isLoginPage(body) {
    return /name="user\.Login"|user\/login\.action/i.test(body)
  }

  async login(username, password) {
    if (this.loginPromise) return this.loginPromise
    this.loginPromise = (async () => {
      try {
        this.cookies.clear()
        const loginPage = await this.requestFollow(LOGIN_PATH)
        const form = loginPage.body.match(/<form[^>]+action="([^"]*dologin\.action[^"]*)"/i)
        if (!form) throw new AptatError('没有找到码图登录表单', 'LOGIN_FORM_MISSING')
        const action = new URL(form[1].replaceAll('&amp;', '&'), new URL(LOGIN_PATH, this.baseUrl)).toString()
        const payload = new URLSearchParams({
          'user.Login': username,
          'user.Password': password,
        }).toString()
        const response = await this.requestFollow(action, {
          method: 'POST',
          body: payload,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Referer: new URL(LOGIN_PATH, this.baseUrl).toString(),
          },
        })
        if (this.isLoginPage(response.body)) {
          const message = textOf(parseHtml(response.body)).match(/用户名.*?错误|密码.*?错误|登录失败/)?.[0]
          throw new AptatError(message || '账号或密码不正确，码图没有登录成功', 'LOGIN_REJECTED')
        }
        const welcome = await this.requestFollow('/aptat/user/welcome.action')
        if (this.isLoginPage(welcome.body)) {
          throw new AptatError('登录后仍被重定向到登录页，请检查账号密码', 'LOGIN_REDIRECTED')
        }
        this.connected = true
        this.username = username
        return true
      } finally {
        this.loginPromise = null
      }
    })()
    return this.loginPromise
  }

  async ensureLogin(credentials) {
    if (this.connected) return
    if (!credentials || !credentials.username || !credentials.password) {
      throw new AptatError('还没有连接码图账号', 'NOT_CONFIGURED')
    }
    await this.login(credentials.username, credentials.password)
  }

  async getHtml(path, credentials) {
    await this.ensureLogin(credentials)
    let response = await this.requestFollow(path)
    if (this.isLoginPage(response.body) || /user\/login\.action$/.test(response.headers.location || '')) {
      this.connected = false
      await this.login(credentials.username, credentials.password)
      response = await this.requestFollow(path)
    }
    if (response.status >= 400) {
      throw new AptatError(`码图返回 HTTP ${response.status}`, 'HTTP_ERROR', { path })
    }
    return response.body
  }

  async resolveClassId(credentials) {
    if (this.classId) return this.classId
    const html = await this.getHtml('/aptat/course/liststudentclass', credentials)
    const match = html.match(/liststudenttaskgroup\?_class\.id=(\d+)/)
    if (!match) throw new AptatError('没有在码图中找到你的班级', 'CLASS_NOT_FOUND')
    this.classId = Number(match[1])
    return this.classId
  }

  parseGroups(html) {
    const root = parseHtml(html)
    const groups = []
    for (const row of rowsOf(root)) {
      const cells = directCells(row)
      if (cells.length < 3) continue
      const link = findLink(row, 'listTaskGroup_Task?taskGroup.id=')
      if (!link) continue
      const href = attr(link, 'href')
      const idMatch = href.match(/taskGroup\.id=(\d+)/)
      if (!idMatch) continue
      const id = Number(idMatch[1])
      const texts = cells.map((cell) => normalise(textOf(cell)))
      if (!texts[1] || groups.some((group) => group.id === id)) continue
      groups.push({
        id,
        name: texts[1],
        weight: texts[2] || '',
        time: texts[3] || '',
      })
    }
    return groups
  }

  parseGrades(html) {
    const root = parseHtml(html)
    const map = new Map()
    for (const row of rowsOf(root)) {
      const cells = directCells(row)
      if (cells.length < 4) continue
      const link = findLink(row, 'taskdetail?taskid=')
      if (!link) continue
      const idMatch = attr(link, 'href').match(/taskid=(\d+)/)
      if (!idMatch) continue
      const id = Number(idMatch[1])
      const texts = cells.map((cell) => normalise(textOf(cell)))
      const attempts = intOf(texts[1])
      const score = intOf(texts[2])
      if (attempts === null && score === null) continue
      map.set(id, { attempts: attempts ?? 0, lastScore: score ?? 0 })
    }
    return map
  }

  async fetchGrades(credentials) {
    const result = new Map()
    for (let page = 1; page <= 6; page += 1) {
      const html = await this.getHtml(`/aptat/assignment/listassignmentgrade?page=${page}`, credentials)
      const rows = this.parseGrades(html)
      if (!rows.size) break
      for (const [id, value] of rows) result.set(id, value)
      if (!new RegExp(`page=${page + 1}[^>]*>第${page + 1}页`).test(html)) break
    }
    return result
  }

  parseGroupTasks(html) {
    const root = parseHtml(html)
    const tasks = []
    for (const row of rowsOf(root)) {
      const cells = directCells(row)
      if (cells.length < 6) continue
      const link = findLink(row, 'taskdetail?taskid=')
      if (!link) continue
      const href = attr(link, 'href')
      const taskMatch = href.match(/taskid=(\d+)/)
      const taskGroupMatch = href.match(/taskGroupTask\.id=(\d+)/)
      const groupMatch = href.match(/taskGroup\.id=(\d+)/)
      if (!taskMatch || !taskGroupMatch) continue
      const texts = cells.map((cell) => normalise(textOf(cell)))
      const id = Number(taskMatch[1])
      if (tasks.some((task) => task.id === id)) continue
      tasks.push({
        id,
        groupTaskId: Number(taskGroupMatch[1]),
        groupId: Number(groupMatch?.[1] || 0),
        name: texts[1],
        lang: texts[2] || 'C++',
        maxSubmissions: intOf(texts[3]) ?? 0,
        points: Number.parseFloat(texts[4]) || 0,
      })
    }
    return tasks
  }

  async fetchTaskDetail(task, credentials) {
    const html = await this.getHtml(
      `/aptat/task/taskdetail?taskid=${task.id}&taskGroupTask.id=${task.groupTaskId}&taskGroup.id=${task.groupId}`,
      credentials,
    )
    const root = parseHtml(html)
    const legend = findByTag(root, 'legend')
    const pre = findByTag(root, 'pre')
    const title = normalise(textOf(legend)) || task.name
    let description = pre ? textLines(pre) : ''
    if (!description) {
      const fieldsets = findAll(root, (node) => node.tag === 'fieldset')
      for (const fieldset of fieldsets) {
        const candidate = textLines(fieldset)
        if (candidate.length > title.length + 8) description = candidate
      }
    }
    const links = findAll(root, (node) => node.tag === 'a')
      .map((node) => ({ href: attr(node, 'href'), text: normalise(textOf(node)) }))
      .filter((item) => /download|\.zip|\.rar|\.pdf|\.docx?|\.c(pp)?$/i.test(item.href))
    return {
      name: title,
      description,
      lang: task.lang,
      throughBank: /通过题库进入/.test(textOf(root)),
      attachments: links,
    }
  }

  async sync(credentials, progress = () => {}) {
    await this.ensureLogin(credentials)
    progress('正在读取班级…')
    const classId = await this.resolveClassId(credentials)
    const groupHtml = await this.getHtml(`/aptat/task/liststudenttaskgroup?_class.id=${classId}`, credentials)
    const groups = this.parseGroups(groupHtml)
    if (!groups.length) throw new AptatError('码图里没有读到作业分组', 'NO_GROUPS')

    progress(`正在读取 ${groups.length} 次作业的提交成绩…`)
    const grades = await this.fetchGrades(credentials)

    progress('正在读取作业题目…')
    const grouped = await mapLimit(groups, 3, async (group) => {
      const html = await this.getHtml(`/aptat/task/listTaskGroup_Task?taskGroup.id=${group.id}`, credentials)
      return { group, tasks: this.parseGroupTasks(html) }
    })

    const tasks = grouped.flatMap(({ group, tasks: groupTasks }) => groupTasks.map((task) => {
      const grade = grades.get(task.id)
      return {
        ...task,
        groupId: group.id,
        groupName: group.name,
        groupWeight: group.weight,
        lastScore: grade?.lastScore ?? null,
        attempts: grade?.attempts ?? 0,
        description: '',
        throughBank: false,
        attachments: [],
      }
    }))

    let done = 0
    progress(`正在读取 ${tasks.length} 道题的题目详情…`)
    await mapLimit(tasks, 4, async (task) => {
      try {
        const detail = await this.fetchTaskDetail(task, credentials)
        Object.assign(task, detail, { name: detail.name || task.name })
      } catch (error) {
        task.detailError = error.message
      }
      done += 1
      if (done % 4 === 0 || done === tasks.length) progress(`正在读取题目详情 ${done}/${tasks.length}…`)
    })

    for (const task of tasks) {
      if (task.lastScore === 100) task.status = 'done'
      else if (task.lastScore !== null && task.lastScore > 0) task.status = 'partial'
      else if (task.attempts > 0) task.status = 'attempted'
      else task.status = 'todo'
      delete task.detailError
    }

    return {
      classId,
      groups: groups.map((group) => ({
        ...group,
        tasks: tasks.filter((task) => task.groupId === group.id).map((task) => task.id),
      })),
      tasks,
      fetchedAt: new Date().toISOString(),
    }
  }

  parseSubmissionRows(html) {
    const root = parseHtml(html)
    const rows = []
    for (const row of rowsOf(root)) {
      const cells = directCells(row)
      if (cells.length < 6) continue
      const link = findLink(row, 'scoredetail?assignmentid=')
      if (!link) continue
      const idMatch = attr(link, 'href').match(/assignmentid=(\d+)/)
      if (!idMatch) continue
      const texts = cells.map((cell) => normalise(textOf(cell)))
      rows.push({
        assignmentId: Number(idMatch[1]),
        taskId: intOf(texts[0]),
        name: texts[1],
        lang: texts[2],
        time: texts[3],
        status: texts[4],
        score: intOf(texts[5]),
        rawScore: texts[5],
      })
    }
    return rows
  }

  async fetchSubmissions(task, credentials) {
    const html = await this.getHtml(
      `/aptat/assignment/listttudenttaskgrouptaskassignmentforstudent?taskGroupTask.id=${task.groupTaskId}`,
      credentials,
    )
    return this.parseSubmissionRows(html).filter((row) => row.taskId === task.id)
  }

  async fetchScoreDetail(assignmentId, credentials) {
    const html = await this.getHtml(`/aptat/assignment/scoredetail?assignmentid=${assignmentId}`, credentials)
    const root = parseHtml(html)
    const text = textLines(root)
    let reason = ''
    const cut = text.search(/扣分\s*[:：]?\s*\d+/)
    if (cut >= 0) {
      reason = text.slice(cut)
        .replace(/^扣分\s*[:：]?\s*\d+\s*/, '')
        .trim()
    }
    if (!reason) {
      const table = findByTag(root, 'table')
      const body = table ? textLines(table).replace(/^成绩详单\s*/, '').trim() : ''
      reason = body && !/^评论/.test(body) ? body : ''
    }
    return { reason: reason || '', raw: text }
  }

  async submit(task, code, credentials, onProgress = () => {}) {
    await this.ensureLogin(credentials)
    onProgress('正在读取本次提交前的记录…')
    const before = await this.fetchSubmissions(task, credentials)
    const beforeMax = before.reduce((max, row) => Math.max(max, row.assignmentId), 0)

    onProgress('正在把代码提交到码图…')
    const { boundary, body } = encodeMultipart({
      'taskGroupTask.id': task.groupTaskId,
      'taskGroup.id': task.groupId,
      'task.id': task.id,
      'task.name': task.name,
      sourcecode: code,
      Submit: '提交',
    })
    const upload = await this.requestFollow('/aptat/assignment/upload_assignment_by_copy_paste', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Referer: `${this.baseUrl}/aptat/assignment/upload?task.id=${task.id}&uploadMethod=upload_copy_paste&taskGroupTask.id=${task.groupTaskId}&taskGroup.id=${task.groupId}`,
      },
      timeout: 60000,
    })
    if (!/上传成功/.test(upload.body)) {
      const message = normalise(textOf(parseHtml(upload.body))).slice(0, 500)
      throw new AptatError(message || '码图没有返回上传成功', 'UPLOAD_REJECTED')
    }

    const deadline = Date.now() + 45000
    let newest = null
    let final = false
    onProgress('代码已上传，正在等待码图评测…')
    while (Date.now() < deadline) {
      await sleep(900)
      const rows = await this.fetchSubmissions(task, credentials)
      const fresh = rows
        .filter((row) => row.assignmentId > beforeMax)
        .sort((a, b) => b.assignmentId - a.assignmentId)[0]
      if (!fresh) {
        onProgress('已上传，正在等待评测记录出现…')
        continue
      }
      newest = fresh
      const status = String(fresh.status || '').trim()
      const finalStatus = /^score$/i.test(status)
        || /编译错误|编译失败|答案错误|运行错误|格式错误|超时|内存超限|输出超限/i.test(status)
      const pending = /编译成功|等待|评测中|排队|judg|queue/i.test(status)
      if (finalStatus && !pending) {
        final = true
        break
      }
      onProgress(`码图正在评测（${status || '排队中'}）…`)
    }

    if (!newest) {
      throw new AptatError('上传成功，但 45 秒内没有看到新的评测记录，请到码图网页确认', 'NO_RESULT')
    }
    if (!final) {
      throw new AptatError(`代码已上传，但码图 45 秒内仍在评测（${newest.status || '排队中'}），请稍后在提交记录里查看，不要重复提交`, 'JUDGE_TIMEOUT')
    }
    const detail = newest.score !== null && newest.score < 100
      ? await this.fetchScoreDetail(newest.assignmentId, credentials)
      : { reason: newest.score === 100 ? '全部测试点通过，没有扣分。' : '' }
    return {
      assignmentId: newest.assignmentId,
      score: newest.score,
      status: newest.status,
      submittedAt: newest.time,
      reason: detail.reason || (newest.score === 100 ? '全部测试点通过，没有扣分。' : '码图尚未给出扣分说明。'),
      rawDetail: detail.raw || '',
    }
  }
}

export const APTAT_BASE = BASE
