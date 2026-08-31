# Third-party notices

## @zxing/library 0.21.3

DXBX Support Toolkit включает собранные части `@zxing/library` для локального чтения и генерации DataMatrix.

Copyright ZXing authors. Licensed under the Apache License, Version 2.0. Полный текст лицензии доступен в пакете `@zxing/library` и на <https://www.apache.org/licenses/LICENSE-2.0>.

Код ZXing встраивается в готовый userscript во время сборки и не загружается из CDN при работе скрипта.

## ZXing-C++ WASM decoder

Локальный декодер основан на ZXing-C++ и включает DataMatrix detector/sample-grid, unwarp и набор локальных препроцессов. Возвращаемый текст адаптирован так, чтобы FNC1 сохранялся как ASCII GS (`0x1D`).

Copyright ZXing-C++ authors and contributors. Licensed under the Apache License, Version 2.0.

## OpenCV 4.13.0

WASM-декодер статически собран с модулями OpenCV `core` и `imgproc` из tag `4.13.0` (commit `fe38fc608f6acb8b68953438a62305d8318f4fcd`).

Copyright OpenCV authors. Licensed under the Apache License, Version 2.0.

## ONNX Runtime Web 1.29.0

Локальные модели исполняются в браузере через `onnxruntime-web` с WebAssembly backend. JavaScript runtime встраивается в userscript, а WASM-бинарник устанавливается как content-addressed Tampermonkey resource.

Copyright Microsoft Corporation. Licensed under the MIT License.
