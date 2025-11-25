# Chrome 插件编译与安装指南

本项目是一个基于 React + Tailwind CSS 的 Chrome 浏览器扩展程序。
由于 Chrome Manifest V3 安全策略限制，插件不能直接引用远程 CDN 脚本（如 `react`, `tailwindcss`），因此我们需要使用构建工具（Vite）将代码编译为本地静态文件。

以下是从零开始构建并安装此插件的完整步骤。

## 1. 环境准备

确保您的电脑已安装：
- **Node.js** (推荐 v18 或更高版本)
- **npm** (通常随 Node.js 一起安装)

## 2. 初始化项目结构

在您的项目根目录下，执行以下操作：

### 2.1 初始化 package.json

打开终端（命令行），运行以下命令初始化项目并安装依赖：

```bash
npm init -y
npm install react react-dom @google/genai
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer typescript @types/react @types/react-dom
```

### 2.2 创建构建配置文件

在项目根目录创建以下配置文件：

**`vite.config.ts`** (Vite 配置)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
```

**`tailwind.config.js`** (Tailwind 配置)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#2d3748',
          850: '#1a202c',
          950: '#0d1117',
        }
      }
    },
  },
  plugins: [],
}
```

**`postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**`tsconfig.json`** (TypeScript 配置)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 3. 整理源码结构

为了符合构建工具的标准，请按照以下结构移动文件：

1.  创建一个 `src` 文件夹。
2.  将以下文件/文件夹**移动到 `src` 文件夹中**：
    - `index.tsx`
    - `App.tsx`
    - `types.ts`
    - `i18n.tsx`
    - `components/` (整个目录)
    - `services/` (整个目录)
    - `utils/` (整个目录)
3.  创建一个 `public` 文件夹。
4.  将 `manifest.json` 和图标文件（如有 `icon.png`）**移动到 `public` 文件夹中**。
5.  修改根目录下的 `index.html`：

**更新后的 `index.html`** (移除 CDN，使用本地入口):
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevUtils Pro</title>
    <!-- Tailwind CSS 指令将通过构建工具注入 -->
    <style>
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    </style>
  </head>
  <body class="bg-slate-950 text-slate-200 antialiased overflow-hidden">
    <div id="root" class="w-[780px] h-[580px] flex flex-col"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

注意：您需要在 `src/index.tsx` 的最顶部添加一行 CSS 导入（如果构建报错找不到样式）：
`import './index.css';` 
并在 `src/index.css` 中写入：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 4. 编译项目

在终端运行：

```bash
npx vite build
```

如果一切顺利，您将在项目根目录下看到一个新生成的 `dist` 文件夹。
这个 `dist` 文件夹包含了所有打包好的 HTML、JS、CSS 和 manifest.json 文件，这就是您的 Chrome 插件包。

## 5. 安装到 Chrome 浏览器

1.  打开 Chrome 浏览器。
2.  在地址栏输入 `chrome://extensions/` 并回车。
3.  在右上角开启 **"开发者模式" (Developer mode)** 开关。
4.  点击左上角的 **"加载已解压的扩展程序" (Load unpacked)** 按钮。
5.  在文件选择弹窗中，选择您的项目目录下的 **`dist`** 文件夹。

## 6. 使用插件

安装完成后，您会在 Chrome 浏览器的扩展程序工具栏中看到 "DevUtils Pro" 的图标。点击图标即可打开工具箱使用！

## 常见问题

- **API Key 问题**: 如果使用了 AI 功能（如 ASCII 生成），请确保代码中正确配置了 API Key，或者在构建前将 Key 注入到环境变量中。对于发布版插件，通常建议在插件设置页让用户输入自己的 Key。
- **样式丢失**: 确保 `index.html` 或入口 `index.tsx` 正确引用了包含 `@tailwind` 指令的 CSS 文件。
