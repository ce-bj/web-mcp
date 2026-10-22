(function () {
  'use strict';

  var storageKey = 'webmcp-admin-prototype-v1';
  var attributeDefaults = {
    productName: true,
    model: true,
    nominalDiameter: true,
    ringStiffness: true,
    standard: true,
    material: true,
    leadTime: true,
    testReport: false
  };
  var attributeState = Object.assign({}, attributeDefaults);
  var currentAttribute = null;
  var toastTimer = null;

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (error) {
      return {};
    }
  }

  function restore() {
    var saved = readSaved();
    if (saved.attributes) {
      Object.keys(attributeDefaults).forEach(function (key) {
        if (typeof saved.attributes[key] === 'boolean') attributeState[key] = saved.attributes[key];
      });
    }
    if (saved.fields) {
      document.querySelectorAll('[data-persist]').forEach(function (element) {
        if (!Object.prototype.hasOwnProperty.call(saved.fields, element.id)) return;
        if (element.type === 'checkbox') element.checked = Boolean(saved.fields[element.id]);
        else element.value = String(saved.fields[element.id]);
      });
    }
    paintAttributes();
    syncSwitches();
    paintCustomDescriptions();
  }

  function save() {
    var fields = {};
    document.querySelectorAll('[data-persist]').forEach(function (element) {
      fields[element.id] = element.type === 'checkbox' ? element.checked : element.value;
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify({ fields: fields, attributes: attributeState }));
      notify('原型配置已保存到当前浏览器');
    } catch (error) {
      notify('当前浏览器未允许本地保存，页面内容仍可继续查看');
    }
  }

  function notify(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3000);
  }

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(function (screen) {
      var active = screen.id === 'screen-' + name;
      screen.hidden = !active;
      screen.classList.toggle('active-screen', active);
    });
    document.querySelectorAll('.primary-item').forEach(function (item) {
      item.classList.toggle('active', item.dataset.screen === name);
    });
    document.querySelectorAll('.secondary-group').forEach(function (group) {
      group.hidden = group.dataset.navGroup !== name;
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showTab(kind, name) {
    var tabAttribute = kind === 'template' ? 'data-template-tab' : 'data-form-tab';
    var panelAttribute = kind === 'template' ? 'data-template-panel' : 'data-form-panel';
    document.querySelectorAll('[' + tabAttribute + '][role="tab"]').forEach(function (tab) {
      tab.setAttribute('aria-selected', tab.getAttribute(tabAttribute) === name ? 'true' : 'false');
    });
    document.querySelectorAll('[' + panelAttribute + ']').forEach(function (panel) {
      panel.hidden = panel.getAttribute(panelAttribute) !== name;
    });
  }

  function syncSwitches() {
    var templateEnabled = document.getElementById('template-enabled').checked;
    document.getElementById('template-tools').hidden = !templateEnabled;
    document.getElementById('template-disabled').hidden = templateEnabled;
    var formEnabled = document.getElementById('form-enabled').checked;
    document.getElementById('form-config').hidden = !formEnabled;
    document.getElementById('form-disabled').hidden = formEnabled;
  }

  function paintAttributes() {
    document.querySelectorAll('[data-attr]').forEach(function (row) {
      var status = row.querySelector('.query-state');
      var enabled = attributeState[row.dataset.attr];
      status.textContent = enabled ? '开放' : '未开放';
      status.classList.toggle('off', !enabled);
    });
  }

  function paintCustomDescriptions() {
    document.querySelectorAll('.field-table textarea').forEach(function (field) {
      field.classList.toggle('is-custom', field.value !== field.dataset.default);
      field.title = field.value !== field.dataset.default ? '已人工修改' : '使用默认描述';
    });
  }

  function openAttribute(row) {
    currentAttribute = row.dataset.attr;
    document.getElementById('dialog-name').value = row.querySelector('strong').textContent;
    document.getElementById('dialog-key').value = currentAttribute;
    document.getElementById('dialog-query').checked = attributeState[currentAttribute];
    document.getElementById('attribute-dialog').showModal();
  }

  document.addEventListener('click', function (event) {
    var screenButton = event.target.closest('[data-screen]');
    if (screenButton) {
      showScreen(screenButton.dataset.screen);
      return;
    }
    var templateButton = event.target.closest('[data-template-tab]');
    if (templateButton) {
      showTab('template', templateButton.dataset.templateTab);
      return;
    }
    var formButton = event.target.closest('[data-form-tab]');
    if (formButton) {
      showTab('form', formButton.dataset.formTab);
      return;
    }
    if (event.target.closest('[data-save]')) {
      save();
      return;
    }
    var editButton = event.target.closest('.attr-edit');
    if (editButton) {
      openAttribute(editButton.closest('[data-attr]'));
      return;
    }
    if (event.target.id === 'dialog-confirm') {
      event.preventDefault();
      attributeState[currentAttribute] = document.getElementById('dialog-query').checked;
      paintAttributes();
      document.getElementById('attribute-dialog').close();
      notify('属性「WebMCP 可查询」已修改；点击保存配置可保留更改');
      return;
    }
    if (event.target.id === 'reset-descriptions') {
      document.querySelectorAll('.field-table textarea').forEach(function (field) {
        field.value = field.dataset.default;
      });
      paintCustomDescriptions();
      notify('已恢复默认描述；点击保存表单可保留更改');
      return;
    }
    if (event.target.id === 'attr-help') {
      notify('添加属性沿用现有功能；本原型重点展示属性编辑中的新增开关');
      return;
    }
    if (event.target.closest('.preview-submit')) {
      notify('这里是后台表单预览；实际提交在前台询价页完成');
    }
  });

  document.getElementById('template-enabled').addEventListener('change', syncSwitches);
  document.getElementById('form-enabled').addEventListener('change', syncSwitches);
  document.querySelectorAll('.field-table textarea').forEach(function (field) {
    field.addEventListener('input', paintCustomDescriptions);
  });
  restore();
})();
