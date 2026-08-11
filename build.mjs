import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
// 这些文件不列为游戏：首页、本生成页、模板
const SKIP = new Set(['index.html', 'games.html', 'template.html']);

console.log(`[build] 工作目录: ${ROOT}`);
console.log(`[build] node: ${process.version}`);

let files;
try {
  files = readdirSync(ROOT)
    .filter((f) => f.toLowerCase().endsWith('.html') && !SKIP.has(f))
    .sort((a, b) => a.localeCompare(b, 'zh'));
} catch (err) {
  console.error('[build] 读取目录失败:', err);
  process.exit(1);
}
console.log(`[build] 扫描到 ${files.length} 个游戏页面:`, files.join(', ') || '(空)');

function getTitle(file) {
  try {
    const html = readFileSync(join(ROOT, file), 'utf8');
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (m && m[1].trim()) return m[1].trim();
  } catch {}
  return file.replace(/\.html$/i, '');
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const items = files.map((f) => ({ file: f, title: getTitle(f) }));

const cards = items
  .map(
    ({ file, title }) => `      <a class="game" href="${esc(file)}">
        <span class="game-title">${esc(title)}</span>
        <span class="game-file">${esc(file)}</span>
      </a>`
  )
  .join('\n');

const page = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>游戏列表</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #fff;
      padding: 3rem 1.5rem 4rem;
    }
    .wrap { max-width: 960px; margin: 0 auto; }
    .top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
    h1 { font-size: 2.2rem; background: linear-gradient(90deg, #fff, #ffd369); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .back { color: #c9d1e0; text-decoration: none; border: 1px solid rgba(255,255,255,.2); padding: .5rem 1.2rem; border-radius: 999px; transition: .2s; }
    .back:hover { background: rgba(255,255,255,.08); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.2rem; }
    .game { display: flex; flex-direction: column; gap: .4rem; padding: 1.4rem; border-radius: 18px; text-decoration: none; color: #fff; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(12px); transition: transform .2s, box-shadow .2s, border-color .2s; }
    .game:hover { transform: translateY(-4px); border-color: rgba(233,69,96,.6); box-shadow: 0 12px 30px rgba(0,0,0,.35); }
    .game-title { font-size: 1.2rem; font-weight: 600; }
    .game-file { font-size: .8rem; color: #8fa0bd; }
    .empty { color: #8fa0bd; margin-top: 2rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <h1>游戏列表</h1>
      <a class="back" href="index.html">&larr; 返回首页</a>
    </div>
    ${items.length ? `<div class="grid">\n${cards}\n    </div>` : '<p class="empty">还没有游戏页面，把 .html 文件丢进仓库根目录再 push 即可。</p>'}
  </div>
</body>
</html>
`;

try {
  writeFileSync(join(ROOT, 'games.html'), page, 'utf8');
} catch (err) {
  console.error('[build] 写入 games.html 失败:', err);
  process.exit(1);
}
console.log(`✅ 生成 games.html，共 ${items.length} 个游戏页面`);
