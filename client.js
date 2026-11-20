window.__ModuleLoader__.load({
  id: 'dsh-matu-tutor',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const {
      useCallback, useEffect, useMemo, useRef, useState,
    } = React

    const API_ROOT = '/aptat-api'
    // Package-prefixed so this slot id and locale namespace cannot collide with
    // another plugin's.
    const NAMESPACE = 'dsh-matu-tutor'

    const ZH = {
      'nav.label': '码图 C 助教',
      'app.title': '码图 C 助教',
      'app.subtitle': 'UESTC · APTAT 本地练习台',
      'app.progress': '作业进度',
      'app.remaining': '待完成',
      'app.loading': '正在连接码图…',
      'app.syncing': '正在同步',
      'app.synced': '已同步',
      'app.never': '尚未同步',
      'app.syncFailed': '同步失败',
      'sync.failedTitle': '登录成功，但同步失败了',
      'app.refresh': '同步码图',
      'app.refreshing': '同步中…',
      'app.tutor': 'AI 助教',
      'app.close': '关闭',
      'setup.eyebrow': 'CONNECT / 01',
      'setup.title': '把码图作业搬到本地',
      'setup.desc': '登录一次，作业、得分和扣分原因会同步到本机。代码只保存在你自己的电脑里。',
      'setup.account': '码图账号',
      'setup.accountHint': '学号 / 账号',
      'setup.password': '密码',
      'setup.remember': '保存到系统凭据库，下次自动登录',
      'setup.connect': '连接码图',
      'setup.connecting': '正在登录并同步题目…',
      'setup.note': '凭据只写入系统凭据库，不写进代码、不上传给模型。',
      'setup.privacy': 'AI 辅导只会收到当前题目、你的代码和你的提问。',
      'setup.error': '连接失败',
      'rail.search': '搜索题号、题目…',
      'rail.filter': '只看未完成',
      'rail.empty': '没有匹配的题目',
      'rail.noScore': '未提交',
      'rail.functionHint': '函数题',
      'problem.meta.id': '题号',
      'problem.meta.points': '分值',
      'problem.meta.attempts': '提交次数',
      'problem.meta.score': '最近得分',
      'problem.functionWarn': '这题可能只要求提交函数，不要把本地测试的 main 一起交上去。',
      'problem.empty': '题目描述还没有同步。',
      'problem.aiHarness': '生成测试 main',
      'problem.history': '提交记录',
      'problem.noHistory': '还没有提交记录。',
      'problem.loadingHistory': '正在读取提交记录…',
      'problem.collapse': '收起题目',
      'problem.expand': '展开题目',
      'code.tab.solution': '提交文件',
      'code.tab.harness': '本地测试 main',
      'code.tab.input': '测试输入',
      'code.harnessNote': '不会提交。函数题用它调用你的函数做本地测试。',
      'code.placeholder': '在这里写 C 代码…',
      'code.save': '保存',
      'code.saved': '已保存',
      'code.saveFailedStay': '上一题的修改没有保存成功，先留在这一题：',
      'code.saving': '保存中…',
      'code.unsaved': '未保存',
      'code.buildRun': '编译并运行',
      'code.aiCheck': 'AI 检查',
      'code.aiCheckBusy': 'AI 正在看…',
      'code.aiCheckTitle': '让 AI 检查当前进度；只有用 // Q: 或 // 问： 标出的注释才会被当作问题（Ctrl+Shift+Enter）',
      'code.aiCheckBadge': '个注释问题',
      'code.cursor': 'Ln',
      'code.submit': '提交到码图',
      'code.lines': '行',
      'code.stdinPlaceholder': '在这里填测试数据（如 12 34），点“编译并运行”时作为标准输入喂给程序',
      'term.title': '运行终端',
      'term.ready': '就绪',
      'term.busy': '运行中',
      'term.clear': '清空',
      'term.command': '输入命令，例如 gcc solution.c -o main',
      'term.runCommand': '执行',
      'term.empty': '编译或运行后，输出会显示在这里。',
      'run.output': '输出',
      'run.compiling': '编译中',
      'run.running': '运行中',
      'run.failed': '编译失败',
      'run.stop': '停止',
      'run.stopped': '[已停止]',
      'run.exitCode': '退出码',
      'run.noOutput': '（暂无输出）',
      'run.noCompiler': '没能运行编译器。请确认电脑上装了 gcc（README 里有 Windows 安装步骤），然后重试。',
      'time.justNow': '刚刚',
      'time.minutesAgo': '{n} 分钟前',
      'time.hoursAgo': '{n} 小时前',
      'time.daysAgo': '{n} 天前',
      'ui.show': '显示',
      'ui.hide': '隐藏',
      'ui.unknown': '未知',
      'ui.selectTask': '选择题目',
      'setup.step1': '01 登录',
      'setup.step2': '02 同步',
      'setup.step3': '03 练习',
      'setup.missingFields': '请把账号和密码都填上。',
      'rail.collapse': '收起题目栏',
      'rail.showRail': '展开题目栏',
      'rail.hideRail': '收起题目栏，给代码区更多空间',
      'rail.attempts': '{n} 次提交',
      'problem.statement': '题目',
      'status.done': '已完成',
      'status.partial': '部分完成',
      'status.attempted': '已提交未得分',
      'status.todo': '未提交',
      'editor.commentAt': '第 {line} 行：{text}',
      'editor.hideTerminal': '隐藏终端',
      'editor.showTerminal': '显示终端',
      'editor.buildRunTitle': '编译并运行当前代码（Ctrl+Enter）',
      'editor.aiCheckTabHint': '切回 solution.c 或 harness.c 后再检查',
      'editor.submitTitle': '真实提交到码图，会消耗一次提交机会',
      'editor.dismissResult': '关闭结果',
      'editor.runFailed': '运行失败',
      'editor.copyFailed': '复制失败，请手动选择代码。',
      'tutor.resizeHint': '调整助教面板宽度（左右拖动）',
      'tutor.resizeTitle': '左右拖动调整宽度，双击恢复默认',
      'tutor.startTitle': '让助教先讲这道题的功能框架',
      'tutor.start': '开始讲解',
      'tutor.modelTitle': '点击切换助教使用的模型',
      'tutor.rulesTitle': '长期教学约定：在对话里说“记住……”会自动写入，跨题跨轮生效',
      'tutor.ruleCount': '约定 {n}',
      'tutor.loadingModels': '读取模型列表…',
      'tutor.noModels': '没有可用模型',
      'tutor.modelSwitched': '助教模型已切换：{model}',
      'tutor.prevMine': '跳到上一条我说的话',
      'tutor.nextMine': '跳到下一条我说的话',
      'tutor.prevMineLabel': '↑ 我说的',
      'tutor.nextMineLabel': '↓ 我说的',
      'tutor.inputHint': 'Enter 发送 · Shift+Enter 换行',
      'tutor.clearChatTitle': '清空辅导对话',
      'tutor.clearChatDesc': '这道题的 AI 辅导对话会被删除，本地代码和提交记录不受影响。',
      'tutor.clearChatConfirm': '清空',
      'account.title': '码图账号',
      'account.connected': '当前已连接：{account}。更新账号不会删除本地代码和提交记录。',
      'account.clear': '清除本机凭据',
      'account.clearDesc': '本机保存的码图账号和密码会被删除，本地代码不会被删除。下次打开需要重新登录。',
      'account.clearConfirm': '清除',
      'account.connecting': '正在连接…',
      'account.update': '更新账号',
      'account.cleared': '已清除本机凭据',
      'account.chip': '码图',
      'app.notStarted': '插件没有启动',
      'app.initializing': '正在初始化本地工作台…',
      'app.syncingDetail': '正在从码图同步作业、得分和题目…',
      'app.pickTask': '从左侧选择一道题开始。',
      'app.streamNoResponse': '浏览器没有收到流式响应',
      'layout.focusExitTitle': '退出宽屏，回到 Harness 布局（Esc）',
      'layout.focusEnterTitle': '宽屏模式：铺满整个窗口，隐藏 Harness 侧栏',
      'layout.focusExit': '退出宽屏',
      'layout.focusEnter': '宽屏',
      'theme.toLight': '切换到浅色',
      'theme.toDark': '切换到深色',
      'theme.toLightLabel': '切换到浅色主题',
      'theme.toDarkLabel': '切换到深色主题',
      'term.exit': '退出码',
      'submit.title': '提交到码图',
      'submit.desc': '这会真实提交到 UESTC 码图，并消耗一次提交机会。提交前请先本地测试。',
      'submit.task': '题目',
      'submit.codeSize': '代码长度',
      'submit.attempts': '已提交',
      'submit.cancel': '再检查一下',
      'submit.confirm': '确认提交',
      'submit.uploading': '正在上传代码…',
      'submit.judging': '正在等待码图评测…',
      'submit.wait': '通常需要 2–20 秒，请不要关闭页面。',
      'submit.result': '评测结果',
      'submit.score': '分',
      'submit.full': '满分通过',
      'submit.keepEditing': '继续修改',
      'submit.unknown': '未得到分数',
      'tutor.title': 'AI 助教',
      'tutor.subtitle': '读题 · 思路 · 语法 · 代码',
      'tutor.emptyTitle': '不急着要答案，先把这题看懂。',
      'tutor.emptyDesc': '先给你这道题的功能框架（含循环/分支的层级关系），然后一块一块写：你选一个功能块，我讲知识点 + 只给这一块的代码，并说明它该放在第几层。',
      'tutor.start': '从这道题开始',
      'tutor.mode.lesson': '逐步讲解',
      'tutor.mode.hint': '只给提示',
      'tutor.mode.coach': '检查进度',
      'tutor.mode.debug': '帮我调试',
      'tutor.mode.review': '代码审查',
      'tutor.placeholder': '问一个具体问题，或说“继续”…',
      'tutor.send': '发送',
      'tutor.stop': '停止生成',
      'tutor.clear': '清空对话',
      'tutor.thinking': '正在组织讲解…',
      'tutor.copy': '复制代码',
      'tutor.copied': '已复制',
      'tutor.insert': '追加到编辑器',
      'tutor.inserted': '已追加',
      'tutor.model': '默认模型',
      'tutor.noModel': '未配置模型',
      'tutor.error': 'AI 辅导暂时不可用',
      'tutor.you': '你',
      'tutor.assistant': '助教',
      'common.cancel': '取消',
      'common.retry': '重试',
      'common.close': '关闭',
    }

    const EN = {
      'nav.label': 'MATU C tutor',
      'app.title': 'MATU C tutor',
      'app.subtitle': 'UESTC · APTAT practice desk',
      'app.progress': 'Progress',
      'app.remaining': 'To do',
      'app.loading': 'Connecting to APTAT…',
      'app.syncing': 'Syncing',
      'app.synced': 'Synced',
      'app.never': 'Never synced',
      'app.syncFailed': 'Sync failed',
      'sync.failedTitle': 'Signed in, but the sync failed',
      'app.refresh': 'Sync',
      'app.refreshing': 'Syncing…',
      'app.tutor': 'AI tutor',
      'app.close': 'Close',
      'setup.eyebrow': 'CONNECT / 01',
      'setup.title': 'Bring APTAT homework to your desk',
      'setup.desc': 'Sign in once. Assignments, scores and deduction notes sync locally. Your code stays on this computer.',
      'setup.account': 'APTAT account',
      'setup.accountHint': 'Student ID / account',
      'setup.password': 'Password',
      'setup.remember': 'Save in the system credential store',
      'setup.connect': 'Connect',
      'setup.connecting': 'Signing in and syncing…',
      'setup.note': 'Credentials go to the OS credential store, never into code or the model prompt.',
      'setup.privacy': 'The tutor only receives this problem, your code and your question.',
      'setup.error': 'Connection failed',
      'rail.search': 'Search number or title…',
      'rail.filter': 'Unfinished only',
      'rail.empty': 'No matching tasks',
      'rail.noScore': 'Not submitted',
      'rail.functionHint': 'function',
      'problem.meta.id': 'No.',
      'problem.meta.points': 'Points',
      'problem.meta.attempts': 'Attempts',
      'problem.meta.score': 'Last score',
      'problem.functionWarn': 'This task may expect only a function. Do not submit your local test main.',
      'problem.empty': 'The statement has not been synced yet.',
      'problem.aiHarness': 'Make a test main',
      'problem.history': 'Submissions',
      'problem.noHistory': 'No submissions yet.',
      'problem.loadingHistory': 'Loading submissions…',
      'problem.collapse': 'Collapse statement',
      'problem.expand': 'Expand statement',
      'code.tab.solution': 'Submission file',
      'code.tab.harness': 'Local test main',
      'code.tab.input': 'Test input',
      'code.harnessNote': 'Never submitted. Use it to call your function for local tests.',
      'code.placeholder': 'Write C here…',
      'code.save': 'Save',
      'code.saved': 'Saved',
      'code.saveFailedStay': 'The previous problem could not be saved, so you are still on it: ',
      'code.saving': 'Saving…',
      'code.unsaved': 'Unsaved',
      'code.buildRun': 'Build & run',
      'code.aiCheck': 'AI check',
      'code.aiCheckBusy': 'AI is reading…',
      'code.aiCheckTitle': 'Ask the tutor to check your progress; only comments marked // Q: or // Ask: count as questions (Ctrl+Shift+Enter)',
      'code.aiCheckBadge': 'comment questions',
      'code.cursor': 'Ln',
      'code.submit': 'Submit to APTAT',
      'code.lines': 'lines',
      'code.stdinPlaceholder': 'Type test data here (e.g. 12 34); it is fed to the program as standard input',
      'term.title': 'Run terminal',
      'term.ready': 'ready',
      'term.busy': 'running',
      'term.clear': 'Clear',
      'term.command': 'Type a command, e.g. gcc solution.c -o main',
      'term.runCommand': 'Run',
      'term.empty': 'Output appears here after a build or run.',
      'run.output': 'Output',
      'run.compiling': 'Compiling',
      'run.running': 'Running',
      'run.failed': 'Compile failed',
      'run.stop': 'Stop',
      'run.stopped': '[stopped]',
      'run.exitCode': 'exit code',
      'run.noOutput': '(no output yet)',
      'run.noCompiler': 'The compiler could not be started. Check that gcc is installed (the README has Windows steps), then try again.',
      'time.justNow': 'just now',
      'time.minutesAgo': '{n} min ago',
      'time.hoursAgo': '{n} h ago',
      'time.daysAgo': '{n} d ago',
      'ui.show': 'Show',
      'ui.hide': 'Hide',
      'ui.unknown': 'unknown',
      'ui.selectTask': 'Choose a problem',
      'setup.step1': '01 Sign in',
      'setup.step2': '02 Sync',
      'setup.step3': '03 Practice',
      'setup.missingFields': 'Fill in both the account and the password.',
      'rail.collapse': 'Problems',
      'rail.showRail': 'Show the problem list',
      'rail.hideRail': 'Collapse the problem list to give the editor more room',
      'rail.attempts': '{n} submissions',
      'problem.statement': 'Problem',
      'status.done': 'Done',
      'status.partial': 'Partially done',
      'status.attempted': 'Submitted, no score',
      'status.todo': 'Not submitted',
      'editor.commentAt': 'line {line}: {text}',
      'editor.hideTerminal': 'Hide terminal',
      'editor.showTerminal': 'Show terminal',
      'editor.buildRunTitle': 'Compile and run the current code (Ctrl+Enter)',
      'editor.aiCheckTabHint': 'Switch back to solution.c or harness.c to check',
      'editor.submitTitle': 'Submits for real to APTAT and uses one submission attempt',
      'editor.dismissResult': 'Dismiss result',
      'editor.runFailed': 'Run failed',
      'editor.copyFailed': 'Copy failed; select the code and copy it manually.',
      'tutor.resizeHint': 'Resize the tutor panel (drag sideways)',
      'tutor.resizeTitle': 'Drag sideways to resize; double-click to reset',
      'tutor.startTitle': 'Have the tutor outline this problem first',
      'tutor.start': 'Start teaching',
      'tutor.modelTitle': 'Click to switch the model the tutor uses',
      'tutor.rulesTitle': 'Long-lived teaching preferences: saying “remember …” in the chat saves one that applies across problems',
      'tutor.ruleCount': '{n} rules',
      'tutor.loadingModels': 'Reading the model list…',
      'tutor.noModels': 'No models available',
      'tutor.modelSwitched': 'Tutor model switched to {model}',
      'tutor.prevMine': 'Jump to my previous message',
      'tutor.nextMine': 'Jump to my next message',
      'tutor.prevMineLabel': '↑ mine',
      'tutor.nextMineLabel': '↓ mine',
      'tutor.inputHint': 'Enter to send · Shift+Enter for a new line',
      'tutor.clearChatTitle': 'Clear the tutoring chat',
      'tutor.clearChatDesc': 'The AI tutoring conversation for this problem is deleted. Local code and submission history are kept.',
      'tutor.clearChatConfirm': 'Clear',
      'account.title': 'MATU account',
      'account.connected': 'Connected as {account}. Changing the account keeps local code and submission history.',
      'account.clear': 'Clear local credentials',
      'account.clearDesc': 'The APTAT account and password saved on this machine are deleted. Local code is kept. You will need to sign in again next time.',
      'account.clearConfirm': 'Clear',
      'account.connecting': 'Connecting…',
      'account.update': 'Update account',
      'account.cleared': 'Local credentials cleared',
      'account.chip': 'MATU',
      'app.notStarted': 'The plugin did not start',
      'app.initializing': 'Starting the local workbench…',
      'app.syncingDetail': 'Syncing homework, scores and problems from APTAT…',
      'app.pickTask': 'Pick a problem on the left to begin.',
      'app.streamNoResponse': 'The browser received no streaming response',
      'layout.focusExitTitle': 'Leave wide mode and return to the Harness layout (Esc)',
      'layout.focusEnterTitle': 'Wide mode: fill the window and hide the Harness sidebar',
      'layout.focusExit': 'Exit wide',
      'layout.focusEnter': 'Wide',
      'theme.toLight': 'Switch to light',
      'theme.toDark': 'Switch to dark',
      'theme.toLightLabel': 'Switch to the light theme',
      'theme.toDarkLabel': 'Switch to the dark theme',
      'term.exit': 'exit',
      'submit.title': 'Submit to APTAT',
      'submit.desc': 'This is a real submission to UESTC APTAT and uses one attempt. Test locally first.',
      'submit.task': 'Task',
      'submit.codeSize': 'Code size',
      'submit.attempts': 'Attempts',
      'submit.cancel': 'Keep editing',
      'submit.confirm': 'Submit',
      'submit.uploading': 'Uploading code…',
      'submit.judging': 'Waiting for the judge…',
      'submit.wait': 'Usually 2–20 seconds. Keep this page open.',
      'submit.result': 'Result',
      'submit.score': 'pts',
      'submit.full': 'Full score',
      'submit.keepEditing': 'Keep editing',
      'submit.unknown': 'No score returned',
      'tutor.title': 'AI tutor',
      'tutor.subtitle': 'Read · reason · syntax · code',
      'tutor.emptyTitle': 'Slow down and understand the problem first.',
      'tutor.emptyDesc': 'I will give you a function-block outline first. Then we write one block at a time: you pick a block, I explain the syntax and give only that block.',
      'tutor.start': 'Start with this problem',
      'tutor.mode.lesson': 'Step by step',
      'tutor.mode.hint': 'Hints only',
      'tutor.mode.coach': 'Check progress',
      'tutor.mode.debug': 'Debug',
      'tutor.mode.review': 'Review',
      'tutor.placeholder': 'Ask a specific question, or say “continue”…',
      'tutor.send': 'Send',
      'tutor.stop': 'Stop',
      'tutor.clear': 'Clear chat',
      'tutor.thinking': 'Thinking…',
      'tutor.copy': 'Copy code',
      'tutor.copied': 'Copied',
      'tutor.insert': 'Append to editor',
      'tutor.inserted': 'Appended',
      'tutor.model': 'Default model',
      'tutor.noModel': 'No model configured',
      'tutor.error': 'The tutor is unavailable',
      'tutor.you': 'You',
      'tutor.assistant': 'Tutor',
      'common.cancel': 'Cancel',
      'common.retry': 'Retry',
      'common.close': 'Close',
    }

    const STATUS_RANK = { done: 0, partial: 1, attempted: 2, todo: 3 }

    function fmtScore(value) {
      return value === null || value === undefined ? '—' : String(value)
    }

    function fmtDate(value, locale) {
      if (!value) return '—'
      try {
        return new Date(value).toLocaleString(locale || 'en-US', { hour12: false })
      } catch {
        return String(value)
      }
    }

    // Takes `t` because it renders relative time; module-level helpers have no
    // locale seat of their own.
    function recent(value, t) {
      if (!value) return '—'
      const date = new Date(value)
      const delta = Date.now() - date.getTime()
      if (!Number.isFinite(delta)) return fmtDate(value)
      if (delta < 60_000) return t('time.justNow')
      if (delta < 3_600_000) return t('time.minutesAgo').replace('{n}', String(Math.floor(delta / 60_000)))
      if (delta < 86_400_000) return t('time.hoursAgo').replace('{n}', String(Math.floor(delta / 3_600_000)))
      return t('time.daysAgo').replace('{n}', String(Math.floor(delta / 86_400_000)))
    }

    function Icon({ name, size = 16, className = '' }) {
      const paths = {
        refresh: h('path', { d: 'M20 11a8.1 8.1 0 0 0-14.9-4M4 4v5h5M4 13a8.1 8.1 0 0 0 14.9 4M20 20v-5h-5' }),
        spark: h('path', { d: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z' }),
        play: h('path', { d: 'M8 5l11 7-11 7V5z' }),
        upload: h('path', { d: 'M12 16V4m0 0L7 9m5-5l5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2' }),
        terminal: h('path', { d: 'M4 5h16v14H4zM8 9l3 3-3 3m6 0h4' }),
        search: h('path', { d: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm6 -1l4 4' }),
        chevron: h('path', { d: 'M9 6l6 6-6 6' }),
        copy: h('rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }),
        send: h('path', { d: 'M4 12l16-8-5 16-3-6-8-2z' }),
        close: h('path', { d: 'M6 6l12 12M18 6L6 18' }),
        check: h('path', { d: 'M5 12l4 4L19 6' }),
        warning: h('path', { d: 'M12 4l9 16H3L12 4zm0 5v5m0 3v.5' }),
        eye: h('path', { d: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' }),
        clock: h('path', { d: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' }),
        code: h('path', { d: 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 3l-4 18' }),
        arrow: h('path', { d: 'M5 12h14m-6-6l6 6-6 6' }),
        stop: h('rect', { x: 6, y: 6, width: 12, height: 12, rx: 2 }),
        user: h('path', { d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0' }),
        expand: h('path', { d: 'M9 3H3v6M15 3h6v6M9 21H3v-6M21 15v6h-6' }),
        collapse: h('path', { d: 'M3 9h6V3M21 9h-6V3M3 15h6v6M21 15h-6v6' }),
        panel: h('path', { d: 'M4 4h16v16H4zM10 4v16M14 9l-2 3 2 3' }),
        sun: h('path', { d: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' }),
        moon: h('path', { d: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z' }),
      }
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: name === 'send' || name === 'play' ? 'currentColor' : 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: `aptat-icon ${className}`,
        'aria-hidden': true,
      }, paths[name] || paths.code)
    }

    function Mark({ children }) {
      return h('span', { className: 'aptat-mark' }, children)
    }

    function Spinner({ small = false }) {
      return h('span', { className: `aptat-spinner${small ? ' aptat-spinner-sm' : ''}`, 'aria-hidden': true })
    }

    function useT(ctx) {
      const [, force] = React.useReducer((value) => value + 1, 0)
      useEffect(() => {
        const dispose = ctx.locale.subscribe(force)
        return () => { if (typeof dispose === 'function') dispose() }
      }, [ctx])
      return useMemo(() => ctx.locale.bind(NAMESPACE), [ctx])
    }

    const MATH_SYMBOLS = {
      cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓',
      le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠',
      approx: '≈', equiv: '≡', sim: '∼', propto: '∝',
      infty: '∞', partial: '∂', nabla: '∇',
      pi: 'π', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ',
      epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
      lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', rho: 'ρ', sigma: 'σ',
      tau: 'τ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
      Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π',
      Sigma: 'Σ', Phi: 'Φ', Omega: 'Ω',
      sum: '∑', prod: '∏', int: '∫', iint: '∬', oint: '∮',
      to: '→', rightarrow: '→', leftarrow: '←', Rightarrow: '⇒',
      Leftarrow: '⇐', leftrightarrow: '↔', mapsto: '↦',
      in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', supset: '⊃',
      cup: '∪', cap: '∩', forall: '∀', exists: '∃', nexists: '∄',
      ldots: '…', dots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱',
      quad: '\u2003', qquad: '\u2003\u2003', ' ': ' ', ',': '\u2009',
      ';': '\u2005', ':': '\u2005', '!': '', '%': '%', '$': '$',
      '#': '#', '&': '&', '_': '_', '{': '{', '}': '}',
      lbrace: '{', rbrace: '}', lbrack: '[', rbrack: ']',
      langle: '⟨', rangle: '⟩', vert: '|', Vert: '‖',
      angle: '∠', perp: '⊥', parallel: '∥', therefore: '∴',
      because: '∵', degree: '°', circ: '∘',
    }
    const MATH_FUNCTIONS = new Set([
      'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos',
      'arctan', 'sinh', 'cosh', 'tanh', 'log', 'ln', 'lg', 'exp',
      'lim', 'max', 'min', 'det', 'gcd', 'mod',
    ])
    const MATH_OPS = new Set([
      'cdot', 'times', 'div', 'pm', 'mp', 'le', 'leq', 'ge', 'geq',
      'ne', 'neq', 'approx', 'equiv', 'sim', 'propto', 'in', 'notin',
      'subset', 'subseteq', 'supset', 'cup', 'cap', 'to', 'rightarrow',
      'leftarrow', 'Rightarrow', 'Leftarrow', 'leftrightarrow', 'mapsto',
      'perp', 'parallel',
    ])

    function parseMath(source) {
      const src = String(source)
      const n = src.length
      let i = 0

      function readCommand() {
        i += 1
        if (i >= n) return ''
        if (/[A-Za-z]/.test(src[i])) {
          const start = i
          while (i < n && /[A-Za-z]/.test(src[i])) i += 1
          return src.slice(start, i)
        }
        const command = src[i]
        i += 1
        return command
      }

      function skipSpaces() {
        while (i < n && /[ \t]/.test(src[i])) i += 1
      }

      function readRawGroup() {
        skipSpaces()
        if (i >= n) return ''
        if (src[i] !== '{') return src[i++]
        i += 1
        let depth = 1
        let out = ''
        while (i < n && depth > 0) {
          const ch = src[i]
          i += 1
          if (ch === '{') { depth += 1; out += ch }
          else if (ch === '}') { depth -= 1; if (depth > 0) out += ch }
          else out += ch
        }
        return out
      }

      function parseArg() {
        skipSpaces()
        if (i >= n) return []
        if (src[i] === '{') {
          i += 1
          return parseSequence('}')
        }
        if (src[i] === '\\') {
          return commandNodes(readCommand())
        }
        const ch = src[i]
        i += 1
        return [{ type: 'text', value: ch }]
      }

      function attachScript(nodes, kind, arg) {
        const last = nodes[nodes.length - 1]
        if (last && last.type === 'script') {
          if (kind === '^' && !last.sup?.length) last.sup = arg
          else if (kind === '_' && !last.sub?.length) last.sub = arg
          else nodes.push({ type: 'script', base: [last], sup: kind === '^' ? arg : [], sub: kind === '_' ? arg : [] })
          return
        }
        const base = last ? [last] : []
        if (last) nodes.pop()
        nodes.push({ type: 'script', base, sup: kind === '^' ? arg : [], sub: kind === '_' ? arg : [] })
      }

      function commandNodes(command) {
        if (command === 'frac' || command === 'dfrac' || command === 'tfrac') {
          return [{ type: 'frac', num: parseArg(), den: parseArg() }]
        }
        if (command === 'sqrt') {
          skipSpaces()
          let index = null
          if (src[i] === '[') {
            const close = src.indexOf(']', i + 1)
            if (close >= 0) {
              index = src.slice(i + 1, close)
              i = close + 1
            }
          }
          return [{ type: 'sqrt', body: parseArg(), index }]
        }
        if (command === 'text' || command === 'mathrm' || command === 'operatorname' || command === 'mbox' || command === 'textrm') {
          return [{ type: 'text', value: readRawGroup(), plain: true }]
        }
        if (command === 'mathbf' || command === 'boldsymbol') {
          return [{ type: 'styled', style: 'bold', body: parseArg() }]
        }
        if (command === 'mathbb' || command === 'mathcal' || command === 'mathit') {
          return [{ type: 'styled', style: 'italic', body: parseArg() }]
        }
        if (command === 'overline' || command === 'bar') {
          return [{ type: 'overline', body: parseArg() }]
        }
        if (command === 'vec' || command === 'hat' || command === 'widehat') {
          return [{ type: 'accent', accent: command === 'vec' ? '→' : '^', body: parseArg() }]
        }
        if (command === 'left' || command === 'right') {
          skipSpaces()
          if (i < n) {
            const delimiter = src[i]
            i += 1
            if (delimiter === '.') return []
            if (delimiter === '\\') return commandNodes(readCommand())
            return [{ type: 'text', value: delimiter }]
          }
          return []
        }
        if (command === 'begin' || command === 'end') {
          readRawGroup()
          return []
        }
        if (command === 'limits' || command === 'nolimits' || command === 'displaystyle' || command === 'textstyle') return []
        if (command === 'quad') return [{ type: 'text', value: '\u2003' }]
        if (command === 'qquad') return [{ type: 'text', value: '\u2003\u2003' }]
        if (command === '\\') return [{ type: 'break' }]
        if (MATH_FUNCTIONS.has(command)) {
          return [{ type: 'text', value: command, plain: true, function: true }]
        }
        if (Object.prototype.hasOwnProperty.call(MATH_SYMBOLS, command)) {
          const value = MATH_SYMBOLS[command]
          return [{ type: MATH_OPS.has(command) ? 'op' : 'text', value }]
        }
        if (command === 'not') return [{ type: 'text', value: '¬' }]
        return [{ type: 'text', value: command }]
      }

      function parseSequence(stop) {
        const nodes = []
        while (i < n) {
          const ch = src[i]
          if (stop && ch === stop) { i += 1; break }
          if (ch === '\\') {
            nodes.push(...commandNodes(readCommand()))
            continue
          }
          if (ch === '{') {
            i += 1
            nodes.push(...parseSequence('}'))
            continue
          }
          if (ch === '^' || ch === '_') {
            i += 1
            attachScript(nodes, ch, parseArg())
            continue
          }
          if (ch === '&' || ch === '~') {
            i += 1
            nodes.push({ type: 'text', value: ' ' })
            continue
          }
          if (ch === '}') {
            i += 1
            break
          }
          let j = i
          while (j < n && !'\\{}^_&~'.includes(src[j])) j += 1
          if (j === i) j += 1
          nodes.push({ type: 'text', value: src.slice(i, j) })
          i = j
        }
        return nodes
      }

      try {
        return parseSequence(null)
      } catch {
        return [{ type: 'text', value: source }]
      }
    }

    function renderMathText(value, plain) {
      if (plain) return value
      return String(value).split(/([A-Za-z]+)/).map((piece, index) => {
        if (/^[A-Za-z]+$/.test(piece)) {
          return h('span', { key: index, className: 'aptat-math-var' }, piece)
        }
        return h(React.Fragment, { key: index }, piece)
      })
    }

    function MathNode({ node }) {
      if (node.type === 'text') {
        return h('span', { className: node.function ? 'aptat-math-fn' : undefined }, renderMathText(node.value, node.plain))
      }
      if (node.type === 'op') return h('span', { className: 'aptat-math-op' }, node.value)
      if (node.type === 'frac') {
        return h('span', { className: 'aptat-math-frac' },
          h('span', { className: 'aptat-math-num' }, node.num.map((child, index) => h(MathNode, { node: child, key: index }))),
          h('span', { className: 'aptat-math-den' }, node.den.map((child, index) => h(MathNode, { node: child, key: index }))),
        )
      }
      if (node.type === 'sqrt') {
        return h('span', { className: 'aptat-math-sqrt' },
          node.index ? h('sup', { className: 'aptat-math-index' }, renderMathText(node.index, true)) : null,
          h('span', { className: 'aptat-math-radical' }, '√'),
          h('span', { className: 'aptat-math-radicand' }, node.body.map((child, index) => h(MathNode, { node: child, key: index }))),
        )
      }
      if (node.type === 'script') {
        return h('span', { className: 'aptat-math-script' },
          node.base.map((child, index) => h(MathNode, { node: child, key: index })),
          node.sub?.length ? h('sub', null, node.sub.map((child, index) => h(MathNode, { node: child, key: index }))) : null,
          node.sup?.length ? h('sup', null, node.sup.map((child, index) => h(MathNode, { node: child, key: index }))) : null,
        )
      }
      if (node.type === 'overline') {
        return h('span', { className: 'aptat-math-overline' }, node.body.map((child, index) => h(MathNode, { node: child, key: index })))
      }
      if (node.type === 'accent') {
        return h('span', { className: 'aptat-math-accent' },
          h('span', { className: 'aptat-math-accent-mark' }, node.accent),
          h('span', null, node.body.map((child, index) => h(MathNode, { node: child, key: index }))),
        )
      }
      if (node.type === 'styled') {
        return h('span', { className: `aptat-math-${node.style}` }, node.body.map((child, index) => h(MathNode, { node: child, key: index })))
      }
      if (node.type === 'break') return h('br')
      return null
    }

    function MathTex({ source, display = false }) {
      const nodes = useMemo(() => parseMath(source), [source])
      return h('span', { className: `aptat-math${display ? ' is-block' : ''}` },
        nodes.map((node, index) => h(MathNode, { node, key: index })),
      )
    }

    function inlineNodes(text) {
      const pieces = String(text).split(/(\*\*[^*]+\*\*|`[^`\n]+`|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\\([\s\S]*?\\\))/g)
      return pieces.map((piece, index) => {
        if (piece.startsWith('$$') && piece.endsWith('$$')) {
          return h(MathTex, { key: index, source: piece.slice(2, -2), display: true })
        }
        if (piece.startsWith('\\[') && piece.endsWith('\\]')) {
          return h(MathTex, { key: index, source: piece.slice(2, -2), display: true })
        }
        if (piece.startsWith('$') && piece.endsWith('$')) {
          return h(MathTex, { key: index, source: piece.slice(1, -1) })
        }
        if (piece.startsWith('\\(') && piece.endsWith('\\)')) {
          return h(MathTex, { key: index, source: piece.slice(2, -2) })
        }
        if (piece.startsWith('**') && piece.endsWith('**')) {
          return h('strong', { key: index }, inlineNodes(piece.slice(2, -2)))
        }
        if (piece.startsWith('`') && piece.endsWith('`')) {
          return h('code', { key: index, className: 'aptat-inline-code' }, piece.slice(1, -1))
        }
        return h(React.Fragment, { key: index }, piece)
      })
    }

    function splitTableRow(raw) {
      const source = String(raw || '').trim()
      if (!source.includes('|')) return null
      let text = source
      if (text.startsWith('|')) text = text.slice(1)
      if (text.endsWith('|')) text = text.slice(0, -1)
      const cells = []
      let current = ''
      let inCode = false
      let inMath = false
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i]
        if (ch === '\\' && text[i + 1] === '|') {
          current += '|'
          i += 1
        } else if (ch === '`') {
          inCode = !inCode
          current += ch
        } else if (ch === '$' && !inCode) {
          inMath = !inMath
          current += ch
        } else if (ch === '|' && !inCode && !inMath) {
          cells.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
      cells.push(current.trim())
      return cells
    }

    function isTableSeparator(cells) {
      return Array.isArray(cells) && cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))
    }

    function tableAlignments(cells) {
      return cells.map((cell) => {
        const value = cell.trim()
        if (value.startsWith(':') && value.endsWith(':')) return 'center'
        if (value.endsWith(':')) return 'right'
        return 'left'
      })
    }

    function Markdown({ text, onCopy, t }) {
      const blocks = useMemo(() => {
        const source = String(text || '')
        const out = []
        const fence = /```([^\n`]*)\n([\s\S]*?)```/g
        let last = 0
        let match
        while ((match = fence.exec(source))) {
          if (match.index > last) out.push({ type: 'text', text: source.slice(last, match.index) })
          out.push({ type: 'code', lang: (match[1] || '').trim(), text: match[2] })
          last = match.index + match[0].length
        }
        if (last < source.length) out.push({ type: 'text', text: source.slice(last) })
        return out
      }, [text])

      const renderText = (value, blockIndex) => {
        const lines = String(value).replace(/\r\n?/g, '\n').split('\n')
        const nodes = []
        let list = null
        let paragraph = []
        const flushParagraph = () => {
          if (!paragraph.length) return
          nodes.push(h('p', { key: `p${nodes.length}` }, inlineNodes(paragraph.join(' '))))
          paragraph = []
        }
        const flushList = () => {
          if (!list) return
          nodes.push(h(list.ordered ? 'ol' : 'ul', { key: `l${nodes.length}` }, list.items.map((item, index) => h('li', { key: index }, inlineNodes(item)))))
          list = null
        }
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
          const raw = lines[lineIndex]
          const line = raw.trimEnd()
          if (!line.trim()) {
            flushParagraph(); flushList(); continue
          }
          const heading = line.match(/^(#{1,4})\s+(.*)$/)
          if (heading) {
            flushParagraph(); flushList()
            const level = Math.min(4, heading[1].length)
            nodes.push(h(`h${level + 2}`, { key: `h${nodes.length}` }, inlineNodes(heading[2])))
            continue
          }
          const mathOnly = /^\s*(?:\$\$[\s\S]*\$\$|\\\[[\s\S]*\\\]|\$[^$]+\$|\\\([\s\S]*\\\))\s*$/.test(line)
          if (mathOnly) {
            flushParagraph(); flushList()
            nodes.push(h('div', { key: `m${nodes.length}`, className: 'aptat-math-line' }, inlineNodes(line.trim())))
            continue
          }
          const tableHeader = splitTableRow(line)
          const tableSeparator = tableHeader ? splitTableRow(lines[lineIndex + 1] || '') : null
          if (tableHeader && tableHeader.length > 0 && isTableSeparator(tableSeparator) && tableSeparator.length === tableHeader.length) {
            flushParagraph(); flushList()
            const aligns = tableAlignments(tableSeparator)
            const rows = []
            let rowIndex = lineIndex + 2
            while (rowIndex < lines.length && lines[rowIndex].trim()) {
              const row = splitTableRow(lines[rowIndex])
              if (!row) break
              rows.push(tableHeader.map((_, cellIndex) => row[cellIndex] || ''))
              rowIndex += 1
            }
            nodes.push(h('div', { key: `tbl${nodes.length}`, className: 'aptat-md-table-wrap' },
              h('table', { className: 'aptat-md-table' },
                h('thead', null,
                  h('tr', null, tableHeader.map((cell, cellIndex) => h('th', {
                    key: cellIndex,
                    className: `is-${aligns[cellIndex]}`,
                  }, inlineNodes(cell)))),
                ),
                rows.length ? h('tbody', null,
                  rows.map((row, rowNumber) => h('tr', { key: rowNumber },
                    row.map((cell, cellIndex) => h('td', {
                      key: cellIndex,
                      className: `is-${aligns[cellIndex]}`,
                    }, inlineNodes(cell))),
                  )),
                ) : null,
              ),
            ))
            lineIndex = rowIndex - 1
            continue
          }
          const bullet = line.match(/^\s*[-*]\s+(.*)$/)
          const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/)
          if (bullet || ordered) {
            flushParagraph()
            const isOrdered = Boolean(ordered)
            if (!list || list.ordered !== isOrdered) { flushList(); list = { ordered: isOrdered, items: [] } }
            list.items.push((bullet || ordered)[1])
            continue
          }
          flushList()
          paragraph.push(line.trim())
        }
        flushParagraph(); flushList()
        return h('div', { key: `t${blockIndex}`, className: 'aptat-md-text' }, nodes)
      }

      return h('div', { className: 'aptat-markdown' }, blocks.map((block, index) => {
        if (block.type === 'text') return renderText(block.text, index)
        return h('div', { key: `c${index}`, className: 'aptat-code-block' },
          h('div', { className: 'aptat-code-block-head' },
            h('span', null, block.lang || 'code'),
            onCopy ? h('button', {
              type: 'button', className: 'aptat-mini-button', onClick: () => onCopy(block.text, 'copy'),
            }, t('tutor.copy')) : null,
            onCopy ? h('button', {
              type: 'button', className: 'aptat-mini-button', onClick: () => onCopy(block.text, 'insert'),
            }, t('tutor.insert')) : null,
          ),
          h('pre', null, h('code', null, block.text)),
        )
      }))
    }

    let bootPromise = null
    let bootData = null

    async function getBootstrap(force = false) {
      if (force) bootPromise = null
      if (!bootPromise) {
        bootPromise = fetch(`${API_ROOT}/bootstrap`, {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        }).then(async (response) => {
          if (!response.ok) throw new Error(`无法初始化插件（HTTP ${response.status}）`)
          bootData = await response.json()
          return bootData
        }).catch((error) => { bootPromise = null; throw error })
      }
      return bootPromise
    }

    async function api(path, options = {}, retried = false) {
      const boot = bootData || await getBootstrap()
      const headers = {
        Accept: 'application/json',
        'x-aptat-token': boot.token,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      }
      const response = await fetch(`${API_ROOT}${path}`, {
        credentials: 'same-origin',
        ...options,
        headers,
      })
      if (response.status === 403 && !retried) {
        await getBootstrap(true)
        return api(path, options, true)
      }
      let payload = null
      try { payload = await response.json() } catch { payload = null }
      if (!response.ok || payload?.ok === false) {
        const error = new Error(payload?.error || `请求失败（HTTP ${response.status}）`)
        error.code = payload?.code
        error.status = response.status
        throw error
      }
      return payload
    }

    function countLines(text) {
      return text ? text.split('\n').length : 0
    }

    function extractCommentQuestions(code) {
      const source = String(code || '')
      const questions = []
      const re = /\/\/[^\n]*|\/\*[\s\S]*?\*\//g
      let match
      while ((match = re.exec(source))) {
        const text = match[0]
          .replace(/^\/\/\s*/, '')
          .replace(/^\/\*+\s*/, '')
          .replace(/\s*\*\/$/, '')
          .replace(/^\s*\*\s?/gm, '')
          .trim()
        if (!text) continue
        const isQuestion = /^\s*(?:Q|q|问|问题)\s*[:：]/.test(text)
          || /^\s*[?？]/.test(text)
          || /^\s*请问/.test(text)
        if (isQuestion) {
          const line = source.slice(0, match.index).split('\n').length
          questions.push({ line, text: text.slice(0, 280) })
        }
      }
      return questions.slice(-8)
    }

    const EDITOR_OPEN_PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" }
    const EDITOR_CLOSE_PAIRS = { ')': '(', ']': '[', '}': '{', '"': '"', "'": "'" }

    const C_KEYWORDS = new Set([
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
      'break', 'continue', 'return', 'goto', 'sizeof',
    ])
    const C_TYPES = new Set([
      'int', 'char', 'float', 'double', 'void', 'short', 'long', 'unsigned',
      'signed', 'const', 'static', 'struct', 'typedef', 'enum', 'union',
      'extern', 'volatile', 'register', 'auto', 'inline', 'size_t', 'bool',
      'FILE', 'wchar_t', 'int8_t', 'int16_t', 'int32_t', 'int64_t',
      'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t',
    ])
    const C_CONSTANTS = new Set(['NULL', 'EOF', 'true', 'false', 'stdin', 'stdout', 'stderr'])

    function tokenizeC(source) {
      if (!source) return []
      if (source.length > 160000) return [{ type: 'plain', text: source }]
      const tokens = []
      const push = (type, text) => { if (text) tokens.push({ type, text }) }
      const n = source.length
      let i = 0
      while (i < n) {
        const ch = source[i]
        if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n' || ch === '\f') {
          let j = i + 1
          while (j < n && /[ \t\r\n\f]/.test(source[j])) j += 1
          push('plain', source.slice(i, j))
          i = j
          continue
        }
        if (ch === '#') {
          const lineStart = source.lastIndexOf('\n', i - 1) + 1
          if (/^[ \t]*$/.test(source.slice(lineStart, i))) {
            let j = source.indexOf('\n', i)
            if (j < 0) j = n
            push('preproc', source.slice(i, j))
            i = j
            continue
          }
        }
        if (ch === '/' && source[i + 1] === '/') {
          let j = source.indexOf('\n', i)
          if (j < 0) j = n
          push('comment', source.slice(i, j))
          i = j
          continue
        }
        if (ch === '/' && source[i + 1] === '*') {
          let j = source.indexOf('*/', i + 2)
          j = j < 0 ? n : j + 2
          push('comment', source.slice(i, j))
          i = j
          continue
        }
        if (ch === '"' || ch === "'") {
          const quote = ch
          let j = i + 1
          while (j < n) {
            if (source[j] === '\\') { j += 2; continue }
            if (source[j] === quote) { j += 1; break }
            if (source[j] === '\n') break
            j += 1
          }
          push('string', source.slice(i, j))
          i = j
          continue
        }
        if (/[0-9]/.test(ch)) {
          const match = source.slice(i).match(/^(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)[uUlLfF]*/)
          if (match) {
            push('number', match[0])
            i += match[0].length
            continue
          }
        }
        if (/[A-Za-z_]/.test(ch)) {
          const match = source.slice(i).match(/^[A-Za-z_]\w*/)
          const word = match[0]
          i += word.length
          let look = i
          while (look < n && /[ \t]/.test(source[look])) look += 1
          const isCall = source[look] === '('
          if (C_KEYWORDS.has(word)) push('keyword', word)
          else if (C_TYPES.has(word)) push('type', word)
          else if (C_CONSTANTS.has(word)) push('constant', word)
          else if (isCall) push('function', word)
          else push('plain', word)
          continue
        }
        if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
          let j = i + 1
          while (j < n && /[+\-*/%=<>!&|^~?:]/.test(source[j])) j += 1
          push('operator', source.slice(i, j))
          i = j
          continue
        }
        push('plain', ch)
        i += 1
      }
      return tokens
    }

    function looksFunctionOnly(task) {
      if (!task?.description) return false
      const functionShape = /函数内部不能|不要.{0,8}main|只需.{0,8}函数|保存为|实现指定函数|函数原型|要求实现.{0,12}函数/i.test(task.description)
      const needsMain = /编写\s*main\s*函数[，,]\s*在|在\s*main\s*函数里|从键盘|输入格式|输入[:：]/i.test(task.description)
      return functionShape && !needsMain
    }

    function mergeTaskState(state, task) {
      if (!state?.cache || !task) return state
      return {
        ...state,
        cache: {
          ...state.cache,
          tasks: state.cache.tasks.map((item) => item.id === task.id ? { ...item, ...task } : item),
        },
      }
    }

    function AppIcon({ size = 22, active = false }) {
      // Same mark as icon.svg: braces around a check on a 36-unit grid.
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 36 36',
        fill: 'none',
        'aria-hidden': true,
        className: `aptat-app-icon${active ? ' is-active' : ''}`,
      },
        h('g', { stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
          h('path', { d: 'M14 9.5Q10 9.5 10 13.5V15.5Q10 18 8 18Q10 18 10 20.5V22.5Q10 26.5 14 26.5' }),
          h('path', { d: 'M22 9.5Q26 9.5 26 13.5V15.5Q26 18 28 18Q26 18 26 20.5V22.5Q26 26.5 22 26.5' }),
        ),
        h('path', {
          d: 'M15.6 17.6l2.1 2.2 3.9-4.4',
          stroke: 'currentColor',
          strokeWidth: 2.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          opacity: 0.85,
        }),
      )
    }

    function SetupScreen({ t, onConnected, busy, error }) {
      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')
      const [remember, setRemember] = useState(true)
      const [showPassword, setShowPassword] = useState(false)
      const [localError, setLocalError] = useState('')
      const formRef = useRef(null)

      const submit = async (event) => {
        event.preventDefault()
        if (!username.trim() || !password) {
          setLocalError(t('setup.missingFields'))
          return
        }
        setLocalError('')
        try {
          await onConnected({ username: username.trim(), password, remember })
          setPassword('')
        } catch (err) {
          setLocalError(err.message)
        }
      }

      return h('div', { className: 'aptat-setup-wrap' },
        h('div', { className: 'aptat-setup' },
          h('div', { className: 'aptat-setup-copy' },
            h('div', { className: 'aptat-eyebrow' }, t('setup.eyebrow')),
            h('h1', null, t('setup.title')),
            h('p', { className: 'aptat-lede' }, t('setup.desc')),
            h('div', { className: 'aptat-setup-diagram', 'aria-hidden': true },
              h('span', null, t('setup.step1')),
              h('i', null),
              h('span', null, t('setup.step2')),
              h('i', null),
              h('span', null, t('setup.step3')),
            ),
            h('p', { className: 'aptat-privacy' }, t('setup.note')),
          ),
          h('form', { className: 'aptat-setup-card', onSubmit: submit, ref: formRef },
            h('div', { className: 'aptat-field' },
              h('label', { htmlFor: 'aptat-user' }, t('setup.account')),
              h('input', {
                id: 'aptat-user', autoComplete: 'username', value: username,
                placeholder: t('setup.accountHint'),
                onChange: (event) => setUsername(event.target.value),
              }),
            ),
            h('div', { className: 'aptat-field' },
              h('label', { htmlFor: 'aptat-pass' }, t('setup.password')),
              h('div', { className: 'aptat-password-row' },
                h('input', {
                  id: 'aptat-pass', type: showPassword ? 'text' : 'password',
                  autoComplete: 'current-password', value: password,
                  onChange: (event) => setPassword(event.target.value),
                }),
                h('button', { type: 'button', className: 'aptat-ghost-button', onClick: () => setShowPassword((value) => !value) }, showPassword ? t('ui.hide') : t('ui.show')),
              ),
            ),
            h('label', { className: 'aptat-check' },
              h('input', { type: 'checkbox', checked: remember, onChange: (event) => setRemember(event.target.checked) }),
              h('span', null, t('setup.remember')),
            ),
            (localError || error) ? h('div', { className: 'aptat-error', role: 'alert' }, localError || error) : null,
            h('button', { type: 'submit', className: 'aptat-primary-button aptat-wide', disabled: busy },
              busy ? h(Spinner, { small: true }) : null,
              busy ? t('setup.connecting') : t('setup.connect'),
            ),
            h('p', { className: 'aptat-fineprint' }, t('setup.privacy')),
          ),
        ),
      )
    }

    function TaskRail({ t, cache, selectedId, onSelect, progress, onCollapse }) {
      const [query, setQuery] = useState('')
      const [onlyOpen, setOnlyOpen] = useState(false)
      const [collapsed, setCollapsed] = useState({})
      const groups = cache?.groups || []
      const tasks = cache?.tasks || []
      const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks])
      const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()
        return new Set(tasks.filter((task) => {
          if (onlyOpen && task.status === 'done') return false
          if (!needle) return true
          return `${task.id} ${task.name} ${task.groupName}`.toLowerCase().includes(needle)
        }).map((task) => task.id))
      }, [tasks, query, onlyOpen])

      const groupDone = (group) => group.tasks.filter((id) => taskMap.get(id)?.status === 'done').length

      return h('aside', { className: 'aptat-rail', 'aria-label': t('app.title') },
        h('div', { className: 'aptat-rail-head' },
          h('div', null,
            h('h2', null, t('app.progress')),
          ),
          h('div', { className: 'aptat-rail-head-actions' },
            h('div', { className: 'aptat-progress-number' },
              h('strong', null, progress.done),
              h('span', null, `/${progress.total}`),
            ),
            h('button', {
              type: 'button',
              className: 'aptat-icon-button aptat-rail-collapse',
              onClick: onCollapse,
              title: t('rail.hideRail'),
              'aria-label': t('rail.collapse'),
            }, h(Icon, { name: 'chevron', size: 14, className: 'aptat-chevron-left' })),
          ),
        ),
        h('div', { className: 'aptat-progress-track', 'aria-hidden': true },
          h('span', { style: { width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` } }),
        ),
        h('div', { className: 'aptat-rail-tools' },
          h('label', { className: 'aptat-search' },
            h(Icon, { name: 'search', size: 15 }),
            h('input', {
              value: query, onChange: (event) => setQuery(event.target.value),
              placeholder: t('rail.search'), 'aria-label': t('rail.search'),
            }),
          ),
          h('label', { className: 'aptat-check aptat-check-compact' },
            h('input', { type: 'checkbox', checked: onlyOpen, onChange: (event) => setOnlyOpen(event.target.checked) }),
            h('span', null, t('rail.filter')),
          ),
        ),
        h('div', { className: 'aptat-group-list' },
          groups.map((group, groupIndex) => {
            const ids = group.tasks.filter((id) => filtered.has(id))
            const isCollapsed = collapsed[group.id]
            if (!ids.length && (query.trim() || onlyOpen)) return null
            return h('section', { className: 'aptat-group', key: group.id },
              h('button', {
                type: 'button', className: 'aptat-group-head',
                onClick: () => setCollapsed((value) => ({ ...value, [group.id]: !value[group.id] })),
                'aria-expanded': !isCollapsed,
              },
                h('span', { className: 'aptat-group-index' }, String(groupIndex + 1).padStart(2, '0')),
                h('span', { className: 'aptat-group-name' }, group.name),
                h('span', { className: 'aptat-group-count' }, `${groupDone(group)}/${group.tasks.length}`),
                h(Icon, { name: 'chevron', size: 14, className: isCollapsed ? 'aptat-chevron-closed' : 'aptat-chevron-open' }),
              ),
              !isCollapsed ? h('div', { className: 'aptat-task-list' },
                ids.length ? ids.map((id) => {
                  const task = taskMap.get(id)
                  if (!task) return null
                  const active = task.id === selectedId
                  return h('button', {
                    type: 'button',
                    key: task.id,
                    className: `aptat-task-row${active ? ' is-active' : ''} aptat-status-${task.status}`,
                    onClick: () => onSelect(task.id),
                    'aria-current': active ? 'true' : undefined,
                  },
                    h('span', { className: 'aptat-task-number' }, String(task.id).padStart(2, '0')),
                    h('span', { className: 'aptat-task-copy' },
                      h('span', { className: 'aptat-task-name' }, task.name),
                      h('span', { className: 'aptat-task-sub' },
                        task.status === 'done' ? `✓ ${fmtScore(task.lastScore)}` : task.status === 'partial' ? `${fmtScore(task.lastScore)} · ${t('app.remaining')}` : task.attempts ? `${t('rail.attempts').replace('{n}', String(task.attempts))}` : t('rail.noScore'),
                        looksFunctionOnly(task) ? h('em', null, t('rail.functionHint')) : null,
                      ),
                    ),
                    h('span', { className: `aptat-status-dot aptat-dot-${task.status}`, 'aria-label': t(`status.${task.status}`) }),
                  )
                }) : h('div', { className: 'aptat-rail-empty' }, t('rail.empty')),
              ) : null,
            )
          }),
        ),
      )
    }

    function ProblemPanel({ t, task, cache, onHarness, onHistory, history, historyBusy, collapsed, onToggle }) {
      const [tab, setTab] = useState('statement')
      useEffect(() => { setTab('statement') }, [task?.id])
      const functionOnly = looksFunctionOnly(task)
      if (!task) return null
      return h('section', { className: `aptat-problem${collapsed ? ' is-collapsed' : ''}` },
        h('div', { className: 'aptat-problem-paper', 'aria-hidden': true }),
        h('div', { className: 'aptat-problem-head' },
          h('div', { className: 'aptat-problem-kicker' },
            h('span', { className: 'aptat-muted' }, task.groupName),
          ),
          h('div', { className: 'aptat-problem-title-row' },
            h('h1', null, task.name),
            h('button', { type: 'button', className: 'aptat-icon-button', onClick: onToggle, 'aria-label': collapsed ? t('problem.expand') : t('problem.collapse') },
              h(Icon, { name: 'chevron', size: 16, className: collapsed ? 'aptat-chevron-open' : 'aptat-chevron-down' }),
            ),
          ),
          h('div', { className: 'aptat-meta-row' },
            h('span', null, `${t('problem.meta.id')} ${task.id}`),
            h('span', null, `${t('problem.meta.points')} ${task.points || '—'}`),
            h('span', null, `${t('problem.meta.attempts')} ${task.attempts || 0}/${task.maxSubmissions || '—'}`),
            h('span', { className: task.status === 'done' ? 'is-good' : task.status === 'partial' ? 'is-warn' : '' }, `${t('problem.meta.score')} ${fmtScore(task.lastScore)}`),
          ),
          functionOnly ? h('div', { className: 'aptat-problem-actions' },
            h('button', { type: 'button', className: 'aptat-secondary-button', onClick: onHarness }, h(Icon, { name: 'code', size: 15 }), t('problem.aiHarness')),
          ) : null,
        ),
        !collapsed ? h('div', { className: 'aptat-problem-body' },
          h('div', { className: 'aptat-problem-tabs' },
            h('button', { type: 'button', className: tab === 'statement' ? 'is-active' : '', onClick: () => setTab('statement') }, t('problem.statement')),
            h('button', { type: 'button', className: tab === 'history' ? 'is-active' : '', onClick: () => { setTab('history'); onHistory() } }, t('problem.history')),
          ),
          tab === 'statement'
            ? h('div', { className: 'aptat-statement' },
              functionOnly ? h('div', { className: 'aptat-notice' }, h(Icon, { name: 'warning', size: 16 }), h('span', null, t('problem.functionWarn'))) : null,
              task.description
                ? h('pre', { className: 'aptat-problem-text' }, task.description)
                : h('div', { className: 'aptat-empty-inline' }, t('problem.empty')),
              task.attachments?.length ? h('div', { className: 'aptat-attachments' },
                task.attachments.map((file) => h('a', { key: file.href, href: file.href, target: '_blank', rel: 'noreferrer' }, file.text || file.href)),
              ) : null,
            )
            : h('div', { className: 'aptat-history' },
              historyBusy ? h('div', { className: 'aptat-empty-inline' }, h(Spinner, { small: true }), t('problem.loadingHistory'))
                : history?.rows?.length
                  ? h('div', { className: 'aptat-history-list' },
                    history.rows.slice().sort((a, b) => b.assignmentId - a.assignmentId).map((row) => h('div', { key: row.assignmentId, className: 'aptat-history-row' },
                      h('span', { className: 'aptat-history-score' }, fmtScore(row.score)),
                      h('span', null, row.time),
                      h('span', { className: 'aptat-muted' }, row.status),
                    )),
                    history.latestDetail?.reason ? h('pre', { className: 'aptat-deduction' }, history.latestDetail.reason) : null,
                  )
                  : h('div', { className: 'aptat-empty-inline' }, t('problem.noHistory')),
            ),
        ) : null,
      )
    }

    function CodeEditor({ t, code, setCode, tab, setTab, harness, setHarness, input, setInput, saveState, onBuild, onRun, onBuildRun, onSubmit, busy, onSave, task, result, onCheckProgress, aiBusy, terminalOpen, onToggleTerminal, onDismissResult }) {
      const textareaRef = useRef(null)
      const lineRef = useRef(null)
      const [cursor, setCursor] = useState({ line: 1, column: 1 })
      const highlightRef = useRef(null)
      const activeValue = tab === 'solution' ? code : tab === 'harness' ? harness : input
      const setActive = tab === 'solution' ? setCode : tab === 'harness' ? setHarness : setInput
      const tokens = useMemo(() => (tab === 'input' ? [] : tokenizeC(activeValue)), [activeValue, tab])
      const lines = useMemo(() => Array.from({ length: Math.max(1, countLines(activeValue)) }, (_, index) => index + 1), [activeValue])
      const commentQuestions = useMemo(() => (tab === 'input' ? [] : extractCommentQuestions(activeValue)), [activeValue, tab])

      const setCursorAt = (value, position) => {
        const before = String(value || '').slice(0, position)
        const lastBreak = before.lastIndexOf('\n')
        setCursor({
          line: before.split('\n').length,
          column: position - lastBreak,
        })
      }

      const updateCursor = (event) => {
        const node = event.currentTarget
        setCursorAt(node.value, node.selectionStart || 0)
      }

      const triggerCheck = () => {
        if (aiBusy || !onCheckProgress || tab === 'input') return
        onCheckProgress({
          line: cursor.line,
          column: cursor.column,
          tab,
          comments: commentQuestions,
        })
      }

      const handleKeyDown = (event) => {
        if (event.isComposing || event.nativeEvent?.isComposing) return
        const node = event.currentTarget
        const start = node.selectionStart
        const end = node.selectionEnd
        const hasSelection = start !== end
        const selected = activeValue.slice(start, end)
        const before = activeValue.slice(0, start)
        const after = activeValue.slice(end)
        const noMods = !event.ctrlKey && !event.metaKey && !event.altKey

        const apply = (value, caretStart, caretEnd = caretStart) => {
          setActive(value)
          setCursorAt(value, caretStart)
          requestAnimationFrame(() => {
            node.selectionStart = caretStart
            node.selectionEnd = caretEnd
            syncScroll()
          })
        }

        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Enter') {
          event.preventDefault()
          triggerCheck()
          return
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault()
          onBuildRun()
          return
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault()
          onSave()
          return
        }
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
          event.preventDefault()
          const lineStart = activeValue.lastIndexOf('\n', start - 1) + 1
          let lineEnd = activeValue.indexOf('\n', end)
          if (lineEnd < 0) lineEnd = activeValue.length
          const block = activeValue.slice(lineStart, lineEnd)
          const lines = block.split('\n')
          const nonBlank = lines.filter((line) => line.trim())
          const allCommented = nonBlank.length > 0 && nonBlank.every((line) => /^\s*\/\//.test(line))
          let delta = 0
          const changed = lines.map((line) => {
            if (!line.trim()) return line
            if (allCommented) {
              const next = line.replace(/^(\s*)\/\/ ?/, '$1')
              delta += next.length - line.length
              return next
            }
            const next = /^\s*\/\//.test(line) ? line : line.replace(/^(\s*)/, '$1// ')
            delta += next.length - line.length
            return next
          })
          const nextValue = activeValue.slice(0, lineStart) + changed.join('\n') + activeValue.slice(lineEnd)
          const nextStart = Math.max(lineStart, start + (allCommented ? -3 : 3))
          const nextEnd = Math.max(nextStart, end + delta)
          apply(nextValue, nextStart, nextEnd)
          return
        }

        if (event.key === 'Tab') {
          event.preventDefault()
          if (!hasSelection) {
            if (event.shiftKey) {
              const lineStart = activeValue.lastIndexOf('\n', start - 1) + 1
              const head = activeValue.slice(lineStart)
              const indent = (head.match(/^[ \t]{1,4}/) || [''])[0]
              if (indent) {
                const next = activeValue.slice(0, lineStart) + head.slice(indent.length) + activeValue.slice(lineStart + head.length)
                const caret = Math.max(lineStart, start - indent.length)
                apply(next, caret)
              }
              return
            }
            apply(`${before}    ${after}`, start + 4)
            return
          }

          const lineStart = activeValue.lastIndexOf('\n', start - 1) + 1
          let lineEnd = activeValue.indexOf('\n', end)
          if (lineEnd < 0) lineEnd = activeValue.length
          const block = activeValue.slice(lineStart, lineEnd)
          const lines = block.split('\n')
          let delta = 0
          let firstDelta = 0
          const changed = lines.map((line, index) => {
            if (event.shiftKey) {
              const indent = (line.match(/^[ \t]{1,4}/) || [''])[0]
              delta -= indent.length
              if (index === 0) firstDelta = -indent.length
              return line.slice(indent.length)
            }
            delta += 4
            if (index === 0) firstDelta = 4
            return `    ${line}`
          })
          const nextValue = activeValue.slice(0, lineStart) + changed.join('\n') + activeValue.slice(lineEnd)
          const nextStart = Math.max(lineStart, start + firstDelta)
          const nextEnd = Math.max(nextStart, end + delta)
          apply(nextValue, nextStart, nextEnd)
          return
        }

        if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
          event.preventDefault()
          const lineStart = before.lastIndexOf('\n') + 1
          const currentLine = before.slice(lineStart)
          const baseIndent = (currentLine.match(/^[ \t]*/) || [''])[0]
          const previousChar = activeValue[start - 1]
          const nextChar = activeValue[end]
          let inserted = `\n${baseIndent}`
          let caret = start + inserted.length
          if (previousChar === '{' && nextChar === '}') {
            inserted = `\n${baseIndent}    \n${baseIndent}`
            caret = start + 1 + baseIndent.length + 4
          } else if (previousChar === '{') {
            inserted = `\n${baseIndent}    `
            caret = start + inserted.length
          } else if (nextChar === '}' && currentLine.trim() !== '') {
            inserted = `\n${baseIndent}    \n${baseIndent}`
            caret = start + 1 + baseIndent.length + 4
          }
          apply(before + inserted + after, caret)
          return
        }

        if (event.key === 'Backspace' && noMods && !hasSelection) {
          const previousChar = activeValue[start - 1]
          const nextChar = activeValue[start]
          if (previousChar && EDITOR_OPEN_PAIRS[previousChar] === nextChar) {
            event.preventDefault()
            apply(activeValue.slice(0, start - 1) + activeValue.slice(start + 1), start - 1)
            return
          }
          const lineStart = before.lastIndexOf('\n') + 1
          const lineHead = before.slice(lineStart)
          if (/^[ \t]+$/.test(lineHead)) {
            const remove = lineHead.endsWith('    ') ? 4 : (lineHead.endsWith('\t') ? 1 : 0)
            if (remove) {
              event.preventDefault()
              apply(activeValue.slice(0, start - remove) + activeValue.slice(start), start - remove)
              return
            }
          }
        }

        if (event.key === 'Delete' && noMods && !hasSelection) {
          const previousChar = activeValue[start - 1]
          const nextChar = activeValue[start]
          if (previousChar && EDITOR_OPEN_PAIRS[previousChar] === nextChar) {
            event.preventDefault()
            apply(activeValue.slice(0, start - 1) + activeValue.slice(start + 1), start - 1)
            return
          }
          const lineStart = before.lastIndexOf('\n') + 1
          const lineHead = before.slice(lineStart)
          if (/^[ \t]*$/.test(lineHead) && activeValue.slice(start, start + 4) === '    ') {
            event.preventDefault()
            apply(activeValue.slice(0, start) + activeValue.slice(start + 4), start)
            return
          }
        }

        if (noMods && Object.prototype.hasOwnProperty.call(EDITOR_OPEN_PAIRS, event.key)) {
          event.preventDefault()
          const close = EDITOR_OPEN_PAIRS[event.key]
          if (hasSelection) {
            const next = `${before}${event.key}${selected}${close}${after}`
            apply(next, start + 1, start + 1 + selected.length)
            return
          }
          if (event.key === '"' || event.key === "'") {
            if (activeValue[start] === event.key) {
              apply(activeValue, start + 1)
              return
            }
          }
          const next = `${before}${event.key}${close}${after}`
          apply(next, start + 1)
          return
        }

        if (noMods && Object.prototype.hasOwnProperty.call(EDITOR_CLOSE_PAIRS, event.key)) {
          if (!hasSelection && activeValue[start] === event.key) {
            event.preventDefault()
            apply(activeValue, start + 1)
            return
          }
          if (event.key === '}' && !hasSelection) {
            const lineStart = before.lastIndexOf('\n') + 1
            const lineHead = before.slice(lineStart)
            if (/^[ \t]+$/.test(lineHead) && lineHead.endsWith('    ')) {
              event.preventDefault()
              apply(activeValue.slice(0, start - 4) + '}' + after, start - 3)
            }
          }
        }
      }

      const syncScroll = () => {
        if (!textareaRef.current) return
        const { scrollTop, scrollLeft } = textareaRef.current
        if (lineRef.current) lineRef.current.scrollTop = scrollTop
        if (highlightRef.current) {
          highlightRef.current.scrollTop = scrollTop
          highlightRef.current.scrollLeft = scrollLeft
        }
      }

      React.useLayoutEffect(() => {
        syncScroll()
      }, [activeValue, tab])

      const codeTypography = {
        fontFamily: '"Cascadia Code", "Cascadia Mono", "Fira Code", Consolas, monospace',
        fontSize: '12.5px',
        lineHeight: 1.65,
        tabSize: 4,
        whiteSpace: 'pre',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        fontVariantLigatures: 'none',
        letterSpacing: 0,
        padding: '13px 16px 26px 6px',
      }

      useEffect(() => {
        if (tab === 'input') return
        setCursor({ line: 1, column: 1 })
        if (textareaRef.current) {
          textareaRef.current.selectionStart = 0
          textareaRef.current.selectionEnd = 0
        }
        if (textareaRef.current) {
          textareaRef.current.scrollTop = 0
          textareaRef.current.scrollLeft = 0
        }
        if (lineRef.current) lineRef.current.scrollTop = 0
        if (highlightRef.current) {
          highlightRef.current.scrollTop = 0
          highlightRef.current.scrollLeft = 0
        }
      }, [tab])

      return h('section', { className: 'aptat-editor' },
        h('div', { className: 'aptat-editor-head' },
          h('div', { className: 'aptat-file-tabs', role: 'tablist' },
            h('button', {
              type: 'button', role: 'tab', 'aria-selected': tab === 'solution',
              className: tab === 'solution' ? 'is-active' : '',
              onClick: () => setTab('solution'),
            }, h('span', { className: 'aptat-file-dot' }), 'solution.c'),
            h('button', {
              type: 'button', role: 'tab', 'aria-selected': tab === 'harness',
              className: tab === 'harness' ? 'is-active' : '',
              onClick: () => setTab('harness'),
            }, 'harness.c'),
            h('button', {
              type: 'button', role: 'tab', 'aria-selected': tab === 'input',
              className: tab === 'input' ? 'is-active' : '',
              onClick: () => setTab('input'),
            }, 'stdin'),
          ),
          h('div', { className: 'aptat-editor-status' },
            h('span', { className: 'aptat-lang-chip' }, 'C'),
            h('span', { className: `aptat-save-state is-${saveState}` }, saveState === 'saving' ? t('code.saving') : saveState === 'saved' ? t('code.saved') : t('code.unsaved')),
            h('span', { className: 'aptat-cursor-position' }, `${t('code.cursor')} ${cursor.line}, Col ${cursor.column}`),
            commentQuestions.length ? h('span', { className: 'aptat-comment-flag', title: commentQuestions.map((item) => t('editor.commentAt').replace('{line}', String(item.line)).replace('{text}', item.text)).join('\n') }, `${commentQuestions.length} ${t('code.aiCheckBadge')}`) : null,
            h('span', null, `${countLines(activeValue)} ${t('code.lines')}`),
            h('button', {
              type: 'button',
              className: 'aptat-mini-button aptat-terminal-toggle',
              onClick: onToggleTerminal,
              title: terminalOpen ? t('editor.hideTerminal') : t('editor.showTerminal'),
            }, terminalOpen ? t('editor.hideTerminal') : t('editor.showTerminal')),
          ),
        ),
        tab === 'input' ? h('div', { className: 'aptat-stdin-panel' },
          h('div', { className: 'aptat-stdin-head' },
            h('strong', null, t('code.tab.input')),
            h('span', { className: 'aptat-muted' }, 'stdin'),
          ),
          h('textarea', {
            className: 'aptat-stdin-area',
            value: input,
            placeholder: t('code.stdinPlaceholder'),
            spellCheck: false,
            onChange: (event) => setInput(event.target.value),
          }),
        ) : h('div', { className: 'aptat-code-wrap' },
          h('div', { className: 'aptat-line-numbers', ref: lineRef, 'aria-hidden': true },
            lines.map((line) => h('span', { key: line }, line)),
          ),
          h('div', { className: 'aptat-code-layer' },
            h('pre', { className: 'aptat-highlight', ref: highlightRef, 'aria-hidden': true, style: { ...codeTypography, paddingBottom: '96px', paddingRight: '40px' } },
              tokens.map((token, index) => h('span', {
                key: `${index}-${token.type}`,
                className: `aptat-tok-${token.type}`,
              }, token.text)),
            ),
            h('textarea', {
              ref: textareaRef,
              className: 'aptat-code-area',
              value: activeValue,
              spellCheck: false,
              autoCapitalize: 'off',
              autoCorrect: 'off',
              wrap: 'off',
              'aria-label': tab === 'solution' ? t('code.tab.solution') : t('code.tab.harness'),
              placeholder: tab === 'solution' ? t('code.placeholder') : 'int main(void) { return 0; }',
              onChange: (event) => { setActive(event.target.value); updateCursor(event) },
              onKeyDown: handleKeyDown,
              onScroll: syncScroll,
              onSelect: (event) => { syncScroll(); updateCursor(event) },
              onKeyUp: (event) => { syncScroll(); updateCursor(event) },
              onClick: (event) => { syncScroll(); updateCursor(event) },
              style: codeTypography,
            }),
          ),
          tab === 'harness' ? h('div', { className: 'aptat-harness-note' }, h(Icon, { name: 'warning', size: 14 }), t('code.harnessNote')) : null,
        ),
        h('div', { className: 'aptat-editor-actions' },
          h('div', { className: 'aptat-action-group' },
            h('button', { type: 'button', className: 'aptat-primary-button', onClick: onBuildRun, disabled: busy, title: t('editor.buildRunTitle') }, busy ? h(Spinner, { small: true }) : h(Icon, { name: 'play', size: 15 }), t('code.buildRun')),
            h('button', {
              type: 'button',
              className: 'aptat-ai-check-button',
              onClick: triggerCheck,
              disabled: aiBusy || tab === 'input',
              title: tab === 'input' ? t('editor.aiCheckTabHint') : t('code.aiCheckTitle'),
            },
              aiBusy ? h(Spinner, { small: true }) : h(Icon, { name: 'spark', size: 15 }),
              aiBusy ? t('code.aiCheckBusy') : t('code.aiCheck'),
              commentQuestions.length ? h('span', { className: 'aptat-ai-check-badge' }, commentQuestions.length) : null,
            ),
          ),
          h('div', { className: 'aptat-action-group' },
            h('button', { type: 'button', className: 'aptat-ghost-button', onClick: onSave }, t('code.save')),
            h('button', { type: 'button', className: 'aptat-submit-button', onClick: onSubmit, disabled: busy, title: t('editor.submitTitle') }, h(Icon, { name: 'upload', size: 15 }), t('code.submit')),
          ),
        ),
        result ? h('div', { className: `aptat-result ${result.score === 100 ? 'is-full' : 'is-partial'}` },
          h('div', { className: 'aptat-result-stamp' },
            h('strong', null, result.score ?? '?'),
            h('span', null, t('submit.score')),
          ),
          h('div', { className: 'aptat-result-copy' },
            h('div', { className: 'aptat-result-title' }, result.score === 100 ? t('submit.full') : `${t('submit.result')} · ${result.status || ''}`),
            h('p', null, result.reason || t('submit.unknown')),
            h('small', null, `${recent(result.submittedAt, t)} · #${result.assignmentId || '—'}`),
          ),
          h('button', { type: 'button', className: 'aptat-ghost-button', onClick: () => { setTab('solution'); onDismissResult() } }, t('submit.keepEditing')),
          h('button', {
            type: 'button',
            className: 'aptat-icon-button',
            onClick: onDismissResult,
            title: t('editor.dismissResult'),
            'aria-label': t('editor.dismissResult'),
          }, h(Icon, { name: 'close', size: 15 })),
        ) : null,
      )
    }

    function SmartTerminal({ t, taskId, autoRun, runToken, stdinText }) {
      const [output, setOutput] = useState('')
      const [running, setRunning] = useState(false)
      const [failed, setFailed] = useState(false)
      const [stage, setStage] = useState('')
      const screenRef = useRef(null)
      const streamRef = useRef(null)
      const sessionRef = useRef(null)
      const startedFor = useRef('')

      useEffect(() => {
        const node = screenRef.current
        if (node) node.scrollTop = node.scrollHeight
      }, [output])

      const start = useCallback(async () => {
        if (!taskId) return
        const previous = sessionRef.current
        sessionRef.current = null
        try { streamRef.current?.close() } catch { /* ignore */ }
        streamRef.current = null
        if (previous) {
          try { await api('/run/stop', { method: 'POST', body: JSON.stringify({ id: previous }) }) } catch { /* ignore */ }
        }
        setOutput('')
        setFailed(false)
        setStage('compiling')
        setRunning(true)
        try {
          const data = await api('/run/start', { method: 'POST', body: JSON.stringify({ taskId, stdin: stdinText }) })
          sessionRef.current = data.id
          const boot = bootData || await getBootstrap()
          const response = await fetch(`${API_ROOT}/run/stream?id=${encodeURIComponent(data.id)}`, {
            credentials: 'same-origin',
            headers: { 'x-aptat-token': boot.token, Accept: 'text/event-stream' },
          })
          if (!response.ok || !response.body) throw new Error(`连接失败（HTTP ${response.status}）`)
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          streamRef.current = { close: () => { try { reader.cancel() } catch { /* ignore */ } } }
          ;(async () => {
            try {
              while (true) {
                const { value, done } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                let idx
                while ((idx = buffer.indexOf('\n\n')) >= 0) {
                  const event = buffer.slice(0, idx)
                  buffer = buffer.slice(idx + 2)
                  const line = event.split('\n').find((l) => l.startsWith('data:'))
                  if (!line) continue
                  let payload
                  try { payload = JSON.parse(line.slice(5).trim()) } catch { continue }
                  if (payload.type === 'output') setOutput((prev) => prev + payload.text)
                  else if (payload.type === 'phase') {
                    setStage(payload.phase === 'running' ? 'running' : 'compiling')
                    if (payload.phase === 'compile-failed') {
                      setFailed(true)
                      setStage('compile-failed')
                    }
                  } else if (payload.type === 'exit') {
                    setRunning(false)
                    if (payload.stage === 'compile' && payload.exitCode !== 0) {
                      setFailed(true)
                      setStage('compile-failed')
                      // The Host streams compiler output separately; a compile that
                      // produced no output at all means the compiler never ran.
                      const detail = String(payload.error || '').trim()
                      setOutput((prev) => {
                        if (!prev.trim()) {
                          return `${t('run.noCompiler')}${detail ? `\n[${detail}]` : ''}`
                        }
                        return prev
                      })
                    } else if (payload.stage === 'run' && payload.exitCode !== 0) {
                      setOutput((prev) => prev + `\n[${t('run.exitCode')} ${payload.exitCode}]`)
                    }
                  }
                }
              }
            } catch { /* stream closed */ }
          })()
        } catch (err) {
          setOutput(String(err.message || t('editor.runFailed')))
          setRunning(false)
        }
      }, [taskId, stdinText])

      const stop = useCallback(async () => {
        const session = sessionRef.current
        sessionRef.current = null
        try { streamRef.current?.close() } catch { /* ignore */ }
        streamRef.current = null
        if (session) {
          try { await api('/run/stop', { method: 'POST', body: JSON.stringify({ id: session }) }) } catch { /* ignore */ }
        }
        setRunning(false)
        setOutput((prev) => `${prev}${prev.trim() ? '\n' : ''}${t('run.stopped')}`)
      }, [t])

      useEffect(() => {
        if (!autoRun || !taskId) return
        const token = `${taskId}:${runToken}`
        if (startedFor.current === token) return
        startedFor.current = token
        void start()
      }, [autoRun, taskId, runToken, start])
      return h('section', { className: 'aptat-terminal' },
        h('div', { className: 'aptat-terminal-head' },
          h('div', { className: 'aptat-terminal-title' },
            h('strong', null, t('run.output')),
            running
              ? h('span', { className: 'aptat-term-state is-busy' }, t(stage === 'running' ? 'run.running' : 'run.compiling'))
              : failed
                ? h('span', { className: 'aptat-term-state is-error' }, t('run.failed'))
                : null,
          ),
          running
            ? h('button', {
              type: 'button',
              className: 'aptat-mini-button',
              onClick: stop,
            }, t('run.stop'))
            : null,
        ),
        h('div', { className: 'aptat-terminal-body aptat-smart-term', ref: screenRef },
          h('pre', { className: `aptat-terminal-output${failed ? ' is-error' : ''}` }, output || t('run.noOutput')),
        ),
      )
    }


    function Terminal({ t, lines, busy, input, setInput, command, setCommand, onCommand, onClear, onBuildRun }) {
      const outputRef = useRef(null)
      useEffect(() => {
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
      }, [lines, busy])
      return h('section', { className: 'aptat-terminal' },
        h('div', { className: 'aptat-terminal-head' },
          h('div', { className: 'aptat-terminal-title' },
            h(Icon, { name: 'terminal', size: 15 }),
            h('strong', null, t('term.title')),
            h('span', { className: `aptat-term-state${busy ? ' is-busy' : ''}` }, busy ? t('term.busy') : t('term.ready')),
          ),
          h('div', { className: 'aptat-terminal-tools' },
            h('button', { type: 'button', className: 'aptat-mini-button', onClick: onClear }, t('term.clear')),
          ),
        ),
        h('div', { className: 'aptat-terminal-body' },          h('pre', { className: 'aptat-terminal-output', ref: outputRef },
            lines.length ? lines.map((line, index) => h('div', {
              key: index,
              className: `aptat-term-line${line.kind ? ` is-${line.kind}` : ''}`,
            }, line.text)) : h('span', { className: 'aptat-term-empty' }, t('term.empty')),
            busy ? h('div', { className: 'aptat-term-cursor' }, '▌') : null,
          ),
          h('div', { className: 'aptat-terminal-input-row' },
            h('span', { className: 'aptat-prompt' }, '$'),
            h('input', {
              value: command,
              onChange: (event) => setCommand(event.target.value),
              onKeyDown: (event) => {
                if (event.key === 'Enter') { event.preventDefault(); onCommand() }
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); onBuildRun() }
              },
              placeholder: t('term.command'),
              spellCheck: false,
              'aria-label': t('term.command'),
            }),
            h('button', { type: 'button', className: 'aptat-mini-button', onClick: onCommand, disabled: busy }, t('term.runCommand')),
          ),
        ),
      )
    }

    function Tutor({ t, task, open, onClose, model, chat, setChat, onSend, streaming, onStop, onClear, onCopyCode, onInsertCode, mode, setMode, onStart, error, ruleCount, width, onWidthChange, onModelChange, onNotify }) {
      const [draft, setDraft] = useState('')
      const [resizing, setResizing] = useState(false)
      const [modelPickerOpen, setModelPickerOpen] = useState(false)
      const [modelOptions, setModelOptions] = useState(null)
      const [modelError, setModelError] = useState('')
      const [modelOptionsBusy, setModelOptionsBusy] = useState(false)
      const [modelSaving, setModelSaving] = useState(false)
      const modelPickerRef = useRef(null)
      const bodyRef = useRef(null)
      const inputRef = useRef(null)
      useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      }, [chat, streaming])
      const submit = (event) => {
        event?.preventDefault()
        const value = draft.trim()
        if (!value || streaming) return
        setDraft('')
        onSend(value)
      }
      const modes = [
        ['lesson', t('tutor.mode.lesson')],
        ['hint', t('tutor.mode.hint')],
        ['coach', t('tutor.mode.coach')],
        ['debug', t('tutor.mode.debug')],
        ['review', t('tutor.mode.review')],
      ]

      const clampWidth = (value) => Math.min(760, Math.max(300, Math.round(value)))
      const startResize = (event) => {
        if (event.button !== 0) return
        event.preventDefault()
        const startX = event.clientX
        const startWidth = width || 382
        const previousUserSelect = document.body.style.userSelect
        document.body.style.userSelect = 'none'
        setResizing(true)
        const move = (moveEvent) => {
          onWidthChange(clampWidth(startWidth + (startX - moveEvent.clientX)))
        }
        const stop = () => {
          document.body.style.userSelect = previousUserSelect
          setResizing(false)
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', stop)
          window.removeEventListener('pointercancel', stop)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', stop)
        window.addEventListener('pointercancel', stop)
      }
      const nudgeWidth = (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        const step = event.shiftKey ? 48 : 16
        const delta = event.key === 'ArrowLeft' ? step : -step
        onWidthChange(clampWidth((width || 382) + delta))
      }

      const loadModelOptions = async () => {
        setModelError('')
        setModelOptionsBusy(true)
        setModelPickerOpen(true)
        try {
          const data = await api('/model-options')
          setModelOptions(data.options || [])
        } catch (error) {
          setModelError(error.message)
        } finally {
          setModelOptionsBusy(false)
        }
      }

      const saveTutorModel = async (provider, model) => {
        setModelSaving(true)
        try {
          await api('/tutor-model', { method: 'POST', body: JSON.stringify({ provider, model }) })
          setModelPickerOpen(false)
          onModelChange?.({ provider, model })
        } catch (error) {
          if (onNotify) onNotify(error.message, 'error')
        } finally {
          setModelSaving(false)
        }
      }

      useEffect(() => {
        if (!modelPickerOpen) return undefined
        const handler = (event) => {
          if (modelPickerRef.current && !modelPickerRef.current.contains(event.target)) {
            setModelPickerOpen(false)
          }
        }
        window.addEventListener('pointerdown', handler)
        return () => window.removeEventListener('pointerdown', handler)
      }, [modelPickerOpen])

      const jumpToUserMessage = (direction) => {
        const container = bodyRef.current
        if (!container) return
        const items = Array.from(container.querySelectorAll('.aptat-message.is-user'))
        if (!items.length) return
        const containerTop = container.getBoundingClientRect().top
        const positions = items.map((item) => item.getBoundingClientRect().top - containerTop + container.scrollTop)
        const current = container.scrollTop
        let target = direction > 0
          ? positions.find((position) => position > current + 30)
          : [...positions].reverse().find((position) => position < current - 30)
        if (target === undefined) {
          target = direction > 0 ? positions[0] : positions[positions.length - 1]
        }
        container.scrollTo({ top: Math.max(0, target - 12), behavior: 'smooth' })
        const element = items[positions.indexOf(target)]
        if (element) {
          element.classList.remove('is-flash')
          void element.offsetWidth
          element.classList.add('is-flash')
          window.setTimeout(() => element.classList.remove('is-flash'), 1400)
        }
      }

      return h('aside', { className: `aptat-tutor${open ? ' is-open' : ''}${resizing ? ' is-resizing' : ''}`, 'aria-label': t('tutor.title') },
        h('div', {
          className: 'aptat-tutor-resizer',
          onPointerDown: startResize,
          onKeyDown: nudgeWidth,
          onDoubleClick: () => onWidthChange(382),
          role: 'separator',
          'aria-orientation': 'vertical',
          'aria-label': t('tutor.resizeHint'),
          tabIndex: 0,
          title: t('tutor.resizeTitle'),
        }, h('span', { className: 'aptat-resizer-grip', 'aria-hidden': true })),
        h('div', { className: 'aptat-tutor-head' },
          h('div', { className: 'aptat-tutor-title' },
            h('div', { className: 'aptat-tutor-mark' }, h(Icon, { name: 'spark', size: 17 })),
            h('div', null,
              h('strong', null, t('tutor.title')),
              h('span', null, t('tutor.subtitle')),
            ),
          ),
          h('div', { className: 'aptat-tutor-head-actions' },
            h('button', { type: 'button', className: 'aptat-icon-button aptat-tutor-start', onClick: onStart, disabled: !task || streaming, title: t('tutor.startTitle'), 'aria-label': t('tutor.start') }, h(Icon, { name: 'spark', size: 15 })),
            h('button', { type: 'button', className: 'aptat-icon-button', onClick: onClear, title: t('tutor.clear'), 'aria-label': t('tutor.clear') }, h(Icon, { name: 'refresh', size: 15 })),
            h('button', { type: 'button', className: 'aptat-icon-button aptat-tutor-close', onClick: onClose, title: t('app.close'), 'aria-label': t('app.close') }, h(Icon, { name: 'close', size: 16 })),
          ),
        ),
        h('div', { className: 'aptat-tutor-model', ref: modelPickerRef },
          h('span', { className: 'aptat-model-dot' }),
          h('button', {
            type: 'button',
            className: 'aptat-model-picker',
            onClick: () => { modelPickerOpen ? setModelPickerOpen(false) : loadModelOptions() },
            disabled: modelSaving,
            title: t('tutor.modelTitle'),
          },
            h('span', null, model ? `${t('tutor.model')} · ${model}` : t('tutor.noModel')),
            h(Icon, { name: 'chevron', size: 12, className: modelPickerOpen ? 'aptat-chevron-down' : 'aptat-chevron-open' }),
          ),
          h('span', { className: 'aptat-rule-count', title: t('tutor.rulesTitle') }, t('tutor.ruleCount').replace('{n}', String(ruleCount || 0))),
          modelPickerOpen ? h('div', { className: 'aptat-model-dropdown' },
            modelError
              ? h('div', { className: 'aptat-model-error' },
                h(Icon, { name: 'warning', size: 12 }),
                h('span', null, modelError),
                h('button', { type: 'button', className: 'aptat-mini-button', onClick: loadModelOptions }, t('common.retry')))
              : modelOptionsBusy ? h('div', { className: 'aptat-model-dropdown-loading' }, h(Spinner, { small: true }), t('tutor.loadingModels'))
              : (modelOptions || []).map((group) => h('div', { className: 'aptat-model-group', key: group.provider || group.displayName },
                h('div', { className: 'aptat-model-group-name' }, group.displayName || group.provider || t('ui.unknown')),
                group.models?.length
                  ? group.models.map((m) => h('button', {
                    type: 'button',
                    className: `aptat-model-option${model?.endsWith(` / ${m.id}`) ? ' is-current' : ''}`,
                    key: m.id,
                    onClick: () => saveTutorModel(group.provider, m.id),
                    disabled: modelSaving,
                  }, m.name || m.id))
                  : h('div', { className: 'aptat-model-group-empty' }, t('tutor.noModels')),
              )),
          ) : null,
        ),
        h('div', { className: 'aptat-tutor-modes', role: 'group', 'aria-label': t('tutor.title') },
          modes.map(([key, label]) => h('button', {
            type: 'button', key, className: mode === key ? 'is-active' : '',
            onClick: () => setMode(key),
          }, label)),
        ),
        h('div', { className: 'aptat-chat-nav' },
          h('button', {
            type: 'button', className: 'aptat-mini-button', onClick: () => jumpToUserMessage(-1),
            title: t('tutor.prevMine'),
          }, t('tutor.prevMineLabel')),
          h('button', {
            type: 'button', className: 'aptat-mini-button', onClick: () => jumpToUserMessage(1),
            title: t('tutor.nextMine'),
          }, t('tutor.nextMineLabel')),
        ),
        h('div', { className: 'aptat-chat', ref: bodyRef },
          !chat.length ? h('div', { className: 'aptat-chat-empty' },
            h('div', { className: 'aptat-chat-empty-mark' }, h(Icon, { name: 'spark', size: 26 })),
            h('h3', null, t('tutor.emptyTitle')),
            h('p', null, t('tutor.emptyDesc')),
            h('button', { type: 'button', className: 'aptat-primary-button', onClick: onStart, disabled: !task }, t('tutor.start')),
          ) : null,
          chat.map((message, index) => h('div', {
            key: `${index}-${message.at || ''}`,
            className: `aptat-message ${message.role === 'user' ? 'is-user' : 'is-assistant'}${message.streaming ? ' is-streaming' : ''}`,
          },
            h('div', { className: 'aptat-message-label' }, message.role === 'user' ? t('tutor.you') : t('tutor.assistant')),
            message.role === 'user'
              ? h('div', { className: 'aptat-message-text' }, message.content)
              : message.content
                ? h(Markdown, { text: message.content, t, onCopy: onCopyCode })
                : h('div', { className: 'aptat-thinking' }, h(Spinner, { small: true }), t('tutor.thinking')),
            message.streaming ? h('span', { className: 'aptat-stream-cursor' }, '▌') : null,
          )),
          error ? h('div', { className: 'aptat-error' }, error) : null,
        ),
        h('form', { className: 'aptat-composer', onSubmit: submit },
          h('textarea', {
            ref: inputRef,
            value: draft,
            onChange: (event) => setDraft(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(event) }
            },
            placeholder: t('tutor.placeholder'),
            rows: 3,
            disabled: !task,
          }),
          h('div', { className: 'aptat-composer-foot' },
            h('span', { className: 'aptat-fineprint' }, t('tutor.inputHint')),
            streaming
              ? h('button', { type: 'button', className: 'aptat-ghost-button', onClick: onStop }, h(Icon, { name: 'stop', size: 14 }), t('tutor.stop'))
              : h('button', { type: 'submit', className: 'aptat-send-button', disabled: !draft.trim() || !task }, h(Icon, { name: 'send', size: 15 }), t('tutor.send')),
          ),
        ),
      )
    }

    function AccountDialog({ t, account, busy, error, onClose, onConnect, onForget }) {
      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')
      const [remember, setRemember] = useState(true)
      const [localError, setLocalError] = useState('')
      const ref = useRef(null)
      useEffect(() => {
        const handler = (event) => { if (event.key === 'Escape' && !busy) onClose() }
        window.addEventListener('keydown', handler)
        if (ref.current) ref.current.focus()
        return () => window.removeEventListener('keydown', handler)
      }, [busy, onClose])
      const submit = (event) => {
        event.preventDefault()
        if (!username.trim() || !password) {
          setLocalError(t('setup.missingFields'))
          return
        }
        setLocalError('')
        onConnect({ username: username.trim(), password, remember }).catch((err) => setLocalError(err.message))
      }
      return h('div', { className: 'aptat-modal-backdrop', role: 'presentation' },
        h('div', { className: 'aptat-modal aptat-account-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'aptat-account-title', tabIndex: -1, ref },
          h('div', { className: 'aptat-modal-head' },
            h('div', null,
              h('div', { className: 'aptat-eyebrow' }, 'ACCOUNT / 04'),
              h('h2', { id: 'aptat-account-title' }, t('account.title')),
            ),
            h('button', { type: 'button', className: 'aptat-icon-button', onClick: onClose, disabled: busy, 'aria-label': t('app.close') }, h(Icon, { name: 'close', size: 17 })),
          ),
          h('p', { className: 'aptat-modal-lede' }, t('account.connected').replace('{account}', account || '—')),
          h('form', { onSubmit: submit },
            h('div', { className: 'aptat-field' },
              h('label', { htmlFor: 'aptat-account-user' }, t('setup.account')),
              h('input', { id: 'aptat-account-user', autoComplete: 'username', value: username, onChange: (event) => setUsername(event.target.value), placeholder: t('setup.accountHint') }),
            ),
            h('div', { className: 'aptat-field' },
              h('label', { htmlFor: 'aptat-account-pass' }, t('setup.password')),
              h('input', { id: 'aptat-account-pass', type: 'password', autoComplete: 'current-password', value: password, onChange: (event) => setPassword(event.target.value) }),
            ),
            h('label', { className: 'aptat-check' },
              h('input', { type: 'checkbox', checked: remember, onChange: (event) => setRemember(event.target.checked) }),
              h('span', null, t('setup.remember')),
            ),
            (localError || error) ? h('div', { className: 'aptat-error' }, localError || error) : null,
            h('div', { className: 'aptat-modal-actions' },
              h('button', { type: 'button', className: 'aptat-ghost-button', onClick: onForget, disabled: busy }, t('account.clear')),
              h('button', { type: 'button', className: 'aptat-ghost-button', onClick: onClose, disabled: busy }, t('common.cancel')),
              h('button', { type: 'submit', className: 'aptat-primary-button', disabled: busy }, busy ? h(Spinner, { small: true }) : null, busy ? t('account.connecting') : t('account.update')),
            ),
          ),
        ),
      )
    }

    function SubmitDialog({ t, task, code, busy, phase, onCancel, onConfirm, error }) {      const ref = useRef(null)
      useEffect(() => {
        const handler = (event) => { if (event.key === 'Escape' && !busy) onCancel() }
        window.addEventListener('keydown', handler)
        if (ref.current) ref.current.focus()
        return () => window.removeEventListener('keydown', handler)
      }, [busy, onCancel])
      return h('div', { className: 'aptat-modal-backdrop', role: 'presentation' },
        h('div', { className: 'aptat-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'aptat-submit-title', tabIndex: -1, ref },
          h('div', { className: 'aptat-modal-head' },
            h('div', null,
              h('div', { className: 'aptat-eyebrow' }, 'SUBMIT / 03'),
              h('h2', { id: 'aptat-submit-title' }, t('submit.title')),
            ),
            h('button', { type: 'button', className: 'aptat-icon-button', onClick: onCancel, 'aria-label': t('app.close') }, h(Icon, { name: 'close', size: 17 })),
          ),
          h('p', { className: 'aptat-modal-lede' }, t('submit.desc')),
          h('div', { className: 'aptat-submit-summary' },
            h('div', null, h('span', null, t('submit.task')), h('strong', null, task?.name || '—')),
            h('div', null, h('span', null, t('submit.codeSize')), h('strong', null, `${code.length} chars`)),
            h('div', null, h('span', null, t('submit.attempts')), h('strong', null, `${task?.attempts || 0}/${task?.maxSubmissions || '—'}`)),
          ),
          busy ? h('div', { className: 'aptat-submit-progress' },
            h(Spinner, null),
            h('div', null, h('strong', null, phase || t('submit.uploading')), h('p', null, t('submit.wait'))),
          ) : null,
          error ? h('div', { className: 'aptat-error' }, error) : null,
          h('div', { className: 'aptat-modal-actions' },
            h('button', { type: 'button', className: 'aptat-ghost-button', onClick: onCancel, disabled: busy }, t('submit.cancel')),
            h('button', { type: 'button', className: 'aptat-submit-button', onClick: onConfirm, disabled: busy }, busy ? h(Spinner, { small: true }) : h(Icon, { name: 'upload', size: 16 }), busy ? phase || t('submit.judging') : t('submit.confirm')),
          ),
        ),
      )
    }

    function ConfirmDialog({ t, title, desc, confirmLabel, busy, onCancel, onConfirm }) {
      const ref = useRef(null)
      useEffect(() => {
        const handler = (event) => { if (event.key === 'Escape' && !busy) onCancel() }
        window.addEventListener('keydown', handler)
        if (ref.current) ref.current.focus()
        return () => window.removeEventListener('keydown', handler)
      }, [busy, onCancel])
      return h('div', { className: 'aptat-modal-backdrop', role: 'presentation' },
        h('div', { className: 'aptat-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'aptat-confirm-title', tabIndex: -1, ref },
          h('div', { className: 'aptat-modal-head' },
            h('div', null, h('h2', { id: 'aptat-confirm-title' }, title)),
            h('button', { type: 'button', className: 'aptat-icon-button', onClick: onCancel, 'aria-label': t('common.close') }, h(Icon, { name: 'close', size: 17 })),
          ),
          h('p', { className: 'aptat-modal-lede' }, desc),
          h('div', { className: 'aptat-modal-actions' },
            h('button', { type: 'button', className: 'aptat-ghost-button', onClick: onCancel, disabled: busy }, t('submit.cancel')),
            h('button', { type: 'button', className: 'aptat-danger-button', onClick: onConfirm, disabled: busy }, busy ? h(Spinner, { small: true }) : confirmLabel),
          ),
        ),
      )
    }

    function Workbench({ ctx }) {
      const t = useT(ctx)
      const themeService = ctx.get('theme')
      const [themePreference, setThemePreference] = useState(() => {
        try { return themeService?.getTheme?.()?.preference || 'system' } catch { return 'system' }
      })
      const [state, setState] = useState(null)
      const [bootError, setBootError] = useState('')
      const [selectedId, setSelectedId] = useState(() => {
        const saved = Number(localStorage.getItem('aptat.selectedTask'))
        return Number.isFinite(saved) && saved > 0 ? saved : null
      })
      const [project, setProject] = useState(null)
      const [code, setCode] = useState('')
      const [harness, setHarness] = useState('')
      const [input, setInput] = useState('')
      const [tab, setTab] = useState('solution')
      const [saveState, setSaveState] = useState('saved')
      const [chat, setChat] = useState([])
      const [chatError, setChatError] = useState('')
      const [streaming, setStreaming] = useState(false)
      const [mode, setMode] = useState('lesson')
      const [terminal, setTerminal] = useState([])
      const [termBusy, setTermBusy] = useState(false)
      const [command, setCommand] = useState('')
      const [terminalOpen, setTerminalOpen] = useState(false)
      const [ptyRunToken, setPtyRunToken] = useState(0)
      const [runStdin, setRunStdin] = useState('')
      const [tutorOpen, setTutorOpen] = useState(true)
      const [tutorWidth, setTutorWidth] = useState(() => {
        try {
          const stored = Number(localStorage.getItem('aptat.tutorWidth'))
          return Number.isFinite(stored) && stored >= 300 && stored <= 760 ? stored : 382
        } catch {
          return 382
        }
      })
      const [railOpen, setRailOpen] = useState(() => {
        try { return localStorage.getItem('aptat.railOpen') !== '0' } catch { return true }
      })
      const [problemCollapsed, setProblemCollapsed] = useState(false)
      const [focusMode, setFocusMode] = useState(() => {
        try { return localStorage.getItem('aptat.focusMode') === '1' } catch { return false }
      })
      const appRef = useRef(null)
      const fullscreenOwnedRef = useRef(false)
      const [history, setHistory] = useState(null)
      const [historyBusy, setHistoryBusy] = useState(false)
      const [showSubmit, setShowSubmit] = useState(false)
      const [submitting, setSubmitting] = useState(false)
      const [submitPhase, setSubmitPhase] = useState('')
      const [submitError, setSubmitError] = useState('')
      const [submitResult, setSubmitResult] = useState(null)
      const [accountOpen, setAccountOpen] = useState(false)
      const [accountBusy, setAccountBusy] = useState(false)
      const [accountError, setAccountError] = useState('')
      const [confirmAsk, setConfirmAsk] = useState(null)
      const [syncing, setSyncing] = useState(false)
      const [syncMessage, setSyncMessage] = useState('')
      const [toast, setToast] = useState(null)
      const [notice, setNotice] = useState(null)
      const [noticeDismissed, setNoticeDismissed] = useState('')
      const abortRef = useRef(null)
      const pollingRef = useRef(null)
      const autoRefreshRef = useRef(false)
      const latestRef = useRef({ selectedId, code, harness, input })
      const dirtyRef = useRef(false)
      const skipAutosave = useRef(true)

      latestRef.current = { selectedId, code, harness, input }

      const toastTimer = useRef(null)
      const notify = useCallback((message, kind = 'info') => {
        if (kind === 'error') {
          // Diagnostics like a connect timeout are long and actionable; a 3.2s
          // toast is not enough to read them, so keep them until dismissed.
          setNotice({ message, kind })
          return
        }
        setToast({ message, kind })
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(null), 3200)
      }, [])

      const toggleFocus = useCallback(() => {
        const next = !focusMode
        setFocusMode(next)
        if (next) {
          const element = appRef.current
          if (element?.requestFullscreen) {
            element.requestFullscreen().catch(() => { /* fixed full-viewport mode still works */ })
          }
        } else if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {})
        }
      }, [focusMode])

      useEffect(() => {
        try { localStorage.setItem('aptat.focusMode', focusMode ? '1' : '0') } catch { /* storage may be unavailable */ }
      }, [focusMode])

      useEffect(() => {
        try { localStorage.setItem('aptat.railOpen', railOpen ? '1' : '0') } catch { /* storage may be unavailable */ }
      }, [railOpen])

      useEffect(() => {
        try { localStorage.setItem('aptat.tutorWidth', String(tutorWidth)) } catch { /* storage may be unavailable */ }
      }, [tutorWidth])

      useEffect(() => {
        const sync = () => {
          try { setThemePreference(themeService?.getTheme?.()?.preference || 'system') } catch { /* ignore */ }
        }
        sync()
        let dispose
        try { dispose = ctx.on('theme/change', sync) } catch { dispose = undefined }
        return () => { if (typeof dispose === 'function') dispose() }
      }, [ctx, themeService])

      const toggleTheme = useCallback(() => {
        if (!themeService?.setTheme) return
        const current = (() => { try { return themeService.getTheme() } catch { return null } })()
        const isDark = current?.active?.colorScheme === 'dark'
        const next = isDark ? 'light' : 'dark'
        try { themeService.setTheme(next) } catch { /* theme service refused */ }
      }, [themeService])

      useEffect(() => {
        if (!focusMode) return undefined
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = previous }
      }, [focusMode])

      useEffect(() => {
        if (!focusMode) return undefined
        const handler = (event) => {
          if (event.key !== 'Escape') return
          if (showSubmit || accountOpen) return
          setFocusMode(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
      }, [focusMode, showSubmit, accountOpen])

      useEffect(() => {
        const handler = () => {
          if (document.fullscreenElement === appRef.current) {
            fullscreenOwnedRef.current = true
            return
          }
          if (fullscreenOwnedRef.current && !document.fullscreenElement) {
            fullscreenOwnedRef.current = false
            setFocusMode(false)
          }
        }
        document.addEventListener('fullscreenchange', handler)
        return () => document.removeEventListener('fullscreenchange', handler)
      }, [])

      useEffect(() => {
        if (focusMode) return
        if (document.fullscreenElement && document.fullscreenElement === appRef.current) {
          document.exitFullscreen?.().catch(() => {})
        }
      }, [focusMode])

      useEffect(() => {
        let active = true
        getBootstrap().then((data) => {
          if (!active) return
          setState(data.state)
          if (data.state.cache) {
            const saved = Number(localStorage.getItem('aptat.selectedTask'))
            const exists = data.state.cache.tasks.some((task) => task.id === saved)
            if (!exists) {
              const next = data.state.cache.tasks.find((task) => task.status !== 'done') || data.state.cache.tasks[0]
              if (next) setSelectedId(next.id)
            }
          }
        }).catch((error) => { if (active) setBootError(error.message) })
        return () => { active = false }
      }, [])

      const cache = state?.cache || null
      const tasks = cache?.tasks || []
      const selectedTask = tasks.find((task) => task.id === selectedId) || null
      const progress = useMemo(() => ({
        done: tasks.filter((task) => task.status === 'done').length,
        total: tasks.length,
      }), [tasks])

      useEffect(() => {
        if (selectedId) localStorage.setItem('aptat.selectedTask', String(selectedId))
      }, [selectedId])

      const pollState = useCallback(() => {
        if (pollingRef.current) return
        pollingRef.current = setInterval(async () => {
          try {
            const data = await api('/state')
            setState(data.state)
            if (data.state.syncProgress) setSyncMessage(data.state.syncProgress)
            if (!data.state.refreshing) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
          } catch { /* polling is best effort */ }
        }, 1200)
      }, [])

      useEffect(() => () => { if (pollingRef.current) clearInterval(pollingRef.current) }, [])

      const refresh = useCallback(async (silent = false) => {
        if (syncing) return
        setSyncing(true)
        setSyncMessage(t('app.syncing'))
        pollState()
        try {
          const data = await api('/refresh', { method: 'POST' })
          if (data.state) setState(data.state)
          if (!data.ok) notify(data.error || t('setup.error'), 'error')
          else if (!silent) notify(t('app.synced'), 'success')
        } catch (error) {
          notify(error.message, 'error')
        } finally {
          setSyncing(false)
          setSyncMessage('')
          if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
        }
      }, [notify, pollState, syncing, t])

      useEffect(() => {
        if (!state) return
        if (state.configured && !state.cache && !syncing && !autoRefreshRef.current) {
          autoRefreshRef.current = true
          refresh(true)
        }
      }, [state, syncing, refresh])

      useEffect(() => {
        if (!state?.configured || !state.cache || state.connected || syncing || autoRefreshRef.current) return
        autoRefreshRef.current = true
        refresh(true)
      }, [state, syncing, refresh])

      const connect = useCallback(async ({ username, password, remember }) => {
        setBootError('')
        setSyncing(true)
        setSyncMessage(t('setup.connecting'))
        const interval = setInterval(async () => {
          try {
            const data = await api('/state')
            if (data.state.syncProgress) setSyncMessage(data.state.syncProgress)
          } catch { /* best effort */ }
        }, 1200)
        try {
          const data = await api('/login', { method: 'POST', body: JSON.stringify({ username, password, remember }) })
          setState(data.state)
          if (data.syncError) notify(data.syncError, 'error')
          else notify(t('app.synced'), 'success')
          return data
        } finally {
          setSyncing(false)
          setSyncMessage('')
          clearInterval(interval)
        }
      }, [notify, t])

      const accountConnect = useCallback(async (values) => {
        setAccountBusy(true)
        setAccountError('')
        try {
          await connect(values)
          setAccountOpen(false)
        } catch (error) {
          setAccountError(error.message)
          throw error
        } finally {
          setAccountBusy(false)
        }
      }, [connect])

      const accountForget = useCallback(async () => {
        setAccountBusy(true)
        setAccountError('')
        try {
          const data = await api('/forget', { method: 'POST', body: '{}' })
          setState(data.state)
          setAccountOpen(false)
          notify(t('account.cleared'), 'success')
        } catch (error) {
          setAccountError(error.message)
        } finally {
          setAccountBusy(false)
        }
      }, [notify])

      const loadProject = useCallback(async (taskId) => {
        try {
          const data = await api(`/project?taskId=${taskId}`)
          setProject(data.project)
          setCode(data.project.code)
          setHarness(data.project.harness)
          setInput(data.project.input)
          setSaveState('saved')
          skipAutosave.current = true
        } catch (error) {
          notify(error.message, 'error')
        }
      }, [notify])

      const loadChat = useCallback(async (taskId) => {
        try {
          const data = await api(`/chat?taskId=${taskId}`)
          setChat(data.chat.messages || [])
        } catch {
          setChat([])
        }
      }, [])

      const selectTask = useCallback(async (taskId) => {
        if (taskId === selectedId) return
        if (dirtyRef.current) {
          const snapshot = latestRef.current
          // Await the save: switching away from a problem must not discard edits
          // silently when the write fails.
          try {
            await api('/project', {
              method: 'POST',
              body: JSON.stringify({ taskId: snapshot.selectedId, code: snapshot.code, harness: snapshot.harness, input: snapshot.input }),
            })
          } catch (error) {
            notify(`${t('code.saveFailedStay')}${error.message}`, 'error')
            return
          }
        }
        setSelectedId(taskId)
        setProject(null)
        setCode('')
        setHarness('')
        setInput('')
        setTerminal([])
        setSubmitResult(null)
        setHistory(null)
      }, [selectedId, notify, t])

      useEffect(() => {
        if (!selectedId) return
        let active = true
        setTab('solution')
        setTerminal([])
        loadProject(selectedId)
        loadChat(selectedId)
        return () => { active = false }
      }, [selectedId, loadProject, loadChat])

      useEffect(() => {
        if (!cache || !cache.tasks?.length) return
        if (selectedId && cache.tasks.some((task) => task.id === selectedId)) return
        const next = cache.tasks.find((task) => task.status !== 'done') || cache.tasks[0]
        setSelectedId(next.id)
      }, [cache, selectedId])

      useEffect(() => {
        if (!project) return
        if (skipAutosave.current) { skipAutosave.current = false; return }
        const timer = setTimeout(async () => {
          setSaveState('saving')
          try {
            await api('/project', {
              method: 'POST',
              body: JSON.stringify({ taskId: selectedId, code, harness, input }),
            })
            setSaveState('saved')
            dirtyRef.current = false
          } catch (error) {
            setSaveState('unsaved')
            notify(error.message, 'error')
          }
        }, 700)
        dirtyRef.current = true
        return () => clearTimeout(timer)
      }, [code, harness, input, project, selectedId, notify])

      const saveNow = useCallback(async () => {
        if (!selectedId) return
        try {
          await api('/project', {
            method: 'POST',
            body: JSON.stringify({ taskId: selectedId, code, harness, input }),
          })
          setSaveState('saved')
          dirtyRef.current = false
          notify(t('code.saved'), 'success')
        } catch (error) {
          notify(error.message, 'error')
        }
      }, [selectedId, code, harness, input, notify, t])

      const appendTerminal = (text, kind = 'out') => {
        setTerminal((value) => [...value, ...String(text).split('\n').map((line) => ({ text: line, kind }))])
      }

      const buildRun = useCallback(async () => {
        if (!selectedId) return
        try {
          await api('/project', { method: 'POST', body: JSON.stringify({ taskId: selectedId, code, harness, input }) })
        } catch { /* 仍然尝试运行 */ }
        setRunStdin(input)
        setPtyRunToken((value) => value + 1)
        setTerminalOpen(true)
      }, [selectedId, code, harness, input])

      const build = useCallback(async () => {
        if (!selectedId) return
        try {
          await api('/project', { method: 'POST', body: JSON.stringify({ taskId: selectedId, code, harness, input }) })
        } catch { /* ignore */ }
        setRunStdin(input)
        setPtyRunToken((value) => value + 1)
        setTerminalOpen(true)
      }, [selectedId, code, harness, input])

      const runOnly = useCallback(() => {
        setRunStdin(input)
        setPtyRunToken((value) => value + 1)
        setTerminalOpen(true)
      }, [input])

      const runCommand = useCallback(async () => {
        if (!command.trim() || termBusy) return
        const value = command
        setCommand('')
        setTermBusy(true)
        setTerminalOpen(true)
        setTerminal((current) => [...current, { text: `$ ${value}`, kind: 'cmd' }])
        try {
          const data = await api('/run', {
            method: 'POST',
            body: JSON.stringify({ taskId: selectedId, mode: 'command', command: value, input }),
          })
          const result = data.result
          if (result.output) appendTerminal(result.output, result.ok ? 'out' : 'err')
          appendTerminal(`— ${t('term.exit')} ${result.exitCode ?? '?'} · ${result.durationMs}ms`, 'meta')
        } catch (error) {
          appendTerminal(error.message, 'err')
        } finally {
          setTermBusy(false)
        }
      }, [command, termBusy, selectedId, input, t])

      const loadHistory = useCallback(async () => {
        if (!selectedId || historyBusy) return
        setHistoryBusy(true)
        try {
          const data = await api(`/history?taskId=${selectedId}`)
          setHistory({ rows: data.rows || [], latestDetail: data.latestDetail })
        } catch (error) {
          notify(error.message, 'error')
        } finally {
          setHistoryBusy(false)
        }
      }, [selectedId, historyBusy, notify])

      const submit = useCallback(async () => {
        if (!selectedId || submitting) return
        setSubmitting(true)
        setSubmitError('')
        setSubmitPhase(t('submit.uploading'))
        const interval = setInterval(async () => {
          try {
            const data = await api('/state')
            if (data.state.syncProgress) setSubmitPhase(data.state.syncProgress)
          } catch { /* best effort */ }
        }, 1000)
        try {
          const data = await api('/submit', {
            method: 'POST',
            body: JSON.stringify({ taskId: selectedId, code }),
          })
          setSubmitResult(data.result)
          setState((current) => mergeTaskState(current, data.task))
          setShowSubmit(false)
          setSaveState('saved')
          setHistory(null)
          notify(data.result.score === 100 ? t('submit.full') : `${t('submit.result')} ${data.result.score ?? ''}`, data.result.score === 100 ? 'success' : 'warn')
        } catch (error) {
          setSubmitError(error.message)
        } finally {
          setSubmitting(false)
          setSubmitPhase('')
          clearInterval(interval)
        }
      }, [selectedId, submitting, code, notify, t])

      const sendAi = useCallback(async (message, overrideMode) => {
        if (!selectedId || streaming) return
        setChatError('')
        setStreaming(true)
        setTutorOpen(true)
        const useMode = overrideMode || mode
        const controller = new AbortController()
        abortRef.current = controller
        setChat((current) => [...current, { role: 'user', content: message, at: new Date().toISOString() }, { role: 'assistant', content: '', streaming: true, at: new Date().toISOString() }])
        try {
          const doRequest = async () => {
            const boot = bootData || await getBootstrap()
            return fetch(`${API_ROOT}/ai`, {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                'x-aptat-token': boot.token,
              },
              body: JSON.stringify({ taskId: selectedId, message, mode: useMode, code, harness }),
              signal: controller.signal,
            })
          }
          let response = await doRequest()
          if (response.status === 403) {
            await getBootstrap(true)
            response = await doRequest()
          }
          if (!response.ok) {
            let messageText = `AI 请求失败（HTTP ${response.status}）`
            try { const payload = await response.json(); messageText = payload.error || messageText } catch { /* ignore */ }
            throw new Error(messageText)
          }
          if (!response.body) throw new Error(t('app.streamNoResponse'))
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          let streamError = ''
          while (true) {
            const { value, done } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            let split
            while ((split = buffer.indexOf('\n\n')) >= 0) {
              const event = buffer.slice(0, split)
              buffer = buffer.slice(split + 2)
              const dataLine = event.split('\n').find((line) => line.startsWith('data:'))
              if (!dataLine) continue
              let payload
              try { payload = JSON.parse(dataLine.slice(5).trim()) } catch { continue }
              if (payload.type === 'delta') {
                setChat((current) => {
                  const next = current.slice()
                  const last = next[next.length - 1]
                  if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: last.content + payload.text }
                  return next
                })
              } else if (payload.type === 'meta' && payload.rulesAdded?.length) {
                if (typeof payload.tutorRuleCount === 'number') {
                  setState((current) => current ? { ...current, tutorRuleCount: payload.tutorRuleCount } : current)
                }
                notify(`已记住 ${payload.rulesAdded.length} 条长期教学约定`, 'success')
              } else if (payload.type === 'done' && typeof payload.message === 'string') {
                const finalText = payload.message.trim()
                setChat((current) => {
                  const next = current.slice()
                  const last = next[next.length - 1]
                  if (last?.role === 'assistant') {
                    next[next.length - 1] = { ...last, content: finalText, streaming: false }
                  }
                  return next
                })
              } else if (payload.type === 'error') {
                streamError = payload.message || t('tutor.error')
              }
            }
          }
          if (streamError) throw new Error(streamError)
        } catch (error) {
          if (error.name === 'AbortError') {
            setChat((current) => current.map((item) => item.streaming ? { ...item, streaming: false } : item))
          } else {
            setChatError(error.message)
            setChat((current) => current.map((item) => item.streaming ? { ...item, streaming: false } : item))
          }
        } finally {
          setStreaming(false)
          abortRef.current = null
          setChat((current) => current.map((item) => item.streaming ? { ...item, streaming: false } : item))
        }
      }, [selectedId, streaming, mode, code, t, notify])

      const stopAi = useCallback(() => {
        abortRef.current?.abort()
        setStreaming(false)
      }, [])

      const clearChat = useCallback(async () => {
        if (!selectedId) return
        try {
          await api('/chat/clear', { method: 'POST', body: JSON.stringify({ taskId: selectedId }) })
          setChat([])
          setChatError('')
        } catch (error) {
          notify(error.message, 'error')
        }
      }, [selectedId, notify])

      const askClearChat = useCallback(() => {
        if (!selectedId) return
        setConfirmAsk({
          title: t('tutor.clearChatTitle'),
          desc: t('tutor.clearChatDesc'),
          confirmLabel: t('tutor.clearChatConfirm'),
          run: clearChat,
        })
      }, [selectedId, clearChat])

      const askForget = useCallback(() => {
        setConfirmAsk({
          title: t('account.clear'),
          desc: t('account.clearDesc'),
          confirmLabel: t('account.clearConfirm'),
          run: accountForget,
        })
      }, [accountForget])

      const copyCode = useCallback(async (text, action) => {
        try {
          if (action === 'insert') {
            if (tab === 'harness') {
              setHarness((current) => `${current.trimEnd()}\n\n${text}\n`)
            } else {
              setCode((current) => `${current.trimEnd()}\n\n${text}\n`)
              setTab('solution')
            }
            notify(t('tutor.inserted'), 'success')
            return
          }
          await navigator.clipboard.writeText(text)
          notify(t('tutor.copied'), 'success')
        } catch {
          notify(t('editor.copyFailed'), 'error')
        }
      }, [notify, t, tab])

      const startLesson = useCallback(() => {
        sendAi('先不要写完整代码。先给我这道题的“功能框架”：按执行层次写清楚——哪些是顺序执行，哪些嵌在循环里、哪些在 if/else 分支里，用缩进表示层级，并注明每个循环变量代表什么。然后问我想先做哪个功能块，停下来等我选。之后每次只带我做那一个功能块：讲知识点 + 只给这一小块代码，并说明它该放在第几层。', 'lesson')
      }, [sendAi])

      const requestHarness = useCallback(() => {
        setTab('harness')
        sendAi('请为这道题生成一个“本地测试 main”的脚手架。它只用于本地编译测试，不会提交。请只给一个完整可编译的 harness.c 代码块（本地测试 main，不会提交），并在代码里调用需要提交的函数；不要修改提交文件的函数签名。', 'debug')
      }, [sendAi])

      const handleTutorModelChange = useCallback((selection) => {
        if (selection?.provider && selection?.model) {
          setState((current) => current
            ? { ...current, tutorModel: { provider: selection.provider, model: selection.model }, tutorPinned: true }
            : current)
          notify(t('tutor.modelSwitched').replace('{model}', `${selection.provider} / ${selection.model}`), 'success')
        }
      }, [notify])

      const checkProgress = useCallback((context) => {
        if (!selectedId || streaming) return
        const fileLabel = context.tab === 'harness'
          ? 'harness.c（本地测试，不会提交）'
          : context.tab === 'input'
            ? 'stdin 输入文件'
            : 'solution.c（最终提交文件）'
        const questions = Array.isArray(context.comments) ? context.comments : []
        const lines = questions.map((question) => question.line).join('、')
        const message = [
          `【进度检查】请检查我当前写到的地方：${fileLabel}，光标在第 ${context.line} 行第 ${context.column} 列。`,
          questions.length ? `我在代码注释里写了 ${questions.length} 个问题（第 ${lines} 行），请逐条回答。` : '代码注释里暂时没有提问，重点检查代码。',
          '先判断我做到哪一步、哪些已经写对，再指出最关键的 1-2 个问题或风险；只给下一步最小提示，不要直接给完整答案。',
          '最后请我用自己的话说明一个关键概念或下一步，不要让我手算。',
        ].join('\n')
        setMode('coach')
        sendAi(message, 'coach')
      }, [selectedId, streaming, sendAi])

      if (bootError && !state) {
        return h('div', { className: 'aptat-fatal' },
          h('div', { className: 'aptat-fatal-card' },
            h('div', { className: 'aptat-eyebrow' }, 'ERROR / 00'),
            h('h1', null, t('app.notStarted')),
            h('p', null, bootError),
            h('button', { type: 'button', className: 'aptat-primary-button', onClick: () => { getBootstrap(true).then((data) => { setState(data.state); setBootError('') }).catch((error) => setBootError(error.message)) } }, t('common.retry')),
          ),
        )
      }
      if (!state) {
        return h('div', { className: 'aptat-fatal' },
          h('div', { className: 'aptat-loading-card' }, h(Spinner, null), h('strong', null, t('app.loading')), h('span', null, t('app.initializing'))),
        )
      }
      if (!state.configured) {
        return h(SetupScreen, { t, onConnected: connect, busy: syncing, error: bootError || state.lastSyncError })
      }
      if (!cache) {
        // Signed in but never synced: offer a retry, not the password form —
        // sending an authenticated user back to SetupScreen makes them re-type
        // a password that already worked.
        return h('div', { className: 'aptat-fatal' },
          h('div', { className: 'aptat-loading-card' },
            state.lastSyncError && !syncing ? null : h(Spinner, null),
            h('strong', null, syncing ? t('setup.connecting') : state.lastSyncError ? t('sync.failedTitle') : t('app.loading')),
            h('span', null, syncMessage || state.syncProgress || t('app.syncingDetail')),
            state.lastSyncError ? h('div', { className: 'aptat-error' }, state.lastSyncError) : null,
            !syncing ? h('button', { type: 'button', className: 'aptat-primary-button', onClick: () => refresh(true) }, t('common.retry')) : null,
          ),
        )
      }

      const tutorModelInfo = state.tutorModel || state.model
      const modelLabel = tutorModelInfo ? `${tutorModelInfo.provider} / ${tutorModelInfo.model}` : ''
      const statusLabel = syncing
        ? t('app.refreshing')
        : state.lastSyncError
          ? t('app.syncFailed')
          : t('app.synced')

      // Host-side credential trouble (keychain unavailable, or the user chose not
      // to save) has no other surface, and without it the next launch silently
      // returns to the login form.
      const shownNotice = notice
        || (state.warning && state.warning !== noticeDismissed ? { message: state.warning, kind: 'info' } : null)
        || (state.lastSyncError && state.lastSyncError !== noticeDismissed ? { message: state.lastSyncError, kind: 'error' } : null)

      return h('div', {
        ref: appRef,
        className: `aptat-app${tutorOpen ? '' : ' tutor-closed'}${terminalOpen ? '' : ' terminal-closed'}${focusMode ? ' is-focus' : ''}${railOpen ? '' : ' rail-closed'}`,
        lang: 'zh-CN',
        style: { '--aptat-tutor-width': `${tutorWidth}px` },
      },
        h('header', { className: 'aptat-topbar' },
          h('div', { className: 'aptat-brand' },
            h('div', { className: 'aptat-brand-mark' }, h(AppIcon, { size: 26, active: true })),
            h('div', null,
              h('strong', null, t('app.title')),
              h('span', null, t('app.subtitle')),
            ),
          ),
          h('div', { className: 'aptat-topbar-stats' },
            h('div', { className: 'aptat-top-progress' },
              h('span', null, t('app.progress')),
              h('strong', null, `${progress.done}/${progress.total}`),
              h('i', null, h('b', { style: { width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` } })),
            ),
            h('span', { className: 'aptat-topbar-divider' }),
            h('div', { className: 'aptat-sync-state' },
              h('span', {
                className: `aptat-live-dot${state.connected ? ' is-live' : ''}${state.lastSyncError ? ' is-error' : ''}`,
              }),
              h('span', { title: state.lastSyncError || '' }, statusLabel),
              h('small', null, cache.fetchedAt ? recent(cache.fetchedAt, t) : t('app.never')),
            ),
          ),
          h('div', { className: 'aptat-topbar-actions' },
            h('select', {
              className: 'aptat-mobile-select',
              value: selectedId || '',
              onChange: (event) => selectTask(Number(event.target.value)),
              'aria-label': t('ui.selectTask'),
            }, tasks.map((task) => h('option', { key: task.id, value: task.id }, `${task.id} · ${task.name}`))),
            h('button', {
              type: 'button',
              className: `aptat-rail-toggle${railOpen ? ' is-active' : ''}`,
              onClick: () => setRailOpen((value) => !value),
              title: railOpen ? t('rail.hideRail') : t('rail.showRail'),
              'aria-pressed': railOpen,
            }, h(Icon, { name: 'panel', size: 15 }), t('rail.collapse')),
            h('button', { type: 'button', className: 'aptat-secondary-button', onClick: () => refresh(false), disabled: syncing },
              syncing ? h(Spinner, { small: true }) : h(Icon, { name: 'refresh', size: 15 }),
              syncing ? t('app.refreshing') : t('app.refresh'),
            ),
            h('button', {
              type: 'button',
              className: 'aptat-account-chip',
              title: state.account,
              onClick: () => { setAccountError(''); setAccountOpen(true) },
            }, h(Icon, { name: 'user', size: 14 }), state.account || t('account.chip')),
            h('button', {
              type: 'button',
              className: `aptat-focus-button${focusMode ? ' is-active' : ''}`,
              onClick: toggleFocus,
              title: focusMode ? t('layout.focusExitTitle') : t('layout.focusEnterTitle'),
              'aria-pressed': focusMode,
            }, h(Icon, { name: focusMode ? 'collapse' : 'expand', size: 15 }), h('span', { className: 'aptat-focus-label' }, focusMode ? t('layout.focusExit') : t('layout.focusEnter'))),
            h('button', {
              type: 'button',
              className: 'aptat-theme-toggle',
              onClick: toggleTheme,
              title: themePreference === 'dark' ? t('theme.toLight') : t('theme.toDark'),
              'aria-label': themePreference === 'dark' ? t('theme.toLightLabel') : t('theme.toDarkLabel'),
            }, h(Icon, { name: themePreference === 'dark' ? 'sun' : 'moon', size: 15 })),
            h('button', {
              type: 'button',
              className: `aptat-tutor-toggle${tutorOpen ? ' is-active' : ''}`,
              onClick: () => setTutorOpen((value) => !value),
              'aria-pressed': tutorOpen,
            }, h(Icon, { name: 'spark', size: 15 }), t('app.tutor')),
          ),
        ),
        shownNotice
          ? h('div', { className: `aptat-banner${shownNotice.kind === 'error' ? ' is-error' : ''}`, role: 'status' },
            h(Icon, { name: 'warning', size: 14 }),
            h('span', null, shownNotice.message),
            h('button', {
              type: 'button', className: 'aptat-banner-close', 'aria-label': t('common.close'),
              onClick: () => {
                setNoticeDismissed(shownNotice.message)
                setNotice(null)
              },
            }, '✕'),
          )
          : null,
        h('div', { className: 'aptat-body' },
          railOpen ? h(TaskRail, { t, cache, selectedId, onSelect: selectTask, progress, onCollapse: () => setRailOpen(false) }) : null,
          h('main', { className: 'aptat-main' },
            h(ProblemPanel, {
              t, task: selectedTask, cache, collapsed: problemCollapsed,
              onToggle: () => setProblemCollapsed((value) => !value),
              onHarness: requestHarness,
              onHistory: loadHistory, history, historyBusy,
            }),
            h('div', { className: 'aptat-workspace' },
              selectedTask
                ? h(CodeEditor, {
                  t, task: selectedTask, code, setCode, tab, setTab, harness, setHarness, input, setInput,
                  saveState, onBuild: build, onRun: runOnly, onBuildRun: buildRun, onSave: saveNow,
                  terminalOpen, onToggleTerminal: () => setTerminalOpen((value) => !value),
                  onDismissResult: () => setSubmitResult(null),
                  onSubmit: () => { setSubmitError(''); setShowSubmit(true) },
                  busy: termBusy, result: submitResult, onCheckProgress: checkProgress, aiBusy: streaming,
                })
                : h('div', { className: 'aptat-no-task' }, t('app.pickTask')),
              terminalOpen ? h(SmartTerminal, {
                key: selectedId,
                t, taskId: selectedId,
                autoRun: true, runToken: ptyRunToken, stdinText: runStdin,
              }) : null,
            ),
          ),
          h(Tutor, {
            t, task: selectedTask, open: tutorOpen, onClose: () => setTutorOpen(false),
            model: modelLabel, chat, setChat, onSend: sendAi, streaming, onStop: stopAi,
            onClear: askClearChat, onCopyCode: copyCode, onInsertCode: copyCode,
            mode, setMode, onStart: startLesson, error: chatError, ruleCount: state.tutorRuleCount,
            width: tutorWidth, onWidthChange: setTutorWidth, onModelChange: handleTutorModelChange,
            onNotify: notify,
          }),
          !tutorOpen ? h('div', { className: 'aptat-tutor-stub' },
            h('button', { type: 'button', onClick: () => setTutorOpen(true) }, h(Icon, { name: 'spark', size: 16 }), t('app.tutor')),
          ) : null,
        ),
        showSubmit ? h(SubmitDialog, {
          t, task: selectedTask, code, busy: submitting, phase: submitPhase,
          onCancel: () => { setShowSubmit(false); setSubmitError('') },
          onConfirm: submit, error: submitError,
        }) : null,
        accountOpen ? h(AccountDialog, {
          t, account: state.account, busy: accountBusy, error: accountError,
          onClose: () => { if (!accountBusy) setAccountOpen(false) },
          onConnect: accountConnect, onForget: askForget,
        }) : null,
        confirmAsk ? h(ConfirmDialog, {
          t,
          title: confirmAsk.title,
          desc: confirmAsk.desc,
          confirmLabel: confirmAsk.confirmLabel,
          busy: accountBusy,
          onCancel: () => setConfirmAsk(null),
          onConfirm: async () => {
            const run = confirmAsk.run
            setConfirmAsk(null)
            await run()
          },
        }) : null,
        toast ? h('div', { className: `aptat-toast is-${toast.kind}`, role: 'status' },
          h(Icon, { name: toast.kind === 'error' ? 'warning' : 'check', size: 15 }),
          h('span', null, toast.message),
        ) : null,
      )
    }

    function makeStyleApi() {
      try {
        if (typeof styles !== 'undefined' && styles && typeof styles.insert === 'function') return styles
      } catch { /* the loader may not expose the global */ }
      return {
        insert(css) {
          const element = document.createElement('style')
          element.setAttribute('data-aptat-styles', '')
          element.textContent = css
          document.head.appendChild(element)
          return () => { element.remove() }
        },
      }
    }

    function applyStyles() {
      return `
        .aptat-app, .aptat-app * { box-sizing: border-box; }
        .aptat-app {
          height: 100%; min-height: 0; display: flex; flex-direction: column;
          background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
          font-family: "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI", sans-serif;
          font-size: 13px; line-height: 1.5; overflow: hidden;
        }
        .aptat-app :where(button, input, textarea) { font: inherit; color: inherit; }
        .aptat-app button { cursor: pointer; }
        .aptat-app button:disabled { cursor: default; opacity: .55; }
        .aptat-app :focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
        .aptat-icon { flex: 0 0 auto; display: block; }
        .aptat-eyebrow { font-family: "Cascadia Mono", "Consolas", monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--dsw-alias-label-secondary); }
        .aptat-muted { color: var(--dsw-alias-label-secondary); }
        .aptat-brand-mark { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-layer-1); }
        .aptat-app-icon.is-active { color: var(--dsw-alias-brand-primary); }
        .aptat-topbar { height: 58px; flex: 0 0 58px; display: flex; align-items: center; gap: 18px; padding: 0 18px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
        .aptat-brand { display: flex; align-items: center; gap: 10px; min-width: 190px; }
        .aptat-brand strong { display: block; font-size: 14px; letter-spacing: .01em; }
        .aptat-brand span { display: block; margin-top: 1px; font-size: 10px; color: var(--dsw-alias-label-secondary); letter-spacing: .04em; }
        .aptat-topbar-stats { display: flex; align-items: center; gap: 16px; margin-left: auto; min-width: 0; }
        .aptat-top-progress { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
        .aptat-top-progress strong { font-family: "Cascadia Mono", Consolas, monospace; color: var(--dsw-alias-label-primary); font-size: 12px; }
        .aptat-top-progress i { width: 80px; height: 4px; border-radius: 99px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; }
        .aptat-top-progress b { display: block; height: 100%; background: var(--dsw-alias-brand-primary); border-radius: inherit; transition: width .3s ease; }
        .aptat-topbar-divider { width: 1px; height: 24px; background: var(--dsw-alias-border-l1); }
        .aptat-sync-state { display: flex; align-items: center; gap: 7px; min-width: 120px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
        .aptat-sync-state small { display: block; font-size: 10px; opacity: .72; margin-left: 2px; }
        .aptat-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--dsw-alias-state-idle-primary); }
        .aptat-live-dot.is-live { background: var(--dsw-alias-state-success-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent); }
        .aptat-live-dot.is-error { background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-error-primary) 16%, transparent); }
        .aptat-banner { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 10%, var(--dsw-alias-bg-layer-1)); color: var(--dsw-alias-label-primary); font-size: 11.5px; line-height: 1.55; }
        .aptat-banner.is-error { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, var(--dsw-alias-bg-layer-1)); }
        .aptat-banner > .aptat-icon { flex: 0 0 auto; margin-top: 2px; color: var(--dsw-alias-label-secondary); }
        .aptat-banner > span { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
        .aptat-banner-close { flex: 0 0 auto; border: 0; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; font-size: 12px; line-height: 1; padding: 2px 4px; border-radius: 4px; }
        .aptat-banner-close:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
        .aptat-topbar-actions { display: flex; align-items: center; gap: 8px; }
        .aptat-account-chip { display: inline-flex; align-items: center; gap: 6px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 10px; color: var(--dsw-alias-label-secondary); padding: 5px 8px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; background: transparent; }
        .aptat-account-chip:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
        .aptat-primary-button, .aptat-secondary-button, .aptat-ghost-button, .aptat-submit-button, .aptat-tutor-toggle, .aptat-focus-button, .aptat-theme-toggle, .aptat-rail-toggle, .aptat-ai-check-button, .aptat-send-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          border-radius: 7px; border: 1px solid transparent; padding: 7px 11px; font-size: 12px;
          transition: background .15s ease, border-color .15s ease, color .15s ease, transform .1s ease;
          white-space: nowrap;
        }
        .aptat-primary-button { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 52%, #0f766e); color: var(--dsw-alias-bg-base); border-color: transparent; box-shadow: 0 1px 0 color-mix(in srgb, #fff 12%, transparent) inset; }
        .aptat-danger-button { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 16%, transparent); color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 48%, var(--dsw-alias-label-primary)); border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 46%, var(--dsw-alias-border-l1)); border-radius: 7px; padding: 8px 15px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .aptat-danger-button:hover:not(:disabled) { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 26%, transparent); }
        .aptat-danger-button:disabled { opacity: .55; cursor: default; }
        .aptat-primary-button:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .aptat-secondary-button { background: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-border-l1); color: var(--dsw-alias-label-primary); }
        .aptat-secondary-button:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l2); }
        .aptat-ghost-button { background: transparent; color: var(--dsw-alias-label-secondary); padding-inline: 7px; }
        .aptat-ghost-button:hover:not(:disabled) { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
        .aptat-submit-button { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 20%, transparent); color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 46%, var(--dsw-alias-label-primary)); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 46%, var(--dsw-alias-border-l1)); font-weight: 600; }
        .aptat-submit-button:hover { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 30%, transparent); }
        .aptat-submit-button:hover:not(:disabled) { filter: brightness(1.05); }
        .aptat-tutor-toggle { background: transparent; border-color: var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); }
        .aptat-tutor-toggle.is-active, .aptat-tutor-toggle:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
        .aptat-focus-button { background: transparent; border-color: var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); }
        .aptat-focus-button:hover, .aptat-focus-button.is-active { color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 28%, var(--dsw-alias-border-l1)); }
        .aptat-rail-toggle { background: transparent; border-color: var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); }
        .aptat-theme-toggle { width: 30px; height: 30px; padding: 0; display: grid; place-items: center; background: transparent; border-color: var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); }
        .aptat-theme-toggle:hover { color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-layer-2); }
        .aptat-rail-toggle:hover, .aptat-rail-toggle.is-active { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
        .aptat-ai-check-button { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, var(--dsw-alias-bg-layer-1)); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 34%, var(--dsw-alias-border-l1)); color: var(--dsw-alias-brand-primary); }
        .aptat-ai-check-button:hover:not(:disabled) { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 15%, var(--dsw-alias-bg-layer-1)); }
        .aptat-ai-check-badge { min-width: 15px; height: 15px; padding: 0 4px; display: inline-flex; align-items: center; justify-content: center; border-radius: 99px; background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 26%, transparent); color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 42%, var(--dsw-alias-label-primary)); font-family: "Cascadia Mono", Consolas, monospace; font-size: 8px; line-height: 1; font-weight: 600; }
        .aptat-cursor-position { color: var(--dsw-alias-label-secondary); opacity: .72; }
        .aptat-comment-flag { color: var(--dsw-alias-state-warn-primary); border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 30%, transparent); border-radius: 3px; padding: 0 4px; white-space: nowrap; max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
        .aptat-focus-label { display: inline; }
        .aptat-wide { width: 100%; padding: 10px 12px; }
        .aptat-icon-button { width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary); }
        .aptat-icon-button:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l1); }
        .aptat-mini-button { border: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-secondary); font-size: 10px; padding: 3px 7px; border-radius: 5px; }
        .aptat-mini-button:hover:not(:disabled) { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
        .aptat-body { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 278px minmax(0, 1fr) var(--aptat-tutor-width, 382px); position: relative; }
        .aptat-app.tutor-closed .aptat-body { grid-template-columns: 278px minmax(0, 1fr); }
        .aptat-app.rail-closed .aptat-body { grid-template-columns: minmax(0, 1fr) var(--aptat-tutor-width, 382px); }
        .aptat-app.rail-closed.tutor-closed .aptat-body { grid-template-columns: minmax(0, 1fr); }
        .aptat-rail { min-height: 0; overflow: hidden; display: flex; flex-direction: column; border-right: 1px solid var(--dsw-alias-border-l1); background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 74%, var(--dsw-alias-bg-base)); }
        .aptat-rail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 18px 16px 10px; }
        .aptat-rail-head-actions { display: flex; align-items: center; gap: 2px; }
        .aptat-rail-collapse { width: 24px; height: 24px; }
        .aptat-chevron-left { transform: rotate(180deg); }
        .aptat-rail-head h2 { margin: 3px 0 0; font-size: 16px; letter-spacing: -.02em; }
        .aptat-progress-number { display: flex; align-items: baseline; gap: 2px; font-family: "Cascadia Mono", Consolas, monospace; }
        .aptat-progress-number strong { font-size: 25px; line-height: 1; letter-spacing: -.05em; }
        .aptat-progress-number span { font-size: 11px; color: var(--dsw-alias-label-secondary); }
        .aptat-progress-track { height: 3px; margin: 0 16px 12px; background: var(--dsw-alias-bg-layer-2); border-radius: 99px; overflow: hidden; }
        .aptat-progress-track span { display: block; height: 100%; background: var(--dsw-alias-brand-primary); transition: width .35s ease; }
        .aptat-rail-tools { padding: 0 12px 10px; display: grid; gap: 7px; }
        .aptat-search { display: flex; align-items: center; gap: 7px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; padding: 0 9px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); }
        .aptat-search:focus-within { border-color: var(--dsw-alias-brand-primary); }
        .aptat-search input { width: 100%; border: 0; background: transparent; outline: 0; padding: 8px 0; font-size: 12px; color: var(--dsw-alias-label-primary); }
        .aptat-search input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .75; }
        .aptat-check { display: flex; align-items: flex-start; gap: 7px; font-size: 11px; color: var(--dsw-alias-label-secondary); line-height: 1.4; cursor: pointer; }
        .aptat-check input { accent-color: var(--dsw-alias-brand-primary); margin: 1px 0 0; }
        .aptat-check-compact { padding-left: 2px; }
        .aptat-group-list { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 2px 8px 18px; scrollbar-width: thin; }
        .aptat-group { margin-top: 4px; }
        .aptat-group-head { width: 100%; display: flex; align-items: center; gap: 7px; padding: 7px 6px; border: 0; background: transparent; text-align: left; color: var(--dsw-alias-label-secondary); border-radius: 5px; }
        .aptat-group-head:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
        .aptat-group-index { font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; opacity: .65; }
        .aptat-group-name { font-size: 11px; font-weight: 600; letter-spacing: .02em; }
        .aptat-group-count { margin-left: auto; font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; opacity: .7; }
        .aptat-chevron-open { transform: rotate(90deg); transition: transform .15s ease; }
        .aptat-chevron-closed { transform: rotate(0deg); transition: transform .15s ease; }
        .aptat-chevron-down { transform: rotate(90deg); }
        .aptat-task-list { display: grid; gap: 1px; }
        .aptat-task-row { display: flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; padding: 7px 7px 7px 9px; border: 1px solid transparent; border-left: 2px solid transparent; border-radius: 4px; background: transparent; color: var(--dsw-alias-label-primary); }
        .aptat-task-row:hover { background: var(--dsw-alias-bg-layer-2); }
        .aptat-task-row.is-active { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l1); border-left-color: var(--dsw-alias-brand-primary); }
        .aptat-task-number { font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; color: var(--dsw-alias-label-secondary); padding-top: 2px; min-width: 18px; }
        .aptat-task-copy { display: grid; gap: 1px; min-width: 0; flex: 1; }
        .aptat-task-name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; line-height: 1.35; }
        .aptat-task-sub { display: flex; gap: 5px; align-items: center; color: var(--dsw-alias-label-secondary); font-size: 9px; font-family: "Cascadia Mono", Consolas, monospace; }
        .aptat-task-sub em { font-style: normal; border: 1px solid var(--dsw-alias-border-l1); padding: 0 3px; border-radius: 3px; opacity: .8; }
        .aptat-status-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex: 0 0 auto; background: var(--dsw-alias-state-idle-primary); }
        .aptat-dot-done { background: var(--dsw-alias-state-success-primary); }
        .aptat-dot-partial { background: var(--dsw-alias-state-warn-primary); }
        .aptat-dot-attempted { background: var(--dsw-alias-state-idle-primary); }
        .aptat-dot-todo { background: transparent; border: 1px solid var(--dsw-alias-border-l2); }
        .aptat-rail-empty { padding: 10px 8px; color: var(--dsw-alias-label-secondary); font-size: 11px; }
        .aptat-rail-foot { flex: 0 0 auto; display: flex; justify-content: space-between; padding: 9px 16px; border-top: 1px solid var(--dsw-alias-border-l1); font-size: 9px; color: var(--dsw-alias-label-secondary); font-family: "Cascadia Mono", Consolas, monospace; }
        .aptat-main { min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
        .aptat-problem { position: relative; flex: 0 0 auto; max-height: 39%; overflow: hidden; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); display: flex; flex-direction: column; }
        .aptat-problem.is-collapsed { max-height: none; }
        .aptat-problem-paper { position: absolute; inset: 0; pointer-events: none; opacity: .45; background-image: linear-gradient(color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(to bottom, black, transparent 88%); }
        .aptat-problem-head { position: relative; padding: 14px 20px 10px; flex: 0 0 auto; }
        .aptat-problem-kicker { display: flex; align-items: center; gap: 9px; }
        .aptat-kicker-rule { height: 1px; width: 34px; background: var(--dsw-alias-border-l2); }
        .aptat-problem-title-row { display: flex; align-items: flex-start; gap: 12px; margin-top: 5px; }
        .aptat-problem-title-row h1 { margin: 0; flex: 1; font-family: "Iowan Old Style", "Palatino Linotype", "Songti SC", "SimSun", serif; font-size: 26px; line-height: 1.15; letter-spacing: -.02em; font-weight: 600; }
        .aptat-meta-row { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 8px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 10px; color: var(--dsw-alias-label-secondary); }
        .aptat-meta-row .is-good { color: var(--dsw-alias-state-success-primary); }
        .aptat-meta-row .is-warn { color: var(--dsw-alias-state-warn-primary); }
        .aptat-problem-actions { display: flex; align-items: center; gap: 4px; margin-top: 10px; }
        .aptat-problem-body { position: relative; min-height: 0; overflow-y: auto; padding: 0 20px 14px; scrollbar-width: thin; flex: 1 1 auto; }
        .aptat-problem-tabs { display: flex; gap: 13px; border-bottom: 1px solid var(--dsw-alias-border-l1); margin-bottom: 9px; }
        .aptat-problem-tabs button { border: 0; background: transparent; color: var(--dsw-alias-label-secondary); padding: 2px 0 7px; font-size: 10px; border-bottom: 1px solid transparent; margin-bottom: -1px; }
        .aptat-problem-tabs button.is-active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-brand-primary); }
        .aptat-statement { max-width: 88ch; }
        .aptat-problem-text { margin: 0; font-family: "Cascadia Mono", "Consolas", "Microsoft YaHei UI", monospace; font-size: 12px; line-height: 1.72; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); }
        .aptat-notice { display: flex; gap: 8px; align-items: flex-start; padding: 7px 9px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 35%, var(--dsw-alias-border-l1)); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 8%, transparent); border-radius: 5px; color: var(--dsw-alias-state-warn-primary); font-size: 11px; margin-bottom: 9px; }
        .aptat-empty-inline { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary); font-size: 11px; padding: 8px 0; }
        .aptat-attachments { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .aptat-attachments a { color: var(--dsw-alias-brand-primary); font-size: 11px; }
        .aptat-history-list { display: grid; gap: 5px; }
        .aptat-history-row { display: grid; grid-template-columns: 42px minmax(0,1fr) auto; align-items: center; gap: 8px; padding: 5px 7px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 4px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 9.5px; }
        .aptat-history-score { font-size: 13px; color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 46%, var(--dsw-alias-label-primary)); }
        .aptat-history-note { color: var(--dsw-alias-state-warn-primary); font-family: inherit; }
        .aptat-deduction { margin: 9px 0 0; padding: 9px; border-left: 2px solid var(--dsw-alias-state-error-primary); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 7%, transparent); white-space: pre-wrap; font-family: "Cascadia Mono", Consolas, monospace; font-size: 10.5px; line-height: 1.6; }
        .aptat-workspace { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-base); }
        .aptat-terminal-toggle { margin-left: 4px; }
        .aptat-editor { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
        .aptat-editor-head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 13px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); min-height: 34px; }
        .aptat-file-tabs { display: flex; align-items: stretch; gap: 2px; }
        .aptat-file-tabs button { display: inline-flex; align-items: center; gap: 6px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary); font-family: "Cascadia Mono", Consolas, monospace; font-size: 10px; padding: 7px 7px 6px; }
        .aptat-file-tabs button.is-active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-brand-primary); }
        .aptat-file-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: .7; }
        .aptat-editor-status { display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden; white-space: nowrap; font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; color: var(--dsw-alias-label-secondary); }
        .aptat-save-state.is-saved { color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 46%, var(--dsw-alias-label-primary)); }
        .aptat-save-state.is-saving { color: var(--dsw-alias-state-warn-primary); }
        .aptat-save-state.is-unsaved { color: var(--dsw-alias-state-warn-primary); }
        .aptat-code-wrap { position: relative; flex: 1 1 auto; min-height: 120px; display: flex; overflow: hidden; background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 46%, var(--dsw-alias-bg-base)); box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent); }
        .aptat-line-numbers { flex: 0 0 48px; overflow: hidden; padding: 13px 8px 26px 0; text-align: right; user-select: none; color: var(--dsw-alias-label-secondary); opacity: .42; font-family: "Cascadia Code", "Cascadia Mono", "Fira Code", Consolas, monospace; font-size: 12.5px; line-height: 1.65; font-variant-ligatures: none; }
        .aptat-line-numbers span { display: block; }
        .aptat-code-layer { position: relative; flex: 1 1 auto; min-width: 0; overflow: hidden; }
        .aptat-highlight, .aptat-code-area {
          position: absolute; inset: 0; margin: 0; border: 0;
          padding: 13px 16px 26px 6px; font-family: "Cascadia Code", "Cascadia Mono", "Fira Code", Consolas, monospace;
          font-size: 12.5px; line-height: 1.65; tab-size: 4; white-space: pre; word-wrap: normal; overflow-wrap: normal; word-break: normal; letter-spacing: 0;
          font-variant-ligatures: none; font-feature-settings: normal;
        }
        .aptat-highlight { overflow: hidden; pointer-events: none; user-select: none; color: var(--dsw-alias-label-primary); background: transparent; padding-bottom: 96px; }
        .aptat-highlight code { font: inherit; white-space: inherit; }
        .aptat-code-area { z-index: 1; overflow: auto; resize: none; outline: 0; background: transparent; color: transparent; -webkit-text-fill-color: transparent; caret-color: var(--dsw-alias-brand-primary); scrollbar-width: thin; }
        .aptat-code-area::placeholder { color: var(--dsw-alias-label-secondary); -webkit-text-fill-color: var(--dsw-alias-label-secondary); opacity: .55; }
        .aptat-code-area::selection { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 28%, transparent); color: transparent; }
        .aptat-tok-plain { color: var(--dsw-alias-label-primary); }
        .aptat-tok-comment { color: #2e7d4f; color: color-mix(in srgb, #2e7d4f 52%, var(--dsw-alias-label-primary)); }
        .aptat-tok-string { color: #b45309; color: color-mix(in srgb, #b45309 58%, var(--dsw-alias-label-primary)); }
        .aptat-tok-number { color: #a16207; color: color-mix(in srgb, #a16207 62%, var(--dsw-alias-label-primary)); }
        .aptat-tok-keyword { color: #2563eb; color: color-mix(in srgb, #2563eb 62%, var(--dsw-alias-label-primary)); }
        .aptat-tok-type { color: #0f766e; color: color-mix(in srgb, #0f766e 66%, var(--dsw-alias-label-primary)); }
        .aptat-tok-function { color: #7c3aed; color: color-mix(in srgb, #7c3aed 56%, var(--dsw-alias-label-primary)); }
        .aptat-tok-preproc { color: #a21caf; color: color-mix(in srgb, #a21caf 54%, var(--dsw-alias-label-primary)); }
        .aptat-tok-constant { color: #b45309; color: color-mix(in srgb, #b45309 60%, var(--dsw-alias-label-primary)); }
        .aptat-tok-operator { color: var(--dsw-alias-label-secondary); }
        .aptat-lang-chip { display: inline-flex; align-items: center; height: 15px; padding: 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 3px; color: var(--dsw-alias-brand-primary); font-size: 8.5px; letter-spacing: .04em; }
        .aptat-harness-note { position: absolute; right: 12px; bottom: 8px; display: flex; gap: 5px; align-items: center; max-width: 70%; padding: 4px 7px; border-radius: 4px; background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 12%, var(--dsw-alias-bg-layer-1)); color: var(--dsw-alias-state-warn-primary); font-size: 9px; pointer-events: none; }
        .aptat-stdin-panel { flex: 1 1 auto; min-height: 100px; display: flex; flex-direction: column; padding: 9px 13px; }
        .aptat-stdin-head { display: flex; gap: 8px; align-items: baseline; margin-bottom: 5px; }
        .aptat-stdin-head strong { font-size: 10px; }
        .aptat-stdin-area { flex: 1; resize: none; border: 1px solid var(--dsw-alias-border-l1); border-radius: 5px; background: var(--dsw-alias-bg-base); padding: 8px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 11px; line-height: 1.5; outline: 0; }
        .aptat-stdin-area:focus { border-color: var(--dsw-alias-brand-primary); }
        .aptat-editor-actions { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 12px; border-top: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
        .aptat-action-group { display: flex; align-items: center; gap: 5px; }
        .aptat-result { flex: 0 0 auto; display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-top: 1px solid var(--dsw-alias-border-l1); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, var(--dsw-alias-bg-layer-1)); }
        .aptat-result.is-partial { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 8%, var(--dsw-alias-bg-layer-1)); }
        .aptat-result-stamp { width: 52px; height: 52px; flex: 0 0 52px; display: grid; place-items: center; border: 2px solid var(--dsw-alias-state-success-primary); color: var(--dsw-alias-state-success-primary); border-radius: 50%; transform: rotate(-6deg); font-family: "Cascadia Mono", Consolas, monospace; line-height: 1; }
        .aptat-result.is-partial .aptat-result-stamp { border-color: var(--dsw-alias-state-warn-primary); color: var(--dsw-alias-state-warn-primary); }
        .aptat-result-stamp strong { font-size: 22px; letter-spacing: -.06em; }
        .aptat-result-stamp span { font-size: 8px; margin-top: 2px; }
        .aptat-result-copy { min-width: 0; flex: 1; }
        .aptat-result-title { font-size: 12px; font-weight: 600; }
        .aptat-result-copy p { margin: 2px 0 0; font-size: 10.5px; color: var(--dsw-alias-label-secondary); max-height: 44px; overflow: auto; white-space: pre-wrap; }
        .aptat-result-copy small { font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; color: var(--dsw-alias-label-secondary); opacity: .8; }
        .aptat-terminal { flex: 0 0 190px; min-height: 130px; display: flex; flex-direction: column; border-top: 1px solid var(--dsw-alias-border-l1); background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 55%, var(--dsw-alias-bg-base)); }
        .aptat-terminal-head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 5px 11px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
        .aptat-terminal-title { display: flex; align-items: center; gap: 7px; font-size: 10px; color: var(--dsw-alias-label-secondary); }
        .aptat-terminal-title strong { color: var(--dsw-alias-label-primary); font-weight: 600; }
        .aptat-term-state { font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; padding: 1px 5px; border-radius: 3px; border: 1px solid var(--dsw-alias-border-l1); }
        .aptat-term-state.is-busy { color: var(--dsw-alias-state-warn-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 35%, transparent); }
        .aptat-terminal-tools { display: flex; gap: 5px; }
        .aptat-terminal-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 4px 11px 5px; }
        .aptat-pty { overflow-y: auto; overflow-x: hidden; cursor: text; outline: 0; background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 40%, var(--dsw-alias-bg-base)); }
        .aptat-smart-term { overflow-y: auto; background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 45%, var(--dsw-alias-bg-base)); }
        .aptat-smart-term .aptat-terminal-output { overflow: visible; white-space: pre-wrap; word-break: break-word; }
        .aptat-stdin-line { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; margin-top: 4px; padding-top: 5px; border-top: 1px dashed color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent); }
        .aptat-stdin-line input { flex: 1; border: 0; background: transparent; outline: 0; font-family: "Cascadia Mono", Consolas, monospace; font-size: 11px; color: var(--dsw-alias-label-primary); padding: 3px 0; }
        .aptat-stdin-line input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .65; }
        .aptat-ai-analyze { color: var(--dsw-alias-state-warn-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 40%, transparent); }
        .aptat-term-ai-note { flex: 0 0 auto; padding: 3px 11px 5px; font-size: 9px; color: var(--dsw-alias-label-secondary); }
        .aptat-pty:focus { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 35%, transparent); }
        .aptat-pty .aptat-terminal-output { overflow: visible; white-space: pre-wrap; word-break: break-all; }
        .aptat-terminal-output { flex: 1 1 auto; min-height: 0; overflow: auto; margin: 0; font-family: "Cascadia Mono", Consolas, monospace; font-size: 10.5px; line-height: 1.58; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); scrollbar-width: thin; }
        .aptat-term-line.is-cmd { color: var(--dsw-alias-brand-primary); }
        .aptat-term-line.is-meta { color: var(--dsw-alias-label-secondary); opacity: .75; }
        .aptat-term-line.is-err { color: var(--dsw-alias-state-error-primary); }
        .aptat-term-line.is-hint { color: var(--dsw-alias-state-warn-primary); }
        .aptat-term-empty { color: var(--dsw-alias-label-secondary); opacity: .7; }
        .aptat-term-cursor { color: var(--dsw-alias-brand-primary); animation: aptat-blink 1s steps(2) infinite; }
        @keyframes aptat-blink { 50% { opacity: 0; } }
        .aptat-terminal-input-row { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; border-top: 1px solid var(--dsw-alias-border-l1); padding-top: 3px; margin-top: 2px; }
        .aptat-prompt { color: var(--dsw-alias-brand-primary); font-family: "Cascadia Mono", Consolas, monospace; font-size: 11px; }
        .aptat-terminal-input-row input { flex: 1; border: 0; background: transparent; outline: 0; font-family: "Cascadia Mono", Consolas, monospace; font-size: 10.5px; color: var(--dsw-alias-label-primary); padding: 3px 0; }
        .aptat-terminal-foot { flex: 0 0 auto; padding: 2px 11px 4px; font-size: 8.5px; color: var(--dsw-alias-label-secondary); opacity: .7; }
        .aptat-tutor { min-width: 0; min-height: 0; position: relative; display: flex; flex-direction: column; border-left: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
        .aptat-tutor-resizer { position: absolute; left: -5px; top: 0; bottom: 0; width: 10px; cursor: col-resize; z-index: 8; touch-action: none; display: grid; place-items: center; }
        .aptat-tutor-resizer::after { content: ''; position: absolute; left: 4px; top: 0; bottom: 0; width: 2px; background: transparent; transition: background .15s ease, box-shadow .15s ease; }
        .aptat-tutor-resizer:hover::after, .aptat-tutor.is-resizing .aptat-tutor-resizer::after { background: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 35%, transparent); }
        .aptat-tutor-resizer:focus-visible { outline: none; }
        .aptat-tutor-resizer:focus-visible::after { background: var(--dsw-alias-brand-primary); }
        .aptat-resizer-grip { width: 4px; height: 26px; border-radius: 3px; background: var(--dsw-alias-border-l2); opacity: 0; transition: opacity .15s ease; position: relative; z-index: 1; }
        .aptat-tutor-resizer:hover .aptat-resizer-grip, .aptat-tutor.is-resizing .aptat-resizer-grip { opacity: 1; }
        .aptat-tutor.is-resizing { user-select: none; }
        .aptat-tutor.is-resizing .aptat-tutor-resizer::after { background: var(--dsw-alias-brand-primary); }
        .aptat-app.tutor-closed .aptat-tutor { display: none; }
        .aptat-tutor-head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 12px 12px 8px; }
        .aptat-tutor-title { display: flex; align-items: center; gap: 8px; }
        .aptat-tutor-mark { width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent); color: var(--dsw-alias-brand-primary); }
        .aptat-tutor-title strong { display: block; font-size: 12px; }
        .aptat-tutor-title span { display: block; font-size: 9px; color: var(--dsw-alias-label-secondary); }
        .aptat-tutor-head-actions { display: flex; gap: 2px; }
        .aptat-tutor-close { display: none; }
        .aptat-tutor-model { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; margin: 0 12px 7px; padding: 4px 7px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 4px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; color: var(--dsw-alias-label-secondary); overflow: visible; white-space: nowrap; position: relative; }
        .aptat-model-picker { display: inline-flex; align-items: center; gap: 4px; border: 0; background: transparent; color: var(--dsw-alias-label-secondary); padding: 1px 2px; border-radius: 3px; font: inherit; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
        .aptat-model-picker:hover:not(:disabled) { color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent); }
        .aptat-model-picker span { overflow: hidden; text-overflow: ellipsis; }
        .aptat-model-dropdown { position: absolute; top: calc(100% + 4px); left: -1px; right: -1px; z-index: 30; max-height: 260px; overflow-y: auto; background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,.22); padding: 4px; scrollbar-width: thin; }
        .aptat-model-group { margin-bottom: 4px; }
        .aptat-model-group:last-child { margin-bottom: 0; }
        .aptat-model-group-name { font-size: 8.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--dsw-alias-label-secondary); padding: 3px 5px 2px; opacity: .8; }
        .aptat-model-option { display: block; width: 100%; text-align: left; border: 0; background: transparent; color: var(--dsw-alias-label-primary); font-size: 10px; padding: 4px 6px; border-radius: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aptat-model-option:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
        .aptat-model-option.is-current { color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
        .aptat-model-group-empty { padding: 3px 5px; font-size: 9px; color: var(--dsw-alias-label-secondary); opacity: .7; }
        .aptat-model-error { display: flex; align-items: flex-start; gap: 6px; padding: 6px; font-size: 9.5px; line-height: 1.5; color: var(--dsw-alias-label-primary); }
        .aptat-model-error > span { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
        .aptat-model-error > .aptat-icon { flex: 0 0 auto; margin-top: 1px; color: var(--dsw-alias-state-error-primary); }
        .aptat-model-dropdown-loading { display: flex; align-items: center; gap: 6px; padding: 6px; font-size: 9px; color: var(--dsw-alias-label-secondary); }
        .aptat-model-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--dsw-alias-brand-primary); }
        .aptat-rule-count { margin-left: auto; padding-left: 8px; color: var(--dsw-alias-brand-primary); white-space: nowrap; opacity: .85; }
        .aptat-tutor-modes { flex: 0 0 auto; display: flex; gap: 3px; padding: 0 12px 8px; overflow-x: auto; }
        .aptat-tutor-modes button { border: 1px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary); font-size: 9.5px; padding: 3px 6px; border-radius: 4px; white-space: nowrap; }
        .aptat-tutor-modes button.is-active { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l1); color: var(--dsw-alias-label-primary); }
        .aptat-chat { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 3px 12px 10px; scrollbar-width: thin; }
        .aptat-chat-empty { padding: 18px 5px; }
        .aptat-chat-empty-mark { width: 44px; height: 44px; border-radius: 11px; display: grid; place-items: center; color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); margin-bottom: 10px; }
        .aptat-chat-empty h3 { margin: 0 0 5px; font-family: "Iowan Old Style", "Palatino Linotype", "Songti SC", serif; font-size: 19px; line-height: 1.2; font-weight: 600; letter-spacing: -.02em; }
        .aptat-chat-empty p { margin: 0 0 12px; font-size: 11px; line-height: 1.65; color: var(--dsw-alias-label-secondary); }
        .aptat-message { margin: 9px 0; }
        .aptat-message-label { font-family: "Cascadia Mono", Consolas, monospace; font-size: 8.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--dsw-alias-label-secondary); margin-bottom: 3px; }
        .aptat-message.is-user { margin-left: 18px; }
        .aptat-message.is-user .aptat-message-label { color: color-mix(in srgb, #3b82f6 72%, var(--dsw-alias-label-secondary)); }
        .aptat-message.is-user .aptat-message-text { background: color-mix(in srgb, #3b82f6 15%, var(--dsw-alias-bg-layer-2)); border: 1px solid color-mix(in srgb, #3b82f6 30%, var(--dsw-alias-border-l1)); border-left: 3px solid color-mix(in srgb, #3b82f6 78%, transparent); border-radius: 4px 7px 7px 7px; padding: 7px 9px; white-space: pre-wrap; font-size: 11px; color: var(--dsw-alias-label-primary); }
        .aptat-message.is-assistant { margin-right: 2px; }
        .aptat-message.is-assistant .aptat-message-label { color: color-mix(in srgb, var(--dsw-alias-brand-primary) 65%, var(--dsw-alias-label-secondary)); }
        .aptat-message.is-assistant .aptat-markdown { font-size: 11.5px; line-height: 1.65; color: var(--dsw-alias-label-primary); }
        .aptat-message.is-flash .aptat-message-text { animation: aptat-message-flash 1.3s ease; }
        @keyframes aptat-message-flash { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, #3b82f6 55%, transparent); } 30% { box-shadow: 0 0 0 4px color-mix(in srgb, #3b82f6 40%, transparent); } 100% { box-shadow: 0 0 0 0 transparent; } }
        .aptat-chat-nav { flex: 0 0 auto; display: flex; align-items: center; gap: 5px; padding: 0 12px 7px; }
        .aptat-chat-nav-hint { margin-left: auto; font-size: 8.5px; color: var(--dsw-alias-label-secondary); opacity: .75; white-space: nowrap; }
        .aptat-markdown p { margin: 5px 0; }
        .aptat-markdown h3, .aptat-markdown h4, .aptat-markdown h5, .aptat-markdown h6 { margin: 11px 0 4px; font-size: 12px; line-height: 1.35; }
        .aptat-markdown ul, .aptat-markdown ol { margin: 5px 0; padding-left: 18px; }
        .aptat-markdown li { margin: 2px 0; }
        .aptat-markdown strong { font-weight: 650; }
        .aptat-md-table-wrap { margin: 7px 0; overflow-x: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 5px; background: var(--dsw-alias-bg-base); }
        .aptat-md-table { width: 100%; min-width: 100%; border-collapse: collapse; font-size: 10.2px; line-height: 1.5; }
        .aptat-md-table th, .aptat-md-table td { padding: 5px 7px; border-right: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); vertical-align: top; white-space: normal; overflow-wrap: anywhere; min-width: 54px; }
        .aptat-md-table th:last-child, .aptat-md-table td:last-child { border-right: 0; }
        .aptat-md-table tbody tr:last-child td { border-bottom: 0; }
        .aptat-md-table th { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); font-weight: 650; white-space: nowrap; }
        .aptat-md-table .is-center { text-align: center; }
        .aptat-md-table .is-right { text-align: right; }
        .aptat-md-table .is-left { text-align: left; }
        .aptat-md-table .aptat-math { white-space: normal; }
        .aptat-md-table .aptat-inline-code { white-space: nowrap; }
        .aptat-math-line { margin: 3px 0; overflow-x: auto; }
        .aptat-math { display: inline-block; font-family: "Cambria Math", "STIX Two Math", "Times New Roman", serif; font-size: 1.06em; line-height: 1.55; white-space: nowrap; vertical-align: middle; }
        .aptat-math.is-block { display: block; text-align: center; margin: 5px 0; white-space: normal; overflow-x: auto; }
        .aptat-math-var { font-style: italic; }
        .aptat-math-fn { font-style: normal; margin-right: .1em; }
        .aptat-math-op { margin: 0 .12em; }
        .aptat-math-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 .14em; font-size: .95em; line-height: 1.08; }
        .aptat-math-num { padding: 0 .18em; }
        .aptat-math-den { border-top: 1px solid currentColor; padding: 0 .18em; }
        .aptat-math-script sub, .aptat-math-script sup { font-size: .68em; line-height: 0; }
        .aptat-math-sqrt { display: inline-flex; align-items: flex-start; margin: 0 .08em; }
        .aptat-math-radical { font-size: 1.22em; line-height: .95; }
        .aptat-math-radicand { border-top: 1px solid currentColor; padding: 0 .14em; margin-left: -.03em; }
        .aptat-math-index { font-size: .55em; line-height: 1; margin-right: -.15em; }
        .aptat-math-overline { border-top: 1px solid currentColor; padding-top: 1px; }
        .aptat-math-accent { display: inline-flex; flex-direction: column; align-items: center; }
        .aptat-math-accent-mark { font-size: .75em; line-height: .8; margin-bottom: -.1em; }
        .aptat-math-bold { font-weight: 700; }
        .aptat-math-italic { font-style: italic; }
        .aptat-inline-code { font-family: "Cascadia Mono", Consolas, monospace; font-size: .92em; padding: 0 3px; border-radius: 3px; background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); }
        .aptat-code-block { margin: 7px 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 5px; overflow: hidden; background: var(--dsw-alias-bg-base); }
        .aptat-code-block-head { display: flex; align-items: center; gap: 5px; padding: 3px 6px; background: var(--dsw-alias-bg-layer-2); border-bottom: 1px solid var(--dsw-alias-border-l1); font-family: "Cascadia Mono", Consolas, monospace; font-size: 8.5px; color: var(--dsw-alias-label-secondary); }
        .aptat-code-block-head span { margin-right: auto; }
        .aptat-code-block pre { margin: 0; padding: 7px 8px; overflow-x: auto; font-family: "Cascadia Mono", Consolas, monospace; font-size: 10px; line-height: 1.55; }
        .aptat-thinking { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary); font-size: 10px; padding: 3px 0; }
        .aptat-stream-cursor { color: var(--dsw-alias-brand-primary); animation: aptat-blink 1s steps(2) infinite; }
        .aptat-composer { flex: 0 0 auto; border-top: 1px solid var(--dsw-alias-border-l1); padding: 7px 10px 8px; background: var(--dsw-alias-bg-layer-1); }
        .aptat-composer textarea { width: 100%; min-height: 56px; max-height: 140px; resize: vertical; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: var(--dsw-alias-bg-base); padding: 7px 8px; font-size: 11px; line-height: 1.5; outline: 0; }
        .aptat-composer textarea:focus { border-color: var(--dsw-alias-brand-primary); }
        .aptat-composer-foot { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-top: 4px; }
        .aptat-send-button { background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-bg-base); padding: 5px 9px; font-size: 10px; }
        .aptat-fineprint { margin: 0; font-size: 8.5px; color: var(--dsw-alias-label-secondary); opacity: .8; }
        .aptat-tutor-stub { position: absolute; right: 12px; bottom: 12px; z-index: 6; }
        .aptat-tutor-stub button { display: inline-flex; align-items: center; gap: 6px; background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2); border-radius: 7px; padding: 7px 9px; color: var(--dsw-alias-label-primary); box-shadow: 0 6px 22px rgba(0,0,0,.14); font-size: 11px; }
        .aptat-setup-wrap { height: 100%; overflow: auto; display: grid; place-items: center; padding: 28px; background: var(--dsw-alias-bg-base); }
        .aptat-setup { width: min(860px, 100%); display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 42px; align-items: center; }
        .aptat-setup-copy h1 { margin: 8px 0 12px; font-family: "Iowan Old Style", "Palatino Linotype", "Songti SC", "SimSun", serif; font-size: clamp(32px, 4vw, 48px); line-height: 1.04; letter-spacing: -.04em; font-weight: 600; max-width: 10ch; }
        .aptat-lede { max-width: 46ch; margin: 0 0 20px; font-size: 13px; line-height: 1.7; color: var(--dsw-alias-label-secondary); }
        .aptat-setup-diagram { display: flex; align-items: center; gap: 8px; padding: 12px 0 18px; border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); max-width: 400px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 9px; letter-spacing: .04em; color: var(--dsw-alias-label-secondary); }
        .aptat-setup-diagram i { flex: 1; height: 1px; background: var(--dsw-alias-border-l2); }
        .aptat-privacy { max-width: 42ch; margin: 16px 0 0; font-size: 10px; line-height: 1.6; color: var(--dsw-alias-label-secondary); opacity: .8; }
        .aptat-setup-card { background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 20px; box-shadow: 0 18px 50px rgba(0,0,0,.10); }
        .aptat-field { margin-bottom: 12px; }
        .aptat-field label { display: block; margin-bottom: 4px; font-size: 10px; font-weight: 600; color: var(--dsw-alias-label-secondary); letter-spacing: .03em; }
        .aptat-field input { width: 100%; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: var(--dsw-alias-bg-base); padding: 9px 10px; font-size: 12px; outline: 0; }
        .aptat-field input:focus { border-color: var(--dsw-alias-brand-primary); }
        .aptat-password-row { display: flex; gap: 4px; align-items: center; }
        .aptat-password-row .aptat-ghost-button { flex: 0 0 auto; font-size: 9px; padding: 6px; }
        .aptat-setup-card .aptat-check { margin: 12px 0; }
        .aptat-setup-card .aptat-primary-button { margin-top: 4px; }
        .aptat-error { display: flex; gap: 6px; align-items: flex-start; padding: 7px 8px; margin: 8px 0; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 38%, var(--dsw-alias-border-l1)); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent); border-radius: 5px; color: var(--dsw-alias-state-error-primary); font-size: 10.5px; line-height: 1.5; }
        .aptat-fatal { height: 100%; display: grid; place-items: center; padding: 24px; background: var(--dsw-alias-bg-base); }
        .aptat-fatal-card, .aptat-loading-card { max-width: 440px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 30px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); }
        .aptat-fatal-card h1 { margin: 0; font-size: 22px; }
        .aptat-fatal-card p { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; }
        .aptat-loading-card strong { font-size: 14px; }
        .aptat-loading-card span { font-size: 11px; color: var(--dsw-alias-label-secondary); }
        .aptat-spinner { width: 18px; height: 18px; display: inline-block; border: 2px solid color-mix(in srgb, var(--dsw-alias-label-secondary) 30%, transparent); border-top-color: var(--dsw-alias-brand-primary); border-radius: 50%; animation: aptat-spin .8s linear infinite; }
        .aptat-spinner-sm { width: 12px; height: 12px; border-width: 1.6px; }
        @keyframes aptat-spin { to { transform: rotate(360deg); } }
        .aptat-modal-backdrop { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 20px; background: color-mix(in srgb, #000 44%, transparent); backdrop-filter: blur(2px); }
        .aptat-modal { width: min(520px, 100%); background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; box-shadow: 0 24px 80px rgba(0,0,0,.32); padding: 18px; }
        .aptat-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .aptat-modal-head h2 { margin: 4px 0 0; font-family: "Iowan Old Style", "Palatino Linotype", "Songti SC", serif; font-size: 24px; letter-spacing: -.02em; }
        .aptat-modal-lede { margin: 8px 0 12px; font-size: 11.5px; line-height: 1.6; color: var(--dsw-alias-label-secondary); }
        .aptat-submit-summary { display: grid; gap: 1px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; overflow: hidden; }
        .aptat-submit-summary > div { display: flex; justify-content: space-between; gap: 10px; padding: 7px 9px; background: var(--dsw-alias-bg-base); font-size: 10.5px; }
        .aptat-submit-summary span { color: var(--dsw-alias-label-secondary); }
        .aptat-submit-summary strong { font-family: "Cascadia Mono", Consolas, monospace; font-weight: 500; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .aptat-submit-progress { display: flex; gap: 10px; align-items: flex-start; padding: 12px 0 2px; }
        .aptat-submit-progress strong { font-size: 12px; }
        .aptat-submit-progress p { margin: 2px 0 0; font-size: 10px; color: var(--dsw-alias-label-secondary); }
        .aptat-modal-actions { display: flex; justify-content: flex-end; gap: 7px; margin-top: 14px; }
        .aptat-toast { position: fixed; right: 18px; bottom: 18px; z-index: 70; display: flex; align-items: center; gap: 7px; padding: 8px 11px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 7px; background: var(--dsw-alias-bg-overlay); box-shadow: 0 8px 28px rgba(0,0,0,.2); font-size: 11px; max-width: 380px; }
        .aptat-toast.is-error { color: var(--dsw-alias-state-error-primary); }
        .aptat-toast.is-success { color: var(--dsw-alias-state-success-primary); }
        .aptat-toast.is-warn { color: var(--dsw-alias-state-warn-primary); }
        .aptat-no-task { flex: 1; display: grid; place-items: center; color: var(--dsw-alias-label-secondary); font-size: 12px; }
        .aptat-mobile-select { display: none; max-width: 170px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 5px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: 10px; padding: 6px 7px; }
        .aptat-app.is-focus { position: fixed; inset: 0; z-index: 10000; width: 100vw; height: 100dvh; max-height: 100dvh; border: 0; border-radius: 0; box-shadow: 0 0 0 1px var(--dsw-alias-border-l2); }
        @media (min-width: 1081px) {
          .aptat-app.is-focus .aptat-body { grid-template-columns: 308px minmax(0, 1fr) var(--aptat-tutor-width, 430px); }
          .aptat-app.is-focus.tutor-closed .aptat-body { grid-template-columns: 308px minmax(0, 1fr); }
          .aptat-app.is-focus.rail-closed .aptat-body { grid-template-columns: minmax(0, 1fr) var(--aptat-tutor-width, 430px); }
          .aptat-app.is-focus.rail-closed.tutor-closed .aptat-body { grid-template-columns: minmax(0, 1fr); }
          .aptat-app.is-focus .aptat-problem { max-height: 43%; }
          .aptat-app.is-focus .aptat-terminal { flex-basis: 226px; }
          .aptat-app.is-focus .aptat-problem-title-row h1 { font-size: 29px; }
        }
        @media (min-width: 1600px) {
          .aptat-app.is-focus .aptat-body { grid-template-columns: 330px minmax(0, 1fr) var(--aptat-tutor-width, 468px); }
          .aptat-app.is-focus.tutor-closed .aptat-body { grid-template-columns: 330px minmax(0, 1fr); }
          .aptat-app.is-focus.rail-closed .aptat-body { grid-template-columns: minmax(0, 1fr) var(--aptat-tutor-width, 468px); }
          .aptat-app.is-focus.rail-closed.tutor-closed .aptat-body { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 1280px) {
          .aptat-body { grid-template-columns: 250px minmax(0, 1fr) var(--aptat-tutor-width, 344px); }
          .aptat-app.tutor-closed .aptat-body { grid-template-columns: 250px minmax(0, 1fr); }
          .aptat-problem-title-row h1 { font-size: 23px; }
        }
        @media (max-width: 1080px) {
          .aptat-body { grid-template-columns: 238px minmax(0, 1fr); }
          .aptat-app.rail-closed .aptat-body { grid-template-columns: minmax(0, 1fr); }
          .aptat-tutor { position: absolute; z-index: 20; top: 0; right: 0; bottom: 0; width: min(390px, 94vw); box-shadow: -18px 0 60px rgba(0,0,0,.20); transform: translateX(102%); transition: transform .2s ease; }
          .aptat-tutor-resizer { display: none; }
          .aptat-tutor.is-open { transform: translateX(0); }
          .aptat-tutor-close { display: grid; }
          .aptat-app.tutor-closed .aptat-body { grid-template-columns: 238px minmax(0, 1fr); }
          .aptat-app.rail-closed.tutor-closed .aptat-body { grid-template-columns: minmax(0, 1fr); }
          .aptat-topbar-stats { display: none; }
        }
        @media (max-width: 760px) {
          .aptat-app { font-size: 12px; }
          .aptat-topbar { height: auto; min-height: 54px; flex-wrap: wrap; padding: 8px 10px; gap: 8px; }
          .aptat-brand { min-width: 0; flex: 1; }
          .aptat-brand span { display: none; }
          .aptat-topbar-actions { gap: 4px; }
          .aptat-account-chip { display: none; }
          .aptat-rail-toggle { display: none; }
          .aptat-focus-label { display: none; }
          .aptat-focus-button { padding: 7px 8px; }
          .aptat-body, .aptat-app.tutor-closed .aptat-body { grid-template-columns: 1fr; }
          .aptat-rail { display: none; }
          .aptat-mobile-select { display: block; }
          .aptat-problem { max-height: 34%; }
          .aptat-problem-title-row h1 { font-size: 21px; }
          .aptat-problem-head { padding: 12px 13px 8px; }
          .aptat-problem-body { padding: 0 13px 10px; }
          .aptat-cursor-position { display: none; }
          .aptat-editor-actions { flex-wrap: wrap; }
          .aptat-terminal { flex-basis: 170px; }
          .aptat-setup { grid-template-columns: 1fr; gap: 18px; }
          .aptat-setup-wrap { padding: 16px; }
          .aptat-setup-diagram { max-width: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aptat-app *, .aptat-app *::before, .aptat-app *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
      `
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        const zhDispose = ctx.locale.register(NAMESPACE, 'zh', ZH)
        const enDispose = ctx.locale.register(NAMESPACE, 'en', EN)
        const bound = ctx.locale.bind(NAMESPACE)

        ctx.effect(() => {
          const dispose = ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
            name: 'sidebar.panellist',
            id: NAMESPACE,
            order: 20,
            label: () => bound('nav.label'),
          }, AppIcon))
          return dispose
        }, 'aptat sidebar entry')

        ctx.effect(() => {
          const dispose = ctx.slots.inject('main', () => ctx.slots.register({
            name: 'main',
            key: NAMESPACE,
          }, (props) => h(Workbench, { ...props, ctx })))
          return dispose
        }, 'aptat main panel')

        ctx.effect(() => {
          const disposeStyles = makeStyleApi().insert(applyStyles())
          return () => {
            disposeStyles()
            zhDispose()
            enDispose()
          }
        }, 'aptat styles and locale')
      },
    }
  },
})
