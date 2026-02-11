// ==UserScript==
// @name         DXBX EGAIS Combined (RESTS + Bartender API) Обратная связь: t.me/tiltmachinegun
// @namespace    http://tampermonkey.net/
// @version      8.4
// @description  Объединённый скрипт: остатки ЕГАИС + API бармена (авторизация, добавление/удаление бутылок в ТЗ, поиск накладных)
// @author       t.me/tiltmachinegun
// @downloadUrl  https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/dxbxrestscombined.js
// @updateUrl    https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/dxbxrestscombined.js
// @match        https://dxbx.ru/fe/*
// @match        https://dxbx.ru/index*
// @match        https://dxbx.ru/app/edit/invoice/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/bwip-js@3.0.2/dist/bwip-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @connect      dxbx.ru
// ==/UserScript==
(function() {
    'use strict';

    GM_addStyle(`
:root{--egais-primary:#1890ff;--egais-primary-hover:#40a9ff;--egais-primary-light:rgba(24,144,255,0.2);--egais-success:#52c41a;--egais-success-hover:#389e0d;--egais-neutral:#6c757d;--egais-neutral-hover:#5a6268;--egais-accent:#722ed1;--egais-accent-hover:#9254de;--egais-warning:#fa8c16;--egais-warning-hover:#ffa940;--egais-danger:#f5222d;--egais-danger-hover:#ff4d4f;--egais-info:#13c2c2;--egais-text-on-dark:#ffffff;--egais-radius:4px;--egais-font-size:12px;--egais-shadow:0 4px 20px rgba(0,0,0,0.15)}
html[data-theme="PINK"]{--egais-primary:#eb2f96;--egais-primary-hover:#f759ab;--egais-primary-light:rgba(235,47,150,0.2)}
.egais-modal,.nomenclature-modal,.orders-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95%;max-width:1800px;max-height:90vh;background:white;border-radius:8px;box-shadow:var(--egais-shadow);z-index:10000;display:none;flex-direction:column}
.orders-modal{max-width:1400px}
.egais-btn,.nomenclature-button,.manual-search-button,.pagination-button,.filter-button,.batch-action{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;font-size:var(--egais-font-size);border:none;border-radius:var(--egais-radius);cursor:pointer;transition:background-color 0.2s ease,color 0.2s ease,transform 0.1s ease;line-height:1.2}
.egais-btn:disabled,.pagination-button:disabled{background-color:#ccc;cursor:not-allowed;opacity:0.8}
.egais-btn--primary,.manual-search-button,.pagination-button,.filter-apply{background-color:var(--egais-primary);color:var(--egais-text-on-dark)}
.egais-btn--primary:hover,.manual-search-button:hover,.pagination-button:not(:disabled):hover,.filter-apply:hover{background-color:var(--egais-primary-hover)}
.egais-btn--success,.nomenclature-button,.filter-export{background-color:var(--egais-success);color:var(--egais-text-on-dark)}
.egais-btn--success:hover,.nomenclature-button:hover,.filter-export:hover{background-color:var(--egais-success-hover)}
.egais-btn--muted,.filter-reset{background-color:var(--egais-neutral);color:var(--egais-text-on-dark)}
.egais-btn--muted:hover,.filter-reset:hover{background-color:var(--egais-neutral-hover)}
.egais-btn--accent,.batch-action{background-color:var(--egais-accent);color:var(--egais-text-on-dark)}
.egais-btn--accent:hover,.batch-action:hover{background-color:var(--egais-accent-hover)}
.egais-btn--warning{background-color:var(--egais-warning);color:var(--egais-text-on-dark)}
.egais-btn--warning:hover{background-color:var(--egais-warning-hover)}
.egais-btn--danger{background-color:var(--egais-danger);color:var(--egais-text-on-dark)}
.egais-btn--danger:hover{background-color:var(--egais-danger-hover)}
.egais-btn--info{background-color:var(--egais-info);color:var(--egais-text-on-dark)}
.egais-btn--info:hover{background-color:var(--egais-primary-hover)}
.egais-flex-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.egais-center{justify-content:center}
.egais-ml-8{margin-left:8px}
.egais-ml-10{margin-left:10px}
.egais-mb-16{margin-bottom:16px}
.egais-badge-muted{display:inline-block;padding:2px 6px;background:#e6f7ff;border:1px solid #91d5ff;border-radius:3px;font-size:11px;color:#0050b3}
.text-success{color:#006400}
.text-danger{color:#8b0000}
.text-error{color:#ff0000}
.tz-status-badge{font-size:12px;padding:2px 6px;border-radius:3px;display:inline-block;background:#f0f0f0;color:#555}
.tz-status-badge.tz-yes{background-color:#ccffcc;color:#006400}
.tz-status-badge.tz-no{background-color:#ffcccc;color:#8b0000}
.tz-status-badge.tz-loading{background-color:#f0f0f0;color:#666}
.datamatrix-modal{padding:20px;min-width:320px;max-width:480px;text-align:center}
.datamatrix-code{font-family:monospace;font-size:12px;margin:10px 0;word-break:break-all;padding:8px;background:#f5f5f5;border-radius:4px}
.datamatrix-actions{justify-content:center;margin-top:15px}
.selectable-row{cursor:pointer}
.selected-row{background:#e6f7ff}
.orders-buttons-container{display:flex;align-items:center;gap:8px;margin-left:8px;margin-bottom:16px;flex-wrap:wrap}
.egais-mark-actions{display:flex;align-items:center;gap:8px;margin-left:10px;flex-wrap:wrap}
.egais-modal.active{display:flex}
.short-mark-code{font-size:12px;color:#666;margin-right:5px}
.nomenclature-modal.active{display:flex}
.modal-header{padding:16px 24px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;background:#fafafa;border-radius:8px 8px 0 0}
.modal-title{margin:0;font-size:16px;font-weight:600}
.modal-subtitle{margin:0;font-size:14px;color:#666;font-weight:normal}
.modal-title-container{display:flex;flex-direction:column;gap:4px}
.generate-datamatrix{margin-left:5px;padding:2px 5px;font-size:10px;background:#28a745;color:white;border:none;border-radius:2px;cursor:pointer}
.generate-datamatrix:hover{background:#218838}
.modal-close{background:none;border:none;font-size:18px;cursor:pointer;color:#999}
.modal-close:hover{color:#333}
.modal-content{padding:24px;overflow-y:auto;flex:1;display:flex;flex-direction:column}
.modal-table{width:100%;border-collapse:collapse;margin-top:10px}
.modal-table th,.modal-table td{padding:12px 8px;text-align:left;border-bottom:1px solid #f0f0f0}
.modal-table th{background:#fafafa;font-weight:600;position:sticky;top:0;z-index:10}
.modal-table tr:hover{background:#f5f5f5}
.modal-link{color:#1890ff;text-decoration:none;cursor:pointer}
.modal-link:hover{text-decoration:underline}
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.45);z-index:9999;display:none}
.modal-overlay.active{display:block}
.loading-spinner{text-align:center;padding:40px;color:#999}
.nomenclature-button{margin-left:10px;background-color:var(--egais-success);color:var(--egais-text-on-dark)}
.nomenclature-button:hover{background-color:var(--egais-success-hover)}
.error-message{color:#ff4d4f;text-align:center;padding:20px}
.volume-loading{color:#999;font-style:italic}
.mark-info-cell{max-width:300px;max-height:60px;overflow:hidden;word-break:break-all;cursor:pointer;position:relative;border:1px solid #f0f0f0;border-radius:4px;padding:8px;background-color:#fafafa;transition:max-height 0.3s ease}
.mark-info-cell.expanded{max-height:none;overflow-y:auto}
.mark-info-cell:hover{border-color:#1890ff}
.mark-info-content{max-height:40px;overflow:hidden}
.mark-info-cell.expanded .mark-info-content{max-height:none}
.manual-search-container{display:flex;align-items:center;gap:8px;margin-left:8px;margin-bottom:16px}
.manual-search-input{padding:4px 8px;border:1px solid #d9d9d9;border-radius:1px;font-size:10px;width:250px}
.manual-search-button{background-color:var(--egais-primary);color:var(--egais-text-on-dark)}
.manual-search-button:hover{background-color:var(--egais-primary-hover)}
.egais-mappings-container{margin:12px 0 0;background:#fff;border:1px solid #e9ecef;border-radius:10px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,0.06)}
.egais-mappings-header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.egais-mappings-title{font-size:14px;font-weight:600;color:#1a1a1a}
.egais-mappings-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.egais-mappings-toggle{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:#666}
.egais-mappings-toggle input{width:32px;height:16px;appearance:none;background:#d9d9d9;border-radius:16px;position:relative;outline:none;cursor:pointer}
.egais-mappings-toggle input:checked{background:#1890ff}
.egais-mappings-toggle input::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;background:#fff;border-radius:50%;transition:transform 0.2s}
.egais-mappings-toggle input:checked::after{transform:translateX(16px)}
.egais-mappings-search{padding:6px 10px;border:1px solid #d9d9d9;border-radius:6px;font-size:12px;min-width:260px}
.egais-mappings-search:focus{outline:none;border-color:#1890ff;box-shadow:0 0 0 2px rgba(24,144,255,0.2)}
.egais-mappings-stats{font-size:12px;color:#666;margin-bottom:8px}
.egais-mappings-table-wrapper{max-height:70vh;overflow:auto;border:1px solid #f0f0f0;border-radius:8px}
.egais-mappings-table{width:100%;border-collapse:collapse;font-size:12px}
.egais-mappings-table th,.egais-mappings-table td{padding:10px 8px;border-bottom:1px solid #f0f0f0;vertical-align:top}
.egais-mappings-table th{position:sticky;top:0;background:#fafafa;font-weight:600;z-index:1}
.egais-mappings-cell-title{font-weight:600;color:#1a1a1a}
.egais-mappings-cell-sub{color:#666;margin-top:2px;font-size:11px}
.egais-mappings-code{font-family:monospace;font-size:11px;color:#0050b3;background:#e6f7ff;border:1px solid #91d5ff;padding:2px 6px;border-radius:4px;display:inline-block}
.egais-mappings-empty{text-align:center;padding:30px;color:#999}
.egais-mappings-dropdown{font-size:12px;position:absolute;z-index:10000;background:#fff;border:1px solid #e9ecef;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.12);max-height:280px;overflow:auto;animation:egaisDropdownFadeIn 0.15s ease-out}
@keyframes egaisDropdownFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.egais-mappings-dropdown-loading{padding:12px;text-align:center;color:#999}
.egais-mappings-spinner{display:inline-block;width:14px;height:14px;border:2px solid #f3f3f3;border-top:2px solid var(--egais-primary);border-radius:50%;animation:egaisSpinnerRotate 0.8s linear infinite;vertical-align:middle;margin-right:8px}
@keyframes egaisSpinnerRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.egais-mappings-hint-global{position:absolute;background:#fff;border:1px solid #d9d9d9;border-radius:4px;padding:8px 12px;font-size:14px;color:rgba(0,0,0,0.45);box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:10001;animation:egaisHintFadeIn 0.15s ease-out;white-space:nowrap;display:none}
.egais-mappings-select{position:relative !important}
@keyframes egaisHintFadeIn{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:translateY(0)}}
.egais-unmapped-row{background-color:rgba(255,77,79,0.1) !important;transition:background-color 0.2s ease}
.egais-unmapped-row:hover{background-color:rgba(255,77,79,0.15) !important}
.egais-mappings-container .ant-table-row{transition:background-color 0.2s ease}
.egais-mappings-dropdown .ant-select-item{padding:5px 12px;
cursor:pointer;font-size:14px;line-height:22px;min-height:32px;transition:background-color 0.15s ease}
.egais-mappings-dropdown .ant-select-item-option-active{background-color:#f5f5f5}
.egais-mappings-dropdown .ant-select-item-option:hover{background-color:#f5f5f5}
.egais-mappings-dropdown .ant-select-item-option-content{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.egais-mappings-select.ant-select-focused .ant-select-selector{border-color:var(--egais-primary) !important;box-shadow:0 0 0 2px var(--egais-primary-light) !important;transition:all 0.2s ease}
.egais-mappings-select .ant-select-selector{transition:all 0.2s ease !important}
.egais-mappings-select .ant-select-selection-search-input{cursor:text !important}
.egais-mappings-select .ant-select-selection-placeholder{color:#bfbfbf;pointer-events:none;position:absolute;left:11px;right:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.egais-mappings-select.ant-select-focused .ant-select-selection-placeholder{display:none}
.egais-mappings-actions-cell{white-space:nowrap}
.egais-mappings-action-btn{border:none;background:#f5f5f5;color:#555;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;margin-right:6px}
.egais-mappings-action-btn:hover{background:#e6f7ff;color:#1890ff}
.egais-mappings-action-btn.danger:hover{background:#fff1f0;color:#f5222d}
.egais-mappings-modal{max-width:520px;width:90%}
.egais-mappings-modal .modal-content{padding:16px 20px 20px}
.egais-mappings-modal-search{width:100%;padding:8px 10px;border:1px solid #d9d9d9;border-radius:6px;font-size:12px;margin-bottom:12px}
.egais-mappings-modal-search:focus{outline:none;border-color:#1890ff;box-shadow:0 0 0 2px rgba(24,144,255,0.2)}
.egais-mappings-results{max-height:320px;overflow:auto;border:1px solid #f0f0f0;border-radius:8px}
.egais-mappings-result-item{padding:10px 12px;border-bottom:1px solid #f0f0f0;cursor:pointer}
.egais-mappings-result-item:last-child{border-bottom:none}
.egais-mappings-result-item:hover{background:#f6ffed}
.egais-mappings-result-name{font-size:12px;font-weight:600;color:#1a1a1a}
.egais-mappings-result-measure{font-size:11px;color:#666;margin-top:2px}
.expand-toggle{display:block;text-align:center;margin-top:5px;font-size:12px;color:#1890ff;cursor:pointer}
.expand-toggle:hover{text-decoration:underline}
.copy-mark{margin-left:5px;padding:2px 5px;font-size:10px;background:#f0f0f0;border:none;border-radius:2px;cursor:pointer}
.copy-mark:hover{background:#e0e0e0}
.tz-status-modal{font-size:12px;padding:2px 6px;border-radius:3px;display:inline-block}
.tz-status-yes{background-color:#ccffcc;color:#006400}
.tz-status-no{background-color:#ffcccc;color:#8b0000}
.tz-status-loading{background-color:#f0f0f0;color:#666}
.pagination-controls{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:20px;padding:10px;border-top:1px solid #f0f0f0}
.pagination-button{background-color:var(--egais-primary);color:var(--egais-text-on-dark)}
.pagination-info{font-size:12px;color:#666}
.results-count{margin:10px 0;font-size:14px;color:#666;text-align:center}
.filters-container{background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:15px;border:1px solid #e9ecef}
.filters-header{display:flex;justify-content:between;align-items:center;margin-bottom:10px}
.filters-title{font-weight:600;color:#495057;margin:0}
.filters-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:10px}
.filter-group{display:flex;flex-direction:column;gap:5px}
.filter-label{font-size:12px;font-weight:600;color:#495057}
.filter-input,.filter-select{padding:6px 8px;border:1px solid #ced4da;border-radius:4px;font-size:12px}
.filter-input:focus,.filter-select:focus{outline:none;border-color:#1890ff;box-shadow:0 0 0 2px rgba(24,144,255,0.2)}
.filter-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.filter-button{padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px;transition:all 0.2s}
.filter-apply{background-color:var(--egais-primary);color:var(--egais-text-on-dark)}
.filter-apply:hover{background-color:var(--egais-primary-hover)}
.filter-reset{background-color:var(--egais-neutral);color:var(--egais-text-on-dark)}
.filter-reset:hover{background-color:var(--egais-neutral-hover)}
.filter-export{background-color:var(--egais-success);color:var(--egais-text-on-dark)}
.filter-export:hover{background-color:var(--egais-success-hover)}
.stats-container{display:flex;gap:15px;margin-bottom:10px;flex-wrap:wrap}
.stat-item{background:white;padding:8px 12px;border-radius:4px;border:1px solid #e9ecef;font-size:12px}
.stat-value{font-weight:600;color:#1890ff}
.volume-badge{padding:2px 6px;border-radius:3px;font-size:11px;font-weight:600}
.volume-low{background-color:#fff2f0;color:#cf1322;border:1px solid #ffccc7}
.volume-medium{background-color:#fff7e6;color:#d46b08;border:1px solid #ffd591}
.volume-high{background-color:#f6ffed;color:#389e0d;border:1px solid #b7eb8f}
.sortable-header{cursor:pointer;user-select:none;position:relative;padding-right:15px !important}
.sortable-header:hover{background-color:#e6f7ff}
.sort-icon{position:absolute;right:5px;top:50%;transform:translateY(-50%);font-size:12px}
.table-container{overflow-x:auto;flex:1}
.highlight-row{animation:highlight-fade 2s ease-in-out}
@keyframes highlight-fade{0%{background-color:#fff566}100%{background-color:transparent}}
.quick-filters{display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap}
.quick-filter{padding:4px 8px;background:#e6f7ff;border:1px solid #91d5ff;border-radius:3px;font-size:11px;cursor:pointer;color:#0050b3}
.quick-filter:hover{background:#bae7ff}
.quick-filter.active{background:#1890ff;color:white;border-color:#1890ff}
.batch-actions{display:flex;gap:10px;margin:10px 0;flex-wrap:wrap}
.batch-action{background:var(--egais-accent);color:var(--egais-text-on-dark)}
.batch-action:hover{background:var(--egais-accent-hover)}
.selected-count{background:#13c2c2;color:white;padding:6px 12px;border-radius:4px;font-size:12px;font-weight:600}
.orders-modal.active{display:flex}
.order-item{border:1px solid #e8e8e8;border-radius:6px;margin-bottom:12px;padding:12px;background:#fafafa}
.order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e8e8e8}
.order-title{font-weight:600;color:#1890ff;cursor:pointer}
.order-title:hover{text-decoration:underline}
.order-status{padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}
.status-created{background:#e6f7ff;color:#1890ff}
.order-details{font-size:12px;color:#666}
.order-bottle{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0}
.order-bottle:last-child{border-bottom:none}
.bottle-code{font-family:monospace;font-size:11px}
.bottle-volume{font-weight:600;color:#52c41a}
.bottle-match{padding:2px 6px;border-radius:3px;font-size:10px;font-weight:600}
.match-found{background:#f6ffed;color:#52c41a}
.match-not-found{background:#fff2f0;color:#ff4d4f}
.check-orders-button{margin-left:10px}
.orders-summary{background:#f0f8ff;padding:12px;border-radius:6px;margin-bottom:15px;border:1px solid #d6e4ff}
.summary-stats{display:flex;gap:15px;flex-wrap:wrap}
.summary-stat{font-size:12px}
.summary-value{font-weight:600;color:#1890ff}
.alko-code-filter{background:#f0f8ff;border-left:3px solid #1890ff}
.add-to-tz-modal-button,.remove-from-tz-modal-button{margin-left:5px;padding:4px 8px;font-size:11px;border-radius:3px;transition:background-color 0.2s ease,opacity 0.2s ease}
.add-to-tz-modal-button.loading,.remove-from-tz-modal-button.loading{background-color:var(--egais-warning)}
.add-to-tz-modal-button.success,.remove-from-tz-modal-button.success{background-color:var(--egais-success)}
.add-to-tz-modal-button.error,.remove-from-tz-modal-button.error{background-color:var(--egais-danger)}
.tz-action-buttons{display:flex;gap:5px;flex-wrap:wrap}
.bottle-actions-cell{min-width:150px}
.alko-code-badge{display:inline-block;padding:2px 6px;background:#e6f7ff;border:1px solid #91d5ff;border-radius:3px;font-size:11px;font-family:monospace;color:#0050b3;margin-left:5px}
.alko-code-cell{font-family:monospace;font-size:11px;color:#666}
.invoice-search-button{background-color:var(--egais-warning);color:var(--egais-text-on-dark)}
.invoice-search-button:hover{background-color:var(--egais-warning-hover)}
.invoice-result-modal{padding:0;min-width:420px;max-width:500px;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.invoice-modal-header{background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:20px;border-bottom:1px solid #e9ecef}
.invoice-product-row{display:flex;align-items:flex-start;gap:12px}
.invoice-product-icon{width:48px;height:48px;background:#e8f5e9;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.invoice-product-info{flex:1}
.invoice-product-name{font-size:15px;font-weight:600;color:#1a1a1a;line-height:1.3;margin-bottom:8px}
.invoice-ttn-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.invoice-ttn-text{font-size:13px;color:#666}
.invoice-egais-badge{display:inline-block;padding:4px 10px;background:#e8f5e9;color:#2e7d32;border-radius:6px;font-size:11px;font-weight:600}
.invoice-modal-body{padding:16px 20px;background:#fff}
.invoice-cards-row{display:flex;gap:12px;margin-bottom:16px}
.invoice-card{flex:1;background:#f8f9fa;border:1px solid #e9ecef;border-radius:12px;padding:12px;position:relative}
.invoice-card-label{font-size:11px;color:#999;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between}
.invoice-card-value{font-size:13px;color:#333;font-weight:500;word-break:break-all}
.invoice-card-copy{background:none;border:none;cursor:pointer;font-size:14px;padding:2px;opacity:0.5;transition:opacity 0.2s}
.invoice-card-copy:hover{opacity:1}
.invoice-mark-card{background:#f8f9fa;border:1px solid #e9ecef;border-radius:12px;padding:12px;margin-bottom:16px}
.invoice-section-title{font-size:14px;font-weight:600;color:#1a1a1a;margin:16px 0 12px 0}
.invoice-info-list{background:#fff}
.invoice-info-item{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f0f0f0}
.invoice-info-item:last-child{border-bottom:none}
.invoice-info-icon{width:32px;height:32px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.invoice-info-content{flex:1}
.invoice-info-title{font-size:12px;color:#999;margin-bottom:2px}
.invoice-info-value{font-size:13px;color:#333;font-weight:500}
.invoice-info-subtitle{font-size:11px;color:#666;margin-top:2px}
.invoice-history-section{margin-top:16px}
.invoice-history-item{display:flex;align-items:flex-start;gap:12px;padding:8px 0}
.invoice-history-icon{width:32px;height:32px;background:#e3f2fd;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.invoice-history-content{flex:1}
.invoice-history-title{font-size:13px;color:#333;font-weight:500;display:flex;align-items:center;gap:8px}
.invoice-history-ttn{font-size:12px;color:#666;font-weight:normal}
.invoice-history-arrow{margin-left:auto;color:#ccc;font-size:16px}
.invoice-status-timeline{margin-top:8px;padding-left:4px;border-left:2px solid #e8f5e9}
.invoice-status-item{padding:6px 0 6px 12px;position:relative}
.invoice-status-item::before{content:'';position:absolute;left:-5px;top:12px;width:8px;height:8px;background:#4caf50;border-radius:50%}
.invoice-status-label{display:inline-block;padding:3px 8px;background:#e8f5e9;color:#2e7d32;border-radius:4px;font-size:11px;font-weight:500}
.invoice-status-date{font-size:11px;color:#999;margin-top:2px}
.invoice-modal-footer{padding:16px 20px;background:#f8f9fa;border-top:1px solid #e9ecef;display:flex;gap:10px}
.invoice-btn-primary{flex:1;padding:12px 20px;background:#1890ff;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s}
.invoice-btn-primary:hover{background:#40a9ff}
.invoice-btn-secondary{padding:12px 20px;background:#fff;color:#666;border:1px solid #e9ecef;border-radius:10px;font-size:14px;cursor:pointer;transition:all 0.2s}
.invoice-btn-secondary:hover{background:#f5f5f5;border-color:#d9d9d9}
.invoice-link{color:#1890ff;text-decoration:none;font-weight:600}
.invoice-link:hover{text-decoration:underline}
.auth-container{position:fixed;top:10px;right:10px;background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:4px 8px;font-size:11px;z-index:9998;transition:.3s;max-width:200px;opacity:.7}
.auth-container:hover{background:rgba(255,255,255,.9);border-color:#1890ff;opacity:1;box-shadow:0 4px 12px rgba(0,0,0,.15)}
.auth-status{display:inline-block;margin-right:6px;padding:2px 6px;border-radius:3px;font-weight:500}
.status-authorized{background:rgba(82,196,26,.2);color:#389e0d;border:1px solid rgba(82,196,26,.3)}
.status-unauthorized{background:rgba(245,34,45,.2);color:#cf1322;border:1px solid rgba(245,34,45,.3)}
.auth-buttons{display:inline-flex;gap:4px}
.auth-button{padding:2px 6px;background:rgba(24,144,255,.1);color:#1890ff;border:1px solid rgba(24,144,255,.3);border-radius:3px;cursor:pointer;font-size:10px;transition:.2s}
.auth-button.warning{background:rgba(255,171,0,.1);color:#ffab00;border:1px solid rgba(255,171,0,.3)}
.auth-button:hover{background:#1890ff;color:#fff;border-color:#1890ff}
.auth-button.warning:hover{background:#ffab00;color:#fff}
.auth-toggle{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ff4d4f;color:#fff;border:none;border-radius:50%;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:.3s}
.auth-container:hover .auth-toggle{opacity:1}
.auth-container.collapsed{width:auto;padding:2px 6px}
.auth-container.collapsed .auth-status,.auth-container.collapsed .auth-buttons{display:none}
.auth-container.collapsed::after{content:"🔐";font-size:12px;opacity:.7}
.tz-inline-btn{padding:2px 8px;font-size:10px;min-width:32px}
.tz-inline-btn:disabled{opacity:.6;cursor:not-allowed}
.tz-context-menu{position:absolute;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:10000;padding:4px 0}
.tz-menu-item{padding:6px 12px;cursor:pointer;font-size:12px;white-space:nowrap}
.tz-menu-item:hover{background:#f5f5f5}
.invoice-tz-container{margin:15px 0;padding:15px;background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px}
.invoice-tz-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.invoice-tz-title{margin:0;font-size:14px;color:#1890ff}
.invoice-bottle-list{max-height:400px;overflow-y:auto;border:1px solid #e9ecef;border-radius:6px}
.invoice-bottle-row{display:grid;grid-template-columns:44px minmax(200px,280px) minmax(320px,1fr) 80px 90px 80px;gap:8px;align-items:start;padding:8px 10px;font-size:11px}
.invoice-bottle-header{position:sticky;top:0;background:#fafafa;border-bottom:1px solid #e9ecef;font-weight:600;z-index:1}
.invoice-bottle-item{border-bottom:1px solid #f0f0f0}
.invoice-bottle-item:last-child{border-bottom:none}
.invoice-col-num{text-align:right;color:#666}
.invoice-col-nomen{color:#333;line-height:1.3;word-break:break-word}
.invoice-col-mark{font-family:monospace;font-size:11px;word-break:break-all;color:#333}
.invoice-col-volume{color:#52c41a;font-weight:600;text-align:right}
.invoice-col-status{font-size:11px;color:#999;text-align:center}
.invoice-col-actions{text-align:center}
.auth-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:10001;backdrop-filter:blur(5px)}
.auth-modal{background:#fff;border-radius:12px;padding:30px;width:90%;max-width:400px;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.auth-modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #e8e8e8}
.auth-modal-title{font-size:20px;font-weight:600;color:#1890ff;margin:0}
.auth-modal-close{background:none;border:none;font-size:24px;cursor:pointer;color:#999;width:30px;height:30px;border-radius:50%}
.auth-modal-close:hover{background:#f5f5f5;color:#333}
.auth-form-group{margin-bottom:20px}
.auth-form-label{display:block;margin-bottom:6px;font-weight:500;color:#333}
.auth-form-input{width:100%;padding:10px 12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px;box-sizing:border-box}
.auth-form-input:focus{outline:none;border-color:#1890ff;box-shadow:0 0 0 2px rgba(24,144,255,.2)}
.auth-form-actions{display:flex;gap:10px;margin-top:25px}
.auth-form-submit{flex:1;padding:12px;background:#1890ff;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer}
.auth-form-submit:hover:not(:disabled){background:#40a9ff}
.auth-form-submit:disabled{background:#ccc;cursor:not-allowed}
.auth-form-cancel{padding:12px 20px;background:#f5f5f5;color:#666;border:none;border-radius:6px;cursor:pointer}
.auth-form-cancel:hover{background:#e8e8e8}
.auth-form-error{color:#ff4d4f;font-size:12px;margin-top:5px;display:none}
.auth-form-error.show{display:block}
.auth-form-remember{display:flex;align-items:center;gap:8px;margin-top:10px}
.auth-form-remember label{font-size:13px;color:#666;cursor:pointer}
.auth-modal-footer{margin-top:20px;padding-top:15px;border-top:1px solid #e8e8e8;font-size:12px;color:#999;text-align:center}
.bottle-datamatrix-container{margin:10px auto;padding:12px 15px;background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;max-width:500px;text-align:center}
.bottle-datamatrix-header{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px}
.bottle-datamatrix-title{margin:0;font-size:13px;font-weight:600;color:#1890ff}
.bottle-datamatrix-content{display:flex;flex-direction:column;align-items:center;gap:10px}
.bottle-datamatrix-canvas-wrapper{background:#fff;padding:10px;border:1px solid #e9ecef;border-radius:6px;display:inline-block}
.bottle-datamatrix-mark{font-family:monospace;font-size:10px;word-break:break-all;padding:8px;background:#fff;border:1px solid #e9ecef;border-radius:4px;max-height:60px;overflow-y:auto;text-align:left;width:100%;box-sizing:border-box}
.bottle-datamatrix-actions{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;justify-content:center}
.bottle-datamatrix-actions .egais-btn{padding:4px 8px;font-size:11px}
.bottle-tz-status{margin-top:8px;padding:6px 12px;border-radius:4px;font-size:12px;font-weight:500}
.bottle-tz-status.tz-yes{background:#e6fffb;color:#006d5b;border:1px solid #87e8de}
.bottle-tz-status.tz-no{background:#fff2e8;color:#ad4e00;border:1px solid #ffbb96}
.bottle-tz-status.tz-loading{background:#f0f0f0;color:#666;border:1px solid #d9d9d9}
    `);

    let legalPersonId = null;
    const bottleCache = GM_getValue('bottleCache', {});
    const ordersCache = GM_getValue('ordersCache', {});
    let csrfToken = null;
    let currentSearchData = {
        nomenclature: '',
        legalPersonId: '',
        currentPage: 0,
        totalRecords: 0,
        pageSize: 500
    };
    let currentFilters = {
        nomenclature: '',
        volumeMin: '',
        volumeMax: '',
        alkoCode: '',
        tzStatus: 'all',
        markSearch: '',
        sortField: 'nomenclature',
        sortDirection: 'asc'
    };
    let allBottlesData = [];
    let selectedBottles = new Set();
    let ordersByMarkCode = {};
    let ordersLoaded = false;
    let ordersLoading = false;
    let bottleCheckCache = {};
    let mappingsState = {
        items: [],
        filtered: [],
        paged: [],
        loading: false,
        loaded: false,
        lastLegalPersonId: null,
        lastQuery: '',
        tableQuery: '',
        onlyUnmapped: false,
        pageSize: 20,
        currentPage: 1
    };

    let buttonsInitialized = false;
    let initializationInProgress = false;
    let lastInitTime = 0;
    const INIT_COOLDOWN_MS = 1500;

    const AUTH_CONFIG = {
        API_BASE: 'https://dxbx.ru',
        ENDPOINTS: {
            AUTH: '/apis/auth/authenticate',
            BOTTLES: '/apis/dxbx/egais/bars/bottles',
            ACCESS_PROFILE_SEARCH: '/app/accessprofile/search',
            ACCESS_PROFILE_SAVE: '/app/save/accessprofile',
            VERIFICATION_MODE_PRODUCTS: '/apis/dxbx/egais/verification-mode/products',
            INVOICE_SEARCH: '/app/invoice/search'
        },
        HEADERS: {
            'User-Agent': 'DxBx.React (ios; 1.41.0) (iPhone 15 Pro)',
            'Content-Type': 'application/json',
            'Cookie': '__ddg1_=kgDLpVXQFGV2JKnj97fQ',
            'apiversion': 'v4'
        },
        STORAGE: { AUTH: 'bartenderAuth', CREDS: 'bartenderCreds', COLLAPSED: 'authCollapsed' },
        SESSION_TTL: 24 * 60 * 60 * 1000
    };

    const AuthState = {
        auth: null,
        token: null,
        creds: null,
        tokens: {},

        init() {
            this.creds = GM_getValue(AUTH_CONFIG.STORAGE.CREDS);
            const saved = GM_getValue(AUTH_CONFIG.STORAGE.AUTH);
            if (saved && Date.now() - saved.timestamp < AUTH_CONFIG.SESSION_TTL) {
                this.auth = saved;
                this.updateTokens(saved);
            }
        },

        updateTokens(data) {
            this.tokens = {};
            data?.subjects?.forEach(s => {
                if (s.role?.code === 'barman' && s.token && s.organization) {
                    this.tokens[s.organization.id] = s.token;
                }
            });
        },

        getToken() {
            return legalPersonId ? this.tokens[legalPersonId] || null : null;
        },

        saveCreds(login, password) {
            this.creds = { login, password, timestamp: Date.now() };
            GM_setValue(AUTH_CONFIG.STORAGE.CREDS, this.creds);
        },

        clearCreds() {
            this.creds = null;
            GM_setValue(AUTH_CONFIG.STORAGE.CREDS, null);
        },

        saveAuth(data) {
            this.auth = data;
            this.updateTokens(data);
            this.token = this.getToken();
            GM_setValue(AUTH_CONFIG.STORAGE.AUTH, { user: data.user, subjects: data.subjects, timestamp: Date.now() });
        },

        clearAuth() {
            this.auth = null;
            this.token = null;
            this.clearCreds();
            GM_setValue(AUTH_CONFIG.STORAGE.AUTH, null);
        }
    };

    const URLS = {
        bottleSearch: 'https://dxbx.ru/app/egaisbottle/search',
        barBottleSearch: 'https://dxbx.ru/app/egaisbarbottle/search',
        ordersSearch: 'https://dxbx.ru/app/egaisorder/search',
        orderPage: 'https://dxbx.ru/app/edit/egaisorder/',
        orderItemPage: 'https://dxbx.ru/app/edit/egaisorderitem/',
        mappingsView: 'https://dxbx.ru/api/front/egais/nomenclature/links/view',
        mappingsCreate: 'https://dxbx.ru/api/front/egais/nomenclature/links/create',
        mappingsDelete: 'https://dxbx.ru/api/front/egais/nomenclature/links/delete',
        nomenclatureSearch: 'https://dxbx.ru/api/front/common/nomenclature/matching/buyer/search'
    };

    const JSON_HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const notify = (message, type = 'info') => {
        const colors = { success: '#52c41a', error: '#f5222d', warning: '#faad14', info: '#1890ff' };
        const el = document.createElement('div');
        el.style.cssText = `position:fixed;top:20px;right:20px;background:${colors[type]};color:#fff;padding:12px 16px;border-radius:4px;z-index:10000;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15)`;
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    };

    const authRequest = (opts) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...opts,
            onload: r => {
                if (r.status >= 200 && r.status < 300) resolve(r);
                else { const e = new Error(`HTTP ${r.status}`); e.status = r.status; e.responseText = r.responseText; reject(e); }
            },
            onerror: () => reject(new Error('Network error')),
            ontimeout: () => reject(new Error('Timeout'))
        });
    });

    const BartenderAPI = {
        async authenticate(login, password) {
            const r = await authRequest({
                method: 'POST',
                url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.AUTH,
                headers: AUTH_CONFIG.HEADERS,
                data: JSON.stringify({ login, password })
            });
            const data = JSON.parse(r.responseText);
            if (!data.user) throw new Error(data.message || 'Auth failed');
            return data;
        },

        async addBottle(markInfo, volume, token = AuthState.token) {
            if (!token) throw new Error('Нет токена бармена. Проверьте авторизацию и доступ к ЮЛ ' + legalPersonId);
            const r = await authRequest({
                method: 'POST',
                url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.BOTTLES,
                headers: { ...AUTH_CONFIG.HEADERS, token },
                data: JSON.stringify({ markInfo, actualVolume: parseInt(volume) })
            });
            const key = `${legalPersonId}_${markInfo}`;
            bottleCache[key] = true;
            GM_setValue('bottleCache', bottleCache);
            window.dispatchEvent(new CustomEvent('BottleCacheUpdate', { detail: { markInfo, action: 'added', volume } }));
            return { success: true, status: r.status };
        },

        async removeBottle(markInfo, token = AuthState.token) {
            if (!token) throw new Error('Нет токена бармена');
            const r = await authRequest({
                method: 'DELETE',
                url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.BOTTLES,
                headers: { ...AUTH_CONFIG.HEADERS, token },
                data: JSON.stringify({ markInfo })
            });
            const key = `${legalPersonId}_${markInfo}`;
            bottleCache[key] = false;
            GM_setValue('bottleCache', bottleCache);
            window.dispatchEvent(new CustomEvent('BottleCacheUpdate', { detail: { markInfo, action: 'removed' } }));
            return { success: true, status: r.status };
        },

        async getBottleInfo(mark, token = AuthState.token) {
            if (!token) throw new Error('Нет токена бармена. Авторизуйтесь.');
            const r = await authRequest({
                method: 'POST',
                url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.VERIFICATION_MODE_PRODUCTS,
                headers: { ...AUTH_CONFIG.HEADERS, token, 'Accept': 'application/json', 'Accept-Language': 'ru', 'device-id': '900B7D64-A5FC-4E17-9E67-3F3FD1FB2F52' },
                data: JSON.stringify({ mark })
            });
            return JSON.parse(r.responseText);
        },

        async searchInvoice(ttnNumber, date) {
            const col = (d, o=true) => ({data:d, name:'', searchable:true, orderable:o, search:{value:'',regex:false}});
            const r = await authRequest({
                method: 'POST',
                url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.INVOICE_SEARCH,
                headers: JSON_HEADERS,
                data: JSON.stringify({
                    draw:1, order:[{column:1,dir:'desc'}], start:0, length:200,
                    search:{value:ttnNumber,regex:false}, model:'invoice', searchFormName:'invoice.default',
                    columns: [col('system_list_icon',false),col('number'),col('date'),col('supplier'),col('buyerLegalPerson'),col('sum'),col('status'),col('acceptStatus'),col('egaisStatus'),col('unloadingDate'),col('acceptDate'),col('exchangeChannel'),col('egaisId'),col('createDate')],
                    simpleCrit:{crits:[{attr:'date',value:`${date} - ${date}`,oper:'EQUALS',clauses:[]}]}
                })
            });
            return JSON.parse(r.responseText);
        }
    };

    const Auth = {
        async login(login, password, remember = true) {
            const data = await BartenderAPI.authenticate(login, password);
            AuthState.saveAuth(data);
            if (remember) AuthState.saveCreds(login, password);
            return data;
        },

        async reauth() {
            if (!AuthState.creds?.login || !AuthState.creds?.password) throw new Error('Нет сохранённых данных');
            const data = await BartenderAPI.authenticate(AuthState.creds.login, AuthState.creds.password);
            AuthState.saveAuth(data);
            return data;
        },

        logout() {
            AuthState.clearAuth();
            notify('Вы вышли из системы', 'info');
            AuthUI.update();
        }
    };

    function createEl(tag, className = '', text = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    }

    const tzStatusHTML = (inTZ) => `<span class="tz-status-modal tz-status-${inTZ ? 'yes' : 'no'}">${inTZ ? 'В ТЗ ✓' : 'Нет в ТЗ ✗'}</span>`;

    function createButton({ text = '', variant = 'primary', className = '', title = '', onClick = null, attrs = {} } = {}) {
        const btn = document.createElement('button');
        btn.type = 'button';
        const variantClass = variant ? `egais-btn--${variant}` : '';
        btn.className = ['egais-btn', variantClass, className].filter(Boolean).join(' ');
        if (text) btn.textContent = text;
        if (title) btn.title = title;
        if (typeof onClick === 'function') btn.addEventListener('click', onClick);
        Object.entries(attrs).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                btn.setAttribute(key, value);
            }
        });
        return btn;
    }

    const AuthUI = {
        container: null,

        init() {
            if (this.container) return;
            this.container = document.createElement('div');
            this.container.className = 'auth-container';
            this.container.innerHTML = `<div class="auth-status status-unauthorized">Не авторизован</div><div class="auth-buttons"></div><button class="auth-toggle" title="Свернуть">−</button>`;
            const btns = this.container.querySelector('.auth-buttons');
            [
                { text: '⟳', title: 'Обновить', fn: () => this.check() },
                { text: '🔄', title: 'Реавторизация', fn: () => this.reauth() },
                { text: '🔐', title: 'Войти', fn: () => this.showDialog() },
                { text: '🚪', title: 'Выйти', fn: () => Auth.logout() }
            ].forEach(b => {
                const btn = document.createElement('button');
                btn.className = 'auth-button';
                btn.textContent = b.text;
                btn.title = b.title;
                btn.onclick = e => { e.stopPropagation(); b.fn(); };
                btns.appendChild(btn);
            });
            this.container.querySelector('.auth-toggle').onclick = e => {
                e.stopPropagation();
                this.container.classList.toggle('collapsed');
                GM_setValue(AUTH_CONFIG.STORAGE.COLLAPSED, this.container.classList.contains('collapsed'));
            };
            if (GM_getValue(AUTH_CONFIG.STORAGE.COLLAPSED, false)) this.container.classList.add('collapsed');
            document.body.appendChild(this.container);
        },

        update() {
            const status = this.container?.querySelector('.auth-status');
            if (!status) return;
            const isAuth = !!AuthState.auth;
            status.className = `auth-status ${isAuth ? 'status-authorized' : 'status-unauthorized'}`;
            status.textContent = isAuth ? AuthState.auth.user.name : 'Не авторизован';
            AuthState.token = AuthState.getToken();

            const btns = this.container.querySelector('.auth-buttons');
            const existingAccess = btns?.querySelector('.access-add');
            const hasLegalPerson = legalPersonId && legalPersonId !== 'null' && legalPersonId !== 'undefined';
            if (AuthState.auth && hasLegalPerson && !AuthState.token) {
                if (!existingAccess) {
                    const accessBtn = document.createElement('button');
                    accessBtn.className = 'auth-button warning access-add';
                    accessBtn.textContent = '➕';
                    accessBtn.title = `Добавить доступ к ЮЛ ${legalPersonId}`;
                    accessBtn.onclick = async () => {
                        if (!legalPersonId) { notify('legalPersonId не определён', 'error'); return; }
                        accessBtn.disabled = true;
                        accessBtn.textContent = '...';
                        try {
                            await AccessManager.addLegalPerson(AuthState.auth.user.id, legalPersonId);
                            await this.reauth();
                        } catch (e) { notify('Ошибка: ' + e.message, 'error'); }
                        accessBtn.disabled = false;
                        accessBtn.textContent = '➕';
                    };
                    btns.prepend(accessBtn);
                }
            } else existingAccess?.remove();
        },

        check() {
            const saved = GM_getValue(AUTH_CONFIG.STORAGE.AUTH);
            if (saved && Date.now() - saved.timestamp < AUTH_CONFIG.SESSION_TTL) {
                AuthState.auth = saved;
                AuthState.updateTokens(saved);
                AuthState.token = AuthState.getToken();
            }
            this.update();
        },

        async reauth() {
            if (!AuthState.creds) return notify('Нет сохранённых данных', 'error');
            try {
                notify('Реавторизация...', 'info');
                await Auth.reauth();
                notify('Токены обновлены', 'success');
                this.check();
            } catch (e) { notify('Ошибка: ' + e.message, 'error'); }
        },

        showDialog() {
            const overlay = document.createElement('div');
            overlay.className = 'auth-modal-overlay';
            const close = () => overlay.remove();

            overlay.innerHTML = `<div class="auth-modal"><div class="auth-modal-header"><h2 class="auth-modal-title">Авторизация DXBX</h2><button class="auth-modal-close" type="button">×</button></div><form id="auth-form"><div class="auth-form-group"><label class="auth-form-label">Логин (email)</label><input type="text" id="auth-login" class="auth-form-input" placeholder="Email" required></div><div class="auth-form-group"><label class="auth-form-label">Пароль</label><input type="password" id="auth-password" class="auth-form-input" placeholder="Пароль" required><div class="auth-form-error" id="auth-error"></div></div><div class="auth-form-remember"><input type="checkbox" id="auth-remember" checked><label for="auth-remember">Запомнить</label></div><div class="auth-form-actions"><button type="submit" class="auth-form-submit">Войти</button><button type="button" class="auth-form-cancel">Отмена</button></div></form><div class="auth-modal-footer">Данные сохраняются локально</div></div>`;

            document.body.appendChild(overlay);

            const form = overlay.querySelector('#auth-form');
            const loginInput = overlay.querySelector('#auth-login');
            const passInput = overlay.querySelector('#auth-password');
            const rememberCb = overlay.querySelector('#auth-remember');
            const submitBtn = overlay.querySelector('.auth-form-submit');
            const errorDiv = overlay.querySelector('#auth-error');

            overlay.querySelector('.auth-modal-close').onclick = close;
            overlay.querySelector('.auth-form-cancel').onclick = close;
            overlay.onclick = e => e.target === overlay && close();
            document.addEventListener('keydown', e => e.key === 'Escape' && close(), { once: true });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const login = loginInput.value.trim(), pass = passInput.value.trim();
                if (!login || !pass) { errorDiv.textContent = 'Заполните все поля'; errorDiv.classList.add('show'); return; }
                errorDiv.classList.remove('show');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Вход...';
                try {
                    const data = await Auth.login(login, pass, rememberCb.checked);
                    notify(`Добро пожаловать, ${data.user.name}`, 'success');
                    close();
                    this.check();
                } catch (e) {
                    errorDiv.textContent = e.message;
                    errorDiv.classList.add('show');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Войти';
                }
            });

            submitBtn.addEventListener('click', async (ev) => {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            });

            if (AuthState.creds?.login) { loginInput.value = AuthState.creds.login; passInput.focus(); }
            else loginInput.focus();
        }
    };

    const AccessManager = {
        async addLegalPerson(userId, lpId) {
            let profileId;
            try { 
                profileId = await this.getProfileId(userId); 
            } catch (e) { 
                profileId = await this.getProfileIdAlt(userId); 
            }
            await this.addToProfile(profileId, lpId);
            await Auth.reauth();
            notify('Доступ предоставлен!', 'success');
        },

        async getProfileId(userId) {
            const r = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${AUTH_CONFIG.API_BASE}/app/edit/user/${userId}`,
                    onload: resolve,
                    onerror: reject
                });
            });
            const hashMatch = r.responseText.match(/#app\/edit\/accessprofile\/(\d+)\?ref=user\/\d+/i);
            if (hashMatch?.[1]) {
                return hashMatch[1];
            }
            const m = r.responseText.match(/\/app\/edit\/accessprofile\/(\d+)/i);
            if (m?.[1]) {
                return m[1];
            }
            throw new Error('Профиль не найден на странице пользователя');
        },

        async getProfileIdAlt(userId) {
            const r = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.ACCESS_PROFILE_SEARCH,
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify({
                        draw: 1, start: 0, length: 50,
                        columns: [{ data: 'user' }, { data: 'name' }].map(c => ({ ...c, searchable: true, orderable: true, search: { value: '', regex: false } })),
                        order: [{ column: 0, dir: 'asc' }],
                        search: { value: '', regex: false },
                        model: 'accessprofile',
                        searchFormName: 'accessprofile.default',
                        simpleCrit: { crits: [{ attr: 'user', value: userId, oper: 'EQUALS', clauses: [] }] }
                    }),
                    onload: resolve,
                    onerror: reject
                });
            });
            try {
                const data = JSON.parse(r.responseText);
                if (data.recordsFiltered > 0 && data.data?.[0]?.DT_RowId) {
                    return data.data[0].DT_RowId;
                }
            } catch (e) { 
            }
            return await this.createProfile(userId);
        },

        async createProfile(userId) {
            const r = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.ACCESS_PROFILE_SAVE,
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded', 
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    data: new URLSearchParams({ 'user.id': userId, name: `Профиль ${userId}`, '_method': 'POST' }).toString(),
                    onload: resolve,
                    onerror: reject
                });
            });
            try {
                const data = JSON.parse(r.responseText);
                if (data.success && data.id) return data.id.toString();
            } catch (e) { }
            throw new Error('Не удалось создать профиль');
        },

        async addToProfile(profileId, lpId) {
            const html = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ 
                    method: 'GET', 
                    url: `${AUTH_CONFIG.API_BASE}/app/edit/accessprofile/${profileId}`, 
                    onload: r => resolve(r.responseText),
                    onerror: reject
                });
            });
            const ids = this.extractIds(html);
            if (ids.includes(lpId.toString())) {
                return;
            }
            const fd = this.prepareForm(profileId, html, [...ids, lpId.toString()]);
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: AUTH_CONFIG.API_BASE + AUTH_CONFIG.ENDPOINTS.ACCESS_PROFILE_SAVE,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
                    data: new URLSearchParams([...fd]).toString(),
                    onload: r => {
                        if (r.status >= 200 && r.status < 300) resolve(r);
                        else reject(new Error(`HTTP ${r.status}`));
                    },
                    onerror: reject
                });
            });
        },

        extractIds(html) {
            const ids = new Set();
            [/textIdPairs\[[^\]]+\]\s*=\s*['"`]?(\d+)['"`]?/g, /textIdPairs\[text\]\s*=\s*['"`]?(\d+)['"`]?/g].forEach(re => {
                let m; while ((m = re.exec(html))) if (m[1]) ids.add(m[1]);
            });
            const doc = new DOMParser().parseFromString(html, 'text/html');
            doc.querySelectorAll('input[name="accessprofile.accessLegalPersons.id"]').forEach(i => i.value && ids.add(i.value));
            return Array.from(ids);
        },

        prepareForm(profileId, html, lpIds) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const form = doc.getElementById('entityForm');
            if (!form) throw new Error('Форма не найдена');
            const fd = new FormData();
            fd.append('id', profileId);
            fd.append('_method', 'PUT');
            form.querySelectorAll('input, select, textarea').forEach(el => {
                if (el.name && !el.name.includes('accessprofile.accessLegalPersons.id')) {
                    if ((el.type === 'checkbox' || el.type === 'radio') ? el.checked : true) fd.append(el.name, el.value);
                }
            });
            lpIds.forEach(id => fd.append('accessprofile.accessLegalPersons.id[]', id));
            return fd;
        }
    };

    const BOTTLE_COLUMNS = [
        {"data":"legalPerson","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"egaisActItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"shortMarkCode","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"restsItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"egaisNomenclatureInfo","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"egaisVolume","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"egaisVolumeUpdateDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"active","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
        {"data":"availableVolume","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}}
    ];

    const WORKSHEET_COLUMNS = [
        { header: 'Номенклатура', key: 'nomenclature', width: 40 },
        { header: 'Короткий код', key: 'shortCode', width: 15 },
        { header: 'Объем (мл)', key: 'volume', width: 10 },
        { header: 'Алкокод', key: 'alkoCode', width: 12 },
        { header: 'Статус ТЗ', key: 'tzStatus', width: 12 },
        { header: 'Дата обновления', key: 'updateDate', width: 15 },
        { header: 'Полная марка', key: 'fullMark', width: 50 },
        { header: 'DataMatrix', key: 'datamatrix', width: 30 }
    ];

    const bottleCriterion = (legalPerson, attr, value, oper = 'EQUALS') => ({
        attr: 'legalPerson', value: legalPerson, oper: 'EQUALS',
        clauses: [{ oper: 'AND', criterion: { attr, value, oper, clauses: [] } }]
    });

    const buildBottleSearchPayload = ({ start = 0, length = 200, criterion, order = [{ column: 0, dir: 'asc' }] }) => ({
        draw: 1, columns: BOTTLE_COLUMNS, order, start, length, search: { value: '', regex: false },
        model: 'egaisbottle', searchFormName: 'egaisbottle.default', simpleCrit: { crits: [criterion] }
    });

    const postJSON = (url, payload, { headers = {}, timeout = 15000 } = {}) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST', url, headers: { ...JSON_HEADERS, ...headers }, data: JSON.stringify(payload), timeout,
            onload: r => {
                if (r.status === 200) {
                    const text = r.responseText?.trim();
                    if (!text) return resolve({});
                    try {
                        resolve(JSON.parse(text));
                    } catch (e) {
                        resolve({});
                    }
                } else {
                    reject(new Error(`HTTP ${r.status}`));
                }
            },
            onerror: reject, ontimeout: () => reject(new Error('Таймаут запроса'))
        });
    });

    const getJSON = (url, { headers = {}, timeout = 15000 } = {}) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { ...headers },
            timeout,
            onload: r => r.status === 200 ? resolve(JSON.parse(r.responseText)) : reject(new Error(`HTTP ${r.status}`)),
            onerror: reject,
            ontimeout: () => reject(new Error('Таймаут запроса'))
        });
    });

    const bottleSearch = ({ criterion, start = 0, length = 200, headers = {}, order }) =>
        postJSON(URLS.bottleSearch, buildBottleSearchPayload({ start, length, criterion, order }), { headers });

    const currentLegalPerson = () => legalPersonId || GM_getValue('legalPersonId');

    const debugLog = (msg, data = null) => { const m = data ? `[EGAISTZ] ${msg} ${JSON.stringify(data)}` : `[EGAISTZ] ${msg}`; console.log(m); GM_log(m); };

    const checkBartenderAPIAvailability = () => ({
        available: true,
        isAuthorized: !!AuthState.auth,
        hasToken: !!AuthState.token,
        legalPersonId: legalPersonId,
        userName: AuthState.auth?.user?.name
    });

async function tzBottleAction(isAdd, markInfo, volume, buttonElement = null) {
    const setButtonState = (state, text) => {
        if (!buttonElement) return;
        buttonElement.disabled = state === 'loading';
        buttonElement.classList.remove('loading', 'success', 'error');
        if (state) buttonElement.classList.add(state);
        buttonElement.textContent = text;
    };
    try {
        setButtonState('loading', isAdd ? 'Добавление...' : 'Удаление...');
        
        if (!AuthState.auth) throw new Error('Требуется авторизация. Нажмите 🔐 в правом верхнем углу.');
        if (!AuthState.token) throw new Error('Нет токена для текущей организации. Добавьте доступ через ➕.');

        const result = isAdd 
            ? await BartenderAPI.addBottle(markInfo, volume)
            : await BartenderAPI.removeBottle(markInfo);
        
        if (buttonElement) {
            setButtonState('success', isAdd ? '✓ В ТЗ' : '✓ Удалено');
            setTimeout(() => {
                buttonElement.textContent = isAdd ? 'Удалить из ТЗ' : 'Добавить в ТЗ';
                buttonElement.className = `${isAdd ? 'remove-from-tz' : 'add-to-tz'}-modal-button egais-btn egais-btn--${isAdd ? 'danger' : 'accent'}`;
                buttonElement.disabled = false;
                buttonElement.onclick = () => isAdd ? removeBottleFromTZViaAPI(markInfo, buttonElement) : addBottleToTZWithPrompt(markInfo, buttonElement);
            }, 1000);
        }
        notifyBottleCacheUpdate(markInfo, isAdd ? 'added' : 'removed', volume);
        return result;
    } catch (error) {
        if (buttonElement) { 
            setButtonState('error', 'Ошибка!'); 
            setTimeout(() => { setButtonState(null, isAdd ? 'Добавить в ТЗ' : 'Удалить из ТЗ'); buttonElement.disabled = false; }, 2000); 
        }
        notify(error.message, 'error');
        throw error;
    }
}
const addBottleToTZViaAPI = (markInfo, volume, btn) => tzBottleAction(true, markInfo, volume, btn);
const removeBottleFromTZViaAPI = (markInfo, btn) => tzBottleAction(false, markInfo, null, btn);

function notifyBottleCacheUpdate(markInfo, action, volume = null) {
    bottleCache[`${currentLegalPersonIdForCache}_${markInfo}`] = action === 'added';
    GM_setValue('bottleCache', bottleCache);
    updateTZStatusInUI(markInfo, action === 'added');
    updateTZButtonsInModal(markInfo, action === 'added');
}

async function addBottleToTZWithPrompt(markInfo, buttonElement = null) {
    const volume = buttonElement?.closest('tr') ? (getBottleVolumeFromRow(buttonElement.closest('tr')) || 500) : 500;
    try { await addBottleToTZViaAPI(markInfo, volume, buttonElement); }
    catch (e) { if (buttonElement) alert('Ошибка добавления в ТЗ: ' + e.message); }
}

function getBottleVolumeFromRow(row) {
    if (!row) return null;
    const volumeAttr = row.getAttribute('data-volume');
    if (volumeAttr && !isNaN(parseInt(volumeAttr))) return parseInt(volumeAttr);
    const volumeCell = row.querySelector('.volume-cell');
    if (volumeCell) { const m = getCleanTextContent(volumeCell).match(/(\d+)/); if (m) return parseInt(m[1]); }
    const markMatch = (row.getAttribute('data-mark') || '').match(/(\d{3,4})м?л?/i);
    return markMatch ? parseInt(markMatch[1]) : null;
}

function createTZActionButtons(markInfo, volume, isInTZ = false, row = null) {
    const container = createEl('div', 'tz-action-buttons');
    const actualVolume = volume || (row && getBottleVolumeFromRow(row));
    const volumeInfo = actualVolume ? ` (${actualVolume} мл)` : '';

    const btn = createButton({
        text: isInTZ ? `Удалить из ТЗ${volumeInfo}` : `Добавить в ТЗ${volumeInfo}`,
        title: isInTZ ? 'Удалить бутылку из товарного зала' : `Добавить бутылку в товарный зал${volumeInfo}`,
        variant: isInTZ ? 'danger' : 'accent',
        className: `${isInTZ ? 'remove' : 'add'}-to-tz-modal-button egais-btn`,
        onClick: (e) => {
            e.stopPropagation();
            isInTZ ? removeBottleFromTZViaAPI(markInfo, btn) : addBottleToTZWithPrompt(markInfo, btn);
        }
    });

    container.appendChild(btn);
    return container;
}

async function checkAndUpdateTZButtons() {
    document.querySelectorAll('.modal-table tbody tr').forEach(row => {
        const markInfo = row.getAttribute('data-mark');
        const actionsCell = row.querySelector('.bottle-actions-cell');

        if (markInfo && actionsCell && !actionsCell.querySelector('.tz-action-buttons')) {
            const isInTZ = row.getAttribute('data-tz-status') === 'да';
            actionsCell.appendChild(createTZActionButtons(markInfo, getBottleVolumeFromRow(row), isInTZ, row));
        }
    });
}

    function getCsrfToken() {
        if (!csrfToken) {
            const meta = document.querySelector('meta[name="_csrf"]');
            csrfToken = meta?.getAttribute('content') || (document.cookie.match(/(^|;)\s*XSRF-TOKEN\s*=\s*([^;]+)/)?.[2] && decodeURIComponent(document.cookie.match(/(^|;)\s*XSRF-TOKEN\s*=\s*([^;]+)/)[2]));
        }
        return csrfToken;
    }

    function csrfHeaders() {
        const token = getCsrfToken();
        return token ? { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': token } : { 'X-Requested-With': 'XMLHttpRequest' };
    }

    function interceptXHR() {
        if (window.XMLHttpRequest.prototype._egaisIntercepted) return;
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            return origOpen.call(this, method, url, ...rest);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            try {
                if (this._url) {
                    const restsMatch = this._url.match(/\/api\/front\/egais\/rests\/legalpersons\/(\d+)\/strong/);
                    if (restsMatch?.[1]) {
                        legalPersonId = restsMatch[1];
                        GM_setValue('legalPersonId', legalPersonId);
                        AuthState.token = AuthState.getToken();
                        AuthUI.update();
                    }
                    const lpMatch = this._url.match(/\/legalpersons\/(\d+)/);
                    if (lpMatch?.[1] && lpMatch[1] !== currentLegalPersonIdForCache) {
                        clearCacheForNewLegalPerson(lpMatch[1]);
                    }
                }
            } catch (e) {
            }
            return origSend.call(this, body);
        };
        
        window.XMLHttpRequest.prototype._egaisIntercepted = true;
    }

let currentLegalPersonIdForCache = null;

function initCacheSystem() {
    window.addEventListener('message', handleCacheUpdateMessage);
    window.addEventListener('BottleCacheUpdate', e => handleBottleCacheUpdateEvent(e.detail));
    setupLegalPersonIdObserver();
}

function handleCacheUpdateMessage(event) {
    if (event.data?.type === 'BOTTLE_CACHE_UPDATE') handleBottleCacheUpdateEvent(event.data.data);
    else if (event.data?.type === 'LEGAL_PERSON_CHANGED') handleLegalPersonChanged(event.data.data);
}

function handleBottleCacheUpdateEvent(data) {
    const { markInfo, action, legalPersonId } = data;
    if (legalPersonId !== currentLegalPersonIdForCache) return;

    bottleCache[`${legalPersonId}_${markInfo}`] = action === 'added';
    GM_setValue('bottleCache', bottleCache);
    updateTZStatusInUI(markInfo, action === 'added');
    updateTZButtonsInModal(markInfo, action === 'added');
}

function updateTZButtonsInModal(markInfo, isInTZ) {
    document.querySelectorAll('.modal-table tbody tr').forEach(row => {
        if (row.getAttribute('data-mark') !== markInfo) return;

        const actionsCell = row.querySelector('.bottle-actions-cell');
        actionsCell.querySelector('.tz-action-buttons')?.remove();
        actionsCell.appendChild(createTZActionButtons(markInfo, getBottleVolumeFromRow(row), isInTZ, row));

        const tzCell = row.querySelector('.tz-status-cell');
        if (tzCell) {
            tzCell.innerHTML = tzStatusHTML(isInTZ);
            row.setAttribute('data-tz-status', isInTZ ? 'да' : 'нет');
        }
    });
}

function handleLegalPersonChanged(data) {
    if (data.newLegalPersonId !== currentLegalPersonIdForCache) {
        clearCacheForNewLegalPerson(data.newLegalPersonId);
    }
}

function clearCacheForNewLegalPerson(newLegalPersonId) {
    try {
        Object.keys(bottleCache).forEach(k => delete bottleCache[k]);
        GM_setValue('bottleCache', bottleCache);
    } catch (e) {
        GM_setValue('bottleCache', {});
    }
    bottleCheckCache = {};
    currentLegalPersonIdForCache = newLegalPersonId;
    resetMappingsState();
}

function resetMappingsState() {
    mappingsState.items = [];
    mappingsState.filtered = [];
    mappingsState.paged = [];
    mappingsState.loading = false;
    mappingsState.loaded = false;
    mappingsState.lastLegalPersonId = null;
    mappingsState.currentPage = 1;
    mappingsState.onlyUnmapped = false;
    mappingsState.tableQuery = '';
    
    const container = document.querySelector('.egais-mappings-container');
    if (container) {
        const checkbox = container.querySelector('.egais-mappings-toggle input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
        const searchInput = container.querySelector('.egais-mappings-search');
        if (searchInput) searchInput.value = '';
        
        if (container.style.display !== 'none') {
            const tableWrapper = container.querySelector('.egais-mappings-table-wrapper');
            if (tableWrapper) tableWrapper.innerHTML = '<div class="loading-spinner">Загрузка сопоставлений...</div>';
            setTimeout(() => {
                const lpId = currentLegalPerson();
                if (lpId) loadMappings(lpId, true);
            }, 100);
        }
    }
}

function updateTZStatusInUI(markInfo, inTZ) {
    document.querySelectorAll('.strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1').forEach(element => {
        if (element.textContent.includes(markInfo) || markInfo.includes(element.textContent)) {
            const statusElement = element.parentNode.querySelector('.tz-status');
            if (statusElement) updateTZStatus(statusElement, inTZ);
        }
    });
    updateTZStatusInModals(markInfo, inTZ);
}

function updateTZStatusInModals(markInfo, inTZ) {
    document.querySelectorAll('.modal-table tbody tr').forEach(row => {
        if (row.getAttribute('data-mark') === markInfo) {
            const tzCell = row.querySelector('.tz-status-cell');
            if (tzCell) {
                tzCell.innerHTML = tzStatusHTML(inTZ);
                row.setAttribute('data-tz-status', inTZ ? 'да' : 'нет');
            }
        }
    });
}

function setupLegalPersonIdObserver() {
}

async function forceCheckTZStatus(markInfo, legalPersonId) {
    try {
        const inTZ = await searchInTZ(markInfo, legalPersonId);
        bottleCache[`${legalPersonId}_${markInfo}`] = inTZ;
        GM_setValue('bottleCache', bottleCache);
        return inTZ;
    } catch (error) {
        return false;
    }
}

   async function loadOpenOrders(legalPersonId, forceReload = false) {
        if (ordersLoading) return;

        const cacheKey = `orders_${legalPersonId}`;
        const cacheTimestamp = ordersCache[`${cacheKey}_timestamp`];
        const now = Date.now();

        if (!forceReload && cacheTimestamp && (now - cacheTimestamp < 300000)) {
            const cachedData = ordersCache[cacheKey];
            if (cachedData) { ordersByMarkCode = cachedData; ordersLoaded = true; return; }
        }

        ordersLoading = true;
        try {
            const ordersData = await searchOrders(legalPersonId);
            if (!ordersData?.data?.length) {
                ordersLoaded = true;
                ordersCache[cacheKey] = {};
                ordersCache[`${cacheKey}_timestamp`] = now;
                GM_setValue('ordersCache', ordersCache);
                return;
            }

            ordersByMarkCode = {};
            for (let i = 0; i < ordersData.data.length; i += 3) {
                await Promise.all(ordersData.data.slice(i, i + 3).map(order => processOrder(order.DT_RowId, legalPersonId)));
                if (i + 3 < ordersData.data.length) await new Promise(r => setTimeout(r, 100));
            }

            ordersLoaded = true;
            ordersCache[cacheKey] = ordersByMarkCode;
            ordersCache[`${cacheKey}_timestamp`] = now;
            GM_setValue('ordersCache', ordersCache);
        } catch { ordersLoaded = true; } finally { ordersLoading = false; }
    }

    function searchOrders(legalPersonId) {
        const col = (data, orderable = true) => ({ data, name: '', searchable: true, orderable, search: { value: '', regex: false } });
        return postJSON(URLS.ordersSearch, {
            draw: 1, start: 0, length: 200, model: 'egaisorder', searchFormName: 'egaisorder.default',
            columns: [col('identity'), col('status'), col('legalPerson'), col('firstCloseAttemptDate'), col('createDate'), col('creator', false), col('updateDate')],
            order: [{ column: 4, dir: 'desc' }], search: { value: '', regex: false },
            simpleCrit: { crits: [{ attr: 'legalPerson', value: legalPersonId, oper: 'EQUALS', clauses: [{ oper: 'AND', criterion: { attr: 'status', value: ['CREATED'], oper: 'IN', clauses: [] } }] }] }
        });
    }

    async function processOrder(orderId, legalPersonId) {
        try {
            const orderItems = await getOrderItems(orderId);
            for (const item of orderItems) await processOrderItem(item.id, orderId);
        } catch (error) { }
    }

    async function getOrderItems(orderId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${URLS.orderPage}${orderId}`,
                onload: (response) => {
                    if (response.status !== 200) return resolve([]);
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const items = [...doc.querySelectorAll('tr.clickable-row[data-href*="egaisorderitem"]')]
                            .map(row => ({ id: row.getAttribute('data-href')?.match(/egaisorderitem\/(\d+)/)?.[1], orderId }))
                            .filter(item => item.id);
                        resolve(items);
                    } catch { resolve([]); }
                },
                onerror: () => resolve([])
            });
        });
    }

   async function processOrderItem(itemId, orderId) {
        try {
            const itemDetails = await getOrderItemDetails(itemId, orderId);
            if (!itemDetails?.bottles) return;

            for (const bottle of itemDetails.bottles) {
                const shortCode = extractShortCode(bottle.code);
                if (!shortCode) continue;

                if (!ordersByMarkCode[shortCode]) ordersByMarkCode[shortCode] = [];
                if (!ordersByMarkCode[shortCode].find(o => o.orderId === orderId)) {
                    ordersByMarkCode[shortCode].push({
                        orderId, orderUrl: `https://dxbx.ru/index#app/edit/egaisorder/${orderId}`,
                        itemId, nomenclature: itemDetails.nomenclature,
                        volume: bottle.volume || 'Не указано', fullMarkCode: bottle.code
                    });
                }
            }
        } catch (error) { }
    }

    const extractShortCode = (fullMarkCode) => {
        if (!fullMarkCode) return null;
        const code = fullMarkCode.trim();
        if (code.length >= 15) {
            const shortMark = code.substring(4, 15);
            if (/^\d{11}$/.test(shortMark)) return shortMark;
        }
        const m = code.match(/\d{11}|\d{13}/);
        return m ? m[0] : null;
    };

    async function getOrderItemDetails(itemId, orderId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${URLS.orderItemPage}${itemId}?ref=egaisorder/${orderId}`,
                onload: (response) => {
                    if (response.status !== 200) return resolve({ bottles: [] });
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const bottles = [...doc.querySelectorAll('tr.clickable-row[data-href*="egaisbottlerestreserve"]')]
                            .map(row => {
                                const cells = row.querySelectorAll('td');
                                return cells.length >= 2 ? { code: cells[1].textContent.trim(), volume: cells[2]?.textContent?.trim() || 'Не указано' } : null;
                            }).filter(Boolean);
                        const nomenclature = doc.querySelector('#fgr_nomenclature .label.label-white.label-custom')?.textContent?.trim().replace(/\s+/g, ' ') || 'Не указано';
                        resolve({ bottles, nomenclature });
                    } catch { resolve({ bottles: [] }); }
                },
                onerror: () => resolve({ bottles: [] })
            });
        });
    }
    function createOrdersModal() {
        const overlay = createEl('div', 'modal-overlay orders-overlay');
        overlay.addEventListener('click', closeOrdersModal);
        const modal = createEl('div', 'orders-modal');
        const header = createEl('div', 'modal-header');
        const titleContainer = createEl('div', 'modal-title-container');
        titleContainer.append(createEl('h3', 'modal-title', 'Проверка открытых заказов'), createEl('div', 'modal-subtitle', 'testbuild'));
        const closeButton = createEl('button', 'modal-close');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeOrdersModal);
        header.append(titleContainer, closeButton);
        const content = createEl('div', 'modal-content');
        content.innerHTML = '<div class="loading-spinner">Загрузка заказов...</div>';
        modal.append(header, content);
        document.body.append(overlay, modal);
        return modal;
    }

    function openOrdersModal() {
        if (!document.querySelector('.orders-overlay')) {
            createOrdersModal();
        }
        document.querySelector('.orders-overlay')?.classList.add('active');
        document.querySelector('.orders-modal')?.classList.add('active');
        displayOrdersInModal();
    }

const closeOrdersModal = () => { document.querySelector('.orders-overlay')?.classList.remove('active'); document.querySelector('.orders-modal')?.classList.remove('active'); };

function closeModal() {
    document.querySelector('.modal-overlay')?.classList.remove('active');
    document.querySelector('.nomenclature-modal')?.classList.remove('active');
    currentSearchData = { nomenclature: '', legalPersonId: '', currentPage: 0, totalRecords: 0, pageSize: 500 };
    currentFilters = { nomenclature: '', volumeMin: '', volumeMax: '', alkoCode: '', tzStatus: 'all', markSearch: '', sortField: 'nomenclature', sortDirection: 'asc' };
    allBottlesData = []; selectedBottles.clear();
}

const reloadOrders = (lpId) => { ordersByMarkCode = {}; bottleCheckCache = {}; return loadOpenOrders(lpId, true); };

function addCheckOrdersButton() {
    console.debug('[EGAIS] addCheckOrdersButton called, isTargetPage=', isTargetPage(), 'legalPersonId=', legalPersonId);
    if (!isTargetPage() || !legalPersonId) return;

    const tableWrapper = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
    const form = document.querySelector('form.ant-form');
    console.debug('[EGAIS] addCheckOrdersButton: tableWrapper=', !!tableWrapper, 'form=', !!form);
    if (!tableWrapper || !form || form.querySelector('.orders-buttons-container')) return;

    const ordersContainer = createEl('div', 'orders-buttons-container');

    const button = createButton({ text: 'Проверить заказы', title: 'Показать открытые заказы и сопоставление с бутылками', variant: 'accent', className: 'check-orders-button' });
    button.addEventListener('click', async () => {
        const currentLegalPersonId = currentLegalPerson();
        if (!currentLegalPersonId) { alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.'); return; }
        openOrdersModal();
        if (!ordersLoaded && !ordersLoading) await loadOpenOrders(currentLegalPersonId);
        displayOrdersInModal();
    });

    const reloadButton = createButton({ text: 'Обновить заказы', title: 'Перезагрузить данные заказов', variant: 'warning', className: 'check-orders-button reload-orders-button egais-ml-8' });
    reloadButton.addEventListener('click', async () => {
        const currentLegalPersonId = currentLegalPerson();
        if (!currentLegalPersonId) { alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.'); return; }

        const modal = document.querySelector('.orders-modal.active');
        if (modal) document.querySelector('.orders-modal .modal-content').innerHTML = '<div class="loading-spinner">Перезагрузка заказов...</div>';

        ordersLoaded = ordersLoading = false;
        await reloadOrders(currentLegalPersonId);
        if (modal) displayOrdersInModal();
    });

    ordersContainer.append(button, reloadButton);
    const manualSearch = form.querySelector('.manual-search-container');
    const insertPoint = manualSearch?.nextSibling || form.querySelector('.ant-segmented')?.nextSibling || tableWrapper;
    form.insertBefore(ordersContainer, insertPoint);
}

    function buildOrderMap() {
        const orderMap = new Map();
        let totalBottles = 0;
        for (const [shortCode, orders] of Object.entries(ordersByMarkCode)) {
            for (const order of orders) {
                if (!orderMap.has(order.orderId)) orderMap.set(order.orderId, { ...order, bottles: [] });
                orderMap.get(order.orderId).bottles.push({ shortCode, fullMarkCode: order.fullMarkCode, volume: order.volume, nomenclature: order.nomenclature });
                totalBottles++;
            }
        }
        return { orderMap, totalOrders: orderMap.size, totalBottles };
    }

    const renderOrdersSummary = (to, tb) => `<div class="orders-summary"><div class="summary-stats"><div class="summary-stat">Всего заказов: <span class="summary-value">${to}</span></div><div class="summary-stat">Всего бутылок: <span class="summary-value">${tb}</span></div><div class="summary-stat">Найдено бутылок: <span id="found-bottles-count" class="summary-value">0</span></div><div class="summary-stat">Процент найденных: <span id="found-percentage" class="summary-value">0%</span></div></div></div><div id="orders-content"><div class="loading-spinner">Проверка наличия бутылок...</div></div>`;

    function renderBottleHTML(bottle) {
        const base = `<div class="order-bottle"><div style="flex: 1;"><div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">`;
        const details = `<div style="font-size: 11px; color: #666;"><div><strong>Объем:</strong> ${bottle.volume} мл</div><div><strong>Полная марка:</strong> ${bottle.fullMarkCode}</div>`;
        if (bottle.found && bottle.bottleInfo) {
            return `${base}<a class="modal-link" href="${bottle.bottleInfo.bottleUrl}" target="_blank" style="font-weight: 600;">${bottle.shortCode}</a><span class="bottle-match match-found">✓ Найдена</span></div>${details}<div><strong>Номенклатура:</strong> ${bottle.bottleInfo.nomenclature}</div></div></div></div>`;
        }
        return `${base}<span class="bottle-code" style="font-weight: 600;">${bottle.shortCode}</span><span class="bottle-match match-not-found">✗ Не найдена</span></div>${details}</div></div></div>`;
    }

async function displayOrdersInModal() {
        const content = document.querySelector('.orders-modal .modal-content');

        if (ordersLoading) {
            content.innerHTML = '<div class="loading-spinner">Загрузка заказов...</div>';
            return;
        }

        if (!ordersLoaded) {
            content.innerHTML = `<div class="loading-spinner">Заказы еще не загружены. Нажмите "Проверить заказы" для начала загрузки.<div style="font-size: 12px; margin-top: 10px; color: #999;">Это может занять несколько секунд</div></div>`;
            return;
        }

        if (!Object.keys(ordersByMarkCode).length) {
            content.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Нет открытых заказов</div>';
            return;
        }

        const { orderMap, totalOrders, totalBottles } = buildOrderMap();
        content.innerHTML = renderOrdersSummary(totalOrders, totalBottles);
        await displayOrdersContent();
    }

    async function displayOrdersContent() {
        const content = document.querySelector('.orders-modal .modal-content');

        const { orderMap, totalOrders, totalBottles } = buildOrderMap();

        content.innerHTML = renderOrdersSummary(totalOrders, totalBottles);

        await checkBottlesWithCache(orderMap, totalBottles);
    }

    async function checkBottlesWithCache(orderMap, totalBottles) {
        const currentLegalPersonId = currentLegalPerson();
        if (!currentLegalPersonId) {
            document.getElementById('orders-content').innerHTML = '<div class="error-message">Ошибка: не удалось определить legalPersonId</div>';
            return;
        }

        let currentFoundBottles = 0;
        let ordersHTML = '';
        const updateStats = () => {
            document.getElementById('found-bottles-count').textContent = currentFoundBottles;
            document.getElementById('found-percentage').textContent = totalBottles > 0 ? Math.round((currentFoundBottles / totalBottles) * 100) + '%' : '0%';
        };

        for (const [orderId, orderData] of orderMap) {
            let orderHTML = `<div class="order-item"><div class="order-header"><a class="order-title" href="${orderData.orderUrl}" target="_blank">Заказ #${orderId}</a><span class="order-status status-created">CREATED</span></div><div class="order-details"><div><strong>Номенклатура ресторана:</strong> ${orderData.nomenclature}</div><div style="margin-top: 8px;"><strong>Бутылки в заказе:</strong></div>`;

            for (const bottle of orderData.bottles) {
                const cacheKey = `${currentLegalPersonId}_${bottle.shortCode}`;
                const cached = bottleCheckCache[cacheKey];
                if (cached !== undefined) {
                    bottle.found = cached.found;
                    bottle.bottleInfo = cached.bottleInfo;
                } else {
                    try {
                        const bottleInfo = await getBottleInfoByShortCode(bottle.shortCode, currentLegalPersonId);
                        bottle.found = bottleInfo.found;
                        bottle.bottleInfo = bottleInfo;
                        bottleCheckCache[cacheKey] = { found: bottleInfo.found, bottleInfo };
                    } catch { bottle.found = false; bottle.bottleInfo = null; }
                }
                if (bottle.found) currentFoundBottles++;
                orderHTML += renderBottleHTML(bottle);
                updateStats();
                await new Promise(r => setTimeout(r, 30));
            }

            ordersHTML += orderHTML + `</div></div>`;
            document.getElementById('orders-content').innerHTML = ordersHTML;
        }
        updateStats();
    }

    function createModal() {
        const overlay = createEl('div', 'modal-overlay');
        overlay.addEventListener('click', closeModal);
        const modal = createEl('div', 'nomenclature-modal');
        const header = createEl('div', 'modal-header');
        const titleContainer = createEl('div', 'modal-title-container');
        titleContainer.append(createEl('h3', 'modal-title', 'Поиск бутылок по номенклатуре'), createEl('div', 'modal-subtitle'));
        const closeButton = createEl('button', 'modal-close');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeModal);
        header.append(titleContainer, closeButton);
        const content = createEl('div', 'modal-content');
        content.innerHTML = '<div class="loading-spinner">Загрузка...</div>';
        modal.append(header, content);
        document.body.append(overlay, modal);
        return modal;
    }

    function openModal(nomenclature = '', positionName = '') {
        document.querySelector('.modal-title').textContent = nomenclature ? `Поиск бутылок: ${nomenclature}` : 'Поиск бутылок по номенклатуре';
        document.querySelector('.modal-subtitle').textContent = positionName ? `Позиция: ${positionName}` : '';
        document.querySelector('.modal-overlay')?.classList.add('active');
        document.querySelector('.nomenclature-modal')?.classList.add('active');
    }

    const searchBottlesByNomenclature = (nomenclature, lpId, start = 0, length = 10000) =>
        bottleSearch({ criterion: bottleCriterion(lpId, 'egaisNomenclatureInfo.name', nomenclature, 'LIKE'), start, length, headers: csrfHeaders() });
    async function getBottleInfoByShortCode(shortCode, legalPersonId) {
        try {
            const data = await bottleSearch({ criterion: bottleCriterion(legalPersonId, 'shortMarkCode', shortCode), length: 10 });
            const bottle = data.data?.[0];
            return bottle ? {
                found: true,
                bottleId: bottle.DT_RowId,
                nomenclature: bottle.egaisNomenclatureInfo || 'Не указано',
                shortMarkCode: bottle.shortMarkCode,
                bottleUrl: `https://dxbx.ru/index#app/edit/egaisbottle/${bottle.DT_RowId}`
            } : { found: false };
        } catch (error) {
            return { found: false };
        }
    }

    function getBottleDetails(bottleId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://dxbx.ru/app/edit/egaisbottle/${bottleId}`,
                onload: (response) => {
                    if (response.status !== 200) return reject(new Error(`HTTP error: ${response.status}`));
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const volumeInput = doc.querySelector('input[name="availableVolume"]');
                        const markInfoInput = doc.querySelector('input[name="markInfo"]');
                        if (volumeInput && markInfoInput) resolve({ volume: volumeInput.value, markInfo: markInfoInput.value });
                        else reject(new Error('Элементы с объемом или маркой не найдены'));
                    } catch (error) { reject(new Error(`Ошибка парсинга: ${error.message}`)); }
                },
                onerror: (error) => reject(new Error(`Ошибка сети: ${error}`))
            });
        });
    }

    async function checkTZStatusForBottle(markInfo, legalPersonId) {
        const cacheKey = `${legalPersonId}_${markInfo}`;
        if (bottleCache[cacheKey] !== undefined) return bottleCache[cacheKey];

        try {
            const inTZ = await searchInTZ(markInfo, legalPersonId);
            bottleCache[cacheKey] = inTZ;
            GM_setValue('bottleCache', bottleCache);
            return inTZ;
        } catch (error) {
            return false;
        }
    }

    function createPaginationControls(totalRecords, currentPage, pageSize) {
        const totalPages = Math.ceil(totalRecords / pageSize);
        const controls = createEl('div', 'pagination-controls');
        const prevButton = createButton({ text: '← Назад', variant: 'primary', className: 'pagination-button', onClick: () => loadPage(currentPage - 1) });
        const nextButton = createButton({ text: 'Вперед →', variant: 'primary', className: 'pagination-button', onClick: () => loadPage(currentPage + 1) });
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage >= totalPages - 1;
        const pageInfo = createEl('span', 'pagination-info', `Страница ${currentPage + 1} из ${totalPages} | Записи ${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, totalRecords)} из ${totalRecords}`);
        controls.append(prevButton, pageInfo, nextButton);
        return controls;
    }

    async function loadPage(pageNumber) {
        const content = document.querySelector('.modal-content');
        content.innerHTML = '<div class="loading-spinner">Загрузка...</div>';
        try {
            const results = await searchBottlesByNomenclature(currentSearchData.nomenclature, currentSearchData.legalPersonId, pageNumber * currentSearchData.pageSize, currentSearchData.pageSize);
            currentSearchData.currentPage = pageNumber;
            await displayResultsInModal(results, currentSearchData.nomenclature, currentSearchData.legalPersonId);
        } catch (error) { content.innerHTML = `<div class="error-message">Ошибка при загрузке страницы: ${error.message}</div>`; }
    }

    function createFiltersHTML() {
        const stats = ['Всего записей:total-count', 'Отфильтровано:filtered-count', 'В ТЗ:tz-count', 'Не в ТЗ:not-tz-count', 'Средний объем:avg-volume', 'Уникальных алкокодов:alko-count'];
        const quickFilters = [['tz=yes', 'Только в ТЗ'], ['tz=no', 'Только не в ТЗ'], ['volume=low', 'Меньше 100 мл'], ['volume=medium', '100-500 мл'], ['volume=high', 'Больше 500 мл'], ['alko-code', 'По алкокоду'], ['reset', 'Сбросить всё']];
        const sortOptions = [['nomenclature', 'По номенклатуре'], ['volume', 'По объему'], ['tzStatus', 'По статусу ТЗ'], ['date', 'По дате'], ['shortcode', 'По короткому коду'], ['alkoCode', 'По алкокоду']];

        return `<div class="filters-container"><div class="filters-header"><h4 class="filters-title">Фильтры и сортировка</h4></div><div class="stats-container" id="stats-container">${stats.map(s => { const [label, id] = s.split(':'); return `<div class="stat-item">${label} <span class="stat-value" id="${id}">0</span>${id === 'avg-volume' ? ' мл' : ''}</div>`; }).join('')}</div><div class="batch-actions" id="batch-actions" style="display: none;"><div class="selected-count">Выбрано: <span id="selected-count">0</span></div><button class="batch-action egais-btn egais-btn--accent" id="select-all">Выбрать все</button><button class="batch-action egais-btn egais-btn--accent" id="deselect-all">Снять выделение</button><button class="batch-action egais-btn egais-btn--success" id="export-selected">Экспорт выбранных</button><button class="batch-action egais-btn egais-btn--accent" id="batch-add-tz">➕ Добавить в ТЗ</button><button class="batch-action egais-btn egais-btn--danger" id="batch-remove-tz">➖ Удалить из ТЗ</button></div><div class="quick-filters" id="quick-filters">${quickFilters.map(([f, t]) => `<div class="quick-filter" data-filter="${f}">${t}</div>`).join('')}</div><div class="filters-grid"><div class="filter-group"><label class="filter-label">Номенклатура</label><select class="filter-select" id="nomenclature-filter"><option value="">Все номенклатуры</option></select></div><div class="filter-group"><label class="filter-label">Алкокод</label><select class="filter-select" id="alko-code-filter"><option value="">Все алкокоды</option></select></div><div class="filter-group"><label class="filter-label">Объем от (мл)</label><input type="number" class="filter-input" id="volume-min" placeholder="0" min="0" max="1000"></div><div class="filter-group"><label class="filter-label">Объем до (мл)</label><input type="number" class="filter-input" id="volume-max" placeholder="1000" min="0" max="1000"></div><div class="filter-group"><label class="filter-label">Статус ТЗ</label><select class="filter-select" id="tz-filter"><option value="all">Все</option><option value="yes">В ТЗ</option><option value="no">Не в ТЗ</option></select></div><div class="filter-group"><label class="filter-label">Поиск по марке</label><input type="text" class="filter-input" id="mark-search" placeholder="Часть марки..."></div><div class="filter-group"><label class="filter-label">Сортировка</label><select class="filter-select" id="sort-field">${sortOptions.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></div><div class="filter-group"><label class="filter-label">Направление</label><select class="filter-select" id="sort-direction"><option value="asc">По возрастанию</option><option value="desc">По убыванию</option></select></div></div><div class="filter-actions"><button class="filter-button egais-btn egais-btn--primary filter-apply" id="apply-filters">Применить фильтры</button><button class="filter-button egais-btn egais-btn--muted filter-reset" id="reset-filters">Сбросить фильтры</button><button class="filter-button egais-btn egais-btn--success filter-export" id="export-data">Экспорт в XLS</button><button class="filter-button batch-action egais-btn egais-btn--accent" id="toggle-selection">Режим выбора</button></div></div>`;
    }

    function extractAlkoCode(restsItem) {
        return restsItem?.match(/Алк\. код:\s*(\d+)/)?.[1] || '';
    }

    function setupFilters() {
        document.getElementById('quick-filters').addEventListener('click', e => e.target.classList.contains('quick-filter') && applyQuickFilter(e.target.dataset.filter));
        document.getElementById('apply-filters').addEventListener('click', applyFilters);
        document.getElementById('reset-filters').addEventListener('click', resetFilters);
        document.getElementById('toggle-selection').addEventListener('click', toggleSelectionMode);
        document.getElementById('select-all').addEventListener('click', selectAll);
        document.getElementById('deselect-all').addEventListener('click', deselectAll);
        document.getElementById('export-data').addEventListener('click', exportToXLSX);
        document.getElementById('export-selected').addEventListener('click', exportSelectedToXLSX);
        document.getElementById('batch-add-tz').addEventListener('click', batchAddToTZ);
        document.getElementById('batch-remove-tz').addEventListener('click', batchRemoveFromTZ);

        ['nomenclature-filter', 'tz-filter', 'sort-field', 'sort-direction', 'alko-code-filter'].forEach(id => document.getElementById(id).addEventListener('change', applyFilters));
        ['volume-min', 'volume-max', 'mark-search'].forEach(id => document.getElementById(id).addEventListener('input', debounce(applyFilters, 300)));
    }

    const debounce = (func, wait) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => func(...args), wait); }; };

    function applyQuickFilter(filterType) {
        const actions = {
            'tz=yes': () => currentFilters.tzStatus = 'yes',
            'tz=no': () => currentFilters.tzStatus = 'no',
            'volume=low': () => { currentFilters.volumeMin = '0'; currentFilters.volumeMax = '100'; },
            'volume=medium': () => { currentFilters.volumeMin = '100'; currentFilters.volumeMax = '500'; },
            'volume=high': () => { currentFilters.volumeMin = '500'; currentFilters.volumeMax = '1000'; },
            'alko-code': () => { const s = document.getElementById('alko-code-filter'); if (s.options.length > 1) currentFilters.alkoCode = s.options[1].value; },
            'reset': () => { resetFilters(); return true; }
        };
        if (actions[filterType]?.()) return;
        updateFilterInputs();
        applyFilters();
    }

    function updateFilterInputs() {
        const map = { 'nomenclature-filter': 'nomenclature', 'alko-code-filter': 'alkoCode', 'volume-min': 'volumeMin', 'volume-max': 'volumeMax', 'tz-filter': 'tzStatus', 'mark-search': 'markSearch', 'sort-field': 'sortField', 'sort-direction': 'sortDirection' };
        Object.entries(map).forEach(([id, key]) => document.getElementById(id).value = currentFilters[key]);
    }

    function applyFilters() {
        currentFilters = { nomenclature: document.getElementById('nomenclature-filter').value, alkoCode: document.getElementById('alko-code-filter').value, volumeMin: document.getElementById('volume-min').value, volumeMax: document.getElementById('volume-max').value, tzStatus: document.getElementById('tz-filter').value, markSearch: document.getElementById('mark-search').value.toLowerCase(), sortField: document.getElementById('sort-field').value, sortDirection: document.getElementById('sort-direction').value };
        filterAndSortTable();
    }

    function resetFilters() {
        currentFilters = { nomenclature: '', alkoCode: '', volumeMin: '', volumeMax: '', tzStatus: 'all', markSearch: '', sortField: 'nomenclature', sortDirection: 'asc' };
        updateFilterInputs();
        filterAndSortTable();
    }

    function filterAndSortTable() {
        const rows = document.querySelectorAll('.modal-table tbody tr');
        let visibleCount = 0, tzCount = 0, notTzCount = 0, totalVolume = 0, volumeCount = 0;
        const alkoCodes = new Set();

        rows.forEach(row => {
            const nom = row.getAttribute('data-nomenclature') || '';
            const vol = parseInt(row.getAttribute('data-volume') || 0);
            const tz = row.getAttribute('data-tz-status') || '';
            const mark = (row.getAttribute('data-mark') || '').toLowerCase();
            const short = (row.querySelector('td:nth-child(2)')?.textContent || '').toLowerCase();
            const alko = row.getAttribute('data-alko-code') || '';
            const f = currentFilters;

            const tzMatch = f.tzStatus === 'all' || (f.tzStatus === 'yes' ? tz === 'да' : f.tzStatus === 'no' ? tz === 'нет' : true);
            const shouldShow = (!f.nomenclature || nom === f.nomenclature) &&
                (!f.alkoCode || alko === f.alkoCode) &&
                (!f.volumeMin || vol >= parseInt(f.volumeMin)) &&
                (!f.volumeMax || vol <= parseInt(f.volumeMax)) &&
                tzMatch &&
                (!f.markSearch || mark.includes(f.markSearch) || short.includes(f.markSearch));

            row.style.display = shouldShow ? '' : 'none';
            if (shouldShow) {
                visibleCount++;
                if (tz === 'да') tzCount++;
                if (tz === 'нет') notTzCount++;
                if (vol > 0) { totalVolume += vol; volumeCount++; }
                if (alko) alkoCodes.add(alko);
                row.classList.add('highlight-row');
                setTimeout(() => row.classList.remove('highlight-row'), 1000);
            }
        });

        sortTable();
        updateStats(rows.length, visibleCount, tzCount, notTzCount, volumeCount > 0 ? totalVolume / volumeCount : 0, alkoCodes.size);
    }

    function sortTable() {
        const tbody = document.querySelector('.modal-table tbody');
        const rows = Array.from(tbody.querySelectorAll('tr:not([style*="display: none"])'));
        const { sortField, sortDirection } = currentFilters;

        rows.sort((a, b) => {
            const getValue = (row) => {
                switch (sortField) {
                    case 'volume': return parseInt(row.getAttribute('data-volume') || 0);
                    case 'tzStatus': return row.getAttribute('data-tz-status') || '';
                    case 'date': return row.querySelector('td:nth-child(6)')?.textContent || '';
                    case 'shortcode': return row.querySelector('td:nth-child(2)')?.textContent || '';
                    case 'alkoCode': return row.getAttribute('data-alko-code') || '';
                    default: return row.getAttribute('data-nomenclature') || '';
                }
            };
            let [aVal, bVal] = [getValue(a), getValue(b)];
            if (sortDirection === 'desc') [aVal, bVal] = [bVal, aVal];
            return typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    function updateStats(total, filtered, tzCount, notTzCount, avgVolume, alkoCount) {
        if (arguments.length === 0) {
            const rows = document.querySelectorAll('.modal-table tbody tr');
            let tz = 0, notTz = 0, vis = 0, vol = 0, volCnt = 0;
            const alkos = new Set();
            rows.forEach(r => {
                if (r.style.display === 'none') return;
                vis++;
                const tzStat = r.getAttribute('data-tz-status') || '';
                if (tzStat === 'да') tz++;
                if (tzStat === 'нет') notTz++;
                const v = parseInt(r.getAttribute('data-volume') || 0);
                if (v > 0) { vol += v; volCnt++; }
                const alko = r.getAttribute('data-alko-code');
                if (alko) alkos.add(alko);
            });
            return updateStats(rows.length, vis, tz, notTz, volCnt > 0 ? vol / volCnt : 0, alkos.size);
        }
        ['total-count', 'filtered-count', 'tz-count', 'not-tz-count', 'avg-volume', 'alko-count']
            .forEach((id, i) => document.getElementById(id).textContent = [total, filtered, tzCount, notTzCount, Math.round(avgVolume), alkoCount][i]);
    }

    function populateAlkoCodeFilter(bottles) {
        const select = document.getElementById('alko-code-filter');
        const codes = [...new Set(bottles.map(b => extractAlkoCode(b.restsItem)).filter(Boolean))].sort();
        select.innerHTML = '<option value="">Все алкокоды</option>' + codes.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    const getVolumeBadge = vol => {
        const v = parseInt(vol) || 0;
        return v < 100 ? '<span class="volume-badge volume-low">Малый</span>' : v < 500 ? '<span class="volume-badge volume-medium">Средний</span>' : '<span class="volume-badge volume-high">Большой</span>';
    };

    function toggleSelectionMode() {
        const batchActions = document.getElementById('batch-actions');
        const toggleBtn = document.getElementById('toggle-selection');
        const isSelectionMode = batchActions.style.display !== 'none';
        const rows = document.querySelectorAll('.modal-table tbody tr');

        batchActions.style.display = isSelectionMode ? 'none' : 'flex';
        toggleBtn.textContent = isSelectionMode ? 'Режим выбора' : 'Отменить выбор';

        rows.forEach(row => {
            row.style.cursor = isSelectionMode ? 'default' : 'pointer';
            row.classList.toggle('selectable-row', !isSelectionMode);
            row.classList.remove('selected-row');
            isSelectionMode ? row.removeEventListener('click', handleRowSelection) : row.addEventListener('click', handleRowSelection);
        });

        if (isSelectionMode) { selectedBottles.clear(); updateSelectedCount(); }
    }

    function handleRowSelection(e) {
        const row = e.currentTarget;
        const bottleId = row.getAttribute('data-bottle-id');
        selectedBottles.has(bottleId) ? selectedBottles.delete(bottleId) : selectedBottles.add(bottleId);
        row.classList.toggle('selected-row');
        updateSelectedCount();
    }

    const updateSelectedCount = () => document.getElementById('selected-count').textContent = selectedBottles.size;

    const selectAll = () => { document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])').forEach(r => { selectedBottles.add(r.getAttribute('data-bottle-id')); r.classList.add('selected-row'); }); updateSelectedCount(); };

    const deselectAll = () => { document.querySelectorAll('.modal-table tbody tr').forEach(r => r.classList.remove('selected-row')); selectedBottles.clear(); updateSelectedCount(); };

    async function batchAddToTZ() {
        const api = checkBartenderAPIAvailability();
        if (!api.available || !api.isAuthorized) { alert('Bartender API не авторизован. Откройте панель авторизации.'); return; }
        const rows = selectedBottles.size > 0
            ? [...document.querySelectorAll('.modal-table tbody tr.selected-row')]
            : [...document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])')];
        const toAdd = rows.filter(r => {
            const tzCell = r.querySelector('td:nth-child(6)');
            return tzCell && !tzCell.textContent.includes('✅');
        });
        if (!toAdd.length) { alert('Нет бутылок для добавления в ТЗ'); return; }
        if (!confirm(`Добавить ${toAdd.length} бутылок в ТЗ?`)) return;
        let success = 0, failed = 0;
        for (const row of toAdd) {
            const mark = row.getAttribute('data-mark');
            const volumeCell = row.querySelector('td:nth-child(3)');
            const volume = volumeCell ? parseFloat(volumeCell.textContent) || 50 : 50;
            try {
                const result = await BartenderAPI.addBottle(mark, volume);
                if (result.success) {
                    success++;
                    const tzCell = row.querySelector('td:nth-child(6)');
                    if (tzCell) tzCell.innerHTML = '<span class="tz-badge in-tz">✅ В ТЗ</span>';
                } else failed++;
            } catch (e) { failed++; }
        }
        alert(`Добавлено: ${success}, Ошибок: ${failed}`);
        updateStats();
    }

    async function batchRemoveFromTZ() {
        const api = checkBartenderAPIAvailability();
        if (!api.available || !api.isAuthorized) { alert('Bartender API не авторизован. Откройте панель авторизации.'); return; }
        const rows = selectedBottles.size > 0
            ? [...document.querySelectorAll('.modal-table tbody tr.selected-row')]
            : [...document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])')];
        const toRemove = rows.filter(r => {
            const tzCell = r.querySelector('td:nth-child(6)');
            return tzCell && tzCell.textContent.includes('✅');
        });
        if (!toRemove.length) { alert('Нет бутылок для удаления из ТЗ'); return; }
        if (!confirm(`Удалить ${toRemove.length} бутылок из ТЗ?`)) return;
        let success = 0, failed = 0;
        for (const row of toRemove) {
            const mark = row.getAttribute('data-mark');
            try {
                const result = await BartenderAPI.removeBottle(mark);
                if (result.success) {
                    success++;
                    const tzCell = row.querySelector('td:nth-child(6)');
                    if (tzCell) tzCell.innerHTML = '<span class="tz-badge not-in-tz">❌ Не в ТЗ</span>';
                } else failed++;
            } catch (e) { failed++; }
        }
        alert(`Удалено: ${success}, Ошибок: ${failed}`);
        updateStats();
    }

    async function prepareExportDataWithImages(rows) {
        const data = [];
        for (const row of rows) {
            if (row.style.display === 'none') continue;
            const cells = row.querySelectorAll('td');
            const fullMark = row.getAttribute('data-mark') || '';
            const hasData = [...cells].some(cell => { const t = getCleanTextContent(cell); return t && !['Н/Д', 'Загрузка...', 'Ошибка', 'Проверка...'].includes(t); });
            if (!hasData && !fullMark) continue;
            data.push({
                nomenclature: getCleanTextContent(cells[0]) || '', shortCode: getCleanTextContent(cells[1]) || '', volume: extractVolumeText(cells[2]),
                alkoCode: row.getAttribute('data-alko-code') || '', fullMark, tzStatus: extractTZStatusText(cells[5]), updateDate: getCleanTextContent(cells[6]) || '',
                datamatrixImage: fullMark ? await generateDataMatrixBase64Large(fullMark) : ''
            });
        }
        return data;
    }

function getCleanTextContent(element) {
    if (!element) return '';
    const clone = element.cloneNode(true);
    clone.querySelectorAll('button, .expand-toggle, .copy-mark, .generate-datamatrix, .volume-badge, .tz-status-modal, .modal-link').forEach(el => el.remove());
    return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

function extractVolumeText(volumeCell) {
    if (!volumeCell) return '';
    const clone = volumeCell.cloneNode(true);
    clone.querySelector('.volume-badge')?.remove();
    return (clone.textContent || '').replace(/\s+/g, ' ').trim().match(/(\d+)/)?.[1] || '';
}

function extractTZStatusText(tzCell) {
    if (!tzCell) return '';
    const el = tzCell.querySelector('.tz-status-modal');
    if (!el) return getCleanTextContent(tzCell);
    const text = el.textContent.trim();
    return text.includes('В ТЗ ✓') ? 'В ТЗ' : text.includes('Нет в ТЗ ✗') ? 'Не в ТЗ' : text.includes('Проверка...') ? 'Проверка' : text;
}

    function createWorkbookWithSheet(sheetName) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'EGAIS Script';
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet(sheetName);
        worksheet.columns = WORKSHEET_COLUMNS;
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E6FA' } };
        headerRow.height = 25;
        return { workbook, worksheet };
    }

    function addDataRowsWithImages(workbook, worksheet, data) {
        data.forEach(item => {
            const row = worksheet.addRow({ nomenclature: item.nomenclature, shortCode: item.shortCode, volume: item.volume, alkoCode: item.alkoCode, tzStatus: item.tzStatus, updateDate: item.updateDate, fullMark: item.fullMark });
            row.height = 120;
            if (item.datamatrixImage && item.fullMark) {
                try {
                    const imageId = workbook.addImage({ base64: item.datamatrixImage, extension: 'png' });
                    worksheet.addImage(imageId, { tl: { col: 7, row: row.number - 1, offset: 5 }, br: { col: 8, row: row.number, offset: -5 }, editAs: 'oneCell' });
                } catch {}
            }
        });
    }

    function addStatsSheet(workbook, data) {
        const statsSheet = workbook.addWorksheet('Статистика');
        statsSheet.columns = [{ header: 'Параметр', key: 'param', width: 25 }, { header: 'Значение', key: 'value', width: 20 }];
        [['Дата экспорта', new Date().toLocaleString('ru-RU')], ['Всего записей', data.length], ['В ТЗ', data.filter(i => i.tzStatus === 'В ТЗ').length], ['Не в ТЗ', data.filter(i => i.tzStatus === 'Не в ТЗ').length], ['Средний объем', Math.round(data.reduce((s, i) => s + (parseInt(i.volume) || 0), 0) / Math.max(data.length, 1)) + ' мл']]
            .forEach(([param, value]) => statsSheet.addRow({ param, value }));
        statsSheet.getRow(1).font = { bold: true };
        statsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F8FF' } };
    }

    function filterExportData(data) {
        return data.filter(item => item.nomenclature || item.shortCode || item.volume || item.alkoCode || item.fullMark);
    }

    function makeExportFileName(prefix) {
        return `${prefix}_${new Date().toISOString().split('T')[0]}.xlsx`;
    }

async function exportToXLSX() {
    const rows = document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])');
    if (!rows.length) { alert('Нет данных для экспорта'); return; }

    const btn = document.getElementById('export-data');
    const originalText = btn.textContent;
    btn.textContent = 'Подготовка...';
    btn.disabled = true;

    try {
        const { workbook, worksheet } = createWorkbookWithSheet('Бутылки');
        const data = filterExportData(await prepareExportDataWithImages(rows));
        addDataRowsWithImages(workbook, worksheet, data);
        addStatsSheet(workbook, data);
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), makeExportFileName('бутылки'));
    } catch (error) { alert('Ошибка при экспорте: ' + error.message); } finally { btn.textContent = originalText; btn.disabled = false; }
}

async function exportSelectedToXLSX() {
    const selectedRows = [...document.querySelectorAll('.modal-table tbody tr')].filter(r => selectedBottles.has(r.getAttribute('data-bottle-id')));
    if (!selectedRows.length) { alert('Не выбрано ни одной бутылки для экспорта'); return; }

    const btn = document.getElementById('export-selected');
    const originalText = btn.textContent;
    btn.textContent = 'Подготовка...';
    btn.disabled = true;

    try {
        const { workbook, worksheet } = createWorkbookWithSheet('Выбранные бутылки');
        const data = filterExportData(await prepareExportDataWithImages(selectedRows));
        addDataRowsWithImages(workbook, worksheet, data);
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), makeExportFileName('выбранные_бутылки'));
    } catch (error) { alert('Ошибка при экспорте: ' + error.message); } finally { btn.textContent = originalText; btn.disabled = false; }
}

function generateDataMatrixBase64Large(markCode) {
    return new Promise(resolve => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 400, 400);
            bwipjs.toCanvas(canvas, { bcid: 'datamatrix', text: markCode, scale: 6, height: 60, width: 60, includetext: false });
            resolve(canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, ''));
        } catch { resolve(''); }
    });
}

    async function displayResultsInModal(results, nomenclature, currentLegalPersonId, positionName = '') {
        const content = document.querySelector('.modal-content');
        content.innerHTML = '<div class="loading-spinner">Загрузка...</div>';

        const showEmpty = (msg) => { content.innerHTML = `<div style="text-align: center; padding: 40px; color: #999;">${msg}${positionName ? `<br>Позиция: ${positionName}` : ''}</div>`; };
        if (!results?.data?.length) return showEmpty(`Бутылки для номенклатуры "${nomenclature}" не найдены`);

        currentSearchData.nomenclature = nomenclature;
        currentSearchData.legalPersonId = currentLegalPersonId;
        currentSearchData.totalRecords = results.recordsTotal || results.data.length;

        const activeBottles = results.data.filter(b => b.active === "Да");
        allBottlesData = activeBottles;

        if (!activeBottles.length) return showEmpty(`Активные бутылки для номенклатуры "${nomenclature}" не найдены<br>Всего найдено: ${results.data.length}<br>Активных: 0`);

        content.innerHTML = createFiltersHTML();
        const tableContainer = createEl('div', 'table-container');
        content.appendChild(tableContainer);

        const headers = ['Наименование', 'Короткий код', 'Объем (мл)', 'Алкокод', 'Полная марка', 'В ТЗ', 'Дата обновления', 'Действия с бутылкой', 'ТЗ операции'];
        const sortableHeaders = { 0: 'nomenclature', 1: 'shortcode', 2: 'volume', 3: 'alkoCode', 5: 'tz', 6: 'date' };

        let tableHTML = `<div class="results-count">Найдено активных бутылок: ${activeBottles.length} из ${results.data.length}${positionName ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">Позиция: ${positionName}</div>` : ''}${currentSearchData.totalRecords > currentSearchData.pageSize ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">Всего записей: ${currentSearchData.totalRecords}</div>` : ''}</div><table class="modal-table"><thead><tr>${headers.map((h, i) => sortableHeaders[i] ? `<th class="sortable-header" data-sort="${sortableHeaders[i]}">${h}</th>` : `<th${i === 8 ? ' class="bottle-actions-header"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`;

        activeBottles.forEach(b => {
            const nom = b.egaisNomenclatureInfo || 'Неизвестная номенклатура';
            const alko = extractAlkoCode(b.restsItem);
            tableHTML += `<tr data-bottle-id="${b.DT_RowId}" data-nomenclature="${nom}" data-alko-code="${alko}"><td>${nom}</td><td>${b.title || 'Н/Д'}</td><td class="volume-cell" data-bottle-id="${b.DT_RowId}"><span class="volume-loading">Загрузка...</span></td><td class="alko-code-cell">${alko || 'Н/Д'}</td><td class="mark-info-cell" data-bottle-id="${b.DT_RowId}"><span class="mark-loading">Загрузка...</span></td><td class="tz-status-cell" data-bottle-id="${b.DT_RowId}"><span class="tz-status-modal tz-status-loading">Проверка...</span></td><td>${b.egaisVolumeUpdateDate || 'Н/Д'}</td><td>${b.DT_RowId ? `<a class="modal-link" href="https://dxbx.ru/index#app/edit/egaisbottle/${b.DT_RowId}" target="_blank">Перейти к бутылке</a>` : 'Н/Д'}</td><td class="bottle-actions-cell"></td></tr>`;
        });

        tableHTML += '</tbody></table>';
        if (currentSearchData.totalRecords > currentSearchData.pageSize) {
            tableHTML += createPaginationControls(currentSearchData.totalRecords, currentSearchData.currentPage, currentSearchData.pageSize).outerHTML;
        }
        tableContainer.innerHTML = tableHTML;

        setupFilters();
        populateNomenclatureFilter(activeBottles);
        populateAlkoCodeFilter(activeBottles);
        await loadBottleDetails();
    }

    function populateNomenclatureFilter(bottles) {
        const select = document.getElementById('nomenclature-filter');
        const noms = [...new Set(bottles.map(b => b.egaisNomenclatureInfo || 'Неизвестная номенклатура'))].sort();
        select.innerHTML = '<option value="">Все номенклатуры</option>' + noms.map(n => `<option value="${n}">${n}</option>`).join('');
    }

    async function loadBottleDetails() {
        const volumeCells = document.querySelectorAll('.volume-cell');
        const markCells = document.querySelectorAll('.mark-info-cell');
        const tzCells = document.querySelectorAll('.tz-status-cell');
        const promises = [];

        volumeCells.forEach((cell, index) => {
            const bottleId = cell.getAttribute('data-bottle-id');
            if (!bottleId) return;

            promises.push(
                getBottleDetails(bottleId)
                    .then(details => {
                        const row = cell.closest('tr');
                        const volume = parseInt(details.volume) || 0;
                        row.setAttribute('data-volume', volume);
                        cell.innerHTML = `${volume} ${getVolumeBadge(volume)}`;

                        const markCell = markCells[index];
                        markCell.setAttribute('data-full-mark', details.markInfo);
                        row.setAttribute('data-mark', details.markInfo);
                        markCell.innerHTML = `<div class="mark-info-content">${details.markInfo}</div><div class="expand-toggle">Развернуть ▼</div><button class="copy-mark" title="Скопировать полную марку">Копировать</button><button class="generate-datamatrix" title="Сгенерировать DataMatrix">DataMatrix</button>`;

                        markCell.querySelector('.generate-datamatrix').addEventListener('click', e => { e.stopPropagation(); generateDataMatrix(details.markInfo); });
                        markCell.querySelector('.expand-toggle').addEventListener('click', function(e) {
                            e.stopPropagation();
                            this.closest('.mark-info-cell').classList.toggle('expanded');
                            this.textContent = this.closest('.mark-info-cell').classList.contains('expanded') ? 'Свернуть ▲' : 'Развернуть ▼';
                        });
                        markCell.querySelector('.copy-mark').addEventListener('click', function(e) {
                            e.stopPropagation();
                            navigator.clipboard.writeText(details.markInfo).then(() => { this.textContent = 'Скопировано!'; setTimeout(() => this.textContent = 'Копировать', 2000); }).catch(() => {});
                        });

                        return checkTZStatusForBottle(details.markInfo, currentSearchData.legalPersonId)
                            .then(inTZ => { row.setAttribute('data-tz-status', inTZ ? 'да' : 'нет'); tzCells[index].innerHTML = tzStatusHTML(inTZ); });
                    })
                    .catch(() => { cell.innerHTML = 'Ошибка'; markCells[index].innerHTML = 'Ошибка'; tzCells[index].innerHTML = '<span class="tz-status-modal tz-status-no">Ошибка</span>'; })
            );
        });

        for (let i = 0; i < promises.length; i += 3) {
            await Promise.all(promises.slice(i, i + 3));
            await new Promise(r => setTimeout(r, 100));
        }
        await checkAndUpdateTZButtons();
        applyFilters();
    }

    function addNomenclatureButtons() {
        if (!isTargetPage()) return;
        const table = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
        if (!table) return;
        const tbody = table.querySelector('.ant-table-tbody');
        if (!tbody) return;

        tbody.querySelectorAll('tr.ant-table-row.ant-table-row-level-0:not(.ant-table-expanded-row)').forEach(row => {
            if (row.getAttribute('data-egais-nom-processed') === '1' || row.closest('.restsstyled__ExpandedTableWrapper-sc-1oz76wz-5')) return;
            const cells = row.querySelectorAll('.ant-table-cell');
            if (cells.length < 3) return;
            const alkoCode = cells[1].textContent.trim();
            const nomCell = cells[2];
            const nom = nomCell.textContent.trim();
            if (!nom || nom.length <= 10 || /^\\d+$/.test(nom) || nomCell.querySelector('.nomenclature-button')) return;
            nomCell.querySelectorAll('.nomenclature-button').forEach(b => b.remove());

            const button = createButton({ text: 'Поиск бутылок', title: `Найти активные бутылки для: ${nom}`, variant: 'success', className: 'nomenclature-button' });
            button.addEventListener('click', async (e) => {
                e.stopPropagation(); e.preventDefault();
                const lpId = legalPersonId || GM_getValue('legalPersonId');
                if (!lpId) { alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.'); return; }
                openModal(nom, alkoCode);
                document.querySelector('.modal-content').innerHTML = '<div class="loading-spinner">Поиск активных бутылок...</div>';
                try { await displayResultsInModal(await searchBottlesByNomenclature(nom, lpId), nom, lpId, alkoCode); }
                catch (e) { document.querySelector('.modal-content').innerHTML = `<div class="error-message">Ошибка при поиске бутылок: ${e.message}<br><small>Попробуйте обновить страницу</small>${alkoCode ? `<br>Алкокод: ${alkoCode}` : ''}</div>`; }
            });
            nomCell.appendChild(button);
            row.setAttribute('data-egais-nom-processed', '1');
        });
    }

    function addManualSearchButton() {
        if (!isTargetPage()) return;
        const tableWrapper = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
        const form = document.querySelector('form.ant-form');
        if (!tableWrapper || !form || form.querySelector('.manual-search-container')) return;

        const searchContainer = createEl('div', 'manual-search-container');
        const searchInput = createEl('input', 'manual-search-input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Введите номенклатуру для поиска';
        const searchButton = createButton({ text: 'Поиск бутылок', variant: 'primary', className: 'manual-search-button' });
        searchButton.addEventListener('click', async () => {
            const nom = searchInput.value.trim();
            if (!nom) { alert('Пожалуйста, введите номенклатуру для поиска'); return; }
            const lpId = currentLegalPerson();
            if (!lpId) { alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.'); return; }
            openModal(nom);
            document.querySelector('.modal-content').innerHTML = '<div class="loading-spinner">Поиск активных бутылок...</div>';
            try { await displayResultsInModal(await searchBottlesByNomenclature(nom, lpId), nom, lpId); }
            catch (e) { document.querySelector('.modal-content').innerHTML = `<div class="error-message">Ошибка при поиске бутылок: ${e.message}<br><small>Попробуйте обновить страницу</small></div>`; }
        });
        searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') searchButton.click(); });
        searchContainer.append(searchInput, searchButton);
        form.insertBefore(searchContainer, form.querySelector('.ant-segmented')?.nextSibling || tableWrapper);
    }

    function ensureMappingsContainer() {
        const form = document.querySelector('form.ant-form');
        if (!form) return null;
        let container = form.querySelector('.egais-mappings-container');
        if (container) return container;

        container = createEl('div', 'egais-mappings-container');

        const header = createEl('div', 'egais-mappings-header');
        const title = createEl('div', 'egais-mappings-title', 'Сопоставление номенклатур ЕГАИС');
        const actions = createEl('div', 'egais-mappings-actions');

        const refreshBtn = createButton({ text: 'Обновить', variant: 'primary' });
        refreshBtn.addEventListener('click', async () => {
            const lpId = currentLegalPerson();
            if (!lpId) { alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.'); return; }
            await loadMappings(lpId, true);
        });

        actions.append(refreshBtn);
        header.append(title, actions);

        const controls = createEl('div', 'egais-mappings-header');
        const leftControls = createEl('div', 'egais-mappings-actions');
        const rightControls = createEl('div', 'egais-mappings-actions');

        const onlyUnmappedLabel = createEl('label', 'egais-mappings-toggle');
        const onlyUnmappedInput = createEl('input');
        onlyUnmappedInput.type = 'checkbox';
        onlyUnmappedInput.addEventListener('change', () => {
            mappingsState.onlyUnmapped = onlyUnmappedInput.checked;
            mappingsState.currentPage = 1;
            applyMappingsFilter();
        });
        const onlyUnmappedText = createEl('span', '', 'Только без сопоставлений');
        onlyUnmappedLabel.append(onlyUnmappedInput, onlyUnmappedText);

        leftControls.append(onlyUnmappedLabel);

        const tableSearch = createEl('input', 'egais-mappings-search');
        tableSearch.type = 'text';
        tableSearch.placeholder = 'Поиск по таблице';
        tableSearch.addEventListener('input', () => {
            mappingsState.tableQuery = tableSearch.value.trim();
            mappingsState.currentPage = 1;
            applyMappingsFilter();
        });
        rightControls.append(tableSearch);

        controls.append(leftControls, rightControls);

        const stats = createEl('div', 'egais-mappings-stats', '');
        const tableWrapper = createEl('div', 'egais-mappings-table-wrapper');
        tableWrapper.innerHTML = '<div class="loading-spinner">Загрузка сопоставлений...</div>';

        container.append(header, controls, stats, tableWrapper);

        const segmented = form.querySelector('.ant-segmented');
        const insertPoint = segmented?.nextSibling || form.querySelector('.manual-search-container')?.nextSibling || form;
        form.insertBefore(container, insertPoint);
        return container;
    }

    async function loadMappings(legalPersonId, force = false) {
        if (!legalPersonId) return;
        if (mappingsState.loading) return;
        if (mappingsState.loaded && mappingsState.lastLegalPersonId === legalPersonId && !force) {
            applyMappingsFilter();
            return;
        }

        mappingsState.loading = true;
        mappingsState.loaded = false;
        mappingsState.lastLegalPersonId = legalPersonId;

        const container = ensureMappingsContainer();
        const tableWrapper = container?.querySelector('.egais-mappings-table-wrapper');
        if (tableWrapper) tableWrapper.innerHTML = '<div class="loading-spinner">Загрузка сопоставлений...</div>';

        const payload = {
            legalPersonId: parseInt(legalPersonId, 10),
            page: { limit: 100000, offset: 0 },
            filter: { egaisNomenclature: '', view: 'ALL' }
        };

        try {
            const data = await postJSON(URLS.mappingsView, payload, { timeout: 30000 });
            mappingsState.items = Array.isArray(data.items) ? data.items : [];
            mappingsState.currentPage = 1;
            mappingsState.loaded = true;
            mappingsState.loading = false;
            applyMappingsFilter();
        } catch (e) {
            mappingsState.loading = false;
            if (tableWrapper) tableWrapper.innerHTML = `<div class="error-message">Ошибка загрузки сопоставлений: ${e.message}</div>`;
        }
    }

    const searchRestaurantNomenclature = async (query, legalPersonId) => {
        if (!query) return [];
        const url = `${URLS.nomenclatureSearch}?filter=${encodeURIComponent(query)}&legalPersonId=${encodeURIComponent(legalPersonId)}`;
        return getJSON(url, { timeout: 20000 });
    };

    const createMapping = async (legalPersonId, egaisNomenclatureId, nomenclatureId) =>
        postJSON(URLS.mappingsCreate, { legalPersonId, egaisNomenclatureId, nomenclatureId }, { timeout: 20000 });

    const deleteMapping = async (legalPersonId, egaisNomenclatureId) =>
        postJSON(URLS.mappingsDelete, { legalPersonId, egaisNomenclatureId }, { timeout: 20000 });

    function applyMappingsFilter() {
        const query = (mappingsState.tableQuery || '').toLowerCase();
        let list = mappingsState.items.slice();

        if (mappingsState.onlyUnmapped) {
            list = list.filter(item => !item.nomenclature?.id);
        }

        if (query) {
            list = list.filter(item => {
                const egaisName = item.egaisNomenclature?.name || '';
                const egaisCode = item.egaisNomenclature?.code || '';
                const restName = item.nomenclature?.name || '';
                return (
                    egaisName.toLowerCase().includes(query) ||
                    egaisCode.toLowerCase().includes(query) ||
                    restName.toLowerCase().includes(query)
                );
            });
        }

        mappingsState.filtered = list;
        const start = (mappingsState.currentPage - 1) * mappingsState.pageSize;
        const end = start + mappingsState.pageSize;
        mappingsState.paged = list.slice(start, end);
        renderMappingsTable();
    }

    function renderMappingsTable() {
        const container = ensureMappingsContainer();
        if (!container) return;
        const stats = container.querySelector('.egais-mappings-stats');
        const tableWrapper = container.querySelector('.egais-mappings-table-wrapper');

        const total = mappingsState.items.length;
        const shown = mappingsState.filtered.length;
        if (stats) stats.textContent = `${shown ? `${(mappingsState.currentPage - 1) * mappingsState.pageSize + 1}-${Math.min(mappingsState.currentPage * mappingsState.pageSize, shown)}` : '0'} из ${shown}`;

        if (!shown) {
            tableWrapper.innerHTML = '<div class="egais-mappings-empty">Ничего не найдено</div>';
            return;
        }

        const rows = mappingsState.paged.map((item, idx) => {
            const egais = item.egaisNomenclature || {};
            const rest = item.nomenclature || {};
            const egaisName = egais.name || 'Н/Д';
            const egaisCode = egais.code || 'Н/Д';
            const egaisCapacity = egais.capacity ? `${egais.capacity}` : 'Н/Д';
            const restName = rest.name || '';
            const restMeasure = rest.measure ? rest.measure : '';
            const hasRest = !!rest.id;
            const rowKey = `${egais.id || 'egais'}_${rest.id || 'none'}`;
            const rowClass = hasRest ? '' : 'egais-unmapped-row';

            return `<tr data-row-key="${rowKey}" class="ant-table-row ant-table-row-level-0 ${rowClass}" data-egais-id="${egais.id || ''}"><td class="ant-table-cell">${egaisCode}</td><td class="ant-table-cell">${egaisName}</td><td class="ant-table-cell">${egaisCapacity}</td><td class="ant-table-cell"><div class="ant-select dxbx-selectcomponent__DxBxSelect-sc-1j2coho-0 ibtUQh ant-select-single ant-select-allow-clear ant-select-show-arrow ant-select-show-search egais-mappings-select" data-egais-id="${egais.id || ''}" data-rest-id="${rest.id || ''}" data-rest-name="${restName}" data-rest-measure="${restMeasure}"><div class="ant-select-selector"><span class="ant-select-selection-search"><input type="search" autocomplete="off" class="ant-select-selection-search-input" placeholder="" value=""></span>${hasRest ? `<span class="ant-select-selection-item" title="${restName}${restMeasure ? `, ${restMeasure}` : ''}">${restName}${restMeasure ? `, ${restMeasure}` : ''}</span>` : `<span class="ant-select-selection-placeholder">Не выбрано</span>`}</div><span class="ant-select-arrow" aria-hidden="true"><span role="img" aria-label="search" class="anticon anticon-search ant-select-suffix">🔍</span></span><span class="ant-select-clear" aria-hidden="true" style="${hasRest ? '' : 'display:none;'}">✕</span></div></td></tr>`;
        }).join('');

        tableWrapper.innerHTML = `<div class="ant-table-wrapper"><div class="ant-spin-nested-loading"><div class="ant-spin-container"><div class="ant-table ant-table-scroll-horizontal"><div class="ant-table-container"><div class="ant-table-content" style="overflow: auto hidden;"><table style="width: 950px; min-width: 100%; table-layout: auto;"><colgroup><col style="width: 220px;"><col style="width: 600px;"><col style="width: 90px;"><col style="width: 500px;"></colgroup><thead class="ant-table-thead"><tr><th class="ant-table-cell">Алк. код</th><th class="ant-table-cell">Номенклатура ЕГАИС</th><th class="ant-table-cell">Объем</th><th class="ant-table-cell">Номенклатура ресторана</th></tr></thead><tbody class="ant-table-tbody">${rows}</tbody></table></div></div></div>${renderMappingsPagination()}</div></div></div>`;
        attachMappingsSelectHandlers();
        attachMappingsPaginationHandlers();
    }

    function renderMappingsPagination() {
        const total = mappingsState.filtered.length;
        const pageSize = mappingsState.pageSize;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const current = Math.min(mappingsState.currentPage, totalPages);

        const buildPageItem = (page, label = null, active = false) => `<li title="${page}" class="ant-pagination-item ant-pagination-item-${page}${active ? ' ant-pagination-item-active' : ''}" tabindex="0" data-page="${page}"><a rel="nofollow">${label || page}</a></li>`;

        const pages = [];
        const maxButtons = 5;
        let start = Math.max(1, current - 2);
        let end = Math.min(totalPages, start + maxButtons - 1);
        if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
        for (let i = start; i <= end; i++) pages.push(buildPageItem(i, null, i === current));

        return `<ul class="ant-pagination ant-pagination-mini ant-table-pagination ant-table-pagination-right"><li class="ant-pagination-total-text">${total ? `${(current - 1) * pageSize + 1}-${Math.min(current * pageSize, total)} из ${total}` : `0 из ${total}`}</li><li title="Назад" class="ant-pagination-prev ${current === 1 ? 'ant-pagination-disabled' : ''}" aria-disabled="${current === 1}"><button class="ant-pagination-item-link" type="button" tabindex="-1" ${current === 1 ? 'disabled' : ''} data-page="${current - 1}"><span role="img" aria-label="left" class="anticon anticon-left">‹</span></button></li>${pages.join('')}<li title="Вперед" class="ant-pagination-next ${current === totalPages ? 'ant-pagination-disabled' : ''}" aria-disabled="${current === totalPages}"><button class="ant-pagination-item-link" type="button" tabindex="-1" ${current === totalPages ? 'disabled' : ''} data-page="${current + 1}"><span role="img" aria-label="right" class="anticon anticon-right">›</span></button></li></ul>`;
    }

    function attachMappingsPaginationHandlers() {
        const container = document.querySelector('.egais-mappings-container');
        if (!container) return;
        container.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', () => {
                const page = parseInt(el.getAttribute('data-page'), 10);
                if (!page || page < 1) return;
                const totalPages = Math.max(1, Math.ceil(mappingsState.filtered.length / mappingsState.pageSize));
                if (page > totalPages) return;
                mappingsState.currentPage = page;
                applyMappingsFilter();
            });
        });
    }

    let mappingsDropdownState = { open: false, anchor: null, list: null, timer: null };

    function ensureMappingsDropdown() {
        let dropdown = document.querySelector('.egais-mappings-dropdown');
        if (dropdown) return dropdown;
        dropdown = createEl('div', 'egais-mappings-dropdown');
        dropdown.style.display = 'none';
        document.body.appendChild(dropdown);
        return dropdown;
    }

    function openMappingsDropdown(anchor, items, onSelect, loading = false) {
        const dropdown = ensureMappingsDropdown();
        mappingsDropdownState.anchor = anchor;
        mappingsDropdownState.open = true;
        const rect = anchor.getBoundingClientRect();
        dropdown.style.left = `${rect.left + window.scrollX}px`;
        dropdown.style.top = `${rect.bottom + window.scrollY + 2}px`;
        dropdown.style.minWidth = `${Math.max(rect.width, 300)}px`;
        dropdown.style.maxWidth = '500px';
        
        if (loading) {
            dropdown.innerHTML = '<div class="ant-select-item ant-select-item-option" style="color:#999;cursor:default;"><span class="egais-mappings-spinner"></span>Поиск...</div>';
        } else {
            dropdown.innerHTML = items.length ? `<div class="rc-virtual-list-holder-inner" style="display:flex;flex-direction:column;">` +
                items.map((n, i) => {
                    const displayName = n.name + (n.measure ? `, ${n.measure}` : '');
                    return `<div aria-selected="false" class="ant-select-item ant-select-item-option${i === 0 ? ' ant-select-item-option-active' : ''}" title="${displayName}" data-nom-id="${n.id}" data-nom-name="${n.name}" data-nom-measure="${n.measure || ''}"><div class="ant-select-item-option-content">${displayName}</div><span class="ant-select-item-option-state" style="user-select:none;" unselectable="on" aria-hidden="true"></span></div>`;
                }).join('') + '</div>' : '<div class="ant-select-item ant-select-item-option" style="color:#999;cursor:default;">Ничего не найдено</div>';

            dropdown.querySelectorAll('.ant-select-item-option[data-nom-id]').forEach(node => {
                node.addEventListener('mousedown', (e) => {
                    e.preventDefault(); // Prevent blur on input
                });
                node.addEventListener('mouseenter', () => {
                    dropdown.querySelectorAll('.ant-select-item-option-active').forEach(el => el.classList.remove('ant-select-item-option-active'));
                    node.classList.add('ant-select-item-option-active');
                });
                node.addEventListener('click', () => {
                    const nomId = parseInt(node.getAttribute('data-nom-id'), 10);
                    if (!nomId) return;
                    const selected = {
                        id: nomId,
                        name: node.getAttribute('data-nom-name'),
                        measure: node.getAttribute('data-nom-measure')
                    };
                    updateSelectUI(anchor, selected);
                    onSelect(selected);
                    closeMappingsDropdown();
                    hideMappingsHint(anchor);
                });
            });
        }
        dropdown.style.display = 'block';
    }

    function updateSelectUI(select, nomenclature) {
        const input = select.querySelector('.ant-select-selection-search-input');
        let selItem = select.querySelector('.ant-select-selection-item');
        const placeholder = select.querySelector('.ant-select-selection-placeholder');
        const clear = select.querySelector('.ant-select-clear');
        
        if (input) {
            input.value = '';
            input.blur(); // Remove focus to hide cursor
        }
        
        if (nomenclature) {
            const displayText = nomenclature.name + (nomenclature.measure ? `, ${nomenclature.measure}` : '');
            if (placeholder) placeholder.style.display = 'none';
            if (!selItem) {
                selItem = createEl('span', 'ant-select-selection-item');
                const selector = select.querySelector('.ant-select-selector');
                selector?.appendChild(selItem);
            }
            selItem.textContent = displayText;
            selItem.title = displayText;
            selItem.style.display = '';
            if (clear) clear.style.display = '';
            select.setAttribute('data-rest-name', nomenclature.name);
            select.setAttribute('data-rest-measure', nomenclature.measure || '');
            select.setAttribute('data-rest-id', nomenclature.id);
            const row = select.closest('tr');
            if (row) row.classList.remove('egais-unmapped-row');
        } else {
            if (placeholder) placeholder.style.display = '';
            if (selItem) selItem.remove();
            if (clear) clear.style.display = 'none';
            select.setAttribute('data-rest-name', '');
            select.setAttribute('data-rest-measure', '');
            select.setAttribute('data-rest-id', '');
            const row = select.closest('tr');
            if (row) row.classList.add('egais-unmapped-row');
        }
        
        select.classList.remove('ant-select-focused', 'ant-select-open');
    }

    function showMappingsHint(select, charsRemaining) {
        let hint = document.querySelector('.egais-mappings-hint-global');
        if (!hint) {
            hint = createEl('div', 'egais-mappings-hint-global');
            document.body.appendChild(hint);
        }
        const rect = select.getBoundingClientRect();
        hint.textContent = `Введите ещё символов: ${charsRemaining}`;
        hint.style.left = `${rect.left + window.scrollX}px`;
        hint.style.top = `${rect.bottom + window.scrollY + 4}px`;
        hint.style.display = 'block';
        hint.dataset.selectId = select.getAttribute('data-egais-id');
    }

    function hideMappingsHint(select) {
        const hint = document.querySelector('.egais-mappings-hint-global');
        if (hint) hint.style.display = 'none';
    }

    function closeMappingsDropdown() {
        const dropdown = document.querySelector('.egais-mappings-dropdown');
        if (dropdown) dropdown.style.display = 'none';
        mappingsDropdownState.open = false;
        mappingsDropdownState.anchor = null;
    }

    function attachMappingsSelectHandlers() {
        document.querySelectorAll('.egais-mappings-select').forEach(select => {
            const input = select.querySelector('.ant-select-selection-search-input');
            const clear = select.querySelector('.ant-select-clear');
            const egaisId = parseInt(select.getAttribute('data-egais-id'), 10);

            if (!select.dataset.egaisMappingsClick) {
                select.dataset.egaisMappingsClick = '1';
                select.style.cursor = 'text';
                select.addEventListener('click', (e) => {
                    if (e.target.closest('.ant-select-clear')) return;
                    if (input) {
                        input.focus();
                        const selItem = select.querySelector('.ant-select-selection-item');
                        if (selItem) selItem.style.display = 'none';
                        select.classList.add('ant-select-focused', 'ant-select-open');
                    }
                });
            }

            if (input && !input.dataset.egaisMappings) {
                input.dataset.egaisMappings = '1';
                input.addEventListener('click', (e) => e.stopPropagation());
                
                input.addEventListener('focus', () => {
                    const selItem = select.querySelector('.ant-select-selection-item');
                    const placeholder = select.querySelector('.ant-select-selection-placeholder');
                    if (selItem) selItem.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'none';
                    select.classList.add('ant-select-focused', 'ant-select-open');
                    showMappingsHint(select, 3);
                });
                
                input.addEventListener('blur', () => {
                    setTimeout(() => {
                        if (!mappingsDropdownState.open || mappingsDropdownState.anchor !== select) {
                            const selItem = select.querySelector('.ant-select-selection-item');
                            const placeholder = select.querySelector('.ant-select-selection-placeholder');
                            if (selItem && selItem.textContent) {
                                selItem.style.display = '';
                            } else if (placeholder) {
                                placeholder.style.display = '';
                            }
                            select.classList.remove('ant-select-focused', 'ant-select-open');
                            input.value = '';
                            closeMappingsDropdown();
                            hideMappingsHint(select);
                        }
                    }, 200);
                });
                
                input.addEventListener('input', () => {
                    const query = input.value.trim();
                    if (query.length >= 3) {
                        hideMappingsHint(select);
                        handleMappingsSearch(select, query);
                    } else {
                        closeMappingsDropdown();
                        showMappingsHint(select, 3 - query.length);
                    }
                });
            }

            if (clear && !clear.dataset.egaisMappings) {
                clear.dataset.egaisMappings = '1';
                clear.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const lpId = currentLegalPerson();
                    if (!lpId || !egaisId) return;
                    try {
                        await deleteMapping(parseInt(lpId, 10), egaisId);
                        updateMappingItem(egaisId, null);
                    } catch (err) {
                        alert('Ошибка удаления: ' + err.message);
                    }
                });
            }
        });

        if (!document.body.dataset.mappingsDropdownListener) {
            document.body.dataset.mappingsDropdownListener = '1';
            document.addEventListener('click', (e) => {
                if (!mappingsDropdownState.open) return;
                const dropdown = document.querySelector('.egais-mappings-dropdown');
                if (dropdown && (dropdown.contains(e.target) || mappingsDropdownState.anchor?.contains(e.target))) return;
                closeMappingsDropdown();
            });
        }
    }

    async function handleMappingsSearch(select, query) {
        const lpId = currentLegalPerson();
        const egaisId = parseInt(select.getAttribute('data-egais-id'), 10);
        if (!lpId || !egaisId) return;
        if (!query || query.length < 1) { closeMappingsDropdown(); return; }

        openMappingsDropdown(select, [], () => {}, true);

        clearTimeout(mappingsDropdownState.timer);
        mappingsDropdownState.timer = setTimeout(async () => {
            try {
                const results = await searchRestaurantNomenclature(query, lpId);
                openMappingsDropdown(select, Array.isArray(results) ? results : [], async (selected) => {
                    try {
                        await createMapping(parseInt(lpId, 10), egaisId, selected.id);
                        updateMappingItem(egaisId, { id: selected.id, name: selected.name, measure: selected.measure });
                    } catch (e) {
                        alert('Ошибка создания сопоставления: ' + e.message);
                    }
                });
            } catch (e) {
                openMappingsDropdown(select, [], () => {});
            }
        }, 300);
    }

    function updateMappingItem(egaisNomenclatureId, newNomenclature, skipRerender = false) {
        mappingsState.items = mappingsState.items.map(item => {
            if (item.egaisNomenclature?.id === egaisNomenclatureId) {
                return { ...item, nomenclature: newNomenclature };
            }
            return item;
        });
        if (!skipRerender) {
            applyMappingsFilter();
        }
    }

    function openMappingsEditModal(item) {
        const lpId = currentLegalPerson();
        if (!lpId) { alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.'); return; }

        const overlay = createEl('div', 'modal-overlay active');
        const modal = createEl('div', 'egais-modal egais-mappings-modal active');
        const header = createEl('div', 'modal-header');
        const titleContainer = createEl('div', 'modal-title-container');
        titleContainer.append(
            createEl('h3', 'modal-title', 'Сопоставление номенклатуры'),
            createEl('div', 'modal-subtitle', item.egaisNomenclature?.name || 'Номенклатура ЕГАИС')
        );
        const closeButton = createEl('button', 'modal-close');
        closeButton.innerHTML = '&times;';
        const closeAll = () => { modal.remove(); overlay.remove(); };
        closeButton.addEventListener('click', closeAll);
        overlay.addEventListener('click', closeAll);
        header.append(titleContainer, closeButton);

        const content = createEl('div', 'modal-content');
        const input = createEl('input', 'egais-mappings-modal-search');
        input.type = 'text';
        input.placeholder = 'Начните вводить номенклатуру ресторана...';

        const results = createEl('div', 'egais-mappings-results');
        results.innerHTML = '<div class="egais-mappings-empty">Введите запрос для поиска</div>';

        let searchTimer = null;
        input.addEventListener('input', () => {
            const query = input.value.trim();
            clearTimeout(searchTimer);
            searchTimer = setTimeout(async () => {
                if (!query) {
                    results.innerHTML = '<div class="egais-mappings-empty">Введите запрос для поиска</div>';
                    return;
                }
                results.innerHTML = '<div class="loading-spinner">Поиск...</div>';
                try {
                    const data = await searchRestaurantNomenclature(query, lpId);
                    if (!Array.isArray(data) || data.length === 0) {
                        results.innerHTML = '<div class="egais-mappings-empty">Ничего не найдено</div>';
                        return;
                    }
                    results.innerHTML = data.map(n => `
                        <div class="egais-mappings-result-item" data-nom-id="${n.id}" data-nom-name="${n.name}" data-nom-measure="${n.measure || ''}">
                            <div class="egais-mappings-result-name">${n.name}</div>
                            <div class="egais-mappings-result-measure">${n.measure || ''}</div>
                        </div>
                    `).join('');

                    results.querySelectorAll('.egais-mappings-result-item').forEach(node => {
                        node.addEventListener('click', async () => {
                            const nomId = parseInt(node.getAttribute('data-nom-id'), 10);
                            if (!nomId) return;
                            try {
                                await createMapping(parseInt(lpId, 10), item.egaisNomenclature?.id, nomId);
                                updateMappingItem(item.egaisNomenclature?.id, { id: nomId, name: node.getAttribute('data-nom-name'), measure: node.getAttribute('data-nom-measure') });
                                closeAll();
                            } catch (e) {
                                alert('Ошибка создания сопоставления: ' + e.message);
                            }
                        });
                    });
                } catch (e) {
                    results.innerHTML = `<div class="error-message">Ошибка поиска: ${e.message}</div>`;
                }
            }, 350);
        });

        content.append(input, results);
        modal.append(header, content);
        document.body.append(overlay, modal);
        input.focus();
    }

    function setMappingsActive(active) {
        const container = ensureMappingsContainer();
        const form = document.querySelector('form.ant-form');
        const tableWrapper = form?.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
        const manualSearch = form?.querySelector('.manual-search-container');
        const ordersButtons = form?.querySelector('.orders-buttons-container');
        const pagination = form?.querySelector('ul.ant-pagination.ant-table-pagination');

        const hideElement = (el) => {
            if (!el) return;
            el.style.visibility = 'hidden';
            el.style.position = 'absolute';
            el.style.pointerEvents = 'none';
            el.style.height = '0';
            el.style.overflow = 'hidden';
        };
        const showElement = (el) => {
            if (!el) return;
            el.style.visibility = '';
            el.style.position = '';
            el.style.pointerEvents = '';
            el.style.height = '';
            el.style.overflow = '';
        };

        if (container) container.style.display = active ? 'block' : 'none';
        if (active) {
            hideElement(tableWrapper);
            hideElement(manualSearch);
            hideElement(ordersButtons);
            hideElement(pagination);
        } else {
            showElement(tableWrapper);
            showElement(manualSearch);
            showElement(ordersButtons);
            showElement(pagination);
        }

        if (active) {
            const lpId = currentLegalPerson();
            if (lpId) loadMappings(lpId);
        }
    }

    function addMappingsTab() {
        if (!isTargetPage()) return;
        const form = document.querySelector('form.ant-form');
        const segmentedGroup = form?.querySelector('.ant-segmented-group');
        if (!segmentedGroup) return;
        if (segmentedGroup.querySelector('[data-egais-mappings-tab]')) return;

        const existingItems = segmentedGroup.querySelectorAll('.ant-segmented-item:not([data-egais-mappings-tab])');
        if (existingItems.length === 0) return; // Don't add if no other tabs

        const existingInput = segmentedGroup.querySelector('input.ant-segmented-item-input');
        const inputName = existingInput?.name || `egais-segmented-${Date.now()}`;

        const label = createEl('label', 'ant-segmented-item');
        label.setAttribute('data-egais-mappings-tab', '1');
        const input = createEl('input', 'ant-segmented-item-input');
        input.type = 'radio';
        input.name = inputName;
        input.value = 'mappings';
        const text = createEl('div', 'ant-segmented-item-label', 'Сопоставления');
        text.title = 'Сопоставления';
        label.append(input, text);

        segmentedGroup.appendChild(label);

        label.addEventListener('click', (e) => {
            segmentedGroup.querySelectorAll('.ant-segmented-item').forEach(i => {
                i.classList.remove('ant-segmented-item-selected');
            });
            label.classList.add('ant-segmented-item-selected');
            input.checked = true;
            setMappingsActive(true);
        });

        segmentedGroup.querySelectorAll('.ant-segmented-item:not([data-egais-mappings-tab])').forEach(item => {
            if (item.dataset.egaisMappingsListener) return;
            item.dataset.egaisMappingsListener = '1';
            item.addEventListener('click', () => {
                label.classList.remove('ant-segmented-item-selected');
                input.checked = false;
                setMappingsActive(false);
            });
        });
    }

  async function addEgaisButtons() {
    if (!isTargetPage()) return;
    const markElements = document.querySelectorAll('.strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1.gOhuPU');
    for (const el of markElements) {
        if (el.offsetParent === null || el.getAttribute('data-egais-mark-processed') === '1') continue;
        if (el.parentNode.querySelector('.egais-buttons-container')) { el.setAttribute('data-egais-mark-processed', '1'); continue; }
        const markCode = el.textContent.trim();
        const row = el.closest('tr.ant-table-row');
        const calculatedVolume = parseCalculatedVolume(row);
        const container = createEl('div', 'egais-buttons-container egais-mark-actions');
        const shortEl = createEl('span', 'short-mark-code', 'Загрузка...');
        const tzEl = createEl('span', 'tz-status tz-status-badge tz-loading', 'Проверка...');
        const tzBtns = createInlineTZButtons(markCode, calculatedVolume);
        container.append(createEgaisButton(markCode), createDataMatrixButton(markCode), createInvoiceSearchButton(markCode), tzBtns, shortEl, tzEl);
        el.parentNode.insertBefore(container, el.nextSibling);
        await Promise.all([loadShortMarkCode(markCode, shortEl), checkTZStatus(markCode, tzEl)]);
        el.setAttribute('data-egais-mark-processed', '1');
    }
    document.querySelectorAll('.ant-table-cell .strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1')
        .forEach(c => c.parentNode.querySelectorAll('.nomenclature-button').forEach(b => b.remove()));
}

    function parseCalculatedVolume(row) {
        if (!row) return null;
        try {
            const cells = row.querySelectorAll('td.ant-table-cell');
            if (cells.length >= 5) {
                const volumeText = cells[4]?.textContent?.trim();
                const volume = parseInt(volumeText);
                if (!isNaN(volume) && volume > 0) return volume;
            }
            const rowText = row.textContent;
            const volumeMatch = rowText.match(/(\d+)\s*мл/) || rowText.match(/\b(\d{2,4})\b/);
            if (volumeMatch) {
                const volume = parseInt(volumeMatch[1]);
                if (!isNaN(volume) && volume > 0) return volume;
            }
        } catch (e) { }
        return null;
    }

    function createInlineTZButtons(markCode, calculatedVolume) {
        const btn = createButton({
            text: '+ТЗ',
            variant: 'accent',
            className: 'tz-inline-btn',
            title: 'Добавить в товарный зал',
            onClick: async (e) => {
                e.stopPropagation();
                await handleTZButtonClick(btn, markCode, calculatedVolume);
            }
        });
        btn.style.cssText = 'padding: 2px 8px; font-size: 10px; min-width: 32px;';
        btn.dataset.markCode = markCode;
        btn.dataset.volume = calculatedVolume || '';
        return btn;
    }

    function updateTZButtonState(btn, isInTZ) {
        if (!btn) return;
        btn.textContent = isInTZ ? '-ТЗ' : '+ТЗ';
        btn.title = isInTZ ? 'Удалить из товарного зала' : 'Добавить в товарный зал';
        btn.classList.remove('egais-btn--accent', 'egais-btn--danger');
        btn.classList.add(isInTZ ? 'egais-btn--danger' : 'egais-btn--accent');
    }

    async function handleTZButtonClick(btn, markCode, calculatedVolume) {
        if (!AuthState.auth) { notify('Сначала авторизуйтесь (🔐)', 'error'); return; }
        if (!AuthState.token) { notify('Нет токена для текущего ЮЛ. Добавьте доступ (➕)', 'error'); return; }
        
        const container = btn.closest('.egais-buttons-container') || btn.parentElement;
        const tzStatusEl = container?.querySelector('.tz-status');
        const isInTZ = tzStatusEl?.classList.contains('tz-yes') || false;
        
        if (isInTZ) {
            await doRemoveFromTZ(btn, markCode, tzStatusEl);
        } else {
            await doAddToTZ(btn, markCode, calculatedVolume, tzStatusEl);
        }
    }

    async function doAddToTZ(btn, markCode, calculatedVolume, tzStatusEl) {
        const volume = calculatedVolume || 500;
        
        btn.disabled = true;
        const origText = btn.textContent;
        btn.textContent = '...';
        try {
            await BartenderAPI.addBottle(markCode, parseInt(volume));
            btn.textContent = '✓';
            btn.style.background = '#52c41a';
            notify(`Добавлено в ТЗ (${volume} мл)`, 'success');
            
            if (tzStatusEl) {
                updateTZStatus(tzStatusEl, true);
            }
            const lpId = legalPersonId || GM_getValue('legalPersonId');
            if (lpId) {
                bottleCache[`${lpId}_${markCode}`] = true;
                GM_setValue('bottleCache', bottleCache);
            }
            
            setTimeout(() => { 
                updateTZButtonState(btn, true);
                btn.disabled = false; 
                btn.style.background = ''; 
            }, 1500);
        } catch (e) {
            btn.textContent = '!';
            btn.style.background = '#f5222d';
            notify('Ошибка: ' + e.message, 'error');
            setTimeout(() => { btn.textContent = origText; btn.disabled = false; btn.style.background = ''; }, 2000);
        }
    }

    async function doRemoveFromTZ(btn, markCode, tzStatusEl) {
        btn.disabled = true;
        const origText = btn.textContent;
        btn.textContent = '...';
        try {
            await BartenderAPI.removeBottle(markCode);
            btn.textContent = '✓';
            btn.style.background = '#52c41a';
            notify('Удалено из ТЗ', 'success');
            
            if (tzStatusEl) {
                updateTZStatus(tzStatusEl, false);
            }
            const lpId = legalPersonId || GM_getValue('legalPersonId');
            if (lpId) {
                bottleCache[`${lpId}_${markCode}`] = false;
                GM_setValue('bottleCache', bottleCache);
            }
            
            setTimeout(() => { 
                updateTZButtonState(btn, false);
                btn.disabled = false; 
                btn.style.background = ''; 
            }, 1500);
        } catch (e) {
            btn.textContent = '!';
            btn.style.background = '#f5222d';
            notify('Ошибка: ' + e.message, 'error');
            setTimeout(() => { btn.textContent = origText; btn.disabled = false; btn.style.background = ''; }, 2000);
        }
    }

    function createEgaisButton(markCode) {
        const btn = createButton({ text: 'ЕГАИС', variant: 'primary', className: 'egais-link-button',
            onClick: async (e) => { e.stopPropagation(); const id = currentLegalPerson() || await findLegalPersonId(); id ? openBottlePage(markCode, id) : alert('Не удалось определить legalPersonId.'); }
        });
        btn.dataset.markCode = markCode;
        return btn;
    }

    function createDataMatrixButton(markCode) {
        const btn = createButton({ text: 'DataMatrix', variant: 'success', className: 'datamatrix-button egais-ml-8', onClick: (e) => { e.stopPropagation(); generateDataMatrix(markCode); } });
        btn.dataset.markCode = markCode;
        return btn;
    }

    function createInvoiceSearchButton(markCode) {
        const btn = createButton({
            text: 'Накладная',
            variant: 'warning',
            className: 'invoice-search-button egais-ml-8',
            title: 'Найти исходную накладную по марке',
            onClick: (e) => { e.stopPropagation(); searchInvoiceByMark(markCode); }
        });
        btn.dataset.markCode = markCode;
        return btn;
    }

    async function searchInvoiceByMark(markCode) {
        if (!AuthState.auth || !AuthState.token) {
            notify('Для поиска накладной необходима авторизация бармена', 'error');
            return;
        }

        document.getElementById('invoice-search-modal')?.remove();
        const modal = createEl('div', 'egais-modal invoice-result-modal active');
        modal.id = 'invoice-search-modal';
        const overlay = createEl('div', 'modal-overlay active');
        const closeAll = () => { modal.remove(); overlay.remove(); };
        overlay.addEventListener('click', closeAll);

        modal.innerHTML = '<div class="invoice-modal-body"><div class="loading-spinner">Получение информации о бутылке...</div></div>';
        document.body.append(overlay, modal);

        try {
            const bottleInfo = await BartenderAPI.getBottleInfo(markCode);
            
            if (!bottleInfo.invoice) {
                modal.innerHTML = `<div class="invoice-modal-body"><div class="error-message" style="text-align: center; padding: 40px;"><div style="font-size: 48px; margin-bottom: 16px;">❌</div><div style="font-size: 16px; font-weight: 600; color: #333;">Накладная не найдена</div><div style="font-size: 13px; color: #666; margin-top: 8px;">Для данной марки не найдена информация о накладной</div></div></div><div class="invoice-modal-footer"><button class="invoice-btn-secondary" onclick="this.closest('.egais-modal').remove(); document.querySelector('.modal-overlay')?.remove();">Закрыть</button></div>`;
                return;
            }

            const ttnNumber = bottleInfo.invoice.ttnNumber;
            const invoiceDate = bottleInfo.invoice.date;
            const bottle = bottleInfo.bottle;
            const supplier = bottleInfo.invoice.supplier;
            const statusHistory = bottleInfo.invoice.statusHistory || [];

            modal.innerHTML = '<div class="invoice-modal-body"><div class="loading-spinner">Поиск накладной ' + ttnNumber + '...</div></div>';

            const searchResult = await BartenderAPI.searchInvoice(ttnNumber, invoiceDate);

            const invoice = searchResult.data?.[0];
            const invoiceId = invoice?.DT_RowId;
            const invoiceUrl = invoiceId ? `https://dxbx.ru/index#app/edit/invoice/${invoiceId}` : null;

            const shortMark = bottle?.shortMarkCode || markCode.substring(5, 16);
            const alcoCode = bottle?.nomenclature?.alcoCode || '';
            
            const recentStatuses = statusHistory.slice(-5).reverse();

            modal.innerHTML = `<div class="invoice-modal-header"><div class="invoice-product-row"><div class="invoice-product-icon">🍷</div><div class="invoice-product-info"><div class="invoice-product-name">${bottle?.nomenclature?.name || 'Неизвестный продукт'}</div><div class="invoice-ttn-row"><span class="invoice-ttn-text">${ttnNumber}</span><span class="invoice-ttn-text">От ${invoiceDate}</span>${bottle?.active ? '<span class="invoice-egais-badge">На балансе ЕГАИС</span>' : ''}</div></div></div></div><div class="invoice-modal-body"><div class="invoice-cards-row"><div class="invoice-card"><div class="invoice-card-label">Алкокод:<button class="invoice-card-copy" onclick="navigator.clipboard.writeText('${alcoCode}'); this.textContent='✓'; setTimeout(()=>this.textContent='📋', 1500);">📋</button></div><div class="invoice-card-value">${alcoCode ? alcoCode.substring(0, 7) + '...' + alcoCode.slice(-8) : 'Н/Д'}</div></div><div class="invoice-card"><div class="invoice-card-label">Серия/номер:<button class="invoice-card-copy" onclick="navigator.clipboard.writeText('${shortMark}'); this.textContent='✓'; setTimeout(()=>this.textContent='📋', 1500);">📋</button></div><div class="invoice-card-value">${shortMark}</div></div></div><div class="invoice-mark-card"><div class="invoice-card-label">Марка:<button class="invoice-card-copy" onclick="navigator.clipboard.writeText('${markCode}'); this.textContent='✓'; setTimeout(()=>this.textContent='📋', 1500);">📋</button></div><div class="invoice-card-value" style="font-size: 11px;">${markCode.substring(0, 20)}...${markCode.slice(-20)}</div></div><div class="invoice-section-title">Общая информация</div><div class="invoice-info-list"><div class="invoice-info-item"><div class="invoice-info-icon">👤</div><div class="invoice-info-content"><div class="invoice-info-title">Текущий владелец</div><div class="invoice-info-value">${bottle?.actualOwner?.name || 'Н/Д'}</div>${bottle?.actualOwner?.inn ? `<div class="invoice-info-subtitle">ИНН: ${bottle.actualOwner.inn}  КПП: ${bottle.actualOwner.kpp || 'Н/Д'}</div>` : ''}</div></div><div class="invoice-info-item"><div class="invoice-info-icon">🚚</div><div class="invoice-info-content"><div class="invoice-info-title">Поставщик</div><div class="invoice-info-value">${supplier?.name || invoice?.supplier || 'Н/Д'}</div>${supplier?.inn ? `<div class="invoice-info-subtitle">ИНН: ${supplier.inn}  КПП: ${supplier.kpp || 'Н/Д'}</div>` : ''}</div></div><div class="invoice-info-item"><div class="invoice-info-icon">📅</div><div class="invoice-info-content"><div class="invoice-info-title">Дата розлива</div><div class="invoice-info-value">${bottle?.bottlingDate || 'Н/Д'}</div></div></div><div class="invoice-info-item"><div class="invoice-info-icon">🧪</div><div class="invoice-info-content"><div class="invoice-info-title">Объем</div><div class="invoice-info-value">${bottle?.nomenclature?.amount ? bottle.nomenclature.amount + ' л' : 'Н/Д'}</div></div></div><div class="invoice-info-item"><div class="invoice-info-icon">🔥</div><div class="invoice-info-content"><div class="invoice-info-title">Крепость</div><div class="invoice-info-value">${bottle?.nomenclature?.volume ? bottle.nomenclature.volume + ' %' : 'Н/Д'}</div></div></div></div>${recentStatuses.length > 0 ? `<div class="invoice-history-section"><div class="invoice-section-title">История операций ЕГАИС</div><div class="invoice-history-item" ${invoiceUrl ? `style="cursor: pointer;" onclick="window.open('${invoiceUrl}', '_blank')"` : ''}><div class="invoice-history-icon">📄</div><div class="invoice-history-content"><div class="invoice-history-title">Накладная<span class="invoice-history-ttn">${ttnNumber}</span>${invoiceUrl ? '<span class="invoice-history-arrow">›</span>' : ''}</div><div class="invoice-status-timeline">${recentStatuses.map(s => `<div class="invoice-status-item"><span class="invoice-status-label">${formatEgaisStatus(s.egaisStatus)}</span><div class="invoice-status-date">${s.date}</div></div>`).join('')}</div></div></div></div>` : ''}${!invoiceId ? `<div style="background: #fff7e6; border: 1px solid #ffd591; border-radius: 8px; padding: 12px; margin-top: 16px; text-align: center;"><div style="font-size: 13px; color: #d46b08;">⚠️ Накладная найдена в ЕГАИС, но не найдена в системе DXBX</div><div style="font-size: 11px; color: #999; margin-top: 4px;">Возможно, накладная принадлежит другому ЮЛ</div></div>` : ''}</div><div class="invoice-modal-footer">${invoiceUrl ? `<button class="invoice-btn-primary" onclick="window.open('${invoiceUrl}', '_blank')">📂 Открыть накладную</button>` : ''}<button class="invoice-btn-secondary" onclick="this.closest('.egais-modal').remove(); document.querySelector('.modal-overlay')?.remove();">Закрыть</button></div>`;

        } catch (error) {
            modal.innerHTML = `<div class="invoice-modal-body"><div class="error-message" style="text-align: center; padding: 40px;"><div style="font-size: 48px; margin-bottom: 16px;">❌</div><div style="font-size: 16px; font-weight: 600; color: #333;">Ошибка поиска</div><div style="font-size: 13px; color: #666; margin-top: 8px;">${error.message}</div></div></div><div class="invoice-modal-footer"><button class="invoice-btn-secondary" onclick="this.closest('.egais-modal').remove(); document.querySelector('.modal-overlay')?.remove();">Закрыть</button></div>`;
        }
    }

    function formatEgaisStatus(status) {
        const statusMap = {
            'RECEIVED_FROM_EGAIS': 'Получена из ЕГАИС',
            'ACCEPTANCE_ACT_SENT': 'Акт приёмки отправлен',
            'ACCEPTANCE_ACT_SENDING_IN_PROCESS': 'Акт приёмки в процессе отправки',
            'ACCEPTED_IN_EGAIS': 'Принята в ЕГАИС'
        };
        return statusMap[status] || status;
    }

    function generateDataMatrix(markCode) {
        document.getElementById('datamatrix-modal')?.remove();

        const modal = createEl('div', 'egais-modal datamatrix-modal active');
        modal.id = 'datamatrix-modal';
        const title = createEl('h3', 'modal-title', 'DataMatrix ECC200');
        const dmContainer = createEl('div', 'egais-flex-row egais-center');
        dmContainer.id = 'datamatrix-container';
        const codeText = createEl('div', 'datamatrix-code', markCode);
        const buttonsContainer = createEl('div', 'egais-flex-row datamatrix-actions');

        const copyButton = createButton({ text: 'Копировать изображение', variant: 'primary' });
        const overlay = createEl('div', 'modal-overlay active');
        const closeAll = () => { modal.remove(); overlay.remove(); };

        const closeButton = createButton({ text: 'Закрыть', variant: 'danger', onClick: closeAll });
        overlay.addEventListener('click', closeAll);

        buttonsContainer.append(copyButton, closeButton);
        modal.append(title, dmContainer, codeText, buttonsContainer);
        document.body.append(overlay, modal);

        try {
            const canvas = createEl('canvas');
            canvas.id = 'datamatrix-canvas';
            dmContainer.appendChild(canvas);
            bwipjs.toCanvas(canvas, { bcid: 'datamatrix', text: markCode, scale: 3, height: 30, includetext: false });

            copyButton.addEventListener('click', async () => {
                try {
                    const original = document.getElementById('datamatrix-canvas');
                    const bordered = document.createElement('canvas');
                    const ctx = bordered.getContext('2d');
                    bordered.width = original.width + 50;
                    bordered.height = original.height + 50;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, bordered.width, bordered.height);
                    ctx.drawImage(original, 25, 25);

                    bordered.toBlob(async blob => {
                        try {
                            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                            copyButton.textContent = 'Скопировано!';
                            copyButton.classList.replace('egais-btn--primary', 'egais-btn--success');
                            setTimeout(() => { copyButton.textContent = 'Копировать изображение'; copyButton.classList.replace('egais-btn--success', 'egais-btn--primary'); }, 2000);
                        } catch { fallbackCopyImage(bordered); }
                    }, 'image/png');
                } catch (error) {
                    copyButton.textContent = 'Ошибка!';
                    copyButton.classList.replace('egais-btn--primary', 'egais-btn--danger');
                    setTimeout(() => { copyButton.textContent = 'Копировать изображение'; copyButton.classList.replace('egais-btn--danger', 'egais-btn--primary'); }, 2000);
                }
            });
        } catch (error) {
            dmContainer.innerHTML = '<div class="text-error">Ошибка генерации кода: ' + error.message + '</div>';
            copyButton.disabled = true;
            copyButton.textContent = 'Ошибка генерации';
            copyButton.className = 'egais-btn egais-btn--muted';
        }
    }

function fallbackCopyImage(canvas) {
    try {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed;left:-9999px';
        div.appendChild(img);
        document.body.appendChild(div);
        const range = document.createRange();
        range.selectNode(img);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const ok = document.execCommand('copy');
        sel.removeAllRanges();
        document.body.removeChild(div);
        if (!ok) throw new Error('execCommand failed');
        return true;
    } catch {
        const link = document.createElement('a');
        link.download = 'datamatrix.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        alert('Изображение сохранено как файл.');
        return false;
    }
}

    async function loadShortMarkCode(markCode, el) {
        const lpId = currentLegalPerson();
        if (!lpId) { el.textContent = 'Нет legalPersonId'; el.classList.add('text-error'); return; }
        try {
            const code = await searchBottleByMark(markCode, lpId);
            el.textContent = code || 'Не найден';
            el.classList.remove('text-error', 'text-danger', 'text-success');
            el.classList.add(code ? 'text-success' : 'text-danger');
        } catch { el.textContent = 'Ошибка'; el.classList.remove('text-success', 'text-danger'); el.classList.add('text-error'); }
    }

    const searchBottleByMark = (markCode, lpId) => bottleSearch({ criterion: bottleCriterion(lpId, 'markInfo', markCode), length: 200 }).then(d => d.data?.[0]?.shortMarkCode || null).catch(() => null);

    const openBottlePage = (markCode, lpId) => bottleSearch({ criterion: bottleCriterion(lpId, 'markInfo', markCode), length: 1 }).then(d => { if (d.data?.[0]?.DT_RowId) window.open(`https://dxbx.ru/index#app/edit/egaisbottle/${d.data[0].DT_RowId}`, '_blank'); }).catch(() => {});

   async function checkTZStatus(markCode, el) {
        const lpId = legalPersonId || GM_getValue('legalPersonId');
        if (!lpId) { el.textContent = 'Нет legalPersonId'; el.classList.remove('tz-loading', 'tz-yes'); el.classList.add('tz-status-badge', 'tz-no'); return; }
        const key = `${lpId}_${markCode}`;
        if (bottleCache[key] !== undefined) { updateTZStatus(el, bottleCache[key]); return; }
        try {
            const inTZ = await searchInTZ(markCode, lpId);
            bottleCache[key] = inTZ; GM_setValue('bottleCache', bottleCache); updateTZStatus(el, inTZ);
        } catch { el.textContent = 'Ошибка проверки'; el.classList.remove('tz-loading', 'tz-yes'); el.classList.add('tz-status-badge', 'tz-no'); }
    }

    function searchInTZ(markCode, legalPersonId) {
        const col = (data, orderable = false) => ({ data, name: '', searchable: true, orderable, search: { value: '', regex: false } });
        return postJSON(URLS.barBottleSearch, {
            draw: 1, start: 0, length: 200, model: 'egaisbarbottle', searchFormName: 'egaisbarbottle.default',
            columns: [col('createDate', true), col('egaisBottle', true), col('availableVolume'), col('bottleCapacity'), col('egaisNomenclatureInfo'), col('markInfo')],
            order: [{ column: 0, dir: 'asc' }], search: { value: '', regex: false },
            simpleCrit: { crits: [{ attr: 'legalPerson', value: legalPersonId, oper: 'EQUALS', clauses: [{ oper: 'AND', criterion: { attr: 'egaisBottle.markInfo', value: markCode, oper: 'EQUALS', clauses: [] } }] }] }
        }, { headers: csrfHeaders() }).then(data => data.data?.length > 0);
    }

    function updateTZStatus(element, inTZ) {
        element.textContent = inTZ ? 'В ТЗ ✓' : 'Нет в ТЗ ✗';
        element.classList.remove('tz-loading', inTZ ? 'tz-no' : 'tz-yes');
        element.classList.add('tz-status-badge', inTZ ? 'tz-yes' : 'tz-no');
        
        const container = element.closest('.egais-buttons-container');
        const tzBtn = container?.querySelector('.tz-inline-btn');
        if (tzBtn) {
            updateTZButtonState(tzBtn, inTZ);
        }
    }

    async function findLegalPersonId() {
        const urlMatch = window.location.href.match(/legalpersons\/(\d+)/);
        if (urlMatch?.[1]) return urlMatch[1];
        if (GM_getValue('legalPersonId')) return GM_getValue('legalPersonId');
        for (const s of document.querySelectorAll('script')) { const m = s.textContent.match(/legalpersons\/(\d+)/); if (m?.[1]) return m[1]; }
        return null;
    }

    function handleExpandButtons() {
        document.querySelectorAll('.ant-table-row-expand-icon:not([data-egais-listener])').forEach(button => {
            button.setAttribute('data-egais-listener', 'true');
            button.addEventListener('click', () => setTimeout(addEgaisButtons, 500));
        });
    }

   function observeDOM() {
        const targetNode = document.querySelector('.restsstyled__Wrapper-sc-1oz76wz-0') || document.body;
        if (!targetNode) { setTimeout(observeDOM, 1000); return; }

        const observer = new MutationObserver((mutations) => {
            const shouldUpdate = mutations.some(m =>
                m.type === 'childList' && [...m.addedNodes].some(node =>
                    node.nodeType === 1 && node.querySelector?.(
                        '.ant-table-row.ant-table-row-level-0, .strong-tablestyled__MarkItemWrapper, .ant-table-tbody'
                    ) || node.classList?.contains('ant-table-wrapper')
                )
            );

            if (shouldUpdate) {
                clearTimeout(window.egaisUpdateTimeout);
                window.egaisUpdateTimeout = setTimeout(() => {
                    initializationInProgress = false;
                    initializeButtons();
                }, 500);
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
        setTimeout(initializeButtons, 2000);
    }

    function initializeButtons() {
        if (initializationInProgress || Date.now() - lastInitTime < INIT_COOLDOWN_MS) return;
        initializationInProgress = true;
        lastInitTime = Date.now();
        try { handleExpandButtons(); addEgaisButtons(); addNomenclatureButtons(); addManualSearchButton(); addCheckOrdersButton(); addMappingsTab(); }
        finally { initializationInProgress = false; }
    }

    const isTargetPage = () => window.location.href.includes('https://dxbx.ru/fe/egais/rests');
    const isInvoicePage = () => {
        const href = window.location.href;
        const hash = window.location.hash;
        const isMatch = href.includes('/app/edit/invoice/') || hash.includes('app/edit/invoice/');
        return isMatch;
    };
    
    const isBottlePage = () => {
        const href = window.location.href;
        const hash = window.location.hash;
        const isMatch = (href.includes('/app/edit/egaisbottle/') || hash.includes('app/edit/egaisbottle/')) &&
                        !href.includes('egaisbottlerestreserve');
        return isMatch;
    };
    
    function initBottlePageDataMatrix() {
        const tryCreate = (attempts = 0) => {
            let markInput = document.getElementById('id_markInfo');
            if (!markInput) {
                markInput = document.querySelector('input[name="markInfo"]') ||
                            document.querySelector('textarea[name="markInfo"]') ||
                            document.querySelector('[id*="markInfo"]');
            }
            
            if (!markInput) {
                const labels = document.querySelectorAll('label, .ant-form-item-label, .form-label');
                for (const label of labels) {
                    if (label.textContent.includes('Марка') || label.textContent.includes('markInfo')) {
                        const parent = label.closest('.ant-form-item, .form-group, .ant-row');
                        if (parent) {
                            markInput = parent.querySelector('input, textarea, .ant-input, span[class*="value"], div[class*="value"]');
                            if (markInput) break;
                        }
                    }
                }
            }
            
            if (markInput) {
                const markCode = markInput.value || markInput.textContent?.trim();
                
                if (markCode && markCode.length > 10) {
                    createBottleDataMatrixUI(markCode, markInput);
                } else if (attempts < 20) {
                    setTimeout(() => tryCreate(attempts + 1), 500);
                }
            } else if (attempts < 20) {
                setTimeout(() => tryCreate(attempts + 1), 500);
            }
        };
        
        setTimeout(() => tryCreate(), 1000);
    }
    
    function createBottleDataMatrixUI(markCode, markInput) {
        if (document.querySelector('.bottle-datamatrix-container')) {
            return;
        }
        
        const pageLegalPersonId = getBottleLegalPersonId();
        if (pageLegalPersonId) {
            legalPersonId = pageLegalPersonId;
            GM_setValue('legalPersonId', legalPersonId);
        }
        
        AuthState.init();
        AuthUI.init();
        AuthUI.check();
        
        GM_registerMenuCommand('🔐 Авторизация DXBX', () => AuthUI.showDialog());
        GM_registerMenuCommand('🔄 Реавторизация', () => AuthUI.reauth());
        
        const container = createEl('div', 'bottle-datamatrix-container');
        container.id = 'bottle-datamatrix-ui';
        
        const header = createEl('div', 'bottle-datamatrix-header');
        const title = createEl('h4', 'bottle-datamatrix-title', '📦 DataMatrix марки');
        header.appendChild(title);
        
        const content = createEl('div', 'bottle-datamatrix-content');
        
        const canvasWrapper = createEl('div', 'bottle-datamatrix-canvas-wrapper');
        const canvas = createEl('canvas');
        canvas.id = 'bottle-datamatrix-canvas';
        canvasWrapper.appendChild(canvas);
        content.appendChild(canvasWrapper);
        
        const actions = createEl('div', 'bottle-datamatrix-actions');
        
        const copyImageBtn = createButton({
            text: '📋 Копировать',
            variant: 'primary',
            onClick: () => copyBottleDataMatrixImage(canvas, copyImageBtn)
        });
        
        const downloadBtn = createButton({
            text: '💾 Скачать',
            variant: 'success',
            onClick: () => downloadBottleDataMatrix(canvas, markCode)
        });
        
        const copyMarkBtn = createButton({
            text: '📝 Марка',
            variant: 'muted',
            onClick: () => {
                navigator.clipboard.writeText(markCode).then(() => {
                    copyMarkBtn.textContent = '✓';
                    setTimeout(() => { copyMarkBtn.textContent = '📝 Марка'; }, 1500);
                });
            }
        });
        
        actions.append(copyImageBtn, downloadBtn, copyMarkBtn);
        content.appendChild(actions);
        
        const tzRow = createEl('div', 'bottle-datamatrix-actions');
        
        const tzStatusEl = createEl('span', 'bottle-tz-status tz-loading', '⏳ Проверка ТЗ...');
        tzStatusEl.style.cursor = 'pointer';
        tzStatusEl.title = 'Нажмите для авторизации';
        tzStatusEl.addEventListener('click', () => {
            if (!AuthState.getToken()) {
                AuthUI.showDialog();
            }
        });
        
        const tzBtn = createButton({
            text: '+ТЗ',
            variant: 'accent',
            onClick: async () => handleBottlePageTZClick(tzBtn, tzStatusEl, markCode)
        });
        tzBtn.dataset.markCode = markCode;
        tzBtn.style.minWidth = '50px';
        
        const invoiceBtn = createButton({
            text: '📄 Накладная',
            variant: 'warning',
            className: 'invoice-search-button',
            title: 'Найти исходную накладную по марке',
            onClick: () => searchInvoiceByMark(markCode)
        });
        
        tzRow.append(tzStatusEl, tzBtn, invoiceBtn);
        content.appendChild(tzRow);
        
        const markDetails = createEl('details');
        markDetails.style.cssText = 'width:100%;margin-top:8px;text-align:left';
        const markSummary = createEl('summary');
        markSummary.style.cssText = 'cursor:pointer;font-size:11px;color:#666';
        markSummary.textContent = 'Показать полную марку';
        const markValue = createEl('div', 'bottle-datamatrix-mark', markCode);
        markDetails.append(markSummary, markValue);
        content.appendChild(markDetails);
        
        container.append(header, content);
        
        const formItem = markInput.closest('.ant-form-item, .form-group, .ant-row, .ant-card');
        const insertTarget = formItem || markInput.parentNode;
        
        if (insertTarget && insertTarget.parentNode) {
            insertTarget.parentNode.insertBefore(container, insertTarget.nextSibling);
        } else {
            const mainContent = document.querySelector('.ant-card-body, .main-content, form, .ant-form');
            if (mainContent) {
                mainContent.insertBefore(container, mainContent.firstChild);
            }
        }
        
        try {
            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: markCode,
                scale: 3,
                height: 30,
                includetext: false
            });
        } catch (error) {
            canvasWrapper.innerHTML = '<div class="text-error">Ошибка генерации: ' + error.message + '</div>';
        }
        
        checkBottlePageTZStatus(markCode, tzStatusEl, tzBtn);
    }
    
    async function checkBottlePageTZStatus(markCode, statusEl, tzBtn) {
        try {
            const lpId = legalPersonId || currentLegalPerson() || GM_getValue('legalPersonId');
            const token = AuthState.getToken();
            
            if (!token) {
                statusEl.textContent = '🔐 Авторизация';
                statusEl.className = 'bottle-tz-status tz-no';
                statusEl.style.cursor = 'pointer';
                statusEl.title = 'Нажмите для авторизации';
                tzBtn.disabled = true;
                tzBtn.title = 'Требуется авторизация';
                tzBtn.classList.add('egais-btn--muted');
                tzBtn.classList.remove('egais-btn--accent', 'egais-btn--danger');
                return;
            }
            
            if (!lpId) {
                statusEl.textContent = '⚠️ Нет ЮЛ';
                statusEl.className = 'bottle-tz-status tz-no';
                statusEl.style.cursor = 'pointer';
                statusEl.title = 'Нажмите для авторизации';
                tzBtn.disabled = true;
                tzBtn.title = 'Не определено юридическое лицо';
                tzBtn.classList.add('egais-btn--muted');
                tzBtn.classList.remove('egais-btn--accent', 'egais-btn--danger');
                return;
            }
            
            statusEl.style.cursor = 'default';
            statusEl.title = '';
            tzBtn.disabled = false;
            tzBtn.classList.remove('egais-btn--muted');
            
            const inTZ = await checkIfBottleInTZ(markCode, lpId);
            
            if (inTZ) {
                statusEl.textContent = '✓ В ТЗ';
                statusEl.className = 'bottle-tz-status tz-yes';
                tzBtn.textContent = '-ТЗ';
                tzBtn.title = 'Удалить из товарного зала';
                tzBtn.classList.remove('egais-btn--accent');
                tzBtn.classList.add('egais-btn--danger');
                tzBtn.dataset.inTZ = 'true';
            } else {
                statusEl.textContent = '✗ Не в ТЗ';
                statusEl.className = 'bottle-tz-status tz-no';
                tzBtn.textContent = '+ТЗ';
                tzBtn.title = 'Добавить в товарный зал';
                tzBtn.classList.remove('egais-btn--danger');
                tzBtn.classList.add('egais-btn--accent');
                tzBtn.dataset.inTZ = 'false';
            }
        } catch (error) {
            statusEl.textContent = '⚠️ Ошибка';
            statusEl.className = 'bottle-tz-status tz-no';
            tzBtn.disabled = false;
            tzBtn.classList.remove('egais-btn--muted');
            tzBtn.classList.add('egais-btn--accent');
            tzBtn.textContent = '+ТЗ';
            tzBtn.dataset.inTZ = 'false';
        }
    }
    
    async function checkIfBottleInTZ(markCode, lpId) {
        const cacheKey = `${lpId}_${markCode}`;
        if (bottleCache[cacheKey] !== undefined) {
            return bottleCache[cacheKey];
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch('https://dxbx.ru/app/egaisbarbottle/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                signal: controller.signal,
                body: new URLSearchParams({
                    draw: 1, start: 0, length: 1,
                    model: 'egaisbarbottle',
                    searchFormName: 'egaisbarbottle.default',
                    simpleCrit: JSON.stringify({
                        crits: [{
                            attr: 'legalPerson', value: lpId, oper: 'EQUALS',
                            clauses: [{ oper: 'AND', criterion: { attr: 'egaisBottle.markInfo', value: markCode, oper: 'EQUALS', clauses: [] } }]
                        }]
                    })
                })
            });
            
            clearTimeout(timeoutId);
            
            const data = await response.json();
            const isInTZ = data.recordsTotal > 0;
            bottleCache[cacheKey] = isInTZ;
            return isInTZ;
        } catch (error) {
            return false;
        }
    }
    
    async function handleBottlePageTZClick(btn, statusEl, markCode) {
        const isInTZ = btn.dataset.inTZ === 'true';
        const origText = btn.textContent;
        
        const token = AuthState.getToken();
        if (!token) {
            notify('Требуется авторизация', 'error');
            AuthUI.showDialog();
            return;
        }
        
        btn.disabled = true;
        btn.textContent = '...';
        
        try {
            if (isInTZ) {
                await BartenderAPI.removeBottle(markCode);
                notify('Бутылка удалена из ТЗ', 'success');
                
                updateBottleTZUI(statusEl, btn, false);
            } else {
                const volume = getBottleVolumeFromPage();
                if (!volume) {
                    notify('Не удалось определить объём бутылки', 'error');
                    btn.disabled = false;
                    btn.textContent = origText;
                    return;
                }
                await BartenderAPI.addBottle(markCode, volume);
                notify(`Бутылка добавлена в ТЗ (${volume} мл)`, 'success');
                
                updateBottleTZUI(statusEl, btn, true);
            }
            
            const lpId = legalPersonId || currentLegalPerson() || GM_getValue('legalPersonId');
            const cacheKey = `${lpId}_${markCode}`;
            bottleCache[cacheKey] = !isInTZ; // Сразу обновляем кэш на ожидаемое значение
            
        } catch (error) {
            notify('Ошибка: ' + error.message, 'error');
            btn.textContent = '!';
            btn.style.background = '#f5222d';
            setTimeout(() => {
                btn.textContent = origText;
                btn.style.background = '';
            }, 2000);
        } finally {
            btn.disabled = false;
        }
    }
    
    function updateBottleTZUI(statusEl, tzBtn, inTZ) {
        if (inTZ) {
            statusEl.textContent = '✓ В ТЗ';
            statusEl.className = 'bottle-tz-status tz-yes';
            tzBtn.textContent = '-ТЗ';
            tzBtn.title = 'Удалить из товарного зала';
            tzBtn.classList.remove('egais-btn--accent');
            tzBtn.classList.add('egais-btn--danger');
            tzBtn.dataset.inTZ = 'true';
        } else {
            statusEl.textContent = '✗ Не в ТЗ';
            statusEl.className = 'bottle-tz-status tz-no';
            tzBtn.textContent = '+ТЗ';
            tzBtn.title = 'Добавить в товарный зал';
            tzBtn.classList.remove('egais-btn--danger');
            tzBtn.classList.add('egais-btn--accent');
            tzBtn.dataset.inTZ = 'false';
        }
    }
    
    function getBottleLegalPersonId() {
        let lpInput = document.getElementById('id_legalPerson');
        if (lpInput && lpInput.value) {
            return lpInput.value;
        }
        
        lpInput = document.querySelector('input[name="legalPerson.id"]');
        if (lpInput && lpInput.value) {
            return lpInput.value;
        }
        
        lpInput = document.querySelector('input[name="legalPerson"]');
        if (lpInput && lpInput.value) {
            return lpInput.value;
        }
        
        lpInput = document.querySelector('input[id*="legalPerson"]');
        if (lpInput && lpInput.value) {
            return lpInput.value;
        }
        
        const pageText = document.body.innerText;
        const lpMatch = pageText.match(/Юр\.?\s*лицо[:\s]+[^(]+\((\d+)\s*\//i);
        if (lpMatch) {
            return lpMatch[1];
        }
        
        return null;
    }
    
    function getBottleVolumeFromPage() {
        let volumeInput = document.getElementById('id_availableVolume');
        if (volumeInput && volumeInput.value) {
            const vol = parseInt(volumeInput.value);
            if (!isNaN(vol) && vol > 0) {
                return vol;
            }
        }
        
        volumeInput = document.querySelector('input[name="availableVolume"]');
        if (volumeInput && volumeInput.value) {
            const vol = parseInt(volumeInput.value);
            if (!isNaN(vol) && vol > 0) {
                return vol;
            }
        }
        
        const labels = document.querySelectorAll('label, .ant-form-item-label, td');
        for (const label of labels) {
            if (label.textContent.includes('Доступный объ') || label.textContent.includes('availableVolume')) {
                const parent = label.closest('tr, .ant-form-item, .ant-row, .form-group');
                if (parent) {
                    const valueEl = parent.querySelector('input, td:last-child, span, .ant-form-item-control');
                    if (valueEl) {
                        const text = valueEl.value || valueEl.textContent;
                        const vol = parseInt(text);
                        if (!isNaN(vol) && vol > 0) {
                            return vol;
                        }
                    }
                }
            }
        }
        
        const pageText = document.body.innerText;
        const volumeMatch = pageText.match(/объем:\s*(\d+[.,]?\d*)/i);
        if (volumeMatch) {
            const vol = Math.round(parseFloat(volumeMatch[1].replace(',', '.')) * 1000);
            if (!isNaN(vol) && vol > 0) {
                return vol;
            }
        }
        
        return null;
    }
    
    async function copyBottleDataMatrixImage(canvas, button) {
        try {
            const bordered = document.createElement('canvas');
            const ctx = bordered.getContext('2d');
            bordered.width = canvas.width + 50;
            bordered.height = canvas.height + 50;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, bordered.width, bordered.height);
            ctx.drawImage(canvas, 25, 25);
            
            bordered.toBlob(async blob => {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                    button.textContent = '✓ Скопировано!';
                    button.classList.replace('egais-btn--primary', 'egais-btn--success');
                    setTimeout(() => {
                        button.textContent = '📋 Копировать изображение';
                        button.classList.replace('egais-btn--success', 'egais-btn--primary');
                    }, 2000);
                } catch {
                    fallbackCopyImage(bordered);
                    button.textContent = '✓ Скопировано!';
                    setTimeout(() => { button.textContent = '📋 Копировать изображение'; }, 2000);
                }
            }, 'image/png');
        } catch (error) {
            button.textContent = '✗ Ошибка';
            setTimeout(() => { button.textContent = '📋 Копировать изображение'; }, 2000);
        }
    }
    
    function downloadBottleDataMatrix(canvas, markCode) {
        const bordered = document.createElement('canvas');
        const ctx = bordered.getContext('2d');
        bordered.width = canvas.width + 50;
        bordered.height = canvas.height + 50;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, bordered.width, bordered.height);
        ctx.drawImage(canvas, 25, 25);
        
        const link = document.createElement('a');
        link.download = `datamatrix_${markCode.substring(0, 20)}.png`;
        link.href = bordered.toDataURL('image/png');
        link.click();
    };

    const InvoiceTZInterface = {
        create() {
            const invoiceData = this.parseInvoiceData();
            if (!invoiceData) {
                return;
            }
            
            legalPersonId = invoiceData.buyerLegalPersonId;
            GM_setValue('legalPersonId', legalPersonId);
            AuthState.token = AuthState.getToken();
            AuthUI.update();
            
            if (document.querySelector('.invoice-tz-container')) return;
            
            const container = createEl('div', 'invoice-tz-container');
            container.style.cssText = 'margin: 15px 0; padding: 15px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;';
            
            const header = createEl('div', 'invoice-tz-header');
            header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;';
            
            const title = createEl('h3', 'invoice-tz-title', 'Добавление бутылок из накладной в ТЗ');
            title.style.cssText = 'margin: 0; font-size: 14px; color: #1890ff;';
            
            const buttonsContainer = createEl('div', 'invoice-buttons');
            buttonsContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
            
            const addAllBtn = createButton({
                text: `Добавить все (${invoiceData.bottles.length} шт.)`,
                variant: 'accent',
                className: 'invoice-add-all-button',
                onClick: () => this.handleAddAll(invoiceData.bottles, bottleList)
            });
            addAllBtn.disabled = !AuthState.token;
            
            const downloadZipBtn = createButton({
                text: '📦 Скачать марки в ZIP',
                variant: 'success',
                className: 'invoice-download-zip-button',
                onClick: () => this.downloadMarksAsZip(invoiceData.bottles)
            });
            
            buttonsContainer.append(addAllBtn, downloadZipBtn);
            header.append(title, buttonsContainer);
            container.appendChild(header);
            
            const accessContainer = this.createAccessControl();
            container.appendChild(accessContainer);
            
            const bottleList = this.createBottleList(invoiceData.bottles);
            container.appendChild(bottleList);
            
            const textarea = document.getElementById('id_invoiceRawBody');
            if (textarea?.parentNode) textarea.parentNode.insertBefore(container, textarea.nextSibling);
            else document.body.appendChild(container);
        },
        
        parseInvoiceData() {
            try {
                const buyerInput = document.getElementById('id_buyerLegalPerson');
                if (!buyerInput?.value) {
                    return null;
                }
                
                const textarea = document.getElementById('id_invoiceRawBody');
                if (!textarea?.value) {
                    return null;
                }
                
                const data = JSON.parse(textarea.value);
                if (!data?.items) {
                    return null;
                }
                
                const bottles = [];
                data.items.forEach(item => {
                    const nomenclature = item.productInfo?.fullName || item.identity || 'Неизвестно';
                    item.bottleList?.forEach(bottle => {
                        if (bottle.mark) bottles.push({
                            mark: bottle.mark,
                            volume: item.productInfo ? Math.round(item.productInfo.capacity * 1000) : 750,
                            nomenclature: nomenclature
                        });
                    });
                });
                
                return { buyerLegalPersonId: buyerInput.value, bottles };
            } catch (e) { return null; }
        },
        
        createAccessControl() {
            const container = createEl('div', 'invoice-access-container');
            container.style.cssText = 'margin-bottom: 10px;';
            
            if (!AuthState.auth) {
                const authBtn = createButton({ text: '🔐 Авторизоваться', variant: 'primary', onClick: () => AuthUI.showDialog() });
                container.appendChild(authBtn);
            } else if (!AuthState.token) {
                const status = createEl('div', 'access-status', 'Нет доступа к текущему ЮЛ');
                status.style.cssText = 'font-size: 12px; color: #f5222d; margin-bottom: 5px;';
                const addBtn = createButton({
                    text: '➕ Добавить доступ к ЮЛ',
                    variant: 'warning',
                    onClick: async () => {
                        addBtn.disabled = true;
                        addBtn.textContent = 'Добавление...';
                        try {
                            await AccessManager.addLegalPerson(AuthState.auth.user.id, legalPersonId);
                            notify('Доступ добавлен!', 'success');
                            document.querySelector('.invoice-tz-container')?.remove();
                            this.create();
                        } catch (e) {
                            notify('Ошибка: ' + e.message, 'error');
                            addBtn.disabled = false;
                            addBtn.textContent = '➕ Добавить доступ к ЮЛ';
                        }
                    }
                });
                container.append(status, addBtn);
            } else {
                const status = createEl('div', 'access-status', `✓ Токен для ЮЛ ${legalPersonId} активен`);
                status.style.cssText = 'font-size: 12px; color: #52c41a;';
                container.appendChild(status);
            }
            return container;
        },
        
        createBottleList(bottles) {
            const list = createEl('div', 'invoice-bottle-list');

            const header = createEl('div', 'invoice-bottle-row invoice-bottle-header');
            header.append(
                createEl('span', 'invoice-col-num', '№'),
                createEl('span', 'invoice-col-nomen', 'Номенклатура'),
                createEl('span', 'invoice-col-mark', 'Марка'),
                createEl('span', 'invoice-col-volume', 'Объем'),
                createEl('span', 'invoice-col-status', 'Статус'),
                createEl('span', 'invoice-col-actions', 'ТЗ')
            );
            list.appendChild(header);

            bottles.forEach((bottle, idx) => {
                const item = createEl('div', 'invoice-bottle-row invoice-bottle-item');
                item.dataset.mark = bottle.mark;
                item.dataset.index = idx;

                const numSpan = createEl('span', 'invoice-bottle-num invoice-col-num', `${idx + 1}.`);
                const nomenSpan = createEl('span', 'invoice-col-nomen', bottle.nomenclature || 'Неизвестно');
                const markSpan = createEl('span', 'invoice-bottle-mark invoice-col-mark', bottle.mark);
                markSpan.title = 'Нажмите чтобы скопировать';
                markSpan.onclick = () => {
                    navigator.clipboard.writeText(bottle.mark);
                    notify('Марка скопирована', 'success');
                };

                const volumeSpan = createEl('span', 'invoice-bottle-volume invoice-col-volume', `${bottle.volume} мл`);
                const statusSpan = createEl('span', 'invoice-bottle-status invoice-col-status', 'Ожидание');

                const actionsSpan = createEl('span', 'invoice-col-actions');
                const addBtn = createButton({ text: '+ТЗ', variant: 'accent', onClick: () => this.handleSingle(addBtn, statusSpan, bottle) });
                addBtn.classList.add('invoice-add-btn');
                addBtn.disabled = !AuthState.token;
                actionsSpan.appendChild(addBtn);

                item.append(numSpan, nomenSpan, markSpan, volumeSpan, statusSpan, actionsSpan);
                list.appendChild(item);
            });
            return list;
        },
        
        async handleAddAll(bottles, listEl) {
            if (!AuthState.token) { notify('Нет токена', 'error'); return; }
            let success = 0, failed = 0;
            
            for (const bottle of bottles) {
                const item = listEl.querySelector(`[data-mark="${bottle.mark}"]`);
                const status = item?.querySelector('.invoice-bottle-status');
                const btn = item?.querySelector('button');
                
                if (status) { status.textContent = 'Добавление...'; status.style.color = '#1890ff'; }
                if (btn) btn.disabled = true;
                
                try {
                    await BartenderAPI.addBottle(bottle.mark, bottle.volume);
                    if (status) { status.textContent = '✓ Успешно'; status.style.color = '#52c41a'; }
                    success++;
                } catch (e) {
                    if (status) { status.textContent = '✗ Ошибка'; status.style.color = '#f5222d'; }
                    failed++;
                }
                await new Promise(r => setTimeout(r, 100));
            }
            notify(`Добавлено: ${success}, ошибок: ${failed}`, success > 0 ? 'success' : 'error');
        },
        
        async handleSingle(btn, statusEl, bottle) {
            if (!AuthState.token) { notify('Нет токена', 'error'); return; }
            btn.disabled = true;
            statusEl.textContent = 'Добавление...';
            statusEl.style.color = '#1890ff';
            
            try {
                if (!bottle.mark || bottle.mark.length < 50) {
                    throw new Error(`Марка слишком короткая: ${bottle.mark?.length} символов`);
                }
                
                await BartenderAPI.addBottle(bottle.mark, bottle.volume);
                statusEl.textContent = '✓ Успешно';
                statusEl.style.color = '#52c41a';
                btn.textContent = '✓';
            } catch (e) {
                statusEl.textContent = '✗ ' + (e.message || 'Ошибка');
                statusEl.style.color = '#f5222d';
                btn.textContent = '!';
                notify('Ошибка: ' + e.message, 'error');
                setTimeout(() => { btn.textContent = '+ТЗ'; btn.disabled = false; statusEl.textContent = 'Ожидание'; statusEl.style.color = '#999'; }, 3000);
            }
        },
        
        async downloadMarksAsZip(bottles) {
            if (!bottles || bottles.length === 0) {
                notify('Нет марок для скачивания', 'error');
                return;
            }

            notify(`Генерация ${bottles.length} DataMatrix...`, 'info');

                const loadJSZip = () => new Promise((resolve, reject) => {
                    const existing = window.JSZip || (typeof unsafeWindow !== 'undefined' && unsafeWindow.JSZip) || (typeof JSZip !== 'undefined' && JSZip);
                    if (existing) return resolve(existing);
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                    script.onload = () => {
                        const found = window.JSZip || (typeof unsafeWindow !== 'undefined' && unsafeWindow.JSZip) || (typeof JSZip !== 'undefined' && JSZip);
                        if (found) return resolve(found);
                        try {
                            const bridge = document.createElement('script');
                            bridge.textContent = 'try{window.__JSZip_for_userscript = window.JSZip || this.JSZip;}catch(e){}';
                            document.documentElement.appendChild(bridge);
                            bridge.remove();
                            const bridged = window.__JSZip_for_userscript || (typeof unsafeWindow !== 'undefined' && unsafeWindow.__JSZip_for_userscript);
                            if (bridged) return resolve(bridged);
                        } catch (e) {  }
                        return reject(new Error('JSZip not available after load'));
                    };
                    script.onerror = () => reject(new Error('Не удалось загрузить JSZip'));
                    document.head.appendChild(script);
                });

            const base64ToUint8 = (base64) => {
                const bin = atob(base64);
                const len = bin.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
                return bytes;
            };

            try {
                if (typeof bwipjs === 'undefined') {
                    throw new Error('bwipjs не загружен');
                }

                const JSZipCtor = await loadJSZip();

                const entries = [];
                let successCount = 0;
                const errors = [];
                const canvasSize = 320;
                const bwipScale = 5;
                
                for (let i = 0; i < bottles.length; i++) {
                    const bottle = bottles[i];
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = canvas.height = canvasSize;
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvasSize, canvasSize);

                        bwipjs.toCanvas(canvas, {
                            bcid: 'datamatrix',
                            text: bottle.mark,
                            scale: bwipScale,
                            height: 60,
                            width: 60,
                            includetext: false
                        });

                        const dataUrl = canvas.toDataURL('image/png');
                        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

                        const safeNomenclature = (bottle.nomenclature || 'Неизвестно')
                            .replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/gi, '')
                            .replace(/\s+/g, '_')
                            .substring(0, 50);
                        const shortMark = typeof extractShortCode === 'function' ? extractShortCode(bottle.mark) : null;
                        const safeMark = (shortMark || bottle.mark || '').toString().replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
                        const fileName = `${String(i + 1).padStart(3, '0')}_${safeNomenclature}_${bottle.volume}ml_${safeMark}.png`;

                        entries.push({ name: `datamatrix/${fileName}`, data: base64ToUint8(base64Data) });
                        successCount++;

                        if (i % 5 === 4) await new Promise(r => setTimeout(r, 0));

                    } catch (e) {
                        errors.push(`${i + 1}: ${e.message}`);
                    }
                }

                if (successCount === 0) {
                    throw new Error('Не удалось сгенерировать ни одного изображения: ' + errors.join(', '));
                }

                const marksList = bottles.map((b, i) => `${i + 1}. ${b.nomenclature || 'Неизвестно'} | ${b.volume} мл | ${b.mark}`).join('\n');
                entries.push({ name: 'datamatrix/marks_list.txt', data: typeof marksList === 'string' ? new TextEncoder().encode(marksList) : marksList });

                notify('Создание ZIP архива...', 'info');

                const createStoreZip = (entries) => {
                    const crc32Table = new Uint32Array(256);
                    for (let i = 0; i < 256; i++) {
                        let c = i;
                        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
                        crc32Table[i] = c;
                    }
                    const crc32 = (data) => {
                        let crc = 0xffffffff;
                        for (const byte of data) crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
                        return (crc ^ 0xffffffff) >>> 0;
                    };
                    
                    const files = [];
                    let offset = 0;
                    
                    for (const entry of entries) {
                        const nameBytes = new TextEncoder().encode(entry.name);
                        const fileData = entry.data instanceof Uint8Array ? entry.data : (typeof entry.data === 'string' ? new TextEncoder().encode(entry.data) : new Uint8Array(entry.data));
                        const crc = crc32(fileData);
                        const dataLen = fileData.length;
                        const nameLen = nameBytes.length;
                        
                        files.push({ name: entry.name, nameBytes, data: fileData, crc, offset, nameLen, dataLen });
                        offset += 30 + nameLen + dataLen;
                    }
                    
                    const centralDirSize = files.reduce((sum, f) => sum + 46 + f.nameLen, 0);
                    const totalSize = offset + centralDirSize + 22;
                    const result = new Uint8Array(totalSize);
                    let pos = 0;
                    
                    for (const file of files) {
                        const view = new DataView(result.buffer, pos);
                        view.setUint32(0, 0x04034b50, true);
                        view.setUint16(4, 20, true);
                        view.setUint16(6, 0x0800, true); // UTF-8 flag (bit 11)
                        view.setUint16(8, 0, true);
                        view.setUint16(10, 0, true);
                        view.setUint16(12, 0, true);
                        view.setUint32(14, file.crc, true);
                        view.setUint32(18, file.dataLen, true);
                        view.setUint32(22, file.dataLen, true);
                        view.setUint16(26, file.nameLen, true);
                        view.setUint16(28, 0, true);
                        pos += 30;
                        result.set(file.nameBytes, pos);
                        pos += file.nameLen;
                        result.set(file.data, pos);
                        pos += file.dataLen;
                    }
                    
                    const centralDirPos = pos;
                    for (const file of files) {
                        const view = new DataView(result.buffer, pos);
                        view.setUint32(0, 0x02014b50, true);
                        view.setUint16(4, 20, true);
                        view.setUint16(6, 20, true);
                        view.setUint16(8, 0x0800, true); // UTF-8 flag (bit 11)
                        view.setUint16(10, 0, true);
                        view.setUint16(12, 0, true);
                        view.setUint16(14, 0, true);
                        view.setUint32(16, file.crc, true);
                        view.setUint32(20, file.dataLen, true);
                        view.setUint32(24, file.dataLen, true);
                        view.setUint16(28, file.nameLen, true);
                        view.setUint16(30, 0, true);
                        view.setUint16(32, 0, true);
                        view.setUint16(34, 0, true);
                        view.setUint16(36, 0, true);
                        view.setUint32(38, 0, true);
                        view.setUint32(42, file.offset, true);
                        pos += 46;
                        result.set(file.nameBytes, pos);
                        pos += file.nameLen;
                    }
                    
                    const view = new DataView(result.buffer, pos);
                    view.setUint32(0, 0x06054b50, true);
                    view.setUint16(4, 0, true);
                    view.setUint16(6, 0, true);
                    view.setUint16(8, files.length, true);
                    view.setUint16(10, files.length, true);
                    view.setUint32(12, centralDirSize, true);
                    view.setUint32(16, centralDirPos, true);
                    view.setUint16(20, 0, true);
                    
                    return new Blob([result], { type: 'application/zip' });
                };

                try {
                    const blob = createStoreZip(entries);
                    if (blob.size < 100) throw new Error('ZIP файл слишком маленький, возможно пустой');

                    const fileName = `datamatrix_${bottles.length}_marks_${new Date().toISOString().slice(0, 10)}.zip`;
                    if (typeof saveAs === 'function') {
                        saveAs(blob, fileName);
                    } else {
                        const blobUrl = URL.createObjectURL(blob);
                        const downloadLink = document.createElement('a');
                        downloadLink.href = blobUrl;
                        downloadLink.download = fileName;
                        downloadLink.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
                        document.body.appendChild(downloadLink);
                        await new Promise(r => setTimeout(r, 80));
                        downloadLink.click();
                        setTimeout(() => { try { document.body.removeChild(downloadLink); URL.revokeObjectURL(blobUrl); } catch(e) {} }, 1500);
                    }
                    notify(`ZIP архив с ${successCount} DataMatrix скачан!`, 'success');
                } catch (genErr) {
                    notify('Ошибка генерации ZIP: ' + genErr.message, 'error');
                }

            } catch (e) {
                notify('Ошибка создания ZIP: ' + e.message, 'error');
            }
        }
    };

    const initInvoice = () => {
        AuthState.init();
        AuthUI.init();
        AuthUI.check();
        GM_registerMenuCommand('🔐 Авторизация DXBX', () => AuthUI.showDialog());
        
        const tryCreate = (attempts = 0) => {
            let textarea = document.getElementById('id_invoiceRawBody');
            let buyerInput = document.getElementById('id_buyerLegalPerson');
            
            if (!textarea) {
                textarea = document.querySelector('textarea[name="invoiceRawBody"]') || 
                           document.querySelector('textarea[id*="invoiceRawBody"]');
            }
            if (!buyerInput) {
                buyerInput = document.querySelector('input[name="buyerLegalPerson.id"]') ||
                             document.querySelector('input[id*="buyerLegalPerson"]');
            }
            
            if (textarea && buyerInput) {
                if (textarea.value && buyerInput.value) {
                    InvoiceTZInterface.create();
                } else if (attempts < 20) {
                    setTimeout(() => tryCreate(attempts + 1), 500);
                }
            } else if (attempts < 20) {
                setTimeout(() => tryCreate(attempts + 1), 500);
            }
        };
        
        setTimeout(() => tryCreate(), 1000);
    };

    let lastInvoiceHash = '';
    let lastBottleHash = '';
    
    const handleHashChange = () => {
        if (isInvoicePage() && window.location.hash !== lastInvoiceHash) {
            lastInvoiceHash = window.location.hash;
            const oldContainer = document.querySelector('.invoice-tz-container');
            if (oldContainer) oldContainer.remove();
            setTimeout(initInvoice, 500);
        }
    };
    
    const handleBottleHashChange = () => {
        if (isBottlePage() && window.location.hash !== lastBottleHash) {
            lastBottleHash = window.location.hash;
            const oldContainer = document.querySelector('.bottle-datamatrix-container');
            if (oldContainer) oldContainer.remove();
            setTimeout(initBottlePageDataMatrix, 500);
        }
    };

    if (isInvoicePage()) {
        lastInvoiceHash = window.location.hash;
        document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initInvoice) : initInvoice();
        window.addEventListener('hashchange', handleHashChange);
        return;
    }
    
    if (isBottlePage()) {
        lastBottleHash = window.location.hash;
        document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initBottlePageDataMatrix) : initBottlePageDataMatrix();
        window.addEventListener('hashchange', handleBottleHashChange);
        return;
    }

    window.addEventListener('hashchange', () => {
        if (isInvoicePage()) {
            handleHashChange();
        }
        if (isBottlePage()) {
            handleBottleHashChange();
        }
    });

    if (!isTargetPage()) {
        new MutationObserver(() => { if (isTargetPage()) window.location.reload(); }).observe(document.body, { childList: true, subtree: true });
        return;
    }

    function init() {
        legalPersonId = currentLegalPersonIdForCache = GM_getValue('legalPersonId');
        
        AuthState.init();
        AuthUI.init();
        AuthUI.check();
        
        GM_registerMenuCommand('🔐 Авторизация DXBX', () => AuthUI.showDialog());
        GM_registerMenuCommand('🔄 Реавторизация', () => AuthUI.reauth());
        GM_registerMenuCommand('🚪 Выход', () => Auth.logout());
        GM_registerMenuCommand('ℹ️ Статус авторизации', () => {
            if (AuthState.auth) {
                notify(`${AuthState.auth.user.name} | ЮЛ: ${legalPersonId || '-'} | Токен: ${AuthState.token ? '✓' : '✗'}`, 'success');
            } else notify('Не авторизован', 'error');
        });
        
        window.BartenderAPI = {
            addBottle: BartenderAPI.addBottle.bind(BartenderAPI),
            removeBottle: BartenderAPI.removeBottle.bind(BartenderAPI),
            getToken: () => AuthState.getToken(),
            authenticate: BartenderAPI.authenticate,
            reauth: Auth.reauth.bind(Auth),
            logout: Auth.logout
        };
        window.dispatchEvent(new CustomEvent('BartenderAPIReady', { detail: { api: window.BartenderAPI } }));
        
        interceptXHR(); createModal(); createOrdersModal(); initCacheSystem(); observeDOM();
        setInterval(handleExpandButtons, 3000);
        setInterval(() => { if (!initializationInProgress) { addEgaisButtons(); addNomenclatureButtons(); } }, 5000);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

})();
