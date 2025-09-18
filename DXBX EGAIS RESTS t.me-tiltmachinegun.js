// ==UserScript==
// @name         DXBX EGAIS RESTS t.me/tiltmachinegun
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Добавляет кнопку перехода на страницу бутылок, проверяет наличие в ТЗ, отображает shortMarkCode и генерирует DataMatrix
// @author       t.me/tiltmachinegun
// @downloadUrl   https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/DXBX%20EGAIS%20RESTS%20t.me-tiltmachinegun.js
// @updateUrl     https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/DXBX%20EGAIS%20RESTS%20t.me-tiltmachinegun.js
// @match        https://dxbx.ru/fe/egais/rests*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @require      https://cdn.jsdelivr.net/npm/bwip-js@3.0.2/dist/bwip-js.min.js
// @connect      dxbx.ru
// ==/UserScript==

(function() {
    'use strict';

    let legalPersonId = null;
    const bottleCache = GM_getValue('bottleCache', {});

    function debugLog(message, data = null) {
        console.log('[EGAISTZ]', message, data || '');
        GM_log('[EGAISTZ] ' + message + (data ? ' ' + JSON.stringify(data) : ''));
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
            generateDataMatrix(markCode, button);
        });

        return button;
    }

    function generateDataMatrix(markCode, button) {
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
        observeDOM();
        handleExpandButtons();

        setInterval(handleExpandButtons, 2000);
        setInterval(addEgaisButtons, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
