# 2026 世界杯比赛模拟器

一个精致的世界杯模拟 Web 应用，支持 **48 支球队、12 个小组、32 强至决赛** 的完整推演。

## ✨ 功能

- **小组赛积分计算**
  - 录入胜负平 → 积分与排名即时刷新
  - "所有情况"逆向推演：锁定球队与目标排名，穷举全部 729 种可能走向
  - "小组第三排名"：12 个小组第三自动按积分排序，前 8 名晋级

- **淘汰赛晋级推演**
  - 完整 32 强对阵树（1/16 → 1/8 → 1/4 → 半决赛 → 决赛 + 三四名）
  - **点击球队一键晋级**，胜者自动进入下一轮
  - 半决赛输方自动填入三四名决赛
  - 16 场 R32 对阵严格遵循 FWC26 官方规程（Article 12.6）
  - 8 个小组第三动态落位基于官方 495 种场景表

- **Apple 风格设计**
  - 毛玻璃卡片 + 柔和阴影
  - Framer Motion 弹簧动画
  - 响应式布局

## 🛠 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | React 19 |
| 语言 | TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 3 |
| 动画 | Framer Motion |
| 状态 | Zustand |
| 路由 | React Router |

## 📁 项目结构

```
src/
├── App.tsx                         # 根组件 · 视图路由
├── main.tsx                        # 入口
├── index.css                       # Tailwind 指令
├── components/
│   ├── BracketView.tsx             # 淘汰赛对阵树
│   ├── SmartNavMenu.tsx            # 悬浮导航菜单
│   ├── WebsiteIntro.tsx            # 功能介绍弹窗 + 快捷链接
│   ├── GroupCard.tsx               # 小组卡片
│   ├── GroupModal.tsx              # 小组详情弹窗
│   ├── StandingsTable.tsx          # 积分表
│   ├── MatchPredictor.tsx          # 胜平负选择器
│   ├── PathCard.tsx                # 出线路径卡片
│   ├── PathListView.tsx            # 路径列表
│   └── QualificationScenarios.tsx  # 出线场景展示
├── pages/
│   ├── LandingPage.tsx             # 首页入口
│   ├── HomePage.tsx                # 小组赛页
│   └── AnalysisPage.tsx            # 逆向推演结果页
├── data/
│   ├── groups.ts                   # 12 组球队与赛程
│   ├── teamSortKeys.ts             # 拼音首字母排序
│   └── thirdPlaceMatrix.ts         # 495 种小组第三场景表
├── lib/
│   ├── calculator.ts               # 积分计算引擎
│   └── scenarioStats.ts            # 场景统计
├── logic/
│   └── analysisEngine.ts           # 穷举分析引擎
├── stores/
│   └── analysisStore.ts            # Zustand 状态
└── types/
    └── worldcup.ts                 # TypeScript 类型
```

## 🚀 启动

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173)

## 📊 数据说明

- **小组数据**：12 个小组（A–L），48 支国家队
- **小组第三矩阵**：全部 495 种晋级组合，严格按官方规程落位
- **同分排序**：积分优先，同分按中文队名拼音首字母排序

## ⚠️ 声明

本项目仅供娱乐演示，与 FIFA 无关。
