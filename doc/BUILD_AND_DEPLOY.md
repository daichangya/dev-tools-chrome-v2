# 构建与部署指南 (Build & Deploy Guide)

本项目支持两种部署模式：
1.  **Chrome 浏览器扩展程序 (Extension)**
2.  **Web 应用程序 (Vercel / Static Web)**

---

## 1. 准备工作

确保本地安装了 Node.js (v18+) 和 NPM。

```bash
# 安装依赖
npm install
```

---

## 2. 部署为 Chrome 扩展程序

由于 Manifest V3 禁止远程代码，我们需要构建本地包。

### 步骤
1.  **构建项目**:
    ```bash
    npm run build
    # 或者直接使用 vite
    npx vite build
    ```
    构建完成后会生成 `dist` 目录。

2.  **加载到 Chrome**:
    *   打开 Chrome 浏览器，访问 `chrome://extensions/`
    *   开启右上角的 **开发者模式 (Developer mode)**
    *   点击左上角的 **加载已解压的扩展程序 (Load unpacked)**
    *   选择本项目根目录下的 `dist` 文件夹。

### 注意事项
*   扩展程序模式下，窗口大小固定为 `780x580`。
*   API Key 可以通过环境变量注入，或在代码中硬编码（不推荐用于公开项目）。

---

## 3. 部署到 Vercel (Web 应用)

Web 模式下，应用会自动全屏显示，适配各种屏幕尺寸。

### 方式 A: 使用 Vercel CLI (推荐)
1.  安装 CLI: `npm i -g vercel`
2.  在项目根目录运行:
    ```bash
    vercel
    ```
3.  按照提示操作。在 "Environment Variables" 步骤，添加您的 Gemini API Key:
    *   Key: `VITE_API_KEY`
    *   Value: `您的_google_api_key`

### 方式 B: 连接 GitHub 自动部署
1.  将代码推送到 GitHub 仓库。
2.  登录 [Vercel Dashboard](https://vercel.com)。
3.  点击 "Add New Project"，导入您的 GitHub 仓库。
4.  在 **Settings > Environment Variables** 中添加:
    *   `VITE_API_KEY`: 您的 Gemini API Key
5.  点击 **Deploy**。

### 环境变量说明
对于 Web 构建 (Vite)，环境变量必须以 `VITE_` 开头才能被前端代码访问。
*   请在项目根目录创建 `.env` 文件用于本地开发：
    ```
    VITE_API_KEY=AIzaSy...
    ```

---

## 4. 开发指南

### 本地启动开发服务器 (Web 模式)
```bash
npm run dev
# 或
npx vite
```
这将启动一个本地服务器 (通常是 http://localhost:5173)，您可以在浏览器中直接调试 Web 版界面。

### 目录结构
*   `src/components/tools`: 所有工具的独立组件。
*   `src/utils/toolLogic.ts`: 核心纯函数逻辑（转换、格式化等）。
*   `src/i18n.tsx`: 多语言配置。
*   `src/services`: 外部 API 调用 (Gemini)。