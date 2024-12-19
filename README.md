# html-card-pro

一个强大而灵活的 Home Assistant 自定义卡片，允许您使用 HTML 模板创建完全自定义的界面。

## 特性

- 完全自定义的 HTML/CSS 界面, 支持实体状态的实时更新
- 支持长按显示更多信息, 支持亮度滑块控制
- 支持外部脚本加载, 自动状态更新

## 安装方法

1. 下载 `html-pro-card.js` 文件
2. 将文件复制到您的 `www` 文件夹中
3. 在 Home Assistant 的 Lovelace 资源中添加：
   ```yaml
   url: /local/html-pro-card.js
   type: module
   ```

## 基础配置

```yaml
type: custom:html-pro-card
content: |
  <div class="grid">
    <div class="light-status" data-entity="light.living_room">
      客厅灯
      <div class="state"></div>
    </div>
  </div>
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| content | string | 必填 | HTML 模板内容 |
| entities | list | 可选 | 需要监控的实体列表 |
| update_interval | number | null | 更新间隔(毫秒) |
| always_update | boolean | false | 是否持续更新 |
| do_not_parse | boolean | false | 是否禁用模板解析 |
| scripts | list | [] | 要加载的外部脚本URL |

## 模板示例

### 基础灯光控制
```html
<div class="light-card">
  <div class="light-status" data-entity="light.living_room" data-action="toggle">
    <div class="light-name">客厅灯</div>
    <div class="light-state">{{ states('light.living_room') }}</div>
  </div>
  <input type="range" 
         min="0" 
         max="100" 
         data-entity="light.living_room" 
         value="{{ state_attr('light.living_room', 'brightness') | int }}">
</div>
```

### 状态显示
```html
<div class="sensor-card">
  <div class="sensor-value" data-entity="sensor.temperature">
    温度: {{ states('sensor.temperature') }}°C
  </div>
</div>
```

## CSS 样式示例

```css
<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  
  .light-status {
    background: var(--card-background-color);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: var(--ha-card-box-shadow);
  }
  
  .light-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  input[type="range"] {
    width: 100%;
    margin-top: 1rem;
  }
</style>
```

## 进阶功能

### 1. 长按支持
添加 `data-long-press` 属性以启用长按显示更多信息：
```html
<div class="entity-card" 
     data-entity="light.living_room" 
     data-long-press>
  <!-- 内容 -->
</div>
```

### 2. 动态更新
使用 Home Assistant 的模板语法获取实时状态：
```html
<div class="sensor-display">
  温度: {{ states('sensor.temperature') }}°C
  湿度: {{ states('sensor.humidity') }}%
</div>
```

### 3. 条件渲染
```html
{% if is_state('light.living_room', 'on') %}
  <div class="status-on">灯已开启</div>
{% else %}
  <div class="status-off">灯已关闭</div>
{% endif %}
```

## 故障排除

1. 如果卡片无法加载，请检查浏览器控制台是否有错误信息
2. 确保所有实体ID正确且存在
3. 检查模板语法是否正确
4. 确认外部脚本URL是否可访问

## 注意事项

- 建议使用 `data-entity` 属性绑定实体，便于自动更新
- 避免过于复杂的模板，可能影响性能
- 使用 CSS 变量以适配 HA 的主题
- 测试长按功能时注意触摸屏和鼠标的区别

## 支持

如果遇到问题，请查看以下资源：
- GitHub Issues
- Home Assistant 社区
- 项目文档
