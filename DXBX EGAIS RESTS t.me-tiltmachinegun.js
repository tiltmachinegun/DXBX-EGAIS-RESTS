// ==UserScript==
// @name         DXBX EGAIS RESTS t.me/tiltmachinegun
// @namespace    http://tampermonkey.net/
// @version      5.1.1
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
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

        .orders-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 1400px;
            max-height: 90vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: none;
            flex-direction: column;
        }

        .orders-modal.active {
            display: flex;
        }

        .order-item {
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            margin-bottom: 12px;
            padding: 12px;
            background: #fafafa;
        }

        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e8e8e8;
        }

        .order-title {
            font-weight: 600;
            color: #1890ff;
            cursor: pointer;
        }

        .order-title:hover {
            text-decoration: underline;
        }

        .order-status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }

        .status-created {
            background: #e6f7ff;
            color: #1890ff;
        }

        .order-details {
            font-size: 12px;
            color: #666;
        }

        .order-bottle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .order-bottle:last-child {
            border-bottom: none;
        }

        .bottle-code {
            font-family: monospace;
            font-size: 11px;
        }

        .bottle-volume {
            font-weight: 600;
            color: #52c41a;
        }

        .bottle-match {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 600;
        }

        .match-found {
            background: #f6ffed;
            color: #52c41a;
        }

        .match-not-found {
            background: #fff2f0;
            color: #ff4d4f;
        }

        .check-orders-button {
            margin-left: 10px;
            padding: 4px 8px;
            background-color: #722ed1;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
        }

        .check-orders-button:hover {
            background-color: #9254de;
        }

        .orders-summary {
            background: #f0f8ff;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 15px;
            border: 1px solid #d6e4ff;
        }

        .summary-stats {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .summary-stat {
            font-size: 12px;
        }

        .summary-value {
            font-weight: 600;
            color: #1890ff;
        }

        .alko-code-filter {
            background: #f0f8ff;
            border-left: 3px solid #1890ff;
        }

        .alko-code-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            border-radius: 3px;
            font-size: 11px;
            font-family: monospace;
            color: #0050b3;
            margin-left: 5px;
        }

        .alko-code-cell {
            font-family: monospace;
            font-size: 11px;
            color: #666;
        }
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

    let buttonsInitialized = false;
    let initializationInProgress = false;

    function debugLog(message, data = null) {
        if (data) {
            console.log('[EGAISTZ]', message, data);
            GM_log('[EGAISTZ] ' + message + ' ' + JSON.stringify(data));
        } else {
            console.log('[EGAISTZ]', message);
            GM_log('[EGAISTZ] ' + message);
        }
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
        if (window.XMLHttpRequest.prototype._egaisIntercepted) return;

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

        window.XMLHttpRequest.prototype._egaisIntercepted = true;
    }

   async function loadOpenOrders(legalPersonId, forceReload = false) {
        if (ordersLoading) {
            debugLog('Загрузка заказов уже выполняется, пропускаем...');
            return;
        }

        const cacheKey = `orders_${legalPersonId}`;
        const cacheTimestamp = ordersCache[`${cacheKey}_timestamp`];
        const now = Date.now();
        const CACHE_TTL = 5 * 60 * 1000;

        if (!forceReload && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
            const cachedData = ordersCache[cacheKey];
            if (cachedData) {
                debugLog('Используем кэшированные данные заказов');
                ordersByMarkCode = cachedData;
                ordersLoaded = true;
                return;
            }
        }

        ordersLoading = true;

        try {
            debugLog('Загрузка открытых заказов для legalPersonId:', legalPersonId);
            const ordersData = await searchOrders(legalPersonId);

            if (!ordersData || !ordersData.data || ordersData.data.length === 0) {
                debugLog('Нет открытых заказов');
                ordersLoaded = true;
                ordersCache[cacheKey] = {};
                ordersCache[`${cacheKey}_timestamp`] = now;
                GM_setValue('ordersCache', ordersCache);
                return;
            }

            debugLog('Найдено заказов:', ordersData.data.length);
            ordersByMarkCode = {};

            const BATCH_SIZE = 3;
            for (let i = 0; i < ordersData.data.length; i += BATCH_SIZE) {
                const batch = ordersData.data.slice(i, i + BATCH_SIZE);
                await Promise.all(
                    batch.map(order => processOrder(order.DT_RowId, legalPersonId))
                );

                if (i + BATCH_SIZE < ordersData.data.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            ordersLoaded = true;

            ordersCache[cacheKey] = ordersByMarkCode;
            ordersCache[`${cacheKey}_timestamp`] = now;
            GM_setValue('ordersCache', ordersCache);

            debugLog('Заказы обработаны и закэшированы');

        } catch (error) {
            debugLog('Ошибка загрузки заказов:', error);
            ordersLoaded = true;
        } finally {
            ordersLoading = false;
        }
    }

    function searchOrders(legalPersonId) {
        return new Promise((resolve, reject) => {
            const url = 'https://dxbx.ru/app/egaisorder/search';
            const postData = {
                "draw": 1,
                "columns": [
                    {"data":"identity","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"status","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"legalPerson","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"firstCloseAttemptDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"createDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
                    {"data":"creator","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}},
                    {"data":"updateDate","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}}
                ],
                "order": [{"column": 4, "dir": "desc"}],
                "start": 0,
                "length": 200,
                "search": {"value":"","regex":false},
                "model": "egaisorder",
                "searchFormName": "egaisorder.default",
                "simpleCrit": {
                    "crits": [{
                        "attr": "legalPerson",
                        "value": legalPersonId,
                        "oper": "EQUALS",
                        "clauses": [{
                            "oper": "AND",
                            "criterion": {
                                "attr": "status",
                                "value": ["CREATED"],
                                "oper": "IN",
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
                        resolve(data);
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

    async function processOrder(orderId, legalPersonId) {
        try {
            const orderItems = await getOrderItems(orderId);
            if (!orderItems || orderItems.length === 0) return;

            for (const item of orderItems) {
                await processOrderItem(item.id, orderId);
            }
        } catch (error) {
            debugLog('Ошибка обработки заказа:', error);
        }
    }

    async function getOrderItems(orderId) {
        return new Promise((resolve) => {
            const url = `https://dxbx.ru/app/edit/egaisorder/${orderId}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const itemRows = doc.querySelectorAll('tr.clickable-row[data-href*="egaisorderitem"]');
                            const items = [];

                            for (const row of itemRows) {
                                const href = row.getAttribute('data-href');
                                const match = href.match(/egaisorderitem\/(\d+)/);
                                if (match && match[1]) {
                                    items.push({ id: match[1], orderId: orderId });
                                }
                            }

                            resolve(items);
                        } catch (error) {
                            resolve([]);
                        }
                    } else {
                        resolve([]);
                    }
                },
                onerror: function() {
                    resolve([]);
                }
            });
        });
    }

   async function processOrderItem(itemId, orderId) {
    try {
        debugLog('Обработка элемента заказа:', {itemId, orderId});
        const itemDetails = await getOrderItemDetails(itemId, orderId);

        if (itemDetails && itemDetails.bottles) {
            debugLog('Найдены бутылки в заказе:', itemDetails.bottles.length);
            debugLog('Номенклатура заказа:', itemDetails.nomenclature);

            for (const bottle of itemDetails.bottles) {
                if (bottle.code) {
                    const shortCode = extractShortCode(bottle.code);

                    if (shortCode) {
                        if (!ordersByMarkCode[shortCode]) {
                            ordersByMarkCode[shortCode] = [];
                        }

                        const existingOrder = ordersByMarkCode[shortCode].find(o => o.orderId === orderId);
                        if (!existingOrder) {
                            ordersByMarkCode[shortCode].push({
                                orderId: orderId,
                                orderUrl: `https://dxbx.ru/index#app/edit/egaisorder/${orderId}`,
                                itemId: itemId,
                                nomenclature: itemDetails.nomenclature,
                                volume: bottle.volume || 'Не указано',
                                fullMarkCode: bottle.code
                            });

                            debugLog('Добавлен заказ для короткого кода:', {
                                shortCode: shortCode,
                                nomenclature: itemDetails.nomenclature
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        debugLog('Ошибка обработки элемента заказа:', error);
    }
}

    function extractShortCode(fullMarkCode) {
        if (!fullMarkCode) return null;

        const trimmedCode = fullMarkCode.trim();

        const elevenDigitMatch = trimmedCode.match(/\d{11}/);
        if (elevenDigitMatch) {
            return elevenDigitMatch[0];
        }

        const thirteenDigitMatch = trimmedCode.match(/\d{13}/);
        if (thirteenDigitMatch) {
            return thirteenDigitMatch[0];
        }

        if (trimmedCode.length <= 13) {
            return trimmedCode;
        }

        const digitsFromStart = trimmedCode.match(/^\d+/);
        if (digitsFromStart && digitsFromStart[0].length >= 8) {
            return digitsFromStart[0];
        }

        return null;
    }



    async function getOrderItemDetails(itemId, orderId) {
    return new Promise((resolve) => {
        const url = `https://dxbx.ru/app/edit/egaisorderitem/${itemId}?ref=egaisorder/${orderId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const bottleRows = doc.querySelectorAll('tr.clickable-row[data-href*="egaisbottlerestreserve"]');
                        const bottles = [];

                        for (const row of bottleRows) {
                            const cells = row.querySelectorAll('td');
                            if (cells.length >= 2) {
                                const code = cells[1].textContent.trim();
                                const volume = cells.length >= 3 ? cells[2].textContent.trim() : 'Не указано';
                                bottles.push({ code: code, volume: volume });
                            }
                        }

                        let nomenclature = 'Не указано';
                        const nomenclatureElement = doc.querySelector('#fgr_nomenclature .label.label-white.label-custom');
                        if (nomenclatureElement) {
                            nomenclature = nomenclatureElement.textContent.trim();
                            nomenclature = nomenclature.replace(/\s+/g, ' ').trim();
                        }

                        resolve({ bottles: bottles, nomenclature: nomenclature });
                    } catch (error) {
                        resolve({ bottles: [] });
                    }
                } else {
                    resolve({ bottles: [] });
                }
            },
            onerror: function() {
                resolve({ bottles: [] });
            }
        });
    });
    }
       function createOrdersModal() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay orders-overlay';
        overlay.addEventListener('click', closeOrdersModal);

        const modal = document.createElement('div');
        modal.className = 'orders-modal';

        const header = document.createElement('div');
        header.className = 'modal-header';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'modal-title-container';

        const title = document.createElement('h3');
        title.className = 'modal-title';
        title.textContent = 'Проверка открытых заказов';

        const subtitle = document.createElement('div');
        subtitle.className = 'modal-subtitle';
        subtitle.textContent = 'testbuild';

        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeOrdersModal);

        header.appendChild(titleContainer);
        header.appendChild(closeButton);

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = '<div class="loading-spinner">Загрузка заказов...</div>';

        modal.appendChild(header);
        modal.appendChild(content);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        return modal;
    }

    function openOrdersModal() {
    const overlay = document.querySelector('.orders-overlay');
    const modal = document.querySelector('.orders-modal');

    if (!overlay || !modal) {
        createOrdersModal();
        openOrdersModal();
        return;
    }

    overlay.classList.add('active');
    modal.classList.add('active');

    displayOrdersInModal();
}

function closeOrdersModal() {
    const overlay = document.querySelector('.orders-overlay');
    const modal = document.querySelector('.orders-modal');

    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');

}

function closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        const modal = document.querySelector('.nomenclature-modal');

        if (overlay) overlay.classList.remove('active');
        if (modal) modal.classList.remove('active');

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
            alkoCode: '',
            tzStatus: 'all',
            markSearch: '',
            sortField: 'nomenclature',
            sortDirection: 'asc'
        };
        allBottlesData = [];
        selectedBottles.clear();
    }

function reloadOrders(legalPersonId) {
        debugLog('Принудительная перезагрузка заказов...');
        ordersByMarkCode = {};
        bottleCheckCache = {}; 
        return loadOpenOrders(legalPersonId, true);
    }

function addCheckOrdersButton() {
    if (!isTargetPage()) return;
    if (!legalPersonId) return;

    const tableWrapper = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
    if (!tableWrapper) return;

    const form = document.querySelector('form.ant-form');
    if (!form) return;

    if (form.querySelector('.orders-buttons-container')) {
        return;
    }

    const ordersContainer = document.createElement('div');
    ordersContainer.className = 'orders-buttons-container';
    ordersContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-left: 8px; margin-bottom: 16px;';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'check-orders-button';
    button.textContent = 'Проверить заказы';
    button.title = 'Показать открытые заказы и сопоставление с бутылками';

    button.addEventListener('click', async () => {
        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
        if (!currentLegalPersonId) {
            alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.');
            return;
        }

        openOrdersModal();

        if (!ordersLoaded && !ordersLoading) {
            debugLog('Начало загрузки заказов по кнопке...');
            await loadOpenOrders(currentLegalPersonId);
        } else if (ordersLoading) {
            debugLog('Заказы уже загружаются...');
        } else {
            debugLog('Заказы уже загружены, показываем результаты...');
        }

        displayOrdersInModal();
    });

    const reloadButton = document.createElement('button');
    reloadButton.type = 'button';
    reloadButton.className = 'check-orders-button reload-orders-button';
    reloadButton.textContent = 'Обновить заказы';
    reloadButton.title = 'Перезагрузить данные заказов';
    reloadButton.style.marginLeft = '5px';
    reloadButton.style.backgroundColor = '#fa8c16';

    reloadButton.addEventListener('click', async () => {
        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
        if (!currentLegalPersonId) {
            alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.');
            return;
        }

        if (document.querySelector('.orders-modal.active')) {
            const content = document.querySelector('.orders-modal .modal-content');
            content.innerHTML = '<div class="loading-spinner">Перезагрузка заказов...</div>';
        }

        ordersLoaded = false;
        ordersLoading = false;
        await reloadOrders(currentLegalPersonId);

        if (document.querySelector('.orders-modal.active')) {
            displayOrdersInModal();
        }
    });

    ordersContainer.appendChild(button);
    ordersContainer.appendChild(reloadButton);

    const manualSearch = form.querySelector('.manual-search-container');
    if (manualSearch && manualSearch.nextSibling) {
        form.insertBefore(ordersContainer, manualSearch.nextSibling);
    } else {
        const segmentedControl = form.querySelector('.ant-segmented');
        if (segmentedControl && segmentedControl.nextSibling) {
            form.insertBefore(ordersContainer, segmentedControl.nextSibling);
        } else {
            form.insertBefore(ordersContainer, tableWrapper);
        }
    }
}


async function displayOrdersInModal() {
        const content = document.querySelector('.orders-modal .modal-content');

        if (ordersLoading) {
            content.innerHTML = '<div class="loading-spinner">Загрузка заказов...</div>';
            return;
        }

        if (!ordersLoaded) {
            content.innerHTML = `
                <div class="loading-spinner">
                    Заказы еще не загружены. Нажмите "Проверить заказы" для начала загрузки.
                    <div style="font-size: 12px; margin-top: 10px; color: #999;">
                        Это может занять несколько секунд
                    </div>
                </div>
            `;
            return;
        }

        if (Object.keys(ordersByMarkCode).length === 0) {
            content.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Нет открытых заказов</div>';
            return;
        }


    let totalOrders = 0;
    let totalBottles = 0;
    let foundBottles = 0;
    const orderMap = new Map();

    for (const [shortCode, orders] of Object.entries(ordersByMarkCode)) {
        for (const order of orders) {
            if (!orderMap.has(order.orderId)) {
                orderMap.set(order.orderId, {
                    ...order,
                    bottles: []
                });
            }
            const orderData = orderMap.get(order.orderId);
            orderData.bottles.push({
                shortCode: shortCode,
                fullMarkCode: order.fullMarkCode,
                volume: order.volume,
                nomenclature: order.nomenclature
            });
            totalBottles++;
        }
    }

    totalOrders = orderMap.size;

    let html = `
        <div class="orders-summary">
            <div class="summary-stats">
                <div class="summary-stat">Всего заказов: <span class="summary-value">${totalOrders}</span></div>
                <div class="summary-stat">Всего бутылок: <span class="summary-value">${totalBottles}</span></div>
                <div class="summary-stat">Найдено бутылок: <span id="found-bottles-count" class="summary-value">0</span></div>
                <div class="summary-stat">Процент найденных: <span id="found-percentage" class="summary-value">0%</span></div>
            </div>
        </div>
        <div id="orders-content">
            <div class="loading-spinner">Проверка наличия бутылок...</div>
        </div>
    `;

    content.innerHTML = html;

    const checkBottles = async () => {
        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
        if (!currentLegalPersonId) {
            document.getElementById('orders-content').innerHTML = '<div class="error-message">Ошибка: не удалось определить legalPersonId</div>';
            return;
        }

        let checkedBottles = 0;
        let currentFoundBottles = 0;

        let ordersHTML = '';

        for (const [orderId, orderData] of orderMap) {
            let orderHTML = `
                <div class="order-item">
                    <div class="order-header">
                        <a class="order-title" href="${orderData.orderUrl}" target="_blank">
                            Заказ #${orderId}
                        </a>
                        <span class="order-status status-created">CREATED</span>
                    </div>
                    <div class="order-details">
                        <div><strong>Номенклатура ресторана:</strong> ${orderData.nomenclature}</div>
                        <div style="margin-top: 8px;"><strong>Бутылки в заказе:</strong></div>
            `;

            for (const bottle of orderData.bottles) {
                try {
                    const bottleInfo = await getBottleInfoByShortCode(bottle.shortCode, currentLegalPersonId);
                    bottle.found = bottleInfo.found;
                    bottle.bottleInfo = bottleInfo;

                    if (bottleInfo.found) {
                        currentFoundBottles++;
                        orderHTML += `
                            <div class="order-bottle">
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                        <a class="modal-link" href="${bottle.bottleInfo.bottleUrl}" target="_blank" style="font-weight: 600;">
                                            ${bottle.shortCode}
                                        </a>
                                        <span class="bottle-match match-found">✓ Найдена</span>
                                    </div>
                                    <div style="font-size: 11px; color: #666;">
                                        <div><strong>Номенклатура:</strong> ${bottle.bottleInfo.nomenclature}</div>
                                        <div><strong>Объем:</strong> ${bottle.volume} мл</div>
                                        <div><strong>Полная марка:</strong> ${bottle.fullMarkCode}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        orderHTML += `
                            <div class="order-bottle">
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                        <span class="bottle-code" style="font-weight: 600;">${bottle.shortCode}</span>
                                        <span class="bottle-match match-not-found">✗ Не найдена</span>
                                    </div>
                                    <div style="font-size: 11px; color: #666;">
                                        <div><strong>Объем:</strong> ${bottle.volume} мл</div>
                                        <div><strong>Полная марка:</strong> ${bottle.fullMarkCode}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                    checkedBottles++;

                    document.getElementById('found-bottles-count').textContent = currentFoundBottles;
                    document.getElementById('found-percentage').textContent =
                        totalBottles > 0 ? Math.round((currentFoundBottles / totalBottles) * 100) + '%' : '0%';

                    await new Promise(resolve => setTimeout(resolve, 50));

                } catch (error) {
                    bottle.found = false;
                    bottle.bottleInfo = null;
                    checkedBottles++;
                }
            }

            orderHTML += `</div></div>`;
            ordersHTML += orderHTML;

            document.getElementById('orders-content').innerHTML = ordersHTML;
        }

        foundBottles = currentFoundBottles;
        document.getElementById('found-bottles-count').textContent = foundBottles;
        document.getElementById('found-percentage').textContent =
            totalBottles > 0 ? Math.round((foundBottles / totalBottles) * 100) + '%' : '0%';
    };

    checkBottles();
    await displayOrdersContent();
}

    async function displayOrdersContent() {
        const content = document.querySelector('.orders-modal .modal-content');

        let totalOrders = 0;
        let totalBottles = 0;
        const orderMap = new Map();

        for (const [shortCode, orders] of Object.entries(ordersByMarkCode)) {
            for (const order of orders) {
                if (!orderMap.has(order.orderId)) {
                    orderMap.set(order.orderId, {
                        ...order,
                        bottles: []
                    });
                }
                const orderData = orderMap.get(order.orderId);
                orderData.bottles.push({
                    shortCode: shortCode,
                    fullMarkCode: order.fullMarkCode,
                    volume: order.volume,
                    nomenclature: order.nomenclature
                });
                totalBottles++;
            }
        }

        totalOrders = orderMap.size;

        let html = `
            <div class="orders-summary">
                <div class="summary-stats">
                    <div class="summary-stat">Всего заказов: <span class="summary-value">${totalOrders}</span></div>
                    <div class="summary-stat">Всего бутылок: <span class="summary-value">${totalBottles}</span></div>
                    <div class="summary-stat">Найдено бутылок: <span id="found-bottles-count" class="summary-value">0</span></div>
                    <div class="summary-stat">Процент найденных: <span id="found-percentage" class="summary-value">0%</span></div>
                </div>
            </div>
            <div id="orders-content">
                <div class="loading-spinner">Проверка наличия бутылок...</div>
            </div>
        `;

        content.innerHTML = html;

        await checkBottlesWithCache(orderMap, totalBottles);
    }

    async function checkBottlesWithCache(orderMap, totalBottles) {
        const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
        if (!currentLegalPersonId) {
            document.getElementById('orders-content').innerHTML = '<div class="error-message">Ошибка: не удалось определить legalPersonId</div>';
            return;
        }

        let checkedBottles = 0;
        let currentFoundBottles = 0;
        let ordersHTML = '';

        for (const [orderId, orderData] of orderMap) {
            let orderHTML = `
                <div class="order-item">
                    <div class="order-header">
                        <a class="order-title" href="${orderData.orderUrl}" target="_blank">
                            Заказ #${orderId}
                        </a>
                        <span class="order-status status-created">CREATED</span>
                    </div>
                    <div class="order-details">
                        <div><strong>Номенклатура ресторана:</strong> ${orderData.nomenclature}</div>
                        <div style="margin-top: 8px;"><strong>Бутылки в заказе:</strong></div>
            `;

            for (const bottle of orderData.bottles) {
                const cacheKey = `${currentLegalPersonId}_${bottle.shortCode}`;

                if (bottleCheckCache[cacheKey] !== undefined) {
                    bottle.found = bottleCheckCache[cacheKey].found;
                    bottle.bottleInfo = bottleCheckCache[cacheKey].bottleInfo;
                } else {
                    try {
                        const bottleInfo = await getBottleInfoByShortCode(bottle.shortCode, currentLegalPersonId);
                        bottle.found = bottleInfo.found;
                        bottle.bottleInfo = bottleInfo;
                        bottleCheckCache[cacheKey] = { found: bottleInfo.found, bottleInfo: bottleInfo };
                    } catch (error) {
                        bottle.found = false;
                        bottle.bottleInfo = null;
                    }
                }

                if (bottle.found) {
                    currentFoundBottles++;
                    orderHTML += `
                        <div class="order-bottle">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <a class="modal-link" href="${bottle.bottleInfo.bottleUrl}" target="_blank" style="font-weight: 600;">
                                        ${bottle.shortCode}
                                    </a>
                                    <span class="bottle-match match-found">✓ Найдена</span>
                                </div>
                                <div style="font-size: 11px; color: #666;">
                                    <div><strong>Номенклатура:</strong> ${bottle.bottleInfo.nomenclature}</div>
                                    <div><strong>Объем:</strong> ${bottle.volume} мл</div>
                                    <div><strong>Полная марка:</strong> ${bottle.fullMarkCode}</div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    orderHTML += `
                        <div class="order-bottle">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <span class="bottle-code" style="font-weight: 600;">${bottle.shortCode}</span>
                                    <span class="bottle-match match-not-found">✗ Не найдена</span>
                                </div>
                                <div style="font-size: 11px; color: #666;">
                                    <div><strong>Объем:</strong> ${bottle.volume} мл</div>
                                    <div><strong>Полная марка:</strong> ${bottle.fullMarkCode}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                checkedBottles++;

                document.getElementById('found-bottles-count').textContent = currentFoundBottles;
                document.getElementById('found-percentage').textContent =
                    totalBottles > 0 ? Math.round((currentFoundBottles / totalBottles) * 100) + '%' : '0%';

                await new Promise(resolve => setTimeout(resolve, 30));
            }

            orderHTML += `</div></div>`;
            ordersHTML += orderHTML;
            document.getElementById('orders-content').innerHTML = ordersHTML;
        }

        document.getElementById('found-bottles-count').textContent = currentFoundBottles;
        document.getElementById('found-percentage').textContent =
            totalBottles > 0 ? Math.round((currentFoundBottles / totalBottles) * 100) + '%' : '0%';
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
        async function getBottleInfoByShortCode(shortCode, legalPersonId) {
    return new Promise((resolve) => {
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
            "length": 10,
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
                            "attr": "shortMarkCode",
                            "value": shortCode,
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
                        const bottle = data.data[0];
                        resolve({
                            found: true,
                            bottleId: bottle.DT_RowId,
                            nomenclature: bottle.egaisNomenclatureInfo || 'Не указано',
                            shortMarkCode: bottle.shortMarkCode,
                            bottleUrl: `https://dxbx.ru/index#app/edit/egaisbottle/${bottle.DT_RowId}`
                        });
                    } else {
                        resolve({ found: false });
                    }
                } catch (error) {
                    resolve({ found: false });
                }
            },
            onerror: function() {
                resolve({ found: false });
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
                    <div class="stat-item">Уникальных алкокодов: <span class="stat-value" id="alko-count">0</span></div>
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
                    <div class="quick-filter" data-filter="alko-code">По алкокоду</div>
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
                        <label class="filter-label">Алкокод</label>
                        <select class="filter-select" id="alko-code-filter">
                            <option value="">Все алкокоды</option>
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
                            <option value="alkoCode">По алкокоду</option>
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
                    <button class="filter-button filter-export" id="export-data">Экспорт в XLS</button>
                    <button class="filter-button batch-action" id="toggle-selection">Режим выбора</button>
                </div>
            </div>
        `;
    }

    function extractAlkoCode(restsItem) {
        if (!restsItem) return '';
        const match = restsItem.match(/Алк\. код:\s*(\d+)/);
        return match ? match[1] : '';
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

        document.getElementById('toggle-selection').addEventListener('click', toggleSelectionMode);

        document.getElementById('select-all').addEventListener('click', selectAll);
        document.getElementById('deselect-all').addEventListener('click', deselectAll);
        document.getElementById('export-data').addEventListener('click', exportToXLSX);
    document.getElementById('export-selected').addEventListener('click', exportSelectedToXLSX);

        document.getElementById('nomenclature-filter').addEventListener('change', applyFilters);
        document.getElementById('volume-min').addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('volume-max').addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('tz-filter').addEventListener('change', applyFilters);
        document.getElementById('mark-search').addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('sort-field').addEventListener('change', applyFilters);
        document.getElementById('sort-direction').addEventListener('change', applyFilters);
        document.getElementById('alko-code-filter').addEventListener('change', applyFilters);
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
            case 'alko-code':
                const alkoSelect = document.getElementById('alko-code-filter');
                if (alkoSelect.options.length > 1) {
                    currentFilters.alkoCode = alkoSelect.options[1].value;
                }
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
        document.getElementById('alko-code-filter').value = currentFilters.alkoCode;
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
            alkoCode: document.getElementById('alko-code-filter').value,
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
            alkoCode: '',
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
        const alkoCodes = new Set();

        rows.forEach(row => {
            const nomenclature = row.getAttribute('data-nomenclature') || '';
            const volume = parseInt(row.getAttribute('data-volume') || 0);
            const tzStatus = row.getAttribute('data-tz-status') || '';
            const markInfo = (row.getAttribute('data-mark') || '').toLowerCase();
            const shortCode = (row.querySelector('td:nth-child(2)')?.textContent || '').toLowerCase();
            const alkoCode = row.getAttribute('data-alko-code') || '';

            let shouldShow = true;

            // Фильтр по номенклатуре
            if (currentFilters.nomenclature && nomenclature !== currentFilters.nomenclature) {
                shouldShow = false;
            }

            if (currentFilters.alkoCode && alkoCode !== currentFilters.alkoCode) {
                shouldShow = false;
            }

            // Фильтры по объему
            if (currentFilters.volumeMin && volume < parseInt(currentFilters.volumeMin)) {
                shouldShow = false;
            }

            if (currentFilters.volumeMax && volume > parseInt(currentFilters.volumeMax)) {
                shouldShow = false;
            }

            // Фильтр по статусу ТЗ
            if (currentFilters.tzStatus === 'yes' && tzStatus !== 'да') {
                shouldShow = false;
            }

            if (currentFilters.tzStatus === 'no' && tzStatus !== 'нет') {
                shouldShow = false;
            }

            // Фильтр по марке
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
                if (alkoCode) {
                    alkoCodes.add(alkoCode);
                }

                row.classList.add('highlight-row');
                setTimeout(() => row.classList.remove('highlight-row'), 1000);
            }
        });

        sortTable();
        updateStats(rows.length, visibleCount, tzCount, notTzCount,
                   volumeCount > 0 ? totalVolume / volumeCount : 0, alkoCodes.size);
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
                case 'alkoCode':
                    aValue = a.getAttribute('data-alko-code') || '';
                    bValue = b.getAttribute('data-alko-code') || '';
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

    function updateStats(total, filtered, tzCount, notTzCount, avgVolume, alkoCount) {
        document.getElementById('total-count').textContent = total;
        document.getElementById('filtered-count').textContent = filtered;
        document.getElementById('tz-count').textContent = tzCount;
        document.getElementById('not-tz-count').textContent = notTzCount;
        document.getElementById('avg-volume').textContent = Math.round(avgVolume);
        document.getElementById('alko-count').textContent = alkoCount;
    }


    function populateAlkoCodeFilter(bottles) {
        const select = document.getElementById('alko-code-filter');
        const alkoCodeSet = new Set();

        bottles.forEach(bottle => {
            const alkoCode = extractAlkoCode(bottle.restsItem);
            if (alkoCode) {
                alkoCodeSet.add(alkoCode);
            }
        });

        select.innerHTML = '<option value="">Все алкокоды</option>';
        Array.from(alkoCodeSet).sort().forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = code;
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

    async function prepareExportDataWithImages(rows) {
    const data = [];

    for (const row of rows) {
        if (row.style.display === 'none') continue;

        const cells = row.querySelectorAll('td');
        const fullMark = row.getAttribute('data-mark') || '';

        console.log('Обрабатываем строку, количество ячеек:', cells.length);
        cells.forEach((cell, index) => {
            console.log(`Ячейка ${index}:`, getCleanTextContent(cell).substring(0, 50) + '...');
        });

        const hasData = Array.from(cells).some(cell => {
            const text = getCleanTextContent(cell);
            return text && text !== 'Н/Д' && text !== 'Загрузка...' && text !== 'Ошибка' && text !== 'Проверка...';
        });

        if (!hasData && !fullMark) continue;

        let datamatrixImage = '';
        if (fullMark) {
            datamatrixImage = await generateDataMatrixBase64Large(fullMark);
        }
        data.push({
            nomenclature: getCleanTextContent(cells[0]) || '',
            shortCode: getCleanTextContent(cells[1]) || '',
            volume: extractVolumeText(cells[2]),
            alkoCode: row.getAttribute('data-alko-code') || '',
            fullMark: fullMark,
            tzStatus: extractTZStatusText(cells[5]),
            updateDate: getCleanTextContent(cells[6]) || '',
            datamatrixImage: datamatrixImage
        });

        console.log('Добавлены данные:', {
            nomenclature: getCleanTextContent(cells[0]),
            shortCode: getCleanTextContent(cells[1]),
            volume: extractVolumeText(cells[2]),
            tzStatus: extractTZStatusText(cells[5]),
            updateDate: getCleanTextContent(cells[6])
        });
    }

    return data;
}

function getCleanTextContent(element) {
    if (!element) return '';

    const clone = element.cloneNode(true);

    const elementsToRemove = clone.querySelectorAll(
        'button, .expand-toggle, .copy-mark, .generate-datamatrix, .volume-badge, .tz-status-modal, .modal-link'
    );
    elementsToRemove.forEach(el => el.remove());

    let text = clone.textContent || '';

    text = text.replace(/\s+/g, ' ').trim();

    return text;
}

function extractVolumeText(volumeCell) {
    if (!volumeCell) return '';

    const clone = volumeCell.cloneNode(true);

    const badge = clone.querySelector('.volume-badge');
    if (badge) {
        badge.remove();
    }

    let text = clone.textContent || '';
    text = text.replace(/\s+/g, ' ').trim();

    const volumeMatch = text.match(/(\d+)/);
    if (volumeMatch) {
        return volumeMatch[1];
    }

    return text;
}

function extractTZStatusText(tzCell) {
    if (!tzCell) return '';

    const statusElement = tzCell.querySelector('.tz-status-modal');
    if (statusElement) {
        const text = statusElement.textContent.trim();
        if (text.includes('В ТЗ ✓')) return 'В ТЗ';
        if (text.includes('Нет в ТЗ ✗')) return 'Не в ТЗ';
        if (text.includes('Проверка...')) return 'Проверка';
        return text;
    }

    return getCleanTextContent(tzCell);
}

async function exportToXLSX() {
    const rows = document.querySelectorAll('.modal-table tbody tr:not([style*="display: none"])');

    if (rows.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }

    const exportButton = document.getElementById('export-data');
    const originalText = exportButton.textContent;
    exportButton.textContent = 'Подготовка...';
    exportButton.disabled = true;

    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'EGAIS Script';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Бутылки');

        worksheet.columns = [
            { header: 'Номенклатура', key: 'nomenclature', width: 40 },
            { header: 'Короткий код', key: 'shortCode', width: 15 },
            { header: 'Объем (мл)', key: 'volume', width: 10 },
            { header: 'Алкокод', key: 'alkoCode', width: 12 },
            { header: 'Статус ТЗ', key: 'tzStatus', width: 12 },
            { header: 'Дата обновления', key: 'updateDate', width: 15 },
            { header: 'Полная марка', key: 'fullMark', width: 50 },
            { header: 'DataMatrix', key: 'datamatrix', width: 30 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        headerRow.height = 25;
        const data = await prepareExportDataWithImages(rows);

        const filteredData = data.filter(item =>
            item.nomenclature ||
            item.shortCode ||
            item.volume ||
            item.alkoCode ||
            item.fullMark
        );

        console.log('Всего данных:', data.length, 'После фильтрации:', filteredData.length);

        const addedRows = [];
        for (let i = 0; i < filteredData.length; i++) {
            const item = filteredData[i];

            const row = worksheet.addRow({
                nomenclature: item.nomenclature,
                shortCode: item.shortCode,
                volume: item.volume,
                alkoCode: item.alkoCode,
                tzStatus: item.tzStatus,
                updateDate: item.updateDate,
                fullMark: item.fullMark
            });


            row.height = 120;
            addedRows.push({ row, item });
        }


        for (let i = 0; i < addedRows.length; i++) {
            const { row, item } = addedRows[i];
            if (item.datamatrixImage && item.fullMark) {
                try {
                    const imageId = workbook.addImage({
                        base64: item.datamatrixImage,
                        extension: 'png'
                    });
                    const rowNumber = row.number;

                    worksheet.addImage(imageId, {
                        tl: { col: 7, row: rowNumber - 1, offset: 5 },
                        br: { col: 8, row: rowNumber, offset: -5 },
                        editAs: 'oneCell'
                    });

                    console.log('Добавлено изображение для строки', rowNumber, 'данные:', i);

                } catch (error) {
                    console.error('Ошибка вставки изображения для строки', i + 2, ':', error);
                }
            }
        }

        const statsSheet = workbook.addWorksheet('Статистика');
        statsSheet.columns = [
            { header: 'Параметр', key: 'param', width: 25 },
            { header: 'Значение', key: 'value', width: 20 }
        ];

        const statsData = [
            { param: 'Дата экспорта', value: new Date().toLocaleString('ru-RU') },
            { param: 'Всего записей', value: filteredData.length },
            { param: 'В ТЗ', value: filteredData.filter(item => item.tzStatus === 'В ТЗ').length },
            { param: 'Не в ТЗ', value: filteredData.filter(item => item.tzStatus === 'Не в ТЗ').length },
            { param: 'Средний объем', value: Math.round(filteredData.reduce((sum, item) => sum + (parseInt(item.volume) || 0), 0) / Math.max(filteredData.length, 1)) + ' мл' }
        ];

        statsData.forEach(stat => {
            statsSheet.addRow(stat);
        });

        statsSheet.getRow(1).font = { bold: true };
        statsSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0F8FF' }
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const fileName = `бутылки_${new Date().toISOString().split('T')[0]}.xlsx`;
        saveAs(blob, fileName);
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте: ' + error.message);
    } finally {
        exportButton.textContent = originalText;
        exportButton.disabled = false;
    }
}

async function exportSelectedToXLSX() {
    const rows = document.querySelectorAll('.modal-table tbody tr');
    const selectedRows = Array.from(rows).filter(row => {
        const bottleId = row.getAttribute('data-bottle-id');
        return selectedBottles.has(bottleId);
    });

    if (selectedRows.length === 0) {
        alert('Не выбрано ни одной бутылки для экспорта');
        return;
    }

    const exportButton = document.getElementById('export-selected');
    const originalText = exportButton.textContent;
    exportButton.textContent = 'Подготовка...';
    exportButton.disabled = true;

    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'EGAIS Script';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Выбранные бутылки');

        worksheet.columns = [
            { header: 'Номенклатура', key: 'nomenclature', width: 40 },
            { header: 'Короткий код', key: 'shortCode', width: 15 },
            { header: 'Объем (мл)', key: 'volume', width: 10 },
            { header: 'Алкокод', key: 'alkoCode', width: 12 },
            { header: 'Статус ТЗ', key: 'tzStatus', width: 12 },
            { header: 'Дата обновления', key: 'updateDate', width: 15 },
            { header: 'Полная марка', key: 'fullMark', width: 50 },
            { header: 'DataMatrix', key: 'datamatrix', width: 30 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        headerRow.height = 25;

        const data = await prepareExportDataWithImages(selectedRows);

        const filteredData = data.filter(item =>
            item.nomenclature ||
            item.shortCode ||
            item.volume ||
            item.alkoCode ||
            item.fullMark
        );

        for (let i = 0; i < filteredData.length; i++) {
            const item = filteredData[i];
            const row = worksheet.addRow({
                nomenclature: item.nomenclature,
                shortCode: item.shortCode,
                volume: item.volume,
                alkoCode: item.alkoCode,
                tzStatus: item.tzStatus,
                updateDate: item.updateDate,
                fullMark: item.fullMark
            });

            row.height = 120;

            if (item.datamatrixImage && item.fullMark) {
                try {
                    const imageId = workbook.addImage({
                        base64: item.datamatrixImage,
                        extension: 'png'
                    });

                    const rowNumber = row.number;

                    worksheet.addImage(imageId, {
                        tl: { col: 7, row: rowNumber - 1, offset: 5 },
                        br: { col: 8, row: rowNumber, offset: -5 },
                        editAs: 'oneCell'
                    });

                    console.log('Добавлено изображение для выбранной строки', rowNumber);

                } catch (error) {
                    console.error('Ошибка вставки изображения:', error);
                }
            }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const fileName = `выбранные_бутылки_${new Date().toISOString().split('T')[0]}.xlsx`;
        saveAs(blob, fileName);

    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте: ' + error.message);
    } finally {
        exportButton.textContent = originalText;
        exportButton.disabled = false;
    }
}
    function generateDataMatrixBase64Large(markCode) {
    return new Promise((resolve) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 400;
            canvas.height = 400;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: markCode,
                scale: 6,
                height: 60,
                width: 60,
                includetext: false,
            });

            const dataURL = canvas.toDataURL('image/png');
            const base64 = dataURL.replace(/^data:image\/png;base64,/, '');
            resolve(base64);

        } catch (error) {
            console.error('Ошибка генерации DataMatrix:', error);
            resolve('');
        }
    });
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
                        <th class="sortable-header" data-sort="alkoCode">Алкокод</th>
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
            const alkoCode = extractAlkoCode(bottle.restsItem);

            tableHTML += `
                <tr data-bottle-id="${bottle.DT_RowId}" data-nomenclature="${nomenclatureName}" data-alko-code="${alkoCode}">
                    <td>${nomenclatureName}</td>
                    <td>${bottle.title || 'Н/Д'}</td>
                    <td class="volume-cell" data-bottle-id="${bottle.DT_RowId}">
                        <span class="volume-loading">Загрузка...</span>
                    </td>
                    <td class="alko-code-cell">${alkoCode || 'Н/Д'}</td>
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
        populateAlkoCodeFilter(activeBottles);
        await loadBottleDetails();
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

    const strongAlcoholTable = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
    if (!strongAlcoholTable) {
        debugLog('Таблица не найдена');
        return;
    }

    const mainTable = strongAlcoholTable.querySelector('.ant-table-tbody');
    if (!mainTable) {
        debugLog('Основное тело таблицы не найдено');
        return;
    }

    const rows = mainTable.querySelectorAll('tr.ant-table-row.ant-table-row-level-0:not(.ant-table-expanded-row)');
    debugLog(`Найдено основных строк верхнего уровня: ${rows.length}`);

    let buttonsAdded = 0;

    rows.forEach(row => {
        const isMainTableRow = !row.closest('.restsstyled__ExpandedTableWrapper-sc-1oz76wz-5');
        if (!isMainTableRow) return;

        const cells = row.querySelectorAll('.ant-table-cell');
        debugLog(`Количество ячеек в строке: ${cells.length}`);
        cells.forEach((cell, index) => {
            debugLog(`Ячейка ${index}: "${cell.textContent.trim().substring(0, 50)}..."`);
        });

        if (cells.length >= 3) {
            const alkoCodeCell = cells[1];
            const nomenclatureCell = cells[2];

            const alkoCode = alkoCodeCell.textContent.trim();
            let nomenclature = nomenclatureCell.textContent.trim();

            debugLog(`Обрабатываем: алкокод="${alkoCode}", номенклатура="${nomenclature.substring(0, 50)}..."`);

            if (nomenclature &&
                nomenclature.length > 10 &&
                !nomenclature.match(/^\d+$/) &&
                !nomenclatureCell.querySelector('.nomenclature-button')) {

                const existingButtons = nomenclatureCell.querySelectorAll('.nomenclature-button');
                existingButtons.forEach(btn => btn.remove());

                const button = document.createElement('button');
                button.className = 'nomenclature-button';
                button.textContent = 'Поиск бутылок';
                button.title = `Найти активные бутылки для: ${nomenclature}`;

                button.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    const currentLegalPersonId = legalPersonId || GM_getValue('legalPersonId');
                    if (!currentLegalPersonId) {
                        alert('Не удалось определить legalPersonId. Пожалуйста, обновите страницу.');
                        return;
                    }

                    openModal(nomenclature, alkoCode);

                    const content = document.querySelector('.modal-content');
                    content.innerHTML = '<div class="loading-spinner">Поиск активных бутылок...</div>';

                    try {
                        const results = await searchBottlesByNomenclature(nomenclature, currentLegalPersonId);
                        await displayResultsInModal(results, nomenclature, currentLegalPersonId, alkoCode);
                    } catch (error) {
                        console.error('Ошибка поиска:', error);
                        content.innerHTML = `
                            <div class="error-message">
                                Ошибка при поиске бутылок: ${error.message}<br>
                                <small>Попробуйте обновить страницу и повторить попытку</small>
                                ${alkoCode ? `<br>Алкокод: ${alkoCode}` : ''}
                            </div>
                        `;
                    }
                });

                nomenclatureCell.appendChild(button);
                buttonsAdded++;
                debugLog(`Добавлена кнопка для номенклатуры: ${nomenclature.substring(0, 50)}...`);
            } else {
                debugLog(`Пропуск: "${nomenclature}" - не подходит под критерии номенклатуры`);
            }
        }
    });

    debugLog(`Итого добавлено кнопок номенклатуры: ${buttonsAdded}`);
}

    function addManualSearchButton() {
    if (!isTargetPage()) return;

    const tableWrapper = document.querySelector('.ant-table-wrapper.strong-tablestyled__StyledTable-sc-1ppi8vp-0');
    if (!tableWrapper) return;
    const form = document.querySelector('form.ant-form');
    if (!form) return;

    if (form.querySelector('.manual-search-container')) {
        return;
    }

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
    const segmentedControl = form.querySelector('.ant-segmented');
    if (segmentedControl && segmentedControl.nextSibling) {
        form.insertBefore(searchContainer, segmentedControl.nextSibling);
    } else {
        form.insertBefore(searchContainer, tableWrapper);
    }
}

  async function addEgaisButtons() {
    if (!isTargetPage()) return;

    const markElements = document.querySelectorAll('.strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1.gOhuPU');

    for (const markElement of markElements) {
        if (markElement.offsetParent !== null) {
            const existingContainer = markElement.parentNode.querySelector('.egais-buttons-container');
            if (existingContainer) continue;

            const markCode = markElement.textContent.trim();

            const container = document.createElement('div');
            container.className = 'egais-buttons-container';
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
            markElement.parentNode.insertBefore(container, markElement.nextSibling);

            await Promise.all([
                loadShortMarkCode(markCode, shortMarkCodeElement),
                checkTZStatus(markCode, tzStatus)
            ]);
        }
    }

    const markCells = document.querySelectorAll('.ant-table-cell .strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1');
    markCells.forEach(cell => {
        const nomenclatureButtons = cell.parentNode.querySelectorAll('.nomenclature-button');
        nomenclatureButtons.forEach(btn => btn.remove());
    });
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
    codeText.style.cssText = 'font-family: monospace; font-size: 12px; margin: 10px 0; word-break: break-all; padding: 8px; background: #f5f5f5; border-radius: 4px;';
    modal.appendChild(codeText);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; gap: 8px; justify-content: center; margin-top: 15px;';

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Копировать изображение';
    copyButton.style.cssText = `
        padding: 8px 16px;
        background-color: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.style.cssText = `
        padding: 8px 16px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;
    closeButton.addEventListener('click', () => {
        modal.remove();
        overlay.remove();
    });

    buttonsContainer.appendChild(copyButton);
    buttonsContainer.appendChild(closeButton);
    modal.appendChild(buttonsContainer);

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
        canvas.id = 'datamatrix-canvas';
        dmContainer.appendChild(canvas);

        bwipjs.toCanvas(canvas, {
            bcid: 'datamatrix',
            text: markCode,
            scale: 3,
            height: 30,
            includetext: false,
        });

        copyButton.addEventListener('click', async () => {
            try {
                const originalCanvas = document.getElementById('datamatrix-canvas');

                const borderSize = 25;
                const borderedCanvas = document.createElement('canvas');
                const ctx = borderedCanvas.getContext('2d');

                borderedCanvas.width = originalCanvas.width + (borderSize * 2);
                borderedCanvas.height = originalCanvas.height + (borderSize * 2);

                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height);

                ctx.drawImage(originalCanvas, borderSize, borderSize);

                borderedCanvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({
                                [blob.type]: blob
                            })
                        ]);

                        const originalText = copyButton.textContent;
                        copyButton.textContent = 'Скопировано!';
                        copyButton.style.backgroundColor = '#52c41a';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                            copyButton.style.backgroundColor = '#1890ff';
                        }, 2000);

                    } catch (err) {
                        console.error('Ошибка копирования:', err);
                        fallbackCopyImage(borderedCanvas);
                    }
                }, 'image/png');

            } catch (error) {
                console.error('Ошибка:', error);
                copyButton.textContent = 'Ошибка!';
                copyButton.style.backgroundColor = '#ff4d4f';
                setTimeout(() => {
                    copyButton.textContent = 'Копировать изображение';
                    copyButton.style.backgroundColor = '#1890ff';
                }, 2000);
            }
        });

    } catch (error) {
        console.error('Ошибка генерации DataMatrix:', error);
        dmContainer.innerHTML = '<div style="color: red;">Ошибка генерации кода: ' + error.message + '</div>';

        copyButton.disabled = true;
        copyButton.textContent = 'Ошибка генерации';
        copyButton.style.backgroundColor = '#ccc';
    }
}

function fallbackCopyImage(canvas) {
    try {
        const tempImg = document.createElement('img');
        tempImg.src = canvas.toDataURL('image/png');

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.appendChild(tempImg);
        document.body.appendChild(tempDiv);

        const range = document.createRange();
        range.selectNode(tempImg);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        const successful = document.execCommand('copy');

        selection.removeAllRanges();
        document.body.removeChild(tempDiv);

        if (successful) {
            return true;
        } else {
            throw new Error('execCommand не сработал');
        }
    } catch (err) {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'datamatrix_with_borders.png';
        link.href = dataURL;
        link.click();

        alert('Изображение не удалось скопировать в буфер обмена. Оно было сохранено как файл. Вы можете вручную вставить его из папки загрузок.');
        return false;
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
    const targetNode = document.querySelector('.restsstyled__Wrapper-sc-1oz76wz-0') || document.body;
    if (!targetNode) {
        setTimeout(observeDOM, 1000);
        return;
    }

    debugLog('Начинаем наблюдение за DOM...');

    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.querySelector && (
                            node.querySelector('.ant-table-row.ant-table-row-level-0') ||
                            node.querySelector('.strong-tablestyled__MarkItemWrapper') ||
                            node.querySelector('.ant-table-tbody') ||
                            node.classList?.contains('ant-table-wrapper')
                        )) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                }
            }
        });

        if (shouldUpdate) {
            debugLog('Обнаружены изменения DOM, обновляем кнопки...');
            clearTimeout(window.egaisUpdateTimeout);
            window.egaisUpdateTimeout = setTimeout(() => {
                initializationInProgress = false;
                initializeButtons();
            }, 1000);
        }
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

    setTimeout(initializeButtons, 2000);
    debugLog('DOM observer запущен');
}

    function initializeButtons() {
    if (initializationInProgress) return;
    initializationInProgress = true;

    debugLog('Начало инициализации кнопок...');

    try {
        const oldNomenclatureButtons = document.querySelectorAll('.nomenclature-button');
        oldNomenclatureButtons.forEach(button => {
            const parentCell = button.closest('.ant-table-cell');
            if (parentCell && !parentCell.querySelector('.strong-tablestyled__MarkItemWrapper-sc-1ppi8vp-1')) {
                button.remove();
            }
        });

        const oldEgaisContainers = document.querySelectorAll('.egais-buttons-container');
        oldEgaisContainers.forEach(container => container.remove());

        handleExpandButtons();
        addEgaisButtons();
        addNomenclatureButtons();
        addManualSearchButton();
        addCheckOrdersButton();

        debugLog('Кнопки успешно инициализированы');
    } catch (error) {
        debugLog('Ошибка инициализации кнопок:', error);
    } finally {
        initializationInProgress = false;
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
    debugLog('Скрипт инициализирован', { legalPersonId });

    interceptXHR();
    createModal();
    createOrdersModal();

    observeDOM();

    setInterval(handleExpandButtons, 3000);
    setInterval(() => {
        if (!initializationInProgress) {
            addEgaisButtons();
            addNomenclatureButtons();
        }
    }, 5000);

    debugLog('Все инициализаторы запущены');
}

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
