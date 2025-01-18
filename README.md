# Lottie 动画编辑器
使用地址:https://zimai233.github.io/loottie-/
一个基于React的Lottie动画编辑器，用于创建和编辑Lottie动画。

## 技术栈

- React 18
- Lottie Web
- Material-UI
- Redux Toolkit

## 功能特性

- 可视化编辑Lottie动画
- 实时预览动画效果
- 支持导入/导出Lottie JSON文件
- 图层管理功能
- 关键帧编辑
- 时间轴控制
- 属性面板编辑

## 快速开始

### 环境要求

- Node.js 16+
- npm 8+

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/zimai233/loottie-.git
   ```

2. 安装依赖
   ```bash
   cd loottie-
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm start
   ```

4. 打开浏览器访问 http://localhost:3000

## 项目结构

```
loottie-/
├── public/          # 静态资源
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/             # 源代码
│   ├── components/  # React组件
│   │   ├── Editor.js    # 编辑器组件
│   │   ├── LayerList.js # 图层列表组件
│   │   └── Preview.js   # 预览组件
│   ├── utils/       # 工具函数
│   │   └── lottieUtils.js # Lottie相关工具
│   ├── App.css      # 全局样式
│   ├── App.js       # 主应用组件
│   ├── App.test.js  # 应用测试
│   ├── index.css    # 入口样式
│   ├── index.js     # 入口文件
│   ├── logo.svg     # 应用logo
│   ├── reportWebVitals.js # 性能监控
│   └── setupTests.js # 测试配置
├── package.json     # 项目配置
├── package-lock.json # 依赖锁定
└── README.md        # 项目说明
```

## API 文档

[Lottie Web API 文档](https://airbnb.io/lottie/#/web)

## 示例代码

```javascript
import { Player } from '@lottiefiles/react-lottie-player';

function App() {
  return (
    <Player
      autoplay
      loop
      src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
      style={{ height: '300px', width: '300px' }}
    />
  );
}
```

## 贡献指南

欢迎提交Pull Request或Issue。请遵循以下规范：

1. 代码风格
   - 使用Prettier格式化代码
   - 遵循ESLint规则
   - 组件使用PascalCase命名
   - 工具函数使用camelCase命名

2. 提交信息
   - 使用约定式提交规范
   - 示例：`feat: 添加图层管理功能`

3. 测试要求
   - 新功能需包含单元测试
   - 使用Jest + React Testing Library

4. 文档更新
   - 新功能需更新README文档
   - 重要变更需添加变更日志

## 常见问题

### 1. 如何导入Lottie文件？
点击编辑器左上角的"导入"按钮，选择本地JSON文件即可。

### 2. 如何导出动画？
编辑完成后，点击"导出"按钮即可下载Lottie JSON文件。

### 3. 如何调整动画速度？
在时间轴面板中，拖动速度控制滑块即可调整播放速度。

## 许可证

MIT License

Copyright (c) 2025 Lottie Editor Team
