# Design System - iOS Human Interface Guidelines

本项目遵循 Apple iOS Human Interface Guidelines (人机界面指南)。

---

## 1. 色彩系统

### 1.1 系统主色 (Primary Colors)

| 用途 | 颜色名称 | Hex | 使用场景 |
|------|----------|-----|----------|
| 主色调 | iOS Blue | `#007aff` | 主要按钮、链接、选中状态 |
| 成功 | iOS Green | `#34c759` | 成功状态、确认操作 |
| 警告 | iOS Orange | `#ff9500` | 警告提示 |
| 危险 | iOS Red | `#ff3b30` | 删除、错误、危险操作 |
| 灰色 | iOS Gray | `#8e8e93` | 次要按钮、占位符 |

### 1.2 背景色 (Background Colors)

| 模式 | 层级 | Hex | 使用场景 |
|------|------|-----|----------|
| 亮色 | 主背景 | `#ffffff` | 主要内容区 |
| 亮色 | 次级 | `#f2f2f7` | 分组标题区、输入头部 |
| 亮色 | 三级 | `#f5f5f7` | 页面主背景 |
| 亮色 | 边框 | `#d1d1d6` | 输入框、卡片边框 |
| 暗色 | 主背景 | `#000000` | 页面主背景 |
| 暗色 | 次级 | `#1c1c1e` | 卡片、弹窗背景 |
| 暗色 | 三级 | `#2c2c2e` | 输入头部 |
| 暗色 | 边框 | `#38383a` | 输入框边框 |

### 1.3 文字色 (Text Colors)

| 模式 | 用途 | Hex |
|------|------|-----|
| 亮色 | 主文字 | `#000000` |
| 亮色 | 次文字 | `#666666` |
| 亮色 | 占位符 | `#8e8e93` |
| 暗色 | 主文字 | `#ffffff` |
| 暗色 | 次文字 | `#aaaaaa` |
| 暗色 | 占位符 | `#aeaeb2` |

### 1.4 半透明 (Overlays)

| 用途 | Hex | 不透明度 |
|------|-----|----------|
| 弹窗遮罩 | `#000000` | 30%-40% |
| 轻触反馈 | `#000000` | 5%-10% |
| 暗色轻触 | `#ffffff` | 10%-15% |
| Toast 背景 | `#000000` | 75% |

---

## 2. 排版系统

### 2.1 字体栈 (Font Stack)

```scss
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

### 2.2 字号表 (Type Scale)

| 用途 | 字号 | 字重 | 行高 |
|------|------|------|------|
| 大标题 | 28px | 700 | 1.2 |
| 页面标题 | 20px | 600 | 1.3 |
| 章节标题 | 17px | 600 | 1.3 |
| 正文 | 16px | 400 | 1.4 |
| 次要文字 | 15px | 400 | 1.4 |
| 辅助文字 | 14px | 400 | 1.4 |
| 小标签 | 13px | 500 | 1.3 |
| 状态文字 | 12px | 600 | 1.2 |

### 2.3 字重表 (Font Weight)

| 字重 | 数值 | 使用场景 |
|------|------|----------|
| Regular | 400 | 正文 |
| Medium | 500 | 次要操作、小按钮 |
| Semibold | 600 | 标题、重要按钮文字 |
| Bold | 700 | 大标题、强调 |

---

## 3. 间距系统

### 3.1 基础网格 (Base Grid)

```scss
$spacing-unit: 4px;  // 基础单位
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 20px;
$spacing-2xl: 24px;
$spacing-3xl: 30px;
```

### 3.2 内边距 (Padding)

| 组件 | 值 |
|------|-----|
| 按钮 (大) | 12px 24px |
| 按钮 (中) | 8px 16px |
| 按钮 (小) | 4px 12px |
| 输入框 | 10px / 16px |
| 卡片 | 16px |
| 设置项 | 12px 16px |

### 3.3 圆角 (Border Radius)

| 尺寸 | 用途 | 值 |
|------|------|-----|
| 小 | 按钮、输入框 | 8px |
| 中 | 卡片、弹窗 | 12px |
| 大 | 弹窗主体 | 14px |
| 圆形 | 圆形按钮 | 50% |
| 药丸 | Toast | 20px |

---

## 4. 动画系统

### 4.1 过渡时长 (Duration)

| 类型 | 时长 | 贝塞尔曲线 |
|------|------|-------------|
| 快速交互 | 0.2s | ease |
| 标准过渡 | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |
| 缓入 | 0.3s | ease-out |
| 淡入 | 1s | ease-out |

### 4.2 常用动画

```scss
// 淡入
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

// 缩放弹出 (弹窗)
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

// 淡入
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// 上浮
@keyframes slideDown {
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
```

---

## 5. 组件规范

### 5.1 按钮 (Button)

| 类型 | 背景色 | 文字色 | 圆角 | 交互 |
|------|--------|--------|------|------|
| Primary | `#007aff` | `#ffffff` | 8px | hover: opacity 0.85; translateY(-1px) |
| Default | `#8e8e93` | `#ffffff` | 8px | active: translateY(0) |
| Success | `#34c759` | `#ffffff` | 8px | disabled: opacity 0.5 |
| Warning | `#ff9500` | `#ffffff` | 8px | |
| Danger | `#ff3b30` | `#ffffff` | 8px | |

### 5.2 输入框 (Input)

- 边框: 1px solid `#d1d1d6`
- 圆角: 12px
- 聚焦: 边框 `#007aff` + 3px  rgba(0, 122, 255, 0.1) 外发光
- 标题区背景: `#f2f2f7`
- 禁用: 背景 `#eeeeee`

### 5.3 弹窗 (Dialog)

- 宽度: 270px
- 圆角: 14px
- 阴影: 0 4px 12px rgba(0, 0, 0, 0.15)
- 动画: scaleUp 0.3s ease

### 5.4 侧边栏弹窗 (Modal)

- 宽度: 50% (右侧滑入)
- 过渡: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- 遮罩: rgba(0, 0, 0, 0.3)

### 5.5 Toast

- 位置: 顶部 50px 居中
- 背景: rgba(0, 0, 0, 0.75)
- 圆角: 20px (药丸形)
- 内边距: 10px 20px

### 5.6 设置卡片 (Setting Group)

- 背景: `#ffffff`
- 圆角: 12px
- 阴影: 0 1px 3px rgba(0, 0, 0, 0.05)
- 内边距: 16px
- 间距: 20px

### 5.7 加载动画 (Spinner)

- 尺寸: 16px x 16px
- 边框: 2px solid `#d2d2d7`
- 顶部: 2px solid `#007aff`
- 动画: spin 1s linear infinite

---

## 6. 暗色模式适配

### 6.1 转换规则

| 属性 | 亮色模式 | 暗色模式 |
|------|----------|----------|
| 页面背景 | `#f5f5f7` | `#000000` |
| 卡片背景 | `#ffffff` | `#1c1c1e` |
| 分组背景 | `#f2f2f7` | `#2c2c2e` |
| 边框 | `#d1d1d6` | `#38383a` |
| 主文字 | `#000000` | `#ffffff` |
| 次文字 | `#666666` | `#aaaaaa` |

### 6.2 交互适配

```scss
// Hover 背景
background-color: rgba(0, 0, 0, 0.05) → rgba(255, 255, 255, 0.1)

// 轻触反馈
background-color: rgba(0, 0, 0, 0.1) → rgba(255, 255, 255, 0.15)
```

---

## 7. 无障碍 (Accessibility)

### 7.1 触摸目标

- 最小尺寸: 44px x 44px
- 安全边距: 至少 8px

### 7.2 对比度

- 文字: 至少 4.5:1
- 大文字: 至少 3:1
- 图形: 至少 3:1

---

## 8. 最佳实践

### 8.1 一致性原则

1. **使用系统颜色** - 优先使用 iOS 系统颜色 (#007aff, #34c759 等)
2. **相同的圆角** - 相似元素使用相同圆角值
3. **一致的间距** - 使用 8px 网格系统
4. **统一的动画曲线** - cubic-bezier(0.4, 0, 0.2, 1)

### 8.2 反馈原则

1. **可点击状态** - hover 时提供视觉反馈
2. **点击即时响应** - active 状态立即反馈
3. **加载状态** - 异步操作显示 spinner
4. **禁用状态** - 禁用元素降低不透明度 50%

### 8.3 层次原则

1. **卡片层级** - 使用 subtle 阴影区分
2. **层级过渡** - 弹窗使用半透明遮罩
3. **层级顺序** - 遮罩 1000 → 弹窗 9999 → Toast 10000