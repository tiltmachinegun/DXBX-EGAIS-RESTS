// ==UserScript==
// @name         DXBX EGAIS RESTS t.me/tiltmachinegun
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Добавляет кнопку перехода на страницу бутылок, проверяет наличие в ТЗ, отображает shortMarkCode, генерирует DataMatrix и добавляет поиск по номенклатуре
// @author       t.me/tiltmachinegun
// @downloadUrl   https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/DXBX%20EGAIS%20RESTS%20t.me-tiltmachinegun.js
// @updateUrl     https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/DXBX%20EGAIS%20RESTS%20t.me-tiltmachinegun.js
// @match        https://dxbx.ru/fe/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/bwip-js@3.0.2/dist/bwip-js.min.js
// @connect      dxbx.ru
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .nomenclature-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 1800px;
            max-height: 90vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: none;
            flex-direction: column;
        }

        .nomenclature-modal.active {
            display: flex;
        }

        .modal-header {
            padding: 16px 24px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fafafa;
            border-radius: 8px 8px 0 0;
        }

        .modal-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        .modal-subtitle {
            margin: 0;
            font-size: 14px;
            color: #666;
            font-weight: normal;
        }

        .modal-title-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .generate-datamatrix {
            margin-left: 5px;
            padding: 2px 5px;
            font-size: 10px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
        }

        .generate-datamatrix:hover {
            background: #218838;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #999;
        }

        .modal-close:hover {
            color: #333;
        }

        .modal-content {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .modal-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .modal-table th,
        .modal-table td {
            padding: 12px 8px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }

        .modal-table th {
            background: #fafafa;
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .modal-table tr:hover {
            background: #f5f5f5;
        }

        .modal-link {
            color: #1890ff;
            text-decoration: none;
            cursor: pointer;
        }

        .modal-link:hover {
            text-decoration: underline;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 9999;
            display: none;
        }

        .modal-overlay.active {
            display: block;
        }

        .loading-spinner {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .nomenclature-button {
            margin-left: 10px;
            padding: 4px 8px;
            background-color: #52c41a;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
        }

        .nomenclature-button:hover {
            background-color: #389e0d;
        }

        .error-message {
            color: #ff4d4f;
            text-align: center;
            padding: 20px;
        }

        .volume-loading {
            color: #999;
            font-style: italic;
        }

        .mark-info-cell {
            max-width: 300px;
            max-height: 60px;
            overflow: hidden;
            word-break: break-all;
            cursor: pointer;
            position: relative;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            padding: 8px;
            background-color: #fafafa;
            transition: max-height 0.3s ease;
        }

        .mark-info-cell.expanded {
            max-height: none;
            overflow-y: auto;
        }

        .mark-info-cell:hover {
            border-color: #1890ff;
        }

        .mark-info-content {
            max-height: 40px;
            overflow: hidden;
        }

        .mark-info-cell.expanded .mark-info-content {
            max-height: none;
        }

        .manual-search-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 8px;
            margin-bottom: 16px;
        }

        .manual-search-input {
            padding: 4px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 1px;
            font-size: 10px;
            width: 250px;
        }

        .manual-search-button {
            padding: 4px 8px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10px;
        }

        .manual-search-button:hover {
            background-color: #40a9ff;
        }

        .expand-toggle {
            display: block;
            text-align: center;
            margin-top: 5px;
            font-size: 12px;
            color: #1890ff;
            cursor: pointer;
        }

        .expand-toggle:hover {
            text-decoration: underline;
        }

        .copy-mark {
            margin-left: 5px;
            padding: 2px 5px;
            font-size: 10px;
            background: #f0f0f0;
            border: none;
            border-radius: 2px;
            cursor: pointer;
        }

        .copy-mark:hover {
            background: #e0e0e0;
        }

        .tz-status-modal {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
        }

        .tz-status-yes {
            background-color: #ccffcc;
            color: #006400;
        }

        .tz-status-no {
            background-color: #ffcccc;
            color: #8b0000;
        }

        .tz-status-loading {
            background-color: #f0f0f0;
            color: #666;
        }

        .pagination-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            padding: 10px;
            border-top: 1px solid #f0f0f0;
        }

        .pagination-button {
            padding: 6px 12px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }

        .pagination-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .pagination-info {
            font-size: 12px;
            color: #666;
        }

        .results-count {
            margin: 10px 0;
            font-size: 14px;
            color: #666;
            text-align: center;
        }

        .filters-container {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #e9ecef;
        }

        .filters-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
        }

        .filters-title {
            font-weight: 600;
            color: #495057;
            margin: 0;
        }

        .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-bottom: 10px;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .filter-label {
            font-size: 12px;
            font-weight: 600;
            color: #495057;
        }

        .filter-input, .filter-select {
            padding: 6px 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 12px;
        }

        .filter-input:focus, .filter-select:focus {
            outline: none;
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .filter-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            flex-wrap: wrap;
        }

        .filter-button {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }

        .filter-apply {
            background-color: #1890ff;
            color: white;
        }

        .filter-apply:hover {
            background-color: #40a9ff;
        }

        .filter-reset {
            background-color: #6c757d;
            color: white;
        }

        .filter-reset:hover {
            background-color: #5a6268;
        }

        .filter-export {
            background-color: #28a745;
            color: white;
        }

        .filter-export:hover {
            background-color: #218838;
        }

        .stats-container {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }

        .stat-item {
            background: white;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
            font-size: 12px;
        }

        .stat-value {
            font-weight: 600;
            color: #1890ff;
        }

        .volume-badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
        }

        .volume-low {
            background-color: #fff2f0;
            color: #cf1322;
            border: 1px solid #ffccc7;
        }

        .volume-medium {
            background-color: #fff7e6;
            color: #d46b08;
            border: 1px solid #ffd591;
        }

        .volume-high {
            background-color: #f6ffed;
            color: #389e0d;
            border: 1px solid #b7eb8f;
        }

        .sortable-header {
            cursor: pointer;
            user-select: none;
            position: relative;
            padding-right: 15px !important;
        }

        .sortable-header:hover {
            background-color: #e6f7ff;
        }

        .sort-icon {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
        }

        .table-container {
            overflow-x: auto;
            flex: 1;
        }

        .highlight-row {
            animation: highlight-fade 2s ease-in-out;
        }

        @keyframes highlight-fade {
            0% { background-color: #fff566; }
            100% { background-color: transparent; }
        }

        .quick-filters {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }

        .quick-filter {
            padding: 4px 8px;
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            color: #0050b3;
        }

        .quick-filter:hover {
            background: #bae7ff;
        }

        .quick-filter.active {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }

        .batch-actions {
            display: flex;
            gap: 10px;
            margin: 10px 0;
            flex-wrap: wrap;
        }

        .batch-action {
            padding: 6px 12px;
            background: #722ed1;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }

        .batch-action:hover {
            background: #9254de;
        }

        .selected-count {
            background: #13c2c2;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
    `);

    let legalPersonId = null;
    const bottleCache = GM_getValue('bottleCache', {});
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
        tzStatus: 'all',
        markSearch: '',
        sortField: 'nomenclature',
        sortDirection: 'asc'
    };
    let allBottlesData = [];
    let selectedBottles = new Set();

    function debugLog(message, data = null) {
        console.log('[EGAISTZ]', message, data || '');
        GM_log('[EGAISTZ] ' + message + (data ? ' ' + JSON.stringify(data) : ''));
    }

    function getCsrfToken() {
        if (!csrfToken) {
            const meta = document.querySelector('meta[name="_csrf"]');
            if (meta) {
                csrfToken = meta.getAttribute('content');
            } else {
                const match = document.cookie.match(/(^|;)\s*XSRF-TOKEN\s*=\s*([^;]+)/);
                if (match) csrfToken = decodeURIComponent(match[2]);
            }
        }
        return csrfToken;
    }

    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function() {
            this._url = arguments[1];
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            if (this._url && this._url.includes('/api/front/egais/rests/legalpersons/')) {
                const match = this._url.match(/\/api\/front\/egais\/rests\/legalpersons\/(\d+)\/strong/);
                if (match && match[1]) {
                    legalPersonId = match[1];
                    GM_setValue('legalPersonId', legalPersonId);
                    debugLog('Found legalPersonId:', legalPersonId);
                }
            }
            return originalSend.apply(this, arguments);
        };
    }

    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.addEventListener('click', closeModal);

        const modal = document.createElement('div');
        modal.className = 'nomenclature-modal';

        const header = document.createElement('div');
        header.className = 'modal-header';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'modal-title-container';

        const title = document.createElement('h3');
        title.className = 'modal-title';
        title.textContent = 'Поиск бутылок по номенклатуре';

        const subtitle = document.createElement('div');
        subtitle.className = 'modal-subtitle';
        subtitle.textContent = '';

        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeModal);

        header.appendChild(titleContainer);
        header.appendChild(closeButton);

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = '<div class="loading-spinner">Загрузка...</div>';

        modal.appendChild(header);
        modal.appendChild(content);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        return modal;
    }

    function openModal(nomenclature = '', positionName = '') {
        const overlay = document.querySelector('.modal-overlay');
        const modal = document.querySelector('.nomenclature-modal');

        const title = document.querySelector('.modal-title');
        const subtitle = document.querySelector('.modal-subtitle');

        if (nomenclature) {
            title.textContent = `Поиск бутылок: ${nomenclature}`;
        } else {
            title.textContent = 'Поиск бутылок по номенклатуре';
        }

        if (positionName) {
            subtitle.textContent = `Позиция: ${positionName}`;
        } else {
            subtitle.textContent = '';
        }

        overlay.classList.add('active');
        modal.classList.add('active');
    }

    function closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        const modal = document.querySelector('.nomenclature-modal');

        overlay.classList.remove('active');
        modal.classList.remove('active');

        currentSearchData = {
            nomenclature: '',
            legalPersonId: '',
            currentPage: 0,
            totalRecords: 0,
            pageSize: 500
        };
        currentFilters = {
            nomenclature: '',
            volumeMin: '',
            volumeMax: '',
            tzStatus: 'all',
            markSearch: '',
            sortField: 'nomenclature',
            sortDirection: 'asc'
        };
        allBottlesData = [];
        selectedBottles.clear();
    }

    function searchBottlesByNomenclature(nomenclature, legalPersonId, start = 0, length = 10000) {
        return new Promise((resolve, reject) => {
            const url = 'https://dxbx.ru/app/egaisbottle/search';

            const postData = {
                "draw": 1,
                "columns": [
                    {"data":"legalPerson","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisActItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"shortMarkCode","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"restsItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisNomenclatureInfo","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisVolume","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisVolumeUpdateDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"active","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"availableVolume","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}}
                ],
                "order":[{"column":0,"dir":"asc"}],
                "start": start,
                "length": length,
                "search":{"value":"","regex":false},
                "model":"egaisbottle",
                "searchFormName":"egaisbottle.default",
                "simpleCrit":{
                    "crits":[
                        {
                            "attr":"legalPerson",
                            "value":legalPersonId,
                            "oper":"EQUALS",
                            "clauses":[
                                {
                                    "oper":"AND",
                                    "criterion":{
                                        "attr":"egaisNomenclatureInfo.name",
                                        "value":nomenclature,
                                        "oper":"LIKE",
                                        "clauses":[]
                                    }
                                }
                            ]
                        }
                    ]
                }
            };

            debugLog('Sending search request:', { nomenclature, legalPersonId, start, length });

            const token = getCsrfToken();
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            };

            if (token) {
                headers['X-CSRF-TOKEN'] = token;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: headers,
                data: JSON.stringify(postData),
                onload: function(response) {
                    debugLog('Search response status:', response.status);

                    if (response.status !== 200) {
                        reject(new Error(`HTTP error: ${response.status}`));
                        return;
                    }

                    if (!response.responseText || response.responseText.trim() === '') {
                        reject(new Error('Пустой ответ от сервера'));
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        debugLog('JSON parse error:', {
                            error: error.message,
                            responseText: response.responseText.substring(0, 200)
                        });
                        reject(new Error(`Ошибка обработки ответа: ${error.message}`));
                    }
                },
                onerror: function(error) {
                    debugLog('Request error:', error);
                    reject(new Error('Ошибка сети при выполнении запроса'));
                },
                ontimeout: function() {
                    reject(new Error('Таймаут запроса'));
                }
            });
        });
    }

    function getBottleDetails(bottleId) {
        return new Promise((resolve, reject) => {
            const url = `https://dxbx.ru/app/edit/egaisbottle/${bottleId}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`HTTP error: ${response.status}`));
                        return;
                    }

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const volumeInput = doc.querySelector('input[name="availableVolume"]');
                        const markInfoInput = doc.querySelector('input[name="markInfo"]');

                        if (volumeInput && markInfoInput) {
                            resolve({
                                volume: volumeInput.value,
                                markInfo: markInfoInput.value
                            });
                        } else {
                            reject(new Error('Элементы с объемом или маркой не найдены'));
                        }
                    } catch (error) {
                        reject(new Error(`Ошибка парсинга: ${error.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Ошибка сети: ${error}`));
                }
            });
        });
    }

    async function checkTZStatusForBottle(markInfo, legalPersonId) {
        const cacheKey = `${legalPersonId}_${markInfo}`;

        if (bottleCache[cacheKey] !== undefined) {
            debugLog('Cache hit for TZ check:', cacheKey);
            return bottleCache[cacheKey];
        }

        debugLog('Checking TZ for bottle:', { markInfo, legalPersonId });

        try {
            const inTZ = await searchInTZ(markInfo, legalPersonId);
            bottleCache[cacheKey] = inTZ;
            GM_setValue('bottleCache', bottleCache);
            debugLog('TZ result:', { markInfo, inTZ });
            return inTZ;
        } catch (error) {
            debugLog('TZ check error:', error);
            return false;
        }
    }

    function createPaginationControls(totalRecords, currentPage, pageSize) {
        const totalPages = Math.ceil(totalRecords / pageSize);
        const startRecord = currentPage * pageSize + 1;
        const endRecord = Math.min((currentPage + 1) * pageSize, totalRecords);

        const controls = document.createElement('div');
        controls.className = 'pagination-controls';

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.textContent = '← Назад';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => loadPage(currentPage - 1));

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.textContent = 'Вперед →';
        nextButton.disabled = currentPage >= totalPages - 1;
        nextButton.addEventListener('click', () => loadPage(currentPage + 1));

        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `Страница ${currentPage + 1} из ${totalPages} | Записи ${startRecord}-${endRecord} из ${totalRecords}`;

        controls.appendChild(prevButton);
        controls.appendChild(pageInfo);
        controls.appendChild(nextButton);

        return controls;
    }

    async function loadPage(pageNumber) {
        const content = document.querySelector('.modal-content');
        content.innerHTML = '<div class="loading-spinner">Загрузка...</div>';

        try {
            const results = await searchBottlesByNomenclature(
                currentSearchData.nomenclature,
                currentSearchData.legalPersonId,
                pageNumber * currentSearchData.pageSize,
                currentSearchData.pageSize
            );

            currentSearchData.currentPage = pageNumber;
            await displayResultsInModal(results, currentSearchData.nomenclature, currentSearchData.legalPersonId);
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
            content.innerHTML = `<div class="error-message">Ошибка при загрузке страницы: ${error.message}</div>`;
        }
    }

    function createFiltersHTML() {
        return `
            <div class="filters-container">
                <div class="filters-header">
                    <h4 class="filters-title">Фильтры и сортировка</h4>
                </div>

                <div class="stats-container" id="stats-container">
                    <div class="stat-item">Всего записей: <span class="stat-value" id="total-count">0</span></div>
                    <div class="stat-item">Отфильтровано: <span class="stat-value" id="filtered-count">0</span></div>
                    <div class="stat-item">В ТЗ: <span class="stat-value" id="tz-count">0</span></div>
                    <div class="stat-item">Не в ТЗ: <span class="stat-value" id="not-tz-count">0</span></div>
                    <div class="stat-item">Средний объем: <span class="stat-value" id="avg-volume">0</span> мл</div>
                </div>

                <div class="batch-actions" id="batch-actions" style="display: none;">
                    <div class="selected-count">Выбрано: <span id="selected-count">0</span></div>
                    <button class="batch-action" id="select-all">Выбрать все</button>
                    <button class="batch-action" id="deselect-all">Снять выделение</button>
                    <button class="batch-action" id="export-selected">Экспорт выбранных</button>
                </div>

                <div class="quick-filters" id="quick-filters">
                    <div class="quick-filter" data-filter="tz=yes">Только в ТЗ</div>
                    <div class="quick-filter" data-filter="tz=no">Только не в ТЗ</div>
                    <div class="quick-filter" data-filter="volume=low">Меньше 100 мл</div>
                    <div class="quick-filter" data-filter="volume=medium">100-500 мл</div>
                    <div class="quick-filter" data-filter="volume=high">Больше 500 мл</div>
                    <div class="quick-filter" data-filter="reset">Сбросить всё</div>
                </div>

                <div class="filters-grid">
                    <div class="filter-group">
                        <label class="filter-label">Номенклатура</label>
                        <select class="filter-select" id="nomenclature-filter">
                            <option value="">Все номенклатуры</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Объем от (мл)</label>
                        <input type="number" class="filter-input" id="volume-min" placeholder="0" min="0" max="1000">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Объем до (мл)</label>
                        <input type="number" class="filter-input" id="volume-max" placeholder="1000" min="0" max="1000">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Статус ТЗ</label>
                        <select class="filter-select" id="tz-filter">
                            <option value="all">Все</option>
                            <option value="yes">В ТЗ</option>
                            <option value="no">Не в ТЗ</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Поиск по марке</label>
                        <input type="text" class="filter-input" id="mark-search" placeholder="Часть марки...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Сортировка</label>
                        <select class="filter-select" id="sort-field">
                            <option value="nomenclature">По номенклатуре</option>
                            <option value="volume">По объему</option>
                            <option value="tzStatus">По статусу ТЗ</option>
                            <option value="date">По дате</option>
                            <option value="shortcode">По короткому коду</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Направление</label>
                        <select class="filter-select" id="sort-direction">
                            <option value="asc">По возрастанию</option>
                            <option value="desc">По убыванию</option>
                        </select>
                    </div>
                </div>

                <div class="filter-actions">
                    <button class="filter-button filter-apply" id="apply-filters">Применить фильтры</button>
                    <button class="filter-button filter-reset" id="reset-filters">Сбросить фильтры</button>
                    <button class="filter-button filter-export" id="export-data">Экспорт в CSV</button>
                    <button class="filter-button batch-action" id="toggle-selection">Режим выбора</button>
                </div>
            </div>
        `;
    }

    function setupFilters() {
        // Быстрые фильтры
        document.getElementById('quick-filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-filter')) {
                const filter = e.target.dataset.filter;
                applyQuickFilter(filter);
            }
        });

        // Основные фильтры
        document.getElementById('apply-filters').addEventListener('click', applyFilters);
        document.getElementById('reset-filters').addEventListener('click', resetFilters);
        document.getElementById('export-data').addEventListener('click', exportToCSV);
        document.getElementById('toggle-selection').addEventListener('click', toggleSelectionMode);

        // Пакетные действия
        document.getElementById('select-all').addEventListener('click', selectAll);
        document.getElementById('deselect-all').addEventListener('click', deselectAll);
        document.getElementById('export-selected').addEventListener('click', exportSelected);

        // Автоматическое применение при изменении
        document.getElementById('nomenclature-filter').addEventListener('change', applyFilters);
        document.getElementById('volume-min').addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('volume-max').addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('tz-filter').addEventListener('change', applyFilters);
        document.getElementById('mark-search').addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('sort-field').addEventListener('change', applyFilters);
        document.getElementById('sort-direction').addEventListener('change', applyFilters);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function applyQuickFilter(filterType) {
        switch (filterType) {
            case 'tz=yes':
                currentFilters.tzStatus = 'yes';
                break;
            case 'tz=no':
                currentFilters.tzStatus = 'no';
                break;
            case 'volume=low':
                currentFilters.volumeMin = '0';
                currentFilters.volumeMax = '100';
                break;
            case 'volume=medium':
                currentFilters.volumeMin = '100';
                currentFilters.volumeMax = '500';
                break;
            case 'volume=high':
                currentFilters.volumeMin = '500';
                currentFilters.volumeMax = '1000';
                break;
            case 'reset':
                resetFilters();
                return;
        }
        updateFilterInputs();
        applyFilters();
    }

    function updateFilterInputs() {
        document.getElementById('nomenclature-filter').value = currentFilters.nomenclature;
        document.getElementById('volume-min').value = currentFilters.volumeMin;
        document.getElementById('volume-max').value = currentFilters.volumeMax;
        document.getElementById('tz-filter').value = currentFilters.tzStatus;
        document.getElementById('mark-search').value = currentFilters.markSearch;
        document.getElementById('sort-field').value = currentFilters.sortField;
        document.getElementById('sort-direction').value = currentFilters.sortDirection;
    }

    function applyFilters() {
        currentFilters = {
            nomenclature: document.getElementById('nomenclature-filter').value,
            volumeMin: document.getElementById('volume-min').value,
            volumeMax: document.getElementById('volume-max').value,
            tzStatus: document.getElementById('tz-filter').value,
            markSearch: document.getElementById('mark-search').value.toLowerCase(),
            sortField: document.getElementById('sort-field').value,
            sortDirection: document.getElementById('sort-direction').value
        };

        filterAndSortTable();
    }

    function resetFilters() {
        currentFilters = {
            nomenclature: '',
            volumeMin: '',
            volumeMax: '',
            tzStatus: 'all',
            markSearch: '',
            sortField: 'nomenclature',
            sortDirection: 'asc'
        };

        updateFilterInputs();
        filterAndSortTable();
    }

    function filterAndSortTable() {
        const rows = document.querySelectorAll('.modal-table tbody tr');
        let visibleCount = 0;
        let tzCount = 0;
        let notTzCount = 0;
        let totalVolume = 0;
        let volumeCount = 0;

        rows.forEach(row => {
            const nomenclature = row.getAttribute('data-nomenclature') || '';
            const volume = parseInt(row.getAttribute('data-volume') || 0);
            const tzStatus = row.getAttribute('data-tz-status') || '';
            const markInfo = (row.getAttribute('data-mark') || '').toLowerCase();
            const shortCode = (row.querySelector('td:nth-child(2)')?.textContent || '').toLowerCase();

            let shouldShow = true;

            if (currentFilters.nomenclature && nomenclature !== currentFilters.nomenclature) {
                shouldShow = false;
            }

            if (currentFilters.volumeMin && volume < parseInt(currentFilters.volumeMin)) {
                shouldShow = false;
            }

            if (currentFilters.volumeMax && volume > parseInt(currentFilters.volumeMax)) {
                shouldShow = false;
            }

            if (currentFilters.tzStatus === 'yes' && tzStatus !== 'да') {
                shouldShow = false;
            }

            if (currentFilters.tzStatus === 'no' && tzStatus !== 'нет') {
                shouldShow = false;
            }

            if (currentFilters.markSearch &&
                !markInfo.includes(currentFilters.markSearch) &&
                !shortCode.includes(currentFilters.markSearch)) {
                shouldShow = false;
            }

            row.style.display = shouldShow ? '' : 'none';

            if (shouldShow) {
                visibleCount++;
                if (tzStatus === 'да') tzCount++;
                if (tzStatus === 'нет') notTzCount++;
                if (volume > 0) {
                    totalVolume += volume;
                    volumeCount++;
                }

                row.classList.add('highlight-row');
                setTimeout(() => row.classList.remove('highlight-row'), 1000);
            }
        });

        sortTable();
        updateStats(rows.length, visibleCount, tzCount, notTzCount, volumeCount > 0 ? totalVolume / volumeCount : 0);
    }

    function sortTable() {
        const tbody = document.querySelector('.modal-table tbody');
        const rows = Array.from(tbody.querySelectorAll('tr:not([style*="display: none"])'));

        rows.sort((a, b) => {
            let aValue, bValue;

            switch (currentFilters.sortField) {
                case 'volume':
                    aValue = parseInt(a.getAttribute('data-volume') || 0);
                    bValue = parseInt(b.getAttribute('data-volume') || 0);
                    break;
                case 'tzStatus':
                    aValue = a.getAttribute('data-tz-status') || '';
                    bValue = b.getAttribute('data-tz-status') || '';
                    break;
                case 'date':
                    aValue = a.querySelector('td:nth-child(6)')?.textContent || '';
                    bValue = b.querySelector('td:nth-child(6)')?.textContent || '';
                    break;
                case 'shortcode':
                    aValue = a.querySelector('td:nth-child(2)')?.textContent || '';
                    bValue = b.querySelector('td:nth-child(2)')?.textContent || '';
                    break;
                case 'nomenclature':
                default:
                    aValue = a.getAttribute('data-nomenclature') || '';
                    bValue = b.getAttribute('data-nomenclature') || '';
                    break;
            }

            if (currentFilters.sortDirection === 'desc') {
                [aValue, bValue] = [bValue, aValue];
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            }

            return aValue.toString().localeCompare(bValue.toString());
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    function updateStats(total, filtered, tzCount, notTzCount, avgVolume) {
        document.getElementById('total-count').textContent = total;
        document.getElementById('filtered-count').textContent = filtered;
        document.getElementById('tz-count').textContent = tzCount;
        document.getElementById('not-tz-count').textContent = notTzCount;
        document.getElementById('avg-volume').textContent = Math.round(avgVolume);
    }

    function exportToCSV() {
        const rows = document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])');
        const headers = ['Номенклатура', 'Короткий код', 'Объем (мл)', 'Статус ТЗ', 'Дата обновления', 'Марка'];

        let csvContent = headers.join(';') + '\n';

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [
                cells[0]?.textContent || '',
                cells[1]?.textContent || '',
                cells[2]?.textContent || '',
                cells[3]?.textContent || '',
                cells[4]?.textContent || '',
                row.getAttribute('data-mark') || ''
            ].map(cell => `"${cell.replace(/"/g, '""')}"`).join(';');

            csvContent += rowData + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `бутылки_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function populateNomenclatureFilter(bottles) {
        const select = document.getElementById('nomenclature-filter');
        const nomenclatureSet = new Set();

        bottles.forEach(bottle => {
            const nom = bottle.egaisNomenclatureInfo || 'Неизвестная номенклатура';
            nomenclatureSet.add(nom);
        });

        select.innerHTML = '<option value="">Все номенклатуры</option>';
        Array.from(nomenclatureSet).sort().forEach(nom => {
            const option = document.createElement('option');
            option.value = nom;
            option.textContent = nom;
            select.appendChild(option);
        });
    }

    function getVolumeBadge(volume) {
        const vol = parseInt(volume) || 0;
        if (vol < 100) return '<span class="volume-badge volume-low">Малый</span>';
        if (vol < 500) return '<span class="volume-badge volume-medium">Средний</span>';
        return '<span class="volume-badge volume-high">Большой</span>';
    }

    function toggleSelectionMode() {
        const rows = document.querySelectorAll('.modal-table tbody tr');
        const isSelectionMode = document.getElementById('batch-actions').style.display !== 'none';

        if (isSelectionMode) {
            document.getElementById('batch-actions').style.display = 'none';
            document.getElementById('toggle-selection').textContent = 'Режим выбора';
            rows.forEach(row => {
                row.style.cursor = 'default';
                row.classList.remove('selectable-row');
                row.removeEventListener('click', handleRowSelection);
            });
            selectedBottles.clear();
            updateSelectedCount();
        } else {
            document.getElementById('batch-actions').style.display = 'flex';
            document.getElementById('toggle-selection').textContent = 'Отменить выбор';
            rows.forEach(row => {
                row.style.cursor = 'pointer';
                row.classList.add('selectable-row');
                row.addEventListener('click', handleRowSelection);
            });
        }
    }

    function handleRowSelection(e) {
        const row = e.currentTarget;
        const bottleId = row.getAttribute('data-bottle-id');

        if (selectedBottles.has(bottleId)) {
            selectedBottles.delete(bottleId);
            row.style.background = '';
        } else {
            selectedBottles.add(bottleId);
            row.style.background = '#e6f7ff';
        }

        updateSelectedCount();
    }

    function updateSelectedCount() {
        document.getElementById('selected-count').textContent = selectedBottles.size;
    }

    function selectAll() {
        const rows = document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])');
        rows.forEach(row => {
            const bottleId = row.getAttribute('data-bottle-id');
            selectedBottles.add(bottleId);
            row.style.background = '#e6f7ff';
        });
        updateSelectedCount();
    }

    function deselectAll() {
        const rows = document.querySelectorAll('.modal-table tbody tr');
        rows.forEach(row => {
            row.style.background = '';
        });
        selectedBottles.clear();
        updateSelectedCount();
    }

    function exportSelected() {
        if (selectedBottles.size === 0) {
            alert('Не выбрано ни одной бутылки для экспорта');
            return;
        }

        const rows = document.querySelectorAll('.modal-table tbody tr');
        const headers = ['Номенклатура', 'Короткий код', 'Объем (мл)', 'Статус ТЗ', 'Дата обновления', 'Марка'];

        let csvContent = headers.join(';') + '\n';

        rows.forEach(row => {
            const bottleId = row.getAttribute('data-bottle-id');
            if (selectedBottles.has(bottleId)) {
                const cells = row.querySelectorAll('td');
                const rowData = [
                    cells[0]?.textContent || '',
                    cells[1]?.textContent || '',
                    cells[2]?.textContent || '',
                    cells[3]?.textContent || '',
                    cells[4]?.textContent || '',
                    row.getAttribute('data-mark') || ''
                ].map(cell => `"${cell.replace(/"/g, '""')}"`).join(';');

                csvContent += rowData + '\n';
            }
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `выбранные_бутылки_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function displayResultsInModal(results, nomenclature, currentLegalPersonId, positionName = '') {
        const content = document.querySelector('.modal-content');
        content.innerHTML = '<div class="loading-spinner">Загрузка...</div>';

        if (!results || !results.data || results.data.length === 0) {
            content.innerHTML = `<div style="text-align: center; padding: 40px; color: #999;">
                Бутылки для номенклатуры "${nomenclature}" не найдены
                ${positionName ? `<br>Позиция: ${positionName}` : ''}
            </div>`;
            return;
        }

        currentSearchData.nomenclature = nomenclature;
        currentSearchData.legalPersonId = currentLegalPersonId;
        currentSearchData.totalRecords = results.recordsTotal || results.data.length;

        const activeBottles = results.data.filter(bottle => bottle.active === "Да");
        allBottlesData = activeBottles;

        if (activeBottles.length === 0) {
            content.innerHTML = `<div style="text-align: center; padding: 40px; color: #999;">
                Активные бутылки для номенклатуры "${nomenclature}" не найдены<br>
                Всего найдено бутылок: ${results.data.length}<br>
                Активных: ${results.data.filter(b => b.active === "Да").length}
                ${positionName ? `<br>Позиция: ${positionName}` : ''}
            </div>`;
            return;
        }

        content.innerHTML = createFiltersHTML();

        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        content.appendChild(tableContainer);

        let tableHTML = `
            <div class="results-count">
                Найдено активных бутылок: ${activeBottles.length} из ${results.data.length} на этой странице
                ${positionName ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">Позиция: ${positionName}</div>` : ''}
                ${currentSearchData.totalRecords > currentSearchData.pageSize ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">Всего записей в базе: ${currentSearchData.totalRecords}</div>` : ''}
            </div>
            <table class="modal-table">
                <thead>
                    <tr>
                        <th class="sortable-header" data-sort="nomenclature">Наименование</th>
                        <th class="sortable-header" data-sort="shortcode">Короткий код</th>
                        <th class="sortable-header" data-sort="volume">Объем (мл)</th>
                        <th>Полная марка</th>
                        <th class="sortable-header" data-sort="tz">В ТЗ</th>
                        <th class="sortable-header" data-sort="date">Дата обновления</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
        `;

        activeBottles.forEach(bottle => {
            const nomenclatureName = bottle.egaisNomenclatureInfo || 'Неизвестная номенклатура';

            tableHTML += `
                <tr data-bottle-id="${bottle.DT_RowId}" data-nomenclature="${nomenclatureName}">
                    <td>${nomenclatureName}</td>
                    <td>${bottle.title || 'Н/Д'}</td>
                    <td class="volume-cell" data-bottle-id="${bottle.DT_RowId}">
                        <span class="volume-loading">Загрузка...</span>
                    </td>
                    <td class="mark-info-cell" data-bottle-id="${bottle.DT_RowId}">
                        <span class="mark-loading">Загрузка...</span>
                    </td>
                    <td class="tz-status-cell" data-bottle-id="${bottle.DT_RowId}">
                        <span class="tz-status-modal tz-status-loading">Проверка...</span>
                    </td>
                    <td>${bottle.egaisVolumeUpdateDate || 'Н/Д'}</td>
                    <td>
                        ${bottle.DT_RowId ? `
                        <a class="modal-link" href="https://dxbx.ru/index#app/edit/egaisbottle/${bottle.DT_RowId}" target="_blank">
                            Перейти к бутылке
                        </a>
                        ` : 'Н/Д'}
                    </td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';

        if (currentSearchData.totalRecords > currentSearchData.pageSize) {
            const paginationControls = createPaginationControls(
                currentSearchData.totalRecords,
                currentSearchData.currentPage,
                currentSearchData.pageSize
            );
            tableHTML += paginationControls.outerHTML;
        }

        tableContainer.innerHTML = tableHTML;

        setupFilters();
        populateNomenclatureFilter(activeBottles);
        await loadBottleDetails();
    }

    async function loadBottleDetails() {
        const volumeCells = document.querySelectorAll('.volume-cell');
        const markCells = document.querySelectorAll('.mark-info-cell');
        const tzCells = document.querySelectorAll('.tz-status-cell');
        const promises = [];

        volumeCells.forEach((cell, index) => {
            const bottleId = cell.getAttribute('data-bottle-id');
            if (bottleId) {
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

                            markCell.innerHTML = `
                                <div class="mark-info-content">${details.markInfo}</div>
                                <div class="expand-toggle">Развернуть ▼</div>
                                <button class="copy-mark" title="Скопировать полную марку">Копировать</button>
                                <button class="generate-datamatrix" title="Сгенерировать DataMatrix">DataMatrix</button>
                            `;

                            markCell.querySelector('.generate-datamatrix').addEventListener('click', function(e) {
                                e.stopPropagation();
                                generateDataMatrix(details.markInfo);
                            });

                            markCell.querySelector('.expand-toggle').addEventListener('click', function(e) {
                                e.stopPropagation();
                                const cell = this.closest('.mark-info-cell');
                                cell.classList.toggle('expanded');
                                this.textContent = cell.classList.contains('expanded') ? 'Свернуть ▲' : 'Развернуть ▼';
                            });

                            markCell.querySelector('.copy-mark').addEventListener('click', function(e) {
                                e.stopPropagation();
                                navigator.clipboard.writeText(details.markInfo)
                                    .then(() => {
                                        const originalText = this.textContent;
                                        this.textContent = 'Скопировано!';
                                        setTimeout(() => {
                                            this.textContent = originalText;
                                        }, 2000);
                                    })
                                    .catch(err => {
                                        console.error('Ошибка копирования:', err);
                                    });
                            });

                            return checkTZStatusForBottle(details.markInfo, currentSearchData.legalPersonId)
                                .then(inTZ => {
                                    const tzCell = tzCells[index];
                                    const tzStatus = inTZ ? 'да' : 'нет';
                                    row.setAttribute('data-tz-status', tzStatus);

                                    if (inTZ) {
                                        tzCell.innerHTML = '<span class="tz-status-modal tz-status-yes">В ТЗ ✓</span>';
                                    } else {
                                        tzCell.innerHTML = '<span class="tz-status-modal tz-status-no">Нет в ТЗ ✗</span>';
                                    }
                                });
                        })
                        .catch(error => {
                            console.error('Ошибка загрузки деталей:', error);
                            cell.innerHTML = 'Ошибка';
                            markCells[index].innerHTML = 'Ошибка';
                            tzCells[index].innerHTML = '<span class="tz-status-modal tz-status-no">Ошибка</span>';
                        })
                );
            }
        });

        const MAX_CONCURRENT_REQUESTS = 3;
        for (let i = 0; i < promises.length; i += MAX_CONCURRENT_REQUESTS) {
            const chunk = promises.slice(i, i + MAX_CONCURRENT_REQUESTS);
            await Promise.all(chunk);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        applyFilters();
    }

    function addNomenclatureButtons() {
        if (!isTargetPage()) return;

        const strongAlcoholTable = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0.gsbGPr');

        if (!strongAlcoholTable) return;

        const mainTable = strongAlcoholTable.querySelector('.ant-table-tbody:not(.restsstyled__ExpandedTableWrapper-sc-1oz76wz-5 .ant-table-tbody)');

        if (!mainTable) return;

        const rows = mainTable.querySelectorAll('.ant-table-row.ant-table-row-level-0');

        rows.forEach(row => {
            const cells = row.querySelectorAll('.ant-table-cell');
            if (cells.length >= 3) {
                const nomenclatureCell = cells[2];
                const nomenclature = nomenclatureCell.textContent.trim();

                const positionNameCell = cells[0];
                const positionName = positionNameCell.textContent.trim();

                if (nomenclature &&
                    !nomenclatureCell.querySelector('.nomenclature-button') &&
                    !nomenclature.match(/^\d+\.\d+$/) &&
                    !nomenclature.match(/^[A-F0-9-]+$/) &&
                    !nomenclature.match(/^\d{11,}$/) &&
                    nomenclature.length > 5) {

                    const button = document.createElement('button');
                    button.className = 'nomenclature-button';
                    button.textContent = 'Поиск бутылок';
                    button.title = `Найти активные бутылки для: ${nomenclature}`;

                    button.addEventListener('click', async (e) => {
                        e.stopPropagation();

                        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
                        if (!currentLegalPersonId) {
                            alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.');
                            return;
                        }

                        openModal(nomenclature, positionName);

                        const content = document.querySelector('.modal-content');
                        content.innerHTML = '<div class="loading-spinner">Поиск активных бутылок...</div>';

                        try {
                            const results = await searchBottlesByNomenclature(nomenclature, currentLegalPersonId);
                            await displayResultsInModal(results, nomenclature, currentLegalPersonId, positionName);
                        } catch (error) {
                            console.error('Ошибка поиска:', error);
                            content.innerHTML = `
                                <div class="error-message">
                                    Ошибка при поиске бутылок: ${error.message}<br>
                                    <small>Попробуйте обновить страницу и повторить попытку</small>
                                    ${positionName ? `<br>Позиция: ${positionName}` : ''}
                                </div>
                            `;
                        }
                    });

                    nomenclatureCell.appendChild(button);
                }
            }
        });
    }

    function addManualSearchButton() {
    if (!isTargetPage()) return;

    const tableWrapper = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0.gsbGPr');

    if (!tableWrapper) return;

    if (tableWrapper.querySelector('.manual-search-container')) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'manual-search-container';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'manual-search-input';
    searchInput.placeholder = 'Введите номенклатуру для поиска';

    const searchButton = document.createElement('button');
    searchButton.type = 'button';
    searchButton.className = 'manual-search-button';
    searchButton.textContent = 'Поиск бутылок';

    searchButton.addEventListener('click', async () => {
        const nomenclature = searchInput.value.trim();
        if (!nomenclature) {
            alert('Пожалуйста, введите номенклатуру для поиска');
            return;
        }

        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
        if (!currentLegalPersonId) {
            alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.');
            return;
        }

        openModal(nomenclature);

        const content = document.querySelector('.modal-content');
        content.innerHTML = '<div class="loading-spinner">Поиск активных бутылок...</div>';

        try {
            const results = await searchBottlesByNomenclature(nomenclature, currentLegalPersonId);
            await displayResultsInModal(results, nomenclature, currentLegalPersonId);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            content.innerHTML = `
                <div class="error-message">
                    Ошибка при поиске бутылок: ${error.message}<br>
                    <small>Попробуйте обновить страницу и повторить попытку</small>
                </div>
            `;
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);

    tableWrapper.insertBefore(searchContainer, tableWrapper.firstChild);
}

    async function addEgaisButtons() {
        if (!isTargetPage()) return;
        const markElements = document.querySelectorAll('.strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1.gOhuPU');

        for (const markElement of markElements) {
            if (markElement.offsetParent !== null && !markElement.parentNode.querySelector('.egais-link-button')) {
                const markCode = markElement.textContent.trim();

                const container = document.createElement('div');
                container.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-left: 10px;
                    flex-wrap: wrap;
                `;

                const button = createEgaisButton(markCode);
                const datamatrixButton = createDataMatrixButton(markCode);

                const shortMarkCodeElement = document.createElement('span');
                shortMarkCodeElement.className = 'short-mark-code';
                shortMarkCodeElement.style.cssText = `
                    font-size: 12px;
                    color: #666;
                    margin-right: 5px;
                `;
                shortMarkCodeElement.textContent = 'Загрузка...';

                const tzStatus = document.createElement('span');
                tzStatus.className = 'tz-status';
                tzStatus.style.cssText = `
                    font-size: 12px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    background-color: #f0f0f0;
                `;
                tzStatus.textContent = 'Проверка...';

                container.appendChild(button);
                container.appendChild(datamatrixButton);
                container.appendChild(shortMarkCodeElement);
                container.appendChild(tzStatus);
                markElement.parentNode.appendChild(container);

                await Promise.all([
                    loadShortMarkCode(markCode, shortMarkCodeElement),
                    checkTZStatus(markCode, tzStatus)
                ]);
            }
        }
    }

    function createEgaisButton(markCode) {
        const button = document.createElement('button');
        button.textContent = 'ЕГАИС';
        button.className = 'egais-link-button';
        button.style.cssText = `
            padding: 2px 8px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
        `;
        button.dataset.markCode = markCode;

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
            if (currentLegalPersonId) {
                openBottlePage(markCode, currentLegalPersonId);
            } else {
                findLegalPersonId().then(id => {
                    if (id) {
                        openBottlePage(markCode, id);
                    } else {
                        alert('Не удалось определить legalPersonId.');
                    }
                });
            }
        });

        return button;
    }

    function createDataMatrixButton(markCode) {
        const button = document.createElement('button');
        button.textContent = 'DataMatrix';
        button.className = 'datamatrix-button';
        button.style.cssText = `
            padding: 2px 8px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
        `;
        button.dataset.markCode = markCode;

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            generateDataMatrix(markCode);
        });

        return button;
    }

    function generateDataMatrix(markCode) {
        let modal = document.getElementById('datamatrix-modal');
        if (modal) {
            modal.remove();
        }

        modal = document.createElement('div');
        modal.id = 'datamatrix-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 300px;
            text-align: center;
        `;

        const title = document.createElement('h3');
        title.textContent = 'DataMatrix ECC200';
        title.style.cssText = 'margin: 0 0 15px 0; font-size: 16px;';
        modal.appendChild(title);

        const dmContainer = document.createElement('div');
        dmContainer.id = 'datamatrix-container';
        dmContainer.style.cssText = 'margin: 10px 0; display: flex; justify-content: center;';
        modal.appendChild(dmContainer);

        const codeText = document.createElement('div');
        codeText.textContent = markCode;
        codeText.style.cssText = 'font-family: monospace; font-size: 12px; margin: 10px 0; word-break: break-all;';
        modal.appendChild(codeText);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.cssText = `
            padding: 8px 16px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        `;
        closeButton.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        modal.appendChild(closeButton);

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        try {
            dmContainer.innerHTML = '';

            const canvas = document.createElement('canvas');
            dmContainer.appendChild(canvas);

            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: markCode,
                scale: 3,
                height: 30,
                includetext: false,
            });
        } catch (error) {
            console.error('Ошибка генерации DataMatrix:', error);
            dmContainer.innerHTML = '<div style="color: red;">Ошибка генерации кода: ' + error.message + '</div>';
        }
    }

    async function loadShortMarkCode(markCode, shortMarkCodeElement) {
        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');

        if (!currentLegalPersonId) {
            shortMarkCodeElement.textContent = 'Нет legalPersonId';
            shortMarkCodeElement.style.color = '#ff0000';
            return;
        }
        try {
            const shortMarkCode = await searchBottleByMark(markCode, currentLegalPersonId);
            if (shortMarkCode) {
                shortMarkCodeElement.textContent = shortMarkCode;
                shortMarkCodeElement.style.color = '#006400';
            } else {
                shortMarkCodeElement.textContent = 'Не найден';
                shortMarkCodeElement.style.color = '#8b0000';
            }
        } catch (error) {
            console.error('Ошибка загрузки shortMarkCode:', error);
            shortMarkCodeElement.textContent = 'Ошибка';
            shortMarkCodeElement.style.color = '#ff0000';
        }
    }

    function searchBottleByMark(markCode, legalPersonId) {
        return new Promise((resolve, reject) => {
            const url = 'https://dxbx.ru/app/egaisbottle/search';
            const postData = {
                "draw": 1,
                "columns": [
                    {"data":"legalPerson","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisActItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"shortMarkCode","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"restsItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisNomenclatureInfo","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisVolume","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisVolumeUpdateDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"active","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"availableVolume","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}}
                ],
                "order": [{"column":0,"dir":"asc"}],
                "start": 0,
                "length": 200,
                "search": {"value":"","regex":false},
                "model": "egaisbottle",
                "searchFormName": "egaisbottle.default",
                "simpleCrit": {
                    "crits": [{
                        "attr": "legalPerson",
                        "value": legalPersonId,
                        "oper": "EQUALS",
                        "clauses": [{
                            "oper": "AND",
                            "criterion": {
                                "attr": "markInfo",
                                "value": markCode,
                                "oper": "EQUALS",
                                "clauses": []
                            }
                        }]
                    }]
                }
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(postData),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.data && data.data.length > 0) {
                            resolve(data.data[0].shortMarkCode);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function openBottlePage(markCode, legalPersonId) {
        searchBottleByMark(markCode, legalPersonId).then(shortMarkCode => {
            if (shortMarkCode) {
                const url = 'https://dxbx.ru/app/egaisbottle/search';
                const postData = {
                    "draw": 1,
                    "columns": [
                        {"data":"legalPerson","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"egaisActItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"shortMarkCode","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"restsItem","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"egaisNomenclatureInfo","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"egaisVolume","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"egaisVolumeUpdateDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"active","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                        {"data":"availableVolume","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}}
                    ],
                    "order": [{"column":0,"dir":"asc"}],
                    "start": 0,
                    "length": 200,
                    "search": {"value":"","regex":false},
                    "model": "egaisbottle",
                    "searchFormName": "egaisbottle.default",
                    "simpleCrit": {
                        "crits": [{
                            "attr": "legalPerson",
                            "value": legalPersonId,
                            "oper": "EQUALS",
                            "clauses": [{
                                "oper": "AND",
                                "criterion": {
                                    "attr": "markInfo",
                                    "value": markCode,
                                    "oper": "EQUALS",
                                    "clauses": []
                                }
                            }]
                        }]
                    }
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(postData),
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.data && data.data.length > 0) {
                                const bottleId = data.data[0].DT_RowId;
                                if (bottleId) {
                                    window.open(`https://dxbx.ru/index#app/edit/egaisbottle/${bottleId}`, '_blank');
                                }
                            }
                        } catch (error) {
                            console.error('Ошибка:', error);
                        }
                    }
                });
            }
        });
    }

    async function checkTZStatus(markCode, statusElement) {
        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');

        if (!currentLegalPersonId) {
            debugLog('No legalPersonId for TZ check');
            statusElement.textContent = 'Нет legalPersonId';
            statusElement.style.backgroundColor = '#ffcccc';
            return;
        }

        debugLog('Checking TZ for mark:', { markCode, legalPersonId: currentLegalPersonId });

        const cacheKey = `${currentLegalPersonId}_${markCode}`;
        if (bottleCache[cacheKey] !== undefined) {
            debugLog('Cache hit:', cacheKey);
            updateTZStatus(statusElement, bottleCache[cacheKey]);
            return;
        }

        try {
            debugLog('Sending TZ request for mark:', markCode);
            const inTZ = await searchInTZ(markCode, currentLegalPersonId);
            bottleCache[cacheKey] = inTZ;
            GM_setValue('bottleCache', bottleCache);
            debugLog('TZ result:', { markCode, inTZ });
            updateTZStatus(statusElement, inTZ);
        } catch (error) {
            debugLog('TZ check error:', error);
            statusElement.textContent = 'Ошибка проверки';
            statusElement.style.backgroundColor = '#ffcccc';
        }
    }

    function searchInTZ(markCode, legalPersonId) {
        return new Promise((resolve, reject) => {
            const url = 'https://dxbx.ru/app/egaisbarbottle/search';

            const postData = {
                "draw": 1,
                "columns": [
                    {"data":"createDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"egaisBottle","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"availableVolume","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}},
                    {"data":"bottleCapacity","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}},
                    {"data":"egaisNomenclatureInfo","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}},
                    {"data":"markInfo","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}}
                ],
                "order": [{"column":0,"dir":"asc"}],
                "start": 0,
                "length": 200,
                "search": {"value":"","regex":false},
                "model": "egaisbarbottle",
                "searchFormName": "egaisbarbottle.default",
                "simpleCrit": {
                    "crits": [
                        {
                            "attr": "legalPerson",
                            "value": legalPersonId,
                            "oper": "EQUALS",
                            "clauses": [
                                {
                                    "oper": 'AND',
                                    "criterion": {
                                        "attr": "egaisBottle.markInfo",
                                        "value": markCode,
                                        "oper": "EQUALS",
                                        "clauses": []
                                    }
                                }
                            ]
                        }
                    ]
                }
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: JSON.stringify(postData),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.data && data.data.length > 0);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function updateTZStatus(element, inTZ) {
        if (inTZ) {
            element.textContent = 'В ТЗ ✓';
            element.style.backgroundColor = '#ccffcc';
            element.style.color = '#006400';
        } else {
            element.textContent = 'Нет в ТЗ ✗';
            element.style.backgroundColor = '#ffcccc';
            element.style.color = '#8b0000';
        }
    }

    async function findLegalPersonId() {
        const urlMatch = window.location.href.match(/legalpersons\/(\d+)/);
        if (urlMatch && urlMatch[1]) return urlMatch[1];

        const savedId = GM_getValue('legalPersonId');
        if (savedId) return savedId;

        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            if (script.textContent.includes('legalpersons')) {
                const match = script.textContent.match(/legalpersons\/(\d+)/);
                if (match && match[1]) return match[1];
            }
        }
        return null;
    }

    function handleExpandButtons() {
        const expandButtons = document.querySelectorAll('.ant-table-row-expand-icon');
        expandButtons.forEach(button => {
            if (!button.hasAttribute('data-egais-listener')) {
                button.setAttribute('data-egais-listener', 'true');
                button.addEventListener('click', () => setTimeout(addEgaisButtons, 500));
            }
        });
    }

    function observeDOM() {
        const targetNode = document.querySelector('.ant-table-wrapper');
        if (targetNode) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    handleExpandButtons();
                    setTimeout(addEgaisButtons, 100);
                    setTimeout(addNomenclatureButtons, 100);
                    setTimeout(addManualSearchButton, 100);
                });
            });
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
    }

    function isTargetPage() {
        return window.location.href.includes('https://dxbx.ru/fe/egais/rests');
    }

    if (!isTargetPage()) {
        const urlObserver = new MutationObserver(() => {
            if (isTargetPage()) {
                window.location.reload();
            }
        });

        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return;
    }

    function init() {
        legalPersonId = GM_getValue('legalPersonId');
        debugLog('Script initialized', { legalPersonId });
        interceptXHR();
        createModal();
        observeDOM();
        handleExpandButtons();

        setInterval(handleExpandButtons, 2000);
        setInterval(addEgaisButtons, 3000);
        setInterval(addNomenclatureButtons, 3000);
        setInterval(addManualSearchButton, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
