import { html } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

if (!customElements.get('ha-htmlcard-textarea')) {
  customElements.define('ha-htmlcard-textarea', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #000);
          }
        </style>
        <textarea></textarea>
      `;
      this._input = this.shadowRoot.querySelector('textarea');
      this._input.addEventListener('input', () => {
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: this._input.value },
          bubbles: true,
          composed: true
        }));
      });
    }
    
    set value(val) {
      this._input.value = val;
    }
    
    get value() {
      return this._input.value;
    }
  });
}

if (!customElements.get('ha-htmlcard-textfield')) {
  customElements.define('ha-htmlcard-textfield', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          input {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #000);
          }
        </style>
        <input type="text" />
      `;
      this._input = this.shadowRoot.querySelector('input');
      this._input.addEventListener('input', () => {
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: this._input.value },
          bubbles: true,
          composed: true
        }));
      });
    }
    
    set value(val) {
      this._input.value = val;
    }
    
    get value() {
      return this._input.value;
    }
    
    set type(val) {
      this._input.type = val;
    }
  });
}

if (!customElements.get('ha-htmlcard-switch')) {
  customElements.define('ha-htmlcard-switch', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
          label {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
          }
          input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          span {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          span:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + span {
            background-color: var(--primary-color, #03a9f4);
          }
          input:checked + span:before {
            transform: translateX(16px);
          }
        </style>
        <label>
          <input type="checkbox" />
          <span></span>
        </label>
      `;
      this._input = this.shadowRoot.querySelector('input');
      this._input.addEventListener('change', () => {
        this.dispatchEvent(new CustomEvent('change', {
          detail: { checked: this._input.checked },
          bubbles: true,
          composed: true
        }));
      });
    }
    
    set checked(val) {
      this._input.checked = val;
    }
    
    get checked() {
      return this._input.checked;
    }
  });
}

if (!customElements.get('ha-htmlcard-formfield')) {
  customElements.define('ha-htmlcard-formfield', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            align-items: center;
            padding: 4px 0;
          }
          label {
            padding-left: 8px;
            color: var(--primary-text-color, #000);
          }
        </style>
        <slot></slot>
        <label><slot name="label"></slot></label>
      `;
    }
  });
}

class HtmlTemplateCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._handleContentChange = this._handleContentChange.bind(this);
    this._handleIntervalChange = this._handleIntervalChange.bind(this);
    this._handleParseChange = this._handleParseChange.bind(this);
    this._handleLineBreaksChange = this._handleLineBreaksChange.bind(this);
    this._handleScriptsChange = this._handleScriptsChange.bind(this);
  }

  get value() {
    return this._config;
  }

  set value(config) {
    this._config = config;
    this._render();
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }
  
  _render() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    const container = document.createElement('div');
    container.className = 'card-config';

    const textarea = document.createElement('ha-htmlcard-textarea');
    textarea.label = "HTML内容";
    textarea.rows = 8;
    textarea.value = this._config.content || '';
    textarea.className = 'editor-control';
    textarea.addEventListener('change', this._handleContentChange);

    const parseSwitch = document.createElement('ha-htmlcard-switch');
    parseSwitch.checked = this._config.do_not_parse || false;
    parseSwitch.addEventListener('change', this._handleParseChange);

    const parseField = document.createElement('ha-htmlcard-formfield');
    parseField.innerHTML = '<span slot="label">禁用模板解析</span>';
    parseField.prepend(parseSwitch);

    const lineBreakSwitch = document.createElement('ha-htmlcard-switch');
    lineBreakSwitch.checked = this._config.ignore_line_breaks || false;
    lineBreakSwitch.addEventListener('change', this._handleLineBreaksChange);

    const lineBreakField = document.createElement('ha-htmlcard-formfield');
    lineBreakField.innerHTML = '<span slot="label">忽略换行</span>';
    lineBreakField.prepend(lineBreakSwitch);

    const scriptsTitle = document.createElement('div');
    scriptsTitle.className = 'script-title';
    scriptsTitle.textContent = '脚本';

    const scriptsField = document.createElement('ha-htmlcard-textfield');
    scriptsField.type = "url";
    scriptsField.placeholder = "https://cdn.jsdelivr.net/";
    scriptsField.className = 'editor-control';
    scriptsField.value = Array.isArray(this._config.scripts) && this._config.scripts.length > 0 ? 
      this._config.scripts[0] : '';
    
    const addButton = document.createElement('mwc-button');
    addButton.innerHTML = '添加脚本';
    
    const scriptsList = document.createElement('div');
    scriptsList.className = 'scripts-list';
    
    if (Array.isArray(this._config.scripts)) {
      this._config.scripts.forEach((script, index) => {
        if (index === 0) return; 
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        
        const input = document.createElement('ha-htmlcard-textfield');
        input.type = "url";
        input.value = script;
        input.className = 'editor-control script-input';
        input.addEventListener('change', () => this._updateScripts());
        
        const deleteBtn = document.createElement('mwc-icon-button');
        deleteBtn.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
        deleteBtn.addEventListener('click', () => {
          scriptItem.remove();
          this._updateScripts();
        });
        
        scriptItem.appendChild(input);
        scriptItem.appendChild(deleteBtn);
        scriptsList.appendChild(scriptItem);
      });
    }
    
    addButton.addEventListener('click', () => {
      const url = scriptsField.value.trim();
      if (!url) return;
      
      scriptsField.value = '';
      
      const scriptItem = document.createElement('div');
      scriptItem.className = 'script-item';
      
      const input = document.createElement('ha-htmlcard-textfield');
      input.type = "url";
      input.value = url;
      input.className = 'editor-control script-input';
      input.addEventListener('change', () => this._updateScripts());
      
      const deleteBtn = document.createElement('mwc-icon-button');
      deleteBtn.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
      deleteBtn.addEventListener('click', () => {
        scriptItem.remove();
        this._updateScripts();
      });
      
      scriptItem.appendChild(input);
      scriptItem.appendChild(deleteBtn);
      scriptsList.appendChild(scriptItem);
      this._updateScripts();
    });
    
    const scriptsContainer = document.createElement('div');
    scriptsContainer.className = 'values scripts-container';
    scriptsContainer.appendChild(scriptsTitle);
    scriptsContainer.appendChild(scriptsField);
    scriptsContainer.appendChild(addButton);
    scriptsContainer.appendChild(scriptsList);

    const intervalField = document.createElement('ha-htmlcard-textfield');
    intervalField.label = "更新间隔(ms)";
    intervalField.type = "number";
    intervalField.value = this._config.update_interval || 0;
    intervalField.className = 'editor-control';
    intervalField.addEventListener('change', this._handleIntervalChange);

    const sections = [textarea, parseField, lineBreakField, scriptsContainer, intervalField];
    sections.forEach(element => {
      const div = document.createElement('div');
      div.className = 'values';
      div.appendChild(element);
      container.appendChild(div);
    });

    this.appendChild(container);

    const style = document.createElement('style');
    style.textContent = `
      .card-config {
        padding: 16px;
        width: 400px;
      }
      .values {
        padding-bottom: 16px;
      }
      ha-htmlcard-formfield {
        padding-right: 16px;
        display: block;
      }
      .script-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .scripts-container {
        border: 1px solid var(--divider-color);
        padding: 16px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .script-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .scripts-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .editor-control {
        width: 100%;
        max-width: 400px;
        box-sizing: border-box;
      }
      .script-input {
        width: calc(100% - 48px);
      }
      ha-htmlcard-textarea {
        resize: none;
      }
      mwc-button {
        align-self: flex-end;
      }
    `;
    this.appendChild(style);
  }

  _updateScripts() {
    const scripts = [];
    const mainInput = this.querySelector('ha-htmlcard-textfield[type="url"]');
    if (mainInput && mainInput.value.trim()) {
      scripts.push(mainInput.value.trim());
    }
    
    this.querySelectorAll('.script-item ha-htmlcard-textfield').forEach(input => {
      if (input.value.trim()) {
        scripts.push(input.value.trim());
      }
    });
    
    this._valueChanged('scripts', scripts);
  }

  _handleContentChange(e) {
    this._valueChanged('content', e.target.value);
  }

  _handleIntervalChange(e) {
    this._valueChanged('update_interval', parseInt(e.target.value) || 0);
  }

  _handleParseChange(e) {
    this._valueChanged('do_not_parse', e.target.checked);
  }

  _handleLineBreaksChange(e) {
    this._valueChanged('ignore_line_breaks', e.target.checked);
  }

  _handleScriptsChange(e) {
    this._valueChanged('scripts', e.target.value.split('\n').filter(s => s.trim()));
  }

  _valueChanged(key, value) {
    if (!this._config) return;

    this._config = {
      ...this._config,
      [key]: value
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define("html-pro-card-editor", HtmlTemplateCardEditor);

class HtmlTemplateCard extends HTMLElement {
      static get properties() {
        return {
          hass: { type: Object },
          _config: { type: Object },
        };
      }

      static async getConfigElement() {
        await customElements.get('ha-form');
        return document.createElement('html-pro-card-editor');
      }

      static get editorSchema() {
        return {type:'object',required:['content'],properties:{content:{type:'string',title:'HTML内容',default:'<div class="grid p-4"><div class="entity" data-entity="light.example">示例实体</div></div>'},update_interval:{type:'number',title:'更新间隔',default:1000},do_not_parse:{type:'boolean',title:'禁用模板解析',default:false},ignore_line_breaks:{type:'boolean',title:'忽略换行',default:false},scripts:{type:'array',title:'外部脚本',items:{type:'string'},default:[]}}}
      }
      static preProcessScripts(config) {
        if(typeof config.scripts==='string')config.scripts=config.scripts.split('\n').filter(url=>url.trim()!=='');
        return config;
      }
      static getStubConfig() {
        return {
          content: `Sun state: <b>{{ states('sun.sun') }}</b>, elevation: {{ state_attr('sun.sun','elevation') }}</br>
          <b>Hello!</u></p>
          <img src="https://i.redd.it/ltxppihy4cyy.jpg" width="70%"/></br>`,
          update_interval: 0,
          do_not_parse: false,
          ignore_line_breaks: true,
          scripts: []
        };
      }

      connectedCallback() {
        this._createRootElement();
        this._setupEventListeners();
      }
      disconnectedCallback() {
        if(this._timeUpdateInterval){clearInterval(this._timeUpdateInterval);this._timeUpdateInterval=null;}
        this._removeEventListeners();
      }

      _createRootElement() {
        if(this._rootElement)this.removeChild(this._rootElement);
        this._rootElement=document.createElement('ha-card');
        this.appendChild(this._rootElement);
      }
      _setupEventListeners() {
        if(!this._rootElement)return;
        let pressTimer;
        let longPressTriggered=false;
        const elements=this._rootElement.querySelectorAll('.light-status');
        elements.forEach(element=>{
          element.addEventListener('touchstart',e=>{
            longPressTriggered=false;
            pressTimer=setTimeout(()=>{
              longPressTriggered=true;
              const entityId=element.dataset.entity;
              if(entityId)this._showMoreInfo(entityId);
            },500);
          });
          element.addEventListener('touchend',()=>{
            clearTimeout(pressTimer);
            if(!longPressTriggered){
              const entityId=element.dataset.entity;
              if(entityId)this._toggle(entityId);
            }
          });
          element.addEventListener('touchmove',()=>clearTimeout(pressTimer));
          element.addEventListener('mousedown',()=>{
            longPressTriggered=false;
            pressTimer=setTimeout(()=>{
              longPressTriggered=true;
              const entityId=element.dataset.entity;
              if(entityId)this._showMoreInfo(entityId);
            },500);
          });
          element.addEventListener('mouseup',()=>{
            clearTimeout(pressTimer);
            if(!longPressTriggered){
              const entityId=element.dataset.entity;
              if(entityId)this._toggle(entityId);
            }
          });
          element.addEventListener('mouseleave',()=>clearTimeout(pressTimer));
        });
        const brightnessSliders=this._rootElement.querySelectorAll('input[type="range"]');
        brightnessSliders.forEach(slider=>{
          let timeoutId;
          slider.oninput=e=>{
            e.stopPropagation();
            if(timeoutId)clearTimeout(timeoutId);
            timeoutId=setTimeout(()=>{
              const entityId=slider.dataset.entity;
              if(entityId){
                const brightness=Math.round((slider.value*255)/100);
                this._hass.callService('light','turn_on',{entity_id:entityId,brightness:brightness});
              }
            },150);
          };
        });
        this._rootElement.addEventListener('touchstart',this._handleTouchStart.bind(this),{passive:true});
        this._rootElement.addEventListener('touchend',this._handleTouchEnd.bind(this));
        this._rootElement.addEventListener('touchcancel',this._handleTouchEnd.bind(this));
        this._rootElement.addEventListener('mousedown',this._handleMouseDown.bind(this));
        this._rootElement.addEventListener('mouseup',this._handleMouseUp.bind(this));
        this._rootElement.addEventListener('click',this._handleClick.bind(this));
      }
      _removeEventListeners() {
        if(!this._rootElement)return;
        const elements=this._rootElement.querySelectorAll('.light-status');
        elements.forEach(element=>element.replaceWith(element.cloneNode(true)));
        const sliders=this._rootElement.querySelectorAll('input[type="range"]');
        sliders.forEach(slider=>slider.oninput=null);
        this._rootElement.removeEventListener('touchstart',this._handleTouchStart.bind(this));
        this._rootElement.removeEventListener('touchend',this._handleTouchEnd.bind(this));
        this._rootElement.removeEventListener('touchcancel',this._handleTouchEnd.bind(this));
        this._rootElement.removeEventListener('mousedown',this._handleMouseDown.bind(this));
        this._rootElement.removeEventListener('mouseup',this._handleMouseUp.bind(this));
        this._rootElement.removeEventListener('click',this._handleClick.bind(this));
      }
      _handleTouchStart(e) {
        const target=e.target.closest('[data-long-press]');
        if(!target)return;
        const entityId=target.dataset.entity;
        if(!entityId)return;
        this._longPressTimeout=setTimeout(()=>this._showMoreInfo(entityId),500);
      }
      _handleTouchEnd() {
        if(this._longPressTimeout){clearTimeout(this._longPressTimeout);this._longPressTimeout=null;}
      }
      _handleMouseDown(e) {
        const target=e.target.closest('[data-long-press]');
        if(!target)return;
        const entityId=target.dataset.entity;
        if(!entityId)return;
        this._longPressTimeout=setTimeout(()=>this._showMoreInfo(entityId),500);
      }
      _handleMouseUp() {
        if(this._longPressTimeout){clearTimeout(this._longPressTimeout);this._longPressTimeout=null;}
      }
      _handleClick(e) {
        const actionTarget=e.target.closest('[data-action]');
        if(actionTarget){
          const entityId=actionTarget.dataset.entity;
          const action=actionTarget.dataset.action;
          if(entityId&&action==='toggle')this._toggle(entityId);
          return;
        }
        if(this._longPressTimeout){
          clearTimeout(this._longPressTimeout);
          this._longPressTimeout=null;
          return;
        }
      }
      _showMoreInfo(entityId) {
        if(!entityId||!this._hass.states[entityId])return;
        const event=new CustomEvent('hass-more-info',{detail:{entityId},bubbles:true,composed:true});
        this.dispatchEvent(event);
      }
      _toggle(entityId) {
        if(!entityId||!this._hass.states[entityId])return;
        const domain=entityId.split('.')[0];
        this._hass.callService(domain,'toggle',{entity_id:entityId});
      }
      set hass(hass) {
        const oldHass=this._hass;
        this._hass=hass;
        if(!this._config)return;
        if(!this._entities)this._calculateEntities();
        if(this._shouldUpdate(oldHass))this._processAndRender();
      }
      _setupTimeUpdate() {
        if(this._timeUpdateInterval)clearInterval(this._timeUpdateInterval);
        if(this._config.update_interval && this._config.update_interval > 0){
          const interval=this._config.update_interval;
          this._timeUpdateInterval=setInterval(()=>this._processAndRender(),interval);
        }
      }
      _processAndRender() {
        if(!this._rootElement||!this._config||!this._hass)return;
        try{
          if(this._config.scripts&&Array.isArray(this._config.scripts)){
            this._loadExternalScripts(this._config.scripts).then(()=>{
              this._renderContent();
            }).catch(()=>{
              this._renderContent();
            });
          }else this._renderContent();
        }catch{
          this._renderFallback();
        }
      }
      _renderContent() {
        const content=this._config.ignore_line_breaks?this._config.content:this._config.content.replace(/\r?\n|\r/g,"");
        if(!this._config.do_not_parse){
          this._hass.connection.subscribeMessage(msg=>{try{this._render(msg.result);}catch{this._renderFallback();}},{type:"render_template",template:content}).catch(()=>{this._renderFallback();});
        }else this._render(content);
      }
      async _loadExternalScripts(scripts) {
        const promises=scripts.map(url=>{
          if(!this._loadedScripts.has(url))return this._loadScript(url).then(()=>this._loadedScripts.add(url));
          return Promise.resolve();
        });
        return Promise.all(promises);
      }
      _loadScript(url) {
        return new Promise((resolve,reject)=>{
          const existingScript=document.querySelector(`script[src="${url}"]`);
          if(existingScript){
            if(existingScript.hasAttribute('data-loaded')){resolve();return;}
            existingScript.addEventListener('load',()=>{existingScript.setAttribute('data-loaded','true');resolve();});
            existingScript.addEventListener('error',reject);
            return;
          }
          const script=document.createElement('script');
          script.src=url;
          script.async=true;
          script.setAttribute('data-card','html-template-card');
          script.onload=()=>{script.setAttribute('data-loaded','true');resolve();};
          script.onerror=reject;
          document.head.appendChild(script);
        });
      }
      _render(content) {
        if(!this._rootElement||!this._hass)return;
        try{
          while(this._rootElement.lastChild)this._rootElement.removeChild(this._rootElement.lastChild);
          window.hassTemplateCard={hass:this._hass,config:this._config,root:this._rootElement};
          this._rootElement.innerHTML=content;
          this._setupClickHandlers(this._rootElement);
          this.dispatchEvent(new CustomEvent('content-rendered',{bubbles:true,composed:true,detail:{hass:this._hass,config:this._config}}));
        }catch{
          this._renderFallback();
        }
      }
      _setupClickHandlers(card) {
        const elements=card.querySelectorAll('[data-entity]');
        elements.forEach(element=>{
          element.removeEventListener('click',this._onClick);
          element.removeEventListener('touchstart',this._onTouchStart);
          element.removeEventListener('touchend',this._onTouchEnd);
          element.removeEventListener('mousedown',this._onMouseDown);
          element.removeEventListener('mouseup',this._onMouseUp);
          element.addEventListener('click',this._onClick.bind(this));
          element.addEventListener('touchstart',this._onTouchStart.bind(this));
          element.addEventListener('touchend',this._onTouchEnd.bind(this));
          element.addEventListener('mousedown',this._onMouseDown.bind(this));
          element.addEventListener('mouseup',this._onMouseUp.bind(this));
        });
      }
      _onClick(event) {
        event.stopPropagation();
        const entityId=event.currentTarget.dataset.entity;
        if(!entityId)return;
        const action=event.currentTarget.dataset.action;
        if(action==='toggle'){this._toggle(entityId);return;}
        if(!this._longPressTimeout)this._toggle(entityId);
      }
      _onTouchStart(event) {
        const entityId=event.currentTarget.dataset.entity;
        if(!entityId)return;
        this._longPressTimeout=setTimeout(()=>{this._showMoreInfo(entityId);this._longPressTimeout=null;},500);
      }
      _onTouchEnd() {
        if(this._longPressTimeout){clearTimeout(this._longPressTimeout);this._longPressTimeout=null;}
      }
      _onMouseDown(event) {
        const entityId=event.currentTarget.dataset.entity;
        if(!entityId)return;
        this._longPressTimeout=setTimeout(()=>{this._showMoreInfo(entityId);this._longPressTimeout=null;},500);
      }
      _onMouseUp() {
        if(this._longPressTimeout){clearTimeout(this._longPressTimeout);this._longPressTimeout=null;}
      }
      _toggle(entityId) {
        if(!this._hass)return;
        const state=this._hass.states[entityId];
        if(!state)return;
        let service='toggle';
        if(state.state==='on')service='turn_off';
        else if(state.state==='off')service='turn_on';
        const[domain]=entityId.split('.');
        this._hass.callService(domain,service,{entity_id:entityId});
      }
      _showMoreInfo(entityId) {
        const event=new Event('hass-more-info',{bubbles:true,composed:true});
        event.detail={entityId};
        this.dispatchEvent(event);
      }
     _renderFallback(){
        if(!this._rootElement||!this._hass)return;
        const entities=this._entities||[];
        const content=entities.map(entityId=>{
          const state=this._hass.states[entityId];
          if(!state)return'';
          return`<div class="entity"data-entity="${entityId}"><div class="entity-name">${state.attributes.friendly_name||entityId}</div><div class="state-text">${state.state}</div></div>`;
        }).join('');
        this._rootElement.innerHTML=content;
        this._processStyles();
        this._setupEventListeners();
      }
      _updateStates(){
        if(!this._entities||!this._hass||!this._rootElement)return;
        try{
          this._entities.forEach(entityId=>{
            const state=this._hass.states[entityId];
            if(!state)return;
            const elements=this._rootElement.querySelectorAll(`[data-entity="${entityId}"]`);
            elements.forEach(element=>{
              try{
                const stateText=element.querySelector('.state-text');
                if(stateText)stateText.textContent=state.state;
                const toggleBtn=element.querySelector('.toggle-btn');
                if(toggleBtn){toggleBtn.dataset.state=state.state;toggleBtn.textContent=state.state==='on'?'关闭':'开启';}
                const slider=element.querySelector('input[type="range"]');
                if(slider){
                  const brightness=state.attributes.brightness;
                  slider.value=brightness?Math.round((brightness*100)/255):(state.state==='on'?100:0);
                }
              }catch{}
            });
          });
        }catch{}
      }
      _shouldUpdate(oldHass){
        if(this._config.always_update)return true;
        if(!this._lastUpdate||(this._config.update_interval&&(new Date()-this._lastUpdate)>=this._config.update_interval))return true;
        if(!this._entities||!oldHass)return true;
        return this._entities.some(entity=>!oldHass.states[entity]||!this._hass.states[entity]||oldHass.states[entity]!==this._hass.states[entity]||oldHass.states[entity].attributes!==this._hass.states[entity].attributes);
      }
      setConfig(config){
        const defaultConfig={content:'<div class="grid p-4"><div class="entity" data-entity="light.example">示例实体</div></div>',update_interval:1000,do_not_parse:false,ignore_line_breaks:false,scripts:[]};
        config={...defaultConfig,...config};
        config=this.constructor.preProcessScripts(config);
        if(!config.content)throw new Error("Content must be defined");
        if(config.scripts&&!Array.isArray(config.scripts))throw new Error("Scripts must be an array");
        this._config=config;
        if(this._config.scripts&&this._config.scripts.length>0){
          this._loadExternalScripts(this._config.scripts).then(()=>{
            this._calculateEntities();
            this._createRootElement();
            this._setupEventListeners();
            this._setupTimeUpdate();
          }).catch(()=>{
            this._calculateEntities();
            this._createRootElement();
            this._setupEventListeners();
            this._setupTimeUpdate();
          });
        }else{
          this._calculateEntities();
          this._createRootElement();
          this._setupEventListeners();
          this._setupTimeUpdate();
        }
      }
      _calculateEntities(){
        this._entities=new Set();
        if(this._config.entities?.length)this._config.entities.forEach(entity=>this._entities.add(entity));
        const entityRegex=/\b(?:light|switch|sensor|climate|media_player)\.[a-zA-Z0-9_]+\b/g;
        const matches=this._config.content.match(entityRegex)||[];
        matches.forEach(entity=>this._entities.add(entity));
        this._entities=Array.from(this._entities);
      }
      _processStyles(){
        const style=document.createElement('style');
        style.textContent='[data-entity]{cursor:pointer;-webkit-tap-highlight-color:transparent}input[type="range"]{-webkit-appearance:none;width:100%;background:transparent}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none}';
        this._rootElement.insertBefore(style,this._rootElement.firstChild);
      }
      getCardSize(){return 1;}
    }
    customElements.define("html-pro-card", HtmlTemplateCard);
    window.customCards = window.customCards || [];
    window.customCards.push({
      type: "html-pro-card",
      name: "HTML Pro Card",
      preview: true,
      description: "可自定义各类HTML内容的模板超强卡片"
    });
