// ==UserScript==
// @name         DXBX EGAIS RESTS with Nomenclature Search
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Добавляет кнопку перехода на страницу бутылок, проверяет наличие в ТЗ, отображает shortMarkCode, генерирует DataMatrix и добавляет поиск по номенклатуре
// @author       t.me/tiltmachinegun
// @downloadUrl   https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/DXBX%20EGAIS%20RESTS%20with%20Nomenclature%20Search.js
// @updateUrl     https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/DXBX%20EGAIS%20RESTS%20with%20Nomenclature%20Search.js
// @match        https://dxbx.ru/fe/egais/rests*
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
            width: 90%;
            max-width: 1400px;
            max-height: 80vh;
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
        }

        .modal-table {
            width: 100%;
            border-collapse: collapse;
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




        .mark-info-cell:hover::after {
            content: attr(data-full-mark);
            position: absolute;
            left: 0;
            top: 100%;
            background: #fff;
            border: 1px solid #ddd;
            padding: 8px;
            z-index: 100;
            max-width: 500px;
            word-break: break-all;
            white-space: normal;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
    `);

    let legalPersonId = null;
    const bottleCache = GM_getValue('bottleCache', {});
    let csrfToken = null;

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

        const title = document.createElement('h3');
        title.className = 'modal-title';
        title.textContent = 'Поиск бутылок по номенклатуре';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeModal);

        header.appendChild(title);
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

    function openModal() {
        const overlay = document.querySelector('.modal-overlay');
        const modal = document.querySelector('.nomenclature-modal');

        overlay.classList.add('active');
        modal.classList.add('active');
    }

    function closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        const modal = document.querySelector('.nomenclature-modal');

        overlay.classList.remove('active');
        modal.classList.remove('active');
    }

    function searchBottlesByNomenclature(nomenclature, legalPersonId) {
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
                "start":0,
                "length":500,
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

            debugLog('Sending search request:', { nomenclature, legalPersonId });

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

        // Проверяем кэш
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

    async function displayResultsInModal(results, nomenclature, currentLegalPersonId) {
        const content = document.querySelector('.modal-content');

        if (!results || !results.data || results.data.length === 0) {
            content.innerHTML = `<div style="text-align: center; padding: 40px; color: #999;">
                Бутылки для номенклатуры "${nomenclature}" не найдены
            </div>`;
            return;
        }

        // Фильтруем только активные бутылки
        const activeBottles = results.data.filter(bottle => bottle.active === "Да");

        if (activeBottles.length === 0) {
            content.innerHTML = `<div style="text-align: center; padding: 40px; color: #999;">
                Активные бутылки для номенклатуры "${nomenclature}" не найдены<br>
                Всего найдено бутылок: ${results.data.length}<br>
                Активных: ${results.data.filter(b => b.active === "Да").length}
            </div>`;
            return;
        }

        // Сначала показываем таблицу с предварительными данными
        let tableHTML = `
    <div style="margin-bottom: 16px; font-weight: bold;">
        Найдено активных бутылок: ${activeBottles.length} из ${results.data.length}
    </div>
    <table class="modal-table">
        <thead>
            <tr>
                <th>Короткий код</th>
                <th>Расчетный остаток (мл)</th>
                <th>Полная марка</th>
                <th>В ТЗ</th>
                <th>Дата обновления</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
`;

        activeBottles.forEach(bottle => {
    const restMatch = bottle.restsItem && bottle.restsItem.match(/остаток:\s*([\d.]+)/);
    const restLiters = restMatch ? parseFloat(restMatch[1]) : 0;
    const restMl = restLiters * 1000;

    tableHTML += `
        <tr>
            <td>${bottle.title || 'Н/Д'}</td>
            <td class="volume-cell" data-bottle-id="${bottle.DT_RowId}">
                <span class="volume-loading">Загрузка...</span>
            </td>
            <td class="mark-info-cell" data-bottle-id="${bottle.DT_RowId}" data-full-mark="">
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
        content.innerHTML = tableHTML;

        // асинхронно загружаем точные объемы, марки и проверяем ТЗ
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
                            // Обновляем объем
                            cell.innerHTML = details.volume;

                            // Обновляем марку
                            const markCell = markCells[index];
                            markCell.setAttribute('data-full-mark', details.markInfo);
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

                            // Проверяем ТЗ
                            return checkTZStatusForBottle(details.markInfo, currentLegalPersonId)
                                .then(inTZ => {
                                    const tzCell = tzCells[index];
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

        // Ограничиваем количество одновременных запросов
        const MAX_CONCURRENT_REQUESTS = 3;
        for (let i = 0; i < promises.length; i += MAX_CONCURRENT_REQUESTS) {
            const chunk = promises.slice(i, i + MAX_CONCURRENT_REQUESTS);
            await Promise.all(chunk);
            // Добавляем небольшую задержку между группами запросов
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    function addNomenclatureButtons() {
        // Ищем только основные строки таблицы (не вложенные)
        const mainTable = document.querySelector('.ant-table-tbody:not(.restsstyled__ExpandedTableWrapper-sc-1oz76wz-5 .ant-table-tbody)');

        if (!mainTable) return;

        const rows = mainTable.querySelectorAll('.ant-table-row.ant-table-row-level-0');

        rows.forEach(row => {
            const cells = row.querySelectorAll('.ant-table-cell');
            if (cells.length >= 3) {
                // Проверяем, что это ячейка с номенклатурой (3-я колонка)
                const nomenclatureCell = cells[2];
                const nomenclature = nomenclatureCell.textContent.trim();

                // Проверяем, что это действительно номенклатура (не алкокод и не объем)
                // и кнопка еще не добавлена
                if (nomenclature &&
                    !nomenclatureCell.querySelector('.nomenclature-button') &&
                    !nomenclature.match(/^\d+\.\d+$/) && // не объем
                    !nomenclature.match(/^[A-F0-9-]+$/) && // не справка (FA-, FB-)
                    !nomenclature.match(/^\d{11,}$/) && // не алкокод
                    nomenclature.length > 5) { // не слишком короткий текст

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

                        openModal();

                        const modalTitle = document.querySelector('.modal-title');
                        modalTitle.textContent = `Поиск бутылок: ${nomenclature}`;

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

                    nomenclatureCell.appendChild(button);
                }
            }
        });
    }

    async function addEgaisButtons() {
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

                // Загружаем shortMarkCode и проверяем ТЗ одновременно
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
