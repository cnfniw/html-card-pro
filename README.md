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


### 提示词
```
你是 Home Assistant 的专业卡片设计助手，请帮助我创建一个强大且灵活的自定义卡片，功能包括完全自定义界面、实时更新实体状态、长按显示更多信息等。以下是详细要求：  
### 功能需求：  
- **完全自定义界面**：支持通过 HTML 和 CSS 自定义卡片布局和样式。  
- **实时状态更新**：卡片应能够动态反映 Home Assistant 实体的实时状态。  
- **交互控制**：支持长按显示实体的更多信息，提供亮度滑块调整功能。  
- **扩展能力**：允许加载外部脚本，增加更多功能支持。
### 卡片使用教程:
type: custom:html-pro-card
content: |
  <div class="grid">
    <div class="light-status" data-entity="light.living_room">
      客厅灯
      <div class="state"></div>
    </div>
  </div>
### 配置需求：  
- 基础配置应包括以下选项，并给出示例：  
  - `content`: 定义 HTML 模板内容（必填）。  
  - `entities`: 指定需要动态更新的实体列表。  
  - `update_interval`: 设置更新频率（毫秒）。  
  - `always_update`: 控制是否始终更新。  
  - `do_not_parse`: 禁用模板解析的开关。  
  - `scripts`: 指定需要加载的外部脚本 URL 列表。  
### 示例模板设计：  
1. **实体控制卡片**  
   - 包括灯光状态显示、亮度滑块调整。  
   - 使用 `data-entity` 属性绑定实体以实现自动更新。  
2. **状态显示卡片**  
   - 动态显示传感器的温度、湿度等信息。  
### 样式要求：  
- 提供 CSS 样式示例：  
  - 支持自适应网格布局（grid）。  
  - 样式与 Home Assistant 主题兼容（使用 CSS 变量）。  
  - 确保设计的卡片外观精美且结构清晰。
### 进阶功能：  
1. **长按支持**  
   - 使用 `data-long-press` 属性实现长按操作。  
2. **动态更新**  
   - 使用 Home Assistant 的模板语法反映实时状态：  
     ```html
     温度: {{ states('sensor.temperature') }}°C
     湿度: {{ states('sensor.humidity') }}%
     ```  
3. **条件渲染**  
   - 使用 Jinja 语法实现条件逻辑：  
     ```html
     {% if is_state('light.living_room', 'on') %}
       <div class="status-on">灯已开启</div>
     {% else %}
       <div class="status-off">灯已关闭</div>
     {% endif %}
     ```  
### 注意事项：  
- 使用 `data-entity` 进行实体绑定以确保实时状态更新。  
- 避免过于复杂的模板逻辑，确保卡片性能最佳，注意不支持三元运算符。
- 使用 CSS 变量以支持不同主题。
### 输出格式：  
- 提供完整的 YAML 配置示例。  
- 配套 HTML/CSS 模板代码，附带详细注释。  

---

**输出结果示例格式**：  
- 生成的 YAML 配置文件  
- 适配 HTML & CSS &JS 模板代码  

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
