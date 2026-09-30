import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ignored = new Set(['node_modules', '.git', '.vitepress', 'dist'])

function titleFromFile(file: string) {
  return path.basename(file, '.md').replace(/^\d+[-_、.]*/, '')
}

function sidebar() {
  const groups = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignored.has(entry.name) && !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }))

  return groups.map((group) => {
    const dir = path.join(root, group.name)
    const items = fs.readdirSync(dir)
      .filter((file) => file.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b, 'zh-CN', { numeric: true }))
      .map((file) => ({
        text: titleFromFile(file),
        link: `/${group.name}/${file.slice(0, -3)}`,
      }))

    return { text: group.name.replace(/^\d+[-_、.]*/, ''), collapsed: true, items }
  }).filter((group) => group.items.length > 0)
}

export default defineConfig({
  lang: 'zh-CN',
  title: '千古前端图文教程',
  description: '面向初学者的 Web 前端知识库',
  base: '/web-book/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '📖',
    nav: [
      { text: '首页', link: '/' },
      { text: 'GitHub', link: 'https://github.com/hmfy/web-book' },
    ],
    sidebar: sidebar(),
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    footer: {
      message: '内容以 Markdown 维护，欢迎指正与贡献。',
      copyright: 'CC BY-NC-SA 4.0',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hmfy/web-book' }],
  },
  markdown: {
    lineNumbers: true,
  },
})
