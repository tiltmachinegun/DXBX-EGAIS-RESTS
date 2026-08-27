// ==UserScript==
// @name         DXBX EGAIS Combined (RESTS + Bartender API) Обратная связь: t.me/tiltmachinegun
// @namespace    http://tampermonkey.net/
// @version      9.0.0
// @description  MVP-инструменты техподдержки DXBX: остатки ЕГАИС, локальный DataMatrix, чеки и акты списания.
// @author       t.me/tiltmachinegun
// @downloadURL  https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/dxbxrestscombined.js
// @updateURL    https://raw.githubusercontent.com/tiltmachinegun/DXBX-EGAIS-RESTS/refs/heads/main/dxbxrestscombined.js
// @match        https://dxbx.ru/*
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      dxbx.ru
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

var DxbxDataMatrixCodec=(()=>{var It=Object.defineProperty;var Xr=Object.getOwnPropertyDescriptor;var Gr=Object.getOwnPropertyNames;var Hr=Object.prototype.hasOwnProperty;var Wr=(n,t)=>{for(var r in t)It(n,r,{get:t[r],enumerable:!0})},Zr=(n,t,r,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Gr(t))!Hr.call(n,i)&&i!==r&&It(n,i,{get:()=>t[i],enumerable:!(e=Xr(t,i))||e.enumerable});return n};var jr=n=>Zr(It({},"__esModule",{value:!0}),n);var Xn={};Wr(Xn,{decodeDataMatrixRgba:()=>Un,encodeDataMatrix:()=>zn});var Ot;(function(n){n[n.AZTEC=0]="AZTEC",n[n.CODABAR=1]="CODABAR",n[n.CODE_39=2]="CODE_39",n[n.CODE_93=3]="CODE_93",n[n.CODE_128=4]="CODE_128",n[n.DATA_MATRIX=5]="DATA_MATRIX",n[n.EAN_8=6]="EAN_8",n[n.EAN_13=7]="EAN_13",n[n.ITF=8]="ITF",n[n.MAXICODE=9]="MAXICODE",n[n.PDF_417=10]="PDF_417",n[n.QR_CODE=11]="QR_CODE",n[n.RSS_14=12]="RSS_14",n[n.RSS_EXPANDED=13]="RSS_EXPANDED",n[n.UPC_A=14]="UPC_A",n[n.UPC_E=15]="UPC_E",n[n.UPC_EAN_EXTENSION=16]="UPC_EAN_EXTENSION"})(Ot||(Ot={}));var st=Ot;function Kr(n,t){var r=Object.setPrototypeOf;r?r(n,t):n.__proto__=t}function Yr(n,t){t===void 0&&(t=n.constructor);var r=Error.captureStackTrace;r&&r(n,t)}var qr=(function(){var n=function(r,e){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,o){i.__proto__=o}||function(i,o){for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(i[a]=o[a])},n(r,e)};return function(t,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Yt=(function(n){qr(t,n);function t(r,e){var i=this.constructor,o=n.call(this,r,e)||this;return Object.defineProperty(o,"name",{value:i.name,enumerable:!1,configurable:!0}),Kr(o,i.prototype),Yr(o),o}return t})(Error);var Jr=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Qr=(function(n){Jr(t,n);function t(r){r===void 0&&(r=void 0);var e=n.call(this,r)||this;return e.message=r,e}return t.prototype.getKind=function(){var r=this.constructor;return r.kind},t.kind="Exception",t})(Yt),k=Qr;var $r=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Vr=(function(n){$r(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.kind="IllegalArgumentException",t})(k),_=Vr;var te=(function(){function n(t){if(this.binarizer=t,t===null)throw new _("Binarizer must be non-null.")}return n.prototype.getWidth=function(){return this.binarizer.getWidth()},n.prototype.getHeight=function(){return this.binarizer.getHeight()},n.prototype.getBlackRow=function(t,r){return this.binarizer.getBlackRow(t,r)},n.prototype.getBlackMatrix=function(){return(this.matrix===null||this.matrix===void 0)&&(this.matrix=this.binarizer.getBlackMatrix()),this.matrix},n.prototype.isCropSupported=function(){return this.binarizer.getLuminanceSource().isCropSupported()},n.prototype.crop=function(t,r,e,i){var o=this.binarizer.getLuminanceSource().crop(t,r,e,i);return new n(this.binarizer.createBinarizer(o))},n.prototype.isRotateSupported=function(){return this.binarizer.getLuminanceSource().isRotateSupported()},n.prototype.rotateCounterClockwise=function(){var t=this.binarizer.getLuminanceSource().rotateCounterClockwise();return new n(this.binarizer.createBinarizer(t))},n.prototype.rotateCounterClockwise45=function(){var t=this.binarizer.getLuminanceSource().rotateCounterClockwise45();return new n(this.binarizer.createBinarizer(t))},n.prototype.toString=function(){try{return this.getBlackMatrix().toString()}catch{return""}},n})(),qt=te;var Tt;(function(n){n[n.OTHER=0]="OTHER",n[n.PURE_BARCODE=1]="PURE_BARCODE",n[n.POSSIBLE_FORMATS=2]="POSSIBLE_FORMATS",n[n.TRY_HARDER=3]="TRY_HARDER",n[n.CHARACTER_SET=4]="CHARACTER_SET",n[n.ALLOWED_LENGTHS=5]="ALLOWED_LENGTHS",n[n.ASSUME_CODE_39_CHECK_DIGIT=6]="ASSUME_CODE_39_CHECK_DIGIT",n[n.ENABLE_CODE_39_EXTENDED_MODE=7]="ENABLE_CODE_39_EXTENDED_MODE",n[n.ASSUME_GS1=8]="ASSUME_GS1",n[n.RETURN_CODABAR_START_END=9]="RETURN_CODABAR_START_END",n[n.NEED_RESULT_POINT_CALLBACK=10]="NEED_RESULT_POINT_CALLBACK",n[n.ALLOWED_EAN_EXTENSIONS=11]="ALLOWED_EAN_EXTENSIONS"})(Tt||(Tt={}));var rt=Tt;var re=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ee=(function(n){re(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.getFormatInstance=function(){return new t},t.kind="FormatException",t})(k),M=ee;var ne=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},x;(function(n){n[n.Cp437=0]="Cp437",n[n.ISO8859_1=1]="ISO8859_1",n[n.ISO8859_2=2]="ISO8859_2",n[n.ISO8859_3=3]="ISO8859_3",n[n.ISO8859_4=4]="ISO8859_4",n[n.ISO8859_5=5]="ISO8859_5",n[n.ISO8859_6=6]="ISO8859_6",n[n.ISO8859_7=7]="ISO8859_7",n[n.ISO8859_8=8]="ISO8859_8",n[n.ISO8859_9=9]="ISO8859_9",n[n.ISO8859_10=10]="ISO8859_10",n[n.ISO8859_11=11]="ISO8859_11",n[n.ISO8859_13=12]="ISO8859_13",n[n.ISO8859_14=13]="ISO8859_14",n[n.ISO8859_15=14]="ISO8859_15",n[n.ISO8859_16=15]="ISO8859_16",n[n.SJIS=16]="SJIS",n[n.Cp1250=17]="Cp1250",n[n.Cp1251=18]="Cp1251",n[n.Cp1252=19]="Cp1252",n[n.Cp1256=20]="Cp1256",n[n.UnicodeBigUnmarked=21]="UnicodeBigUnmarked",n[n.UTF8=22]="UTF8",n[n.ASCII=23]="ASCII",n[n.Big5=24]="Big5",n[n.GB18030=25]="GB18030",n[n.EUC_KR=26]="EUC_KR"})(x||(x={}));var ie=(function(){function n(t,r,e){for(var i,o,a=[],s=3;s<arguments.length;s++)a[s-3]=arguments[s];this.valueIdentifier=t,this.name=e,typeof r=="number"?this.values=Int32Array.from([r]):this.values=r,this.otherEncodingNames=a,n.VALUE_IDENTIFIER_TO_ECI.set(t,this),n.NAME_TO_ECI.set(e,this);for(var f=this.values,h=0,u=f.length;h!==u;h++){var l=f[h];n.VALUES_TO_ECI.set(l,this)}try{for(var c=ne(a),p=c.next();!p.done;p=c.next()){var d=p.value;n.NAME_TO_ECI.set(d,this)}}catch(v){i={error:v}}finally{try{p&&!p.done&&(o=c.return)&&o.call(c)}finally{if(i)throw i.error}}}return n.prototype.getValueIdentifier=function(){return this.valueIdentifier},n.prototype.getName=function(){return this.name},n.prototype.getValue=function(){return this.values[0]},n.getCharacterSetECIByValue=function(t){if(t<0||t>=900)throw new M("incorect value");var r=n.VALUES_TO_ECI.get(t);if(r===void 0)throw new M("incorect value");return r},n.getCharacterSetECIByName=function(t){var r=n.NAME_TO_ECI.get(t);if(r===void 0)throw new M("incorect value");return r},n.prototype.equals=function(t){if(!(t instanceof n))return!1;var r=t;return this.getName()===r.getName()},n.VALUE_IDENTIFIER_TO_ECI=new Map,n.VALUES_TO_ECI=new Map,n.NAME_TO_ECI=new Map,n.Cp437=new n(x.Cp437,Int32Array.from([0,2]),"Cp437"),n.ISO8859_1=new n(x.ISO8859_1,Int32Array.from([1,3]),"ISO-8859-1","ISO88591","ISO8859_1"),n.ISO8859_2=new n(x.ISO8859_2,4,"ISO-8859-2","ISO88592","ISO8859_2"),n.ISO8859_3=new n(x.ISO8859_3,5,"ISO-8859-3","ISO88593","ISO8859_3"),n.ISO8859_4=new n(x.ISO8859_4,6,"ISO-8859-4","ISO88594","ISO8859_4"),n.ISO8859_5=new n(x.ISO8859_5,7,"ISO-8859-5","ISO88595","ISO8859_5"),n.ISO8859_6=new n(x.ISO8859_6,8,"ISO-8859-6","ISO88596","ISO8859_6"),n.ISO8859_7=new n(x.ISO8859_7,9,"ISO-8859-7","ISO88597","ISO8859_7"),n.ISO8859_8=new n(x.ISO8859_8,10,"ISO-8859-8","ISO88598","ISO8859_8"),n.ISO8859_9=new n(x.ISO8859_9,11,"ISO-8859-9","ISO88599","ISO8859_9"),n.ISO8859_10=new n(x.ISO8859_10,12,"ISO-8859-10","ISO885910","ISO8859_10"),n.ISO8859_11=new n(x.ISO8859_11,13,"ISO-8859-11","ISO885911","ISO8859_11"),n.ISO8859_13=new n(x.ISO8859_13,15,"ISO-8859-13","ISO885913","ISO8859_13"),n.ISO8859_14=new n(x.ISO8859_14,16,"ISO-8859-14","ISO885914","ISO8859_14"),n.ISO8859_15=new n(x.ISO8859_15,17,"ISO-8859-15","ISO885915","ISO8859_15"),n.ISO8859_16=new n(x.ISO8859_16,18,"ISO-8859-16","ISO885916","ISO8859_16"),n.SJIS=new n(x.SJIS,20,"SJIS","Shift_JIS"),n.Cp1250=new n(x.Cp1250,21,"Cp1250","windows-1250"),n.Cp1251=new n(x.Cp1251,22,"Cp1251","windows-1251"),n.Cp1252=new n(x.Cp1252,23,"Cp1252","windows-1252"),n.Cp1256=new n(x.Cp1256,24,"Cp1256","windows-1256"),n.UnicodeBigUnmarked=new n(x.UnicodeBigUnmarked,25,"UnicodeBigUnmarked","UTF-16BE","UnicodeBig"),n.UTF8=new n(x.UTF8,26,"UTF8","UTF-8"),n.ASCII=new n(x.ASCII,Int32Array.from([27,170]),"ASCII","US-ASCII"),n.Big5=new n(x.Big5,28,"Big5"),n.GB18030=new n(x.GB18030,29,"GB18030","GB2312","EUC_CN","GBK"),n.EUC_KR=new n(x.EUC_KR,30,"EUC_KR","EUC-KR"),n})(),j=ie;var oe=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ae=(function(n){oe(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.kind="UnsupportedOperationException",t})(k),ft=ae;var se=(function(){function n(){}return n.decode=function(t,r){var e=this.encodingName(r);return this.customDecoder?this.customDecoder(t,e):typeof TextDecoder>"u"||this.shouldDecodeOnFallback(e)?this.decodeFallback(t,e):new TextDecoder(e).decode(t)},n.shouldDecodeOnFallback=function(t){return!n.isBrowser()&&t==="ISO-8859-1"},n.encode=function(t,r){var e=this.encodingName(r);return this.customEncoder?this.customEncoder(t,e):typeof TextEncoder>"u"?this.encodeFallback(t):new TextEncoder().encode(t)},n.isBrowser=function(){return typeof window<"u"&&{}.toString.call(window)==="[object Window]"},n.encodingName=function(t){return typeof t=="string"?t:t.getName()},n.encodingCharacterSet=function(t){return t instanceof j?t:j.getCharacterSetECIByName(t)},n.decodeFallback=function(t,r){var e=this.encodingCharacterSet(r);if(n.isDecodeFallbackSupported(e)){for(var i="",o=0,a=t.length;o<a;o++){var s=t[o].toString(16);s.length<2&&(s="0"+s),i+="%"+s}return decodeURIComponent(i)}if(e.equals(j.UnicodeBigUnmarked))return String.fromCharCode.apply(null,new Uint16Array(t.buffer));throw new ft("Encoding "+this.encodingName(r)+" not supported by fallback.")},n.isDecodeFallbackSupported=function(t){return t.equals(j.UTF8)||t.equals(j.ISO8859_1)||t.equals(j.ASCII)},n.encodeFallback=function(t){for(var r=btoa(unescape(encodeURIComponent(t))),e=r.split(""),i=[],o=0;o<e.length;o++)i.push(e[o].charCodeAt(0));return new Uint8Array(i)},n})(),tt=se;var fe=(function(){function n(){}return n.castAsNonUtf8Char=function(t,r){r===void 0&&(r=null);var e=r?r.getName():this.ISO88591;return tt.decode(new Uint8Array([t]),e)},n.guessEncoding=function(t,r){if(r!=null&&r.get(rt.CHARACTER_SET)!==void 0)return r.get(rt.CHARACTER_SET).toString();for(var e=t.length,i=!0,o=!0,a=!0,s=0,f=0,h=0,u=0,l=0,c=0,p=0,d=0,v=0,w=0,E=0,y=t.length>3&&t[0]===239&&t[1]===187&&t[2]===191,m=0;m<e&&(i||o||a);m++){var C=t[m]&255;a&&(s>0?(C&128)===0?a=!1:s--:(C&128)!==0&&((C&64)===0?a=!1:(s++,(C&32)===0?f++:(s++,(C&16)===0?h++:(s++,(C&8)===0?u++:a=!1))))),i&&(C>127&&C<160?i=!1:C>159&&(C<192||C===215||C===247)&&E++),o&&(l>0?C<64||C===127||C>252?o=!1:l--:C===128||C===160||C>239?o=!1:C>160&&C<224?(c++,d=0,p++,p>v&&(v=p)):C>127?(l++,p=0,d++,d>w&&(w=d)):(p=0,d=0))}return a&&s>0&&(a=!1),o&&l>0&&(o=!1),a&&(y||f+h+u>0)?n.UTF8:o&&(n.ASSUME_SHIFT_JIS||v>=3||w>=3)?n.SHIFT_JIS:i&&o?v===2&&c===2||E*10>=e?n.SHIFT_JIS:n.ISO88591:i?n.ISO88591:o?n.SHIFT_JIS:a?n.UTF8:n.PLATFORM_DEFAULT_ENCODING},n.format=function(t){for(var r=[],e=1;e<arguments.length;e++)r[e-1]=arguments[e];var i=-1;function o(s,f,h,u,l,c){if(s==="%%")return"%";if(r[++i]!==void 0){s=u?parseInt(u.substr(1)):void 0;var p=l?parseInt(l.substr(1)):void 0,d;switch(c){case"s":d=r[i];break;case"c":d=r[i][0];break;case"f":d=parseFloat(r[i]).toFixed(s);break;case"p":d=parseFloat(r[i]).toPrecision(s);break;case"e":d=parseFloat(r[i]).toExponential(s);break;case"x":d=parseInt(r[i]).toString(p||16);break;case"d":d=parseFloat(parseInt(r[i],p||10).toPrecision(s)).toFixed(0);break}d=typeof d=="object"?JSON.stringify(d):(+d).toString(p);for(var v=parseInt(h),w=h&&h[0]+""=="0"?"0":" ";d.length<v;)d=f!==void 0?d+w:w+d;return d}}var a=/%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;return t.replace(a,o)},n.getBytes=function(t,r){return tt.encode(t,r)},n.getCharCode=function(t,r){return r===void 0&&(r=0),t.charCodeAt(r)},n.getCharAt=function(t){return String.fromCharCode(t)},n.SHIFT_JIS=j.SJIS.getName(),n.GB2312="GB2312",n.ISO88591=j.ISO8859_1.getName(),n.EUC_JP="EUC_JP",n.UTF8=j.UTF8.getName(),n.PLATFORM_DEFAULT_ENCODING=n.UTF8,n.ASSUME_SHIFT_JIS=!1,n})(),X=fe;var he=(function(){function n(t){t===void 0&&(t=""),this.value=t}return n.prototype.enableDecoding=function(t){return this.encoding=t,this},n.prototype.append=function(t){return typeof t=="string"?this.value+=t.toString():this.encoding?this.value+=X.castAsNonUtf8Char(t,this.encoding):this.value+=String.fromCharCode(t),this},n.prototype.appendChars=function(t,r,e){for(var i=r;r<r+e;i++)this.append(t[i]);return this},n.prototype.length=function(){return this.value.length},n.prototype.charAt=function(t){return this.value.charAt(t)},n.prototype.deleteCharAt=function(t){this.value=this.value.substr(0,t)+this.value.substring(t+1)},n.prototype.setCharAt=function(t,r){this.value=this.value.substr(0,t)+r+this.value.substr(t+1)},n.prototype.substring=function(t,r){return this.value.substring(t,r)},n.prototype.setLengthToZero=function(){this.value=""},n.prototype.toString=function(){return this.value},n.prototype.insert=function(t,r){this.value=this.value.substring(0,t)+r+this.value.substring(t)},n})(),D=he;var ue=(function(){function n(t,r){this.width=t,this.height=r}return n.prototype.getWidth=function(){return this.width},n.prototype.getHeight=function(){return this.height},n.prototype.isCropSupported=function(){return!1},n.prototype.crop=function(t,r,e,i){throw new ft("This luminance source does not support cropping.")},n.prototype.isRotateSupported=function(){return!1},n.prototype.rotateCounterClockwise=function(){throw new ft("This luminance source does not support rotation by 90 degrees.")},n.prototype.rotateCounterClockwise45=function(){throw new ft("This luminance source does not support rotation by 45 degrees.")},n.prototype.toString=function(){for(var t=new Uint8ClampedArray(this.width),r=new D,e=0;e<this.height;e++){for(var i=this.getRow(e,t),o=0;o<this.width;o++){var a=i[o]&255,s=void 0;a<64?s="#":a<128?s="+":a<192?s=".":s=" ",r.append(s)}r.append(`
`)}return r.toString()},n})(),Ct=ue;var le=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ce=(function(n){le(t,n);function t(r){var e=n.call(this,r.getWidth(),r.getHeight())||this;return e.delegate=r,e}return t.prototype.getRow=function(r,e){for(var i=this.delegate.getRow(r,e),o=this.getWidth(),a=0;a<o;a++)i[a]=255-(i[a]&255);return i},t.prototype.getMatrix=function(){for(var r=this.delegate.getMatrix(),e=this.getWidth()*this.getHeight(),i=new Uint8ClampedArray(e),o=0;o<e;o++)i[o]=255-(r[o]&255);return i},t.prototype.isCropSupported=function(){return this.delegate.isCropSupported()},t.prototype.crop=function(r,e,i,o){return new t(this.delegate.crop(r,e,i,o))},t.prototype.isRotateSupported=function(){return this.delegate.isRotateSupported()},t.prototype.invert=function(){return this.delegate},t.prototype.rotateCounterClockwise=function(){return new t(this.delegate.rotateCounterClockwise())},t.prototype.rotateCounterClockwise45=function(){return new t(this.delegate.rotateCounterClockwise45())},t})(Ct),Jt=ce;var pe=(function(){function n(){}return n.arraycopy=function(t,r,e,i,o){for(;o--;)e[i++]=t[r++]},n.currentTimeMillis=function(){return Date.now()},n})(),F=pe;var de=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ve=(function(n){de(t,n);function t(r,e,i,o,a,s,f){var h=n.call(this,e,i)||this;if(h.dataWidth=o,h.dataHeight=a,h.left=s,h.top=f,r.BYTES_PER_ELEMENT===4){for(var u=e*i,l=new Uint8ClampedArray(u),c=0;c<u;c++){var p=r[c],d=p>>16&255,v=p>>7&510,w=p&255;l[c]=(d+v+w)/4&255}h.luminances=l}else h.luminances=r;if(o===void 0&&(h.dataWidth=e),a===void 0&&(h.dataHeight=i),s===void 0&&(h.left=0),f===void 0&&(h.top=0),h.left+e>h.dataWidth||h.top+i>h.dataHeight)throw new _("Crop rectangle does not fit within image data.");return h}return t.prototype.getRow=function(r,e){if(r<0||r>=this.getHeight())throw new _("Requested row is outside the image: "+r);var i=this.getWidth();(e==null||e.length<i)&&(e=new Uint8ClampedArray(i));var o=(r+this.top)*this.dataWidth+this.left;return F.arraycopy(this.luminances,o,e,0,i),e},t.prototype.getMatrix=function(){var r=this.getWidth(),e=this.getHeight();if(r===this.dataWidth&&e===this.dataHeight)return this.luminances;var i=r*e,o=new Uint8ClampedArray(i),a=this.top*this.dataWidth+this.left;if(r===this.dataWidth)return F.arraycopy(this.luminances,a,o,0,i),o;for(var s=0;s<e;s++){var f=s*r;F.arraycopy(this.luminances,a,o,f,r),a+=this.dataWidth}return o},t.prototype.isCropSupported=function(){return!0},t.prototype.crop=function(r,e,i,o){return new t(this.luminances,i,o,this.dataWidth,this.dataHeight,this.left+r,this.top+e)},t.prototype.invert=function(){return new Jt(this)},t})(Ct),Qt=ve;var ge=(function(){function n(t){this.source=t}return n.prototype.getLuminanceSource=function(){return this.source},n.prototype.getWidth=function(){return this.source.getWidth()},n.prototype.getHeight=function(){return this.source.getHeight()},n})(),$t=ge;var Ce=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),we=(function(n){Ce(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.kind="IndexOutOfBoundsException",t})(k),Vt=we;var Ee=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ye=(function(n){Ee(t,n);function t(r,e){r===void 0&&(r=void 0),e===void 0&&(e=void 0);var i=n.call(this,e)||this;return i.index=r,i.message=e,i}return t.kind="ArrayIndexOutOfBoundsException",t})(Vt),xt=ye;var Se=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},me=(function(){function n(){}return n.fill=function(t,r){for(var e=0,i=t.length;e<i;e++)t[e]=r},n.fillWithin=function(t,r,e,i){n.rangeCheck(t.length,r,e);for(var o=r;o<e;o++)t[o]=i},n.rangeCheck=function(t,r,e){if(r>e)throw new _("fromIndex("+r+") > toIndex("+e+")");if(r<0)throw new xt(r);if(e>t)throw new xt(e)},n.asList=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return t},n.create=function(t,r,e){var i=Array.from({length:t});return i.map(function(o){return Array.from({length:r}).fill(e)})},n.createInt32Array=function(t,r,e){var i=Array.from({length:t});return i.map(function(o){return Int32Array.from({length:r}).fill(e)})},n.equals=function(t,r){if(!t||!r||!t.length||!r.length||t.length!==r.length)return!1;for(var e=0,i=t.length;e<i;e++)if(t[e]!==r[e])return!1;return!0},n.hashCode=function(t){var r,e;if(t===null)return 0;var i=1;try{for(var o=Se(t),a=o.next();!a.done;a=o.next()){var s=a.value;i=31*i+s}}catch(f){r={error:f}}finally{try{a&&!a.done&&(e=o.return)&&e.call(o)}finally{if(r)throw r.error}}return i},n.fillUint8Array=function(t,r){for(var e=0;e!==t.length;e++)t[e]=r},n.copyOf=function(t,r){return t.slice(0,r)},n.copyOfUint8Array=function(t,r){if(t.length<=r){var e=new Uint8Array(r);return e.set(t),e}return t.slice(0,r)},n.copyOfRange=function(t,r,e){var i=e-r,o=new Int32Array(i);return F.arraycopy(t,r,o,0,i),o},n.binarySearch=function(t,r,e){e===void 0&&(e=n.numberComparator);for(var i=0,o=t.length-1;i<=o;){var a=o+i>>1,s=e(r,t[a]);if(s>0)i=a+1;else if(s<0)o=a-1;else return a}return-i-1},n.numberComparator=function(t,r){return t-r},n})(),G=me;var _e=(function(){function n(){}return n.numberOfTrailingZeros=function(t){var r;if(t===0)return 32;var e=31;return r=t<<16,r!==0&&(e-=16,t=r),r=t<<8,r!==0&&(e-=8,t=r),r=t<<4,r!==0&&(e-=4,t=r),r=t<<2,r!==0&&(e-=2,t=r),e-(t<<1>>>31)},n.numberOfLeadingZeros=function(t){if(t===0)return 32;var r=1;return t>>>16||(r+=16,t<<=16),t>>>24||(r+=8,t<<=8),t>>>28||(r+=4,t<<=4),t>>>30||(r+=2,t<<=2),r-=t>>>31,r},n.toHexString=function(t){return t.toString(16)},n.toBinaryString=function(t){return String(parseInt(String(t),2))},n.bitCount=function(t){return t=t-(t>>>1&1431655765),t=(t&858993459)+(t>>>2&858993459),t=t+(t>>>4)&252645135,t=t+(t>>>8),t=t+(t>>>16),t&63},n.truncDivision=function(t,r){return Math.trunc(t/r)},n.parseInt=function(t,r){return r===void 0&&(r=void 0),parseInt(t,r)},n.MIN_VALUE_32_BITS=-2147483648,n.MAX_VALUE=Number.MAX_SAFE_INTEGER,n})(),J=_e;var Ae=(function(){function n(t,r){t===void 0?(this.size=0,this.bits=new Int32Array(1)):(this.size=t,r==null?this.bits=n.makeArray(t):this.bits=r)}return n.prototype.getSize=function(){return this.size},n.prototype.getSizeInBytes=function(){return Math.floor((this.size+7)/8)},n.prototype.ensureCapacity=function(t){if(t>this.bits.length*32){var r=n.makeArray(t);F.arraycopy(this.bits,0,r,0,this.bits.length),this.bits=r}},n.prototype.get=function(t){return(this.bits[Math.floor(t/32)]&1<<(t&31))!==0},n.prototype.set=function(t){this.bits[Math.floor(t/32)]|=1<<(t&31)},n.prototype.flip=function(t){this.bits[Math.floor(t/32)]^=1<<(t&31)},n.prototype.getNextSet=function(t){var r=this.size;if(t>=r)return r;var e=this.bits,i=Math.floor(t/32),o=e[i];o&=~((1<<(t&31))-1);for(var a=e.length;o===0;){if(++i===a)return r;o=e[i]}var s=i*32+J.numberOfTrailingZeros(o);return s>r?r:s},n.prototype.getNextUnset=function(t){var r=this.size;if(t>=r)return r;var e=this.bits,i=Math.floor(t/32),o=~e[i];o&=~((1<<(t&31))-1);for(var a=e.length;o===0;){if(++i===a)return r;o=~e[i]}var s=i*32+J.numberOfTrailingZeros(o);return s>r?r:s},n.prototype.setBulk=function(t,r){this.bits[Math.floor(t/32)]=r},n.prototype.setRange=function(t,r){if(r<t||t<0||r>this.size)throw new _;if(r!==t){r--;for(var e=Math.floor(t/32),i=Math.floor(r/32),o=this.bits,a=e;a<=i;a++){var s=a>e?0:t&31,f=a<i?31:r&31,h=(2<<f)-(1<<s);o[a]|=h}}},n.prototype.clear=function(){for(var t=this.bits.length,r=this.bits,e=0;e<t;e++)r[e]=0},n.prototype.isRange=function(t,r,e){if(r<t||t<0||r>this.size)throw new _;if(r===t)return!0;r--;for(var i=Math.floor(t/32),o=Math.floor(r/32),a=this.bits,s=i;s<=o;s++){var f=s>i?0:t&31,h=s<o?31:r&31,u=(2<<h)-(1<<f)&4294967295;if((a[s]&u)!==(e?u:0))return!1}return!0},n.prototype.appendBit=function(t){this.ensureCapacity(this.size+1),t&&(this.bits[Math.floor(this.size/32)]|=1<<(this.size&31)),this.size++},n.prototype.appendBits=function(t,r){if(r<0||r>32)throw new _("Num bits must be between 0 and 32");this.ensureCapacity(this.size+r);for(var e=r;e>0;e--)this.appendBit((t>>e-1&1)===1)},n.prototype.appendBitArray=function(t){var r=t.size;this.ensureCapacity(this.size+r);for(var e=0;e<r;e++)this.appendBit(t.get(e))},n.prototype.xor=function(t){if(this.size!==t.size)throw new _("Sizes don't match");for(var r=this.bits,e=0,i=r.length;e<i;e++)r[e]^=t.bits[e]},n.prototype.toBytes=function(t,r,e,i){for(var o=0;o<i;o++){for(var a=0,s=0;s<8;s++)this.get(t)&&(a|=1<<7-s),t++;r[e+o]=a}},n.prototype.getBitArray=function(){return this.bits},n.prototype.reverse=function(){for(var t=new Int32Array(this.bits.length),r=Math.floor((this.size-1)/32),e=r+1,i=this.bits,o=0;o<e;o++){var a=i[o];a=a>>1&1431655765|(a&1431655765)<<1,a=a>>2&858993459|(a&858993459)<<2,a=a>>4&252645135|(a&252645135)<<4,a=a>>8&16711935|(a&16711935)<<8,a=a>>16&65535|(a&65535)<<16,t[r-o]=a}if(this.size!==e*32){for(var s=e*32-this.size,f=t[0]>>>s,o=1;o<e;o++){var h=t[o];f|=h<<32-s,t[o-1]=f,f=h>>>s}t[e-1]=f}this.bits=t},n.makeArray=function(t){return new Int32Array(Math.floor((t+31)/32))},n.prototype.equals=function(t){if(!(t instanceof n))return!1;var r=t;return this.size===r.size&&G.equals(this.bits,r.bits)},n.prototype.hashCode=function(){return 31*this.size+G.hashCode(this.bits)},n.prototype.toString=function(){for(var t="",r=0,e=this.size;r<e;r++)(r&7)===0&&(t+=" "),t+=this.get(r)?"X":".";return t},n.prototype.clone=function(){return new n(this.size,this.bits.slice())},n.prototype.toArray=function(){for(var t=[],r=0,e=this.size;r<e;r++)t.push(this.get(r));return t},n})(),et=Ae;var Ie=(function(){function n(t,r,e,i){if(this.width=t,this.height=r,this.rowSize=e,this.bits=i,r==null&&(r=t),this.height=r,t<1||r<1)throw new _("Both dimensions must be greater than 0");e==null&&(e=Math.floor((t+31)/32)),this.rowSize=e,i==null&&(this.bits=new Int32Array(this.rowSize*this.height))}return n.parseFromBooleanArray=function(t){for(var r=t.length,e=t[0].length,i=new n(e,r),o=0;o<r;o++)for(var a=t[o],s=0;s<e;s++)a[s]&&i.set(s,o);return i},n.parseFromString=function(t,r,e){if(t===null)throw new _("stringRepresentation cannot be null");for(var i=new Array(t.length),o=0,a=0,s=-1,f=0,h=0;h<t.length;)if(t.charAt(h)===`
`||t.charAt(h)==="\r"){if(o>a){if(s===-1)s=o-a;else if(o-a!==s)throw new _("row lengths do not match");a=o,f++}h++}else if(t.substring(h,h+r.length)===r)h+=r.length,i[o]=!0,o++;else if(t.substring(h,h+e.length)===e)h+=e.length,i[o]=!1,o++;else throw new _("illegal character encountered: "+t.substring(h));if(o>a){if(s===-1)s=o-a;else if(o-a!==s)throw new _("row lengths do not match");f++}for(var u=new n(s,f),l=0;l<o;l++)i[l]&&u.set(Math.floor(l%s),Math.floor(l/s));return u},n.prototype.get=function(t,r){var e=r*this.rowSize+Math.floor(t/32);return(this.bits[e]>>>(t&31)&1)!==0},n.prototype.set=function(t,r){var e=r*this.rowSize+Math.floor(t/32);this.bits[e]|=1<<(t&31)&4294967295},n.prototype.unset=function(t,r){var e=r*this.rowSize+Math.floor(t/32);this.bits[e]&=~(1<<(t&31)&4294967295)},n.prototype.flip=function(t,r){var e=r*this.rowSize+Math.floor(t/32);this.bits[e]^=1<<(t&31)&4294967295},n.prototype.xor=function(t){if(this.width!==t.getWidth()||this.height!==t.getHeight()||this.rowSize!==t.getRowSize())throw new _("input matrix dimensions do not match");for(var r=new et(Math.floor(this.width/32)+1),e=this.rowSize,i=this.bits,o=0,a=this.height;o<a;o++)for(var s=o*e,f=t.getRow(o,r).getBitArray(),h=0;h<e;h++)i[s+h]^=f[h]},n.prototype.clear=function(){for(var t=this.bits,r=t.length,e=0;e<r;e++)t[e]=0},n.prototype.setRegion=function(t,r,e,i){if(r<0||t<0)throw new _("Left and top must be nonnegative");if(i<1||e<1)throw new _("Height and width must be at least 1");var o=t+e,a=r+i;if(a>this.height||o>this.width)throw new _("The region must fit inside the matrix");for(var s=this.rowSize,f=this.bits,h=r;h<a;h++)for(var u=h*s,l=t;l<o;l++)f[u+Math.floor(l/32)]|=1<<(l&31)&4294967295},n.prototype.getRow=function(t,r){r==null||r.getSize()<this.width?r=new et(this.width):r.clear();for(var e=this.rowSize,i=this.bits,o=t*e,a=0;a<e;a++)r.setBulk(a*32,i[o+a]);return r},n.prototype.setRow=function(t,r){F.arraycopy(r.getBitArray(),0,this.bits,t*this.rowSize,this.rowSize)},n.prototype.rotate180=function(){for(var t=this.getWidth(),r=this.getHeight(),e=new et(t),i=new et(t),o=0,a=Math.floor((r+1)/2);o<a;o++)e=this.getRow(o,e),i=this.getRow(r-1-o,i),e.reverse(),i.reverse(),this.setRow(o,i),this.setRow(r-1-o,e)},n.prototype.getEnclosingRectangle=function(){for(var t=this.width,r=this.height,e=this.rowSize,i=this.bits,o=t,a=r,s=-1,f=-1,h=0;h<r;h++)for(var u=0;u<e;u++){var l=i[h*e+u];if(l!==0){if(h<a&&(a=h),h>f&&(f=h),u*32<o){for(var c=0;(l<<31-c&4294967295)===0;)c++;u*32+c<o&&(o=u*32+c)}if(u*32+31>s){for(var c=31;!(l>>>c);)c--;u*32+c>s&&(s=u*32+c)}}}return s<o||f<a?null:Int32Array.from([o,a,s-o+1,f-a+1])},n.prototype.getTopLeftOnBit=function(){for(var t=this.rowSize,r=this.bits,e=0;e<r.length&&r[e]===0;)e++;if(e===r.length)return null;for(var i=e/t,o=e%t*32,a=r[e],s=0;(a<<31-s&4294967295)===0;)s++;return o+=s,Int32Array.from([o,i])},n.prototype.getBottomRightOnBit=function(){for(var t=this.rowSize,r=this.bits,e=r.length-1;e>=0&&r[e]===0;)e--;if(e<0)return null;for(var i=Math.floor(e/t),o=Math.floor(e%t)*32,a=r[e],s=31;!(a>>>s);)s--;return o+=s,Int32Array.from([o,i])},n.prototype.getWidth=function(){return this.width},n.prototype.getHeight=function(){return this.height},n.prototype.getRowSize=function(){return this.rowSize},n.prototype.equals=function(t){if(!(t instanceof n))return!1;var r=t;return this.width===r.width&&this.height===r.height&&this.rowSize===r.rowSize&&G.equals(this.bits,r.bits)},n.prototype.hashCode=function(){var t=this.width;return t=31*t+this.width,t=31*t+this.height,t=31*t+this.rowSize,t=31*t+G.hashCode(this.bits),t},n.prototype.toString=function(t,r,e){return t===void 0&&(t="X "),r===void 0&&(r="  "),e===void 0&&(e=`
`),this.buildToString(t,r,e)},n.prototype.buildToString=function(t,r,e){for(var i=new D,o=0,a=this.height;o<a;o++){for(var s=0,f=this.width;s<f;s++)i.append(this.get(s,o)?t:r);i.append(e)}return i.toString()},n.prototype.clone=function(){return new n(this.width,this.height,this.rowSize,this.bits.slice())},n})(),q=Ie;var Oe=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Te=(function(n){Oe(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.getNotFoundInstance=function(){return new t},t.kind="NotFoundException",t})(k),B=Te;var xe=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),De=(function(n){xe(t,n);function t(r){var e=n.call(this,r)||this;return e.luminances=t.EMPTY,e.buckets=new Int32Array(t.LUMINANCE_BUCKETS),e}return t.prototype.getBlackRow=function(r,e){var i=this.getLuminanceSource(),o=i.getWidth();e==null||e.getSize()<o?e=new et(o):e.clear(),this.initArrays(o);for(var a=i.getRow(r,this.luminances),s=this.buckets,f=0;f<o;f++)s[(a[f]&255)>>t.LUMINANCE_SHIFT]++;var h=t.estimateBlackPoint(s);if(o<3)for(var f=0;f<o;f++)(a[f]&255)<h&&e.set(f);else for(var u=a[0]&255,l=a[1]&255,f=1;f<o-1;f++){var c=a[f+1]&255;(l*4-u-c)/2<h&&e.set(f),u=l,l=c}return e},t.prototype.getBlackMatrix=function(){var r=this.getLuminanceSource(),e=r.getWidth(),i=r.getHeight(),o=new q(e,i);this.initArrays(e);for(var a=this.buckets,s=1;s<5;s++)for(var f=Math.floor(i*s/5),h=r.getRow(f,this.luminances),u=Math.floor(e*4/5),l=Math.floor(e/5);l<u;l++){var c=h[l]&255;a[c>>t.LUMINANCE_SHIFT]++}for(var p=t.estimateBlackPoint(a),d=r.getMatrix(),s=0;s<i;s++)for(var v=s*e,l=0;l<e;l++){var c=d[v+l]&255;c<p&&o.set(l,s)}return o},t.prototype.createBinarizer=function(r){return new t(r)},t.prototype.initArrays=function(r){this.luminances.length<r&&(this.luminances=new Uint8ClampedArray(r));for(var e=this.buckets,i=0;i<t.LUMINANCE_BUCKETS;i++)e[i]=0},t.estimateBlackPoint=function(r){for(var e=r.length,i=0,o=0,a=0,s=0;s<e;s++)r[s]>a&&(o=s,a=r[s]),r[s]>i&&(i=r[s]);for(var f=0,h=0,s=0;s<e;s++){var u=s-o,l=r[s]*u*u;l>h&&(f=s,h=l)}if(o>f){var c=o;o=f,f=c}if(f-o<=e/16)throw new B;for(var p=f-1,d=-1,s=f-1;s>o;s--){var v=s-o,l=v*v*(f-s)*(i-r[s]);l>d&&(p=s,d=l)}return p<<t.LUMINANCE_SHIFT},t.LUMINANCE_BITS=5,t.LUMINANCE_SHIFT=8-t.LUMINANCE_BITS,t.LUMINANCE_BUCKETS=1<<t.LUMINANCE_BITS,t.EMPTY=Uint8ClampedArray.from([0]),t})($t),wt=De;var Me=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Be=(function(n){Me(t,n);function t(r){var e=n.call(this,r)||this;return e.matrix=null,e}return t.prototype.getBlackMatrix=function(){if(this.matrix!==null)return this.matrix;var r=this.getLuminanceSource(),e=r.getWidth(),i=r.getHeight();if(e>=t.MINIMUM_DIMENSION&&i>=t.MINIMUM_DIMENSION){var o=r.getMatrix(),a=e>>t.BLOCK_SIZE_POWER;(e&t.BLOCK_SIZE_MASK)!==0&&a++;var s=i>>t.BLOCK_SIZE_POWER;(i&t.BLOCK_SIZE_MASK)!==0&&s++;var f=t.calculateBlackPoints(o,a,s,e,i),h=new q(e,i);t.calculateThresholdForBlock(o,a,s,e,i,f,h),this.matrix=h}else this.matrix=n.prototype.getBlackMatrix.call(this);return this.matrix},t.prototype.createBinarizer=function(r){return new t(r)},t.calculateThresholdForBlock=function(r,e,i,o,a,s,f){for(var h=a-t.BLOCK_SIZE,u=o-t.BLOCK_SIZE,l=0;l<i;l++){var c=l<<t.BLOCK_SIZE_POWER;c>h&&(c=h);for(var p=t.cap(l,2,i-3),d=0;d<e;d++){var v=d<<t.BLOCK_SIZE_POWER;v>u&&(v=u);for(var w=t.cap(d,2,e-3),E=0,y=-2;y<=2;y++){var m=s[p+y];E+=m[w-2]+m[w-1]+m[w]+m[w+1]+m[w+2]}var C=E/25;t.thresholdBlock(r,v,c,C,o,f)}}},t.cap=function(r,e,i){return r<e?e:r>i?i:r},t.thresholdBlock=function(r,e,i,o,a,s){for(var f=0,h=i*a+e;f<t.BLOCK_SIZE;f++,h+=a)for(var u=0;u<t.BLOCK_SIZE;u++)(r[h+u]&255)<=o&&s.set(e+u,i+f)},t.calculateBlackPoints=function(r,e,i,o,a){for(var s=a-t.BLOCK_SIZE,f=o-t.BLOCK_SIZE,h=new Array(i),u=0;u<i;u++){h[u]=new Int32Array(e);var l=u<<t.BLOCK_SIZE_POWER;l>s&&(l=s);for(var c=0;c<e;c++){var p=c<<t.BLOCK_SIZE_POWER;p>f&&(p=f);for(var d=0,v=255,w=0,E=0,y=l*o+p;E<t.BLOCK_SIZE;E++,y+=o){for(var m=0;m<t.BLOCK_SIZE;m++){var C=r[y+m]&255;d+=C,C<v&&(v=C),C>w&&(w=C)}if(w-v>t.MIN_DYNAMIC_RANGE)for(E++,y+=o;E<t.BLOCK_SIZE;E++,y+=o)for(var m=0;m<t.BLOCK_SIZE;m++)d+=r[y+m]&255}var z=d>>t.BLOCK_SIZE_POWER*2;if(w-v<=t.MIN_DYNAMIC_RANGE&&(z=v/2,u>0&&c>0)){var Y=(h[u-1][c]+2*h[u][c-1]+h[u-1][c-1])/4;v<Y&&(z=Y)}h[u][c]=z}}return h},t.BLOCK_SIZE_POWER=3,t.BLOCK_SIZE=1<<t.BLOCK_SIZE_POWER,t.BLOCK_SIZE_MASK=t.BLOCK_SIZE-1,t.MINIMUM_DIMENSION=t.BLOCK_SIZE*5,t.MIN_DYNAMIC_RANGE=24,t})(wt),ct=Be;var Ne=(function(){function n(t,r,e,i,o,a){e===void 0&&(e=r==null?0:8*r.length),a===void 0&&(a=F.currentTimeMillis()),this.text=t,this.rawBytes=r,this.numBits=e,this.resultPoints=i,this.format=o,this.timestamp=a,this.text=t,this.rawBytes=r,e==null?this.numBits=r==null?0:8*r.length:this.numBits=e,this.resultPoints=i,this.format=o,this.resultMetadata=null,a==null?this.timestamp=F.currentTimeMillis():this.timestamp=a}return n.prototype.getText=function(){return this.text},n.prototype.getRawBytes=function(){return this.rawBytes},n.prototype.getNumBits=function(){return this.numBits},n.prototype.getResultPoints=function(){return this.resultPoints},n.prototype.getBarcodeFormat=function(){return this.format},n.prototype.getResultMetadata=function(){return this.resultMetadata},n.prototype.putMetadata=function(t,r){this.resultMetadata===null&&(this.resultMetadata=new Map),this.resultMetadata.set(t,r)},n.prototype.putAllMetadata=function(t){t!==null&&(this.resultMetadata===null?this.resultMetadata=t:this.resultMetadata=new Map(t))},n.prototype.addResultPoints=function(t){var r=this.resultPoints;if(r===null)this.resultPoints=t;else if(t!==null&&t.length>0){var e=new Array(r.length+t.length);F.arraycopy(r,0,e,0,r.length),F.arraycopy(t,0,e,r.length,t.length),this.resultPoints=e}},n.prototype.getTimestamp=function(){return this.timestamp},n.prototype.toString=function(){return this.text},n})(),tr=Ne;var Dt;(function(n){n[n.OTHER=0]="OTHER",n[n.ORIENTATION=1]="ORIENTATION",n[n.BYTE_SEGMENTS=2]="BYTE_SEGMENTS",n[n.ERROR_CORRECTION_LEVEL=3]="ERROR_CORRECTION_LEVEL",n[n.ISSUE_NUMBER=4]="ISSUE_NUMBER",n[n.SUGGESTED_PRICE=5]="SUGGESTED_PRICE",n[n.POSSIBLE_COUNTRY=6]="POSSIBLE_COUNTRY",n[n.UPC_EAN_EXTENSION=7]="UPC_EAN_EXTENSION",n[n.PDF417_EXTRA_METADATA=8]="PDF417_EXTRA_METADATA",n[n.STRUCTURED_APPEND_SEQUENCE=9]="STRUCTURED_APPEND_SEQUENCE",n[n.STRUCTURED_APPEND_PARITY=10]="STRUCTURED_APPEND_PARITY"})(Dt||(Dt={}));var Mt=Dt;var be=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Fe=(function(n){be(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.getChecksumInstance=function(){return new t},t.kind="ChecksumException",t})(k),rr=Fe;var Re=(function(){function n(){}return n.prototype.exp=function(t){return this.expTable[t]},n.prototype.log=function(t){if(t===0)throw new _;return this.logTable[t]},n.addOrSubtract=function(t,r){return t^r},n})(),nt=Re;var Pe=(function(){function n(t,r){if(r.length===0)throw new _;this.field=t;var e=r.length;if(e>1&&r[0]===0){for(var i=1;i<e&&r[i]===0;)i++;i===e?this.coefficients=Int32Array.from([0]):(this.coefficients=new Int32Array(e-i),F.arraycopy(r,i,this.coefficients,0,this.coefficients.length))}else this.coefficients=r}return n.prototype.getCoefficients=function(){return this.coefficients},n.prototype.getDegree=function(){return this.coefficients.length-1},n.prototype.isZero=function(){return this.coefficients[0]===0},n.prototype.getCoefficient=function(t){return this.coefficients[this.coefficients.length-1-t]},n.prototype.evaluateAt=function(t){if(t===0)return this.getCoefficient(0);var r=this.coefficients,e;if(t===1){e=0;for(var i=0,o=r.length;i!==o;i++){var a=r[i];e=nt.addOrSubtract(e,a)}return e}e=r[0];for(var s=r.length,f=this.field,i=1;i<s;i++)e=nt.addOrSubtract(f.multiply(t,e),r[i]);return e},n.prototype.addOrSubtract=function(t){if(!this.field.equals(t.field))throw new _("GenericGFPolys do not have same GenericGF field");if(this.isZero())return t;if(t.isZero())return this;var r=this.coefficients,e=t.coefficients;if(r.length>e.length){var i=r;r=e,e=i}var o=new Int32Array(e.length),a=e.length-r.length;F.arraycopy(e,0,o,0,a);for(var s=a;s<e.length;s++)o[s]=nt.addOrSubtract(r[s-a],e[s]);return new n(this.field,o)},n.prototype.multiply=function(t){if(!this.field.equals(t.field))throw new _("GenericGFPolys do not have same GenericGF field");if(this.isZero()||t.isZero())return this.field.getZero();for(var r=this.coefficients,e=r.length,i=t.coefficients,o=i.length,a=new Int32Array(e+o-1),s=this.field,f=0;f<e;f++)for(var h=r[f],u=0;u<o;u++)a[f+u]=nt.addOrSubtract(a[f+u],s.multiply(h,i[u]));return new n(s,a)},n.prototype.multiplyScalar=function(t){if(t===0)return this.field.getZero();if(t===1)return this;for(var r=this.coefficients.length,e=this.field,i=new Int32Array(r),o=this.coefficients,a=0;a<r;a++)i[a]=e.multiply(o[a],t);return new n(e,i)},n.prototype.multiplyByMonomial=function(t,r){if(t<0)throw new _;if(r===0)return this.field.getZero();for(var e=this.coefficients,i=e.length,o=new Int32Array(i+t),a=this.field,s=0;s<i;s++)o[s]=a.multiply(e[s],r);return new n(a,o)},n.prototype.divide=function(t){if(!this.field.equals(t.field))throw new _("GenericGFPolys do not have same GenericGF field");if(t.isZero())throw new _("Divide by 0");for(var r=this.field,e=r.getZero(),i=this,o=t.getCoefficient(t.getDegree()),a=r.inverse(o);i.getDegree()>=t.getDegree()&&!i.isZero();){var s=i.getDegree()-t.getDegree(),f=r.multiply(i.getCoefficient(i.getDegree()),a),h=t.multiplyByMonomial(s,f),u=r.buildMonomial(s,f);e=e.addOrSubtract(u),i=i.addOrSubtract(h)}return[e,i]},n.prototype.toString=function(){for(var t="",r=this.getDegree();r>=0;r--){var e=this.getCoefficient(r);if(e!==0){if(e<0?(t+=" - ",e=-e):t.length>0&&(t+=" + "),r===0||e!==1){var i=this.field.log(e);i===0?t+="1":i===1?t+="a":(t+="a^",t+=i)}r!==0&&(r===1?t+="x":(t+="x^",t+=r))}}return t},n})(),it=Pe;var Le=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ke=(function(n){Le(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.kind="ArithmeticException",t})(k),er=ke;var Ue=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),ze=(function(n){Ue(t,n);function t(r,e,i){var o=n.call(this)||this;o.primitive=r,o.size=e,o.generatorBase=i;for(var a=new Int32Array(e),s=1,f=0;f<e;f++)a[f]=s,s*=2,s>=e&&(s^=r,s&=e-1);o.expTable=a;for(var h=new Int32Array(e),f=0;f<e-1;f++)h[a[f]]=f;return o.logTable=h,o.zero=new it(o,Int32Array.from([0])),o.one=new it(o,Int32Array.from([1])),o}return t.prototype.getZero=function(){return this.zero},t.prototype.getOne=function(){return this.one},t.prototype.buildMonomial=function(r,e){if(r<0)throw new _;if(e===0)return this.zero;var i=new Int32Array(r+1);return i[0]=e,new it(this,i)},t.prototype.inverse=function(r){if(r===0)throw new er;return this.expTable[this.size-this.logTable[r]-1]},t.prototype.multiply=function(r,e){return r===0||e===0?0:this.expTable[(this.logTable[r]+this.logTable[e])%(this.size-1)]},t.prototype.getSize=function(){return this.size},t.prototype.getGeneratorBase=function(){return this.generatorBase},t.prototype.toString=function(){return"GF(0x"+J.toHexString(this.primitive)+","+this.size+")"},t.prototype.equals=function(r){return r===this},t.AZTEC_DATA_12=new t(4201,4096,1),t.AZTEC_DATA_10=new t(1033,1024,1),t.AZTEC_DATA_6=new t(67,64,1),t.AZTEC_PARAM=new t(19,16,1),t.QR_CODE_FIELD_256=new t(285,256,0),t.DATA_MATRIX_FIELD_256=new t(301,256,1),t.AZTEC_DATA_8=t.DATA_MATRIX_FIELD_256,t.MAXICODE_FIELD_64=t.AZTEC_DATA_6,t})(nt),Et=ze;var Xe=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Ge=(function(n){Xe(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.kind="ReedSolomonException",t})(k),pt=Ge;var He=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),We=(function(n){He(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.kind="IllegalStateException",t})(k),yt=We;var Ze=(function(){function n(t){this.field=t}return n.prototype.decode=function(t,r){for(var e=this.field,i=new it(e,t),o=new Int32Array(r),a=!0,s=0;s<r;s++){var f=i.evaluateAt(e.exp(s+e.getGeneratorBase()));o[o.length-1-s]=f,f!==0&&(a=!1)}if(!a)for(var h=new it(e,o),u=this.runEuclideanAlgorithm(e.buildMonomial(r,1),h,r),l=u[0],c=u[1],p=this.findErrorLocations(l),d=this.findErrorMagnitudes(c,p),s=0;s<p.length;s++){var v=t.length-1-e.log(p[s]);if(v<0)throw new pt("Bad error location");t[v]=Et.addOrSubtract(t[v],d[s])}},n.prototype.runEuclideanAlgorithm=function(t,r,e){if(t.getDegree()<r.getDegree()){var i=t;t=r,r=i}for(var o=this.field,a=t,s=r,f=o.getZero(),h=o.getOne();s.getDegree()>=(e/2|0);){var u=a,l=f;if(a=s,f=h,a.isZero())throw new pt("r_{i-1} was zero");s=u;for(var c=o.getZero(),p=a.getCoefficient(a.getDegree()),d=o.inverse(p);s.getDegree()>=a.getDegree()&&!s.isZero();){var v=s.getDegree()-a.getDegree(),w=o.multiply(s.getCoefficient(s.getDegree()),d);c=c.addOrSubtract(o.buildMonomial(v,w)),s=s.addOrSubtract(a.multiplyByMonomial(v,w))}if(h=c.multiply(f).addOrSubtract(l),s.getDegree()>=a.getDegree())throw new yt("Division algorithm failed to reduce polynomial?")}var E=h.getCoefficient(0);if(E===0)throw new pt("sigmaTilde(0) was zero");var y=o.inverse(E),m=h.multiplyScalar(y),C=s.multiplyScalar(y);return[m,C]},n.prototype.findErrorLocations=function(t){var r=t.getDegree();if(r===1)return Int32Array.from([t.getCoefficient(1)]);for(var e=new Int32Array(r),i=0,o=this.field,a=1;a<o.getSize()&&i<r;a++)t.evaluateAt(a)===0&&(e[i]=o.inverse(a),i++);if(i!==r)throw new pt("Error locator degree does not match number of roots");return e},n.prototype.findErrorMagnitudes=function(t,r){for(var e=r.length,i=new Int32Array(e),o=this.field,a=0;a<e;a++){for(var s=o.inverse(r[a]),f=1,h=0;h<e;h++)if(a!==h){var u=o.multiply(r[h],s),l=(u&1)===0?u|1:u&-2;f=o.multiply(f,l)}i[a]=o.multiply(t.evaluateAt(s),o.inverse(f)),o.getGeneratorBase()!==0&&(i[a]=o.multiply(i[a],s))}return i},n})(),nr=Ze;var ir=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},T=(function(){function n(t,r,e){this.ecCodewords=t,this.ecBlocks=[r],e&&this.ecBlocks.push(e)}return n.prototype.getECCodewords=function(){return this.ecCodewords},n.prototype.getECBlocks=function(){return this.ecBlocks},n})();var I=(function(){function n(t,r){this.count=t,this.dataCodewords=r}return n.prototype.getCount=function(){return this.count},n.prototype.getDataCodewords=function(){return this.dataCodewords},n})();var je=(function(){function n(t,r,e,i,o,a){var s,f;this.versionNumber=t,this.symbolSizeRows=r,this.symbolSizeColumns=e,this.dataRegionSizeRows=i,this.dataRegionSizeColumns=o,this.ecBlocks=a;var h=0,u=a.getECCodewords(),l=a.getECBlocks();try{for(var c=ir(l),p=c.next();!p.done;p=c.next()){var d=p.value;h+=d.getCount()*(d.getDataCodewords()+u)}}catch(v){s={error:v}}finally{try{p&&!p.done&&(f=c.return)&&f.call(c)}finally{if(s)throw s.error}}this.totalCodewords=h}return n.prototype.getVersionNumber=function(){return this.versionNumber},n.prototype.getSymbolSizeRows=function(){return this.symbolSizeRows},n.prototype.getSymbolSizeColumns=function(){return this.symbolSizeColumns},n.prototype.getDataRegionSizeRows=function(){return this.dataRegionSizeRows},n.prototype.getDataRegionSizeColumns=function(){return this.dataRegionSizeColumns},n.prototype.getTotalCodewords=function(){return this.totalCodewords},n.prototype.getECBlocks=function(){return this.ecBlocks},n.getVersionForDimensions=function(t,r){var e,i;if((t&1)!==0||(r&1)!==0)throw new M;try{for(var o=ir(n.VERSIONS),a=o.next();!a.done;a=o.next()){var s=a.value;if(s.symbolSizeRows===t&&s.symbolSizeColumns===r)return s}}catch(f){e={error:f}}finally{try{a&&!a.done&&(i=o.return)&&i.call(o)}finally{if(e)throw e.error}}throw new M},n.prototype.toString=function(){return""+this.versionNumber},n.buildVersions=function(){return[new n(1,10,10,8,8,new T(5,new I(1,3))),new n(2,12,12,10,10,new T(7,new I(1,5))),new n(3,14,14,12,12,new T(10,new I(1,8))),new n(4,16,16,14,14,new T(12,new I(1,12))),new n(5,18,18,16,16,new T(14,new I(1,18))),new n(6,20,20,18,18,new T(18,new I(1,22))),new n(7,22,22,20,20,new T(20,new I(1,30))),new n(8,24,24,22,22,new T(24,new I(1,36))),new n(9,26,26,24,24,new T(28,new I(1,44))),new n(10,32,32,14,14,new T(36,new I(1,62))),new n(11,36,36,16,16,new T(42,new I(1,86))),new n(12,40,40,18,18,new T(48,new I(1,114))),new n(13,44,44,20,20,new T(56,new I(1,144))),new n(14,48,48,22,22,new T(68,new I(1,174))),new n(15,52,52,24,24,new T(42,new I(2,102))),new n(16,64,64,14,14,new T(56,new I(2,140))),new n(17,72,72,16,16,new T(36,new I(4,92))),new n(18,80,80,18,18,new T(48,new I(4,114))),new n(19,88,88,20,20,new T(56,new I(4,144))),new n(20,96,96,22,22,new T(68,new I(4,174))),new n(21,104,104,24,24,new T(56,new I(6,136))),new n(22,120,120,18,18,new T(68,new I(6,175))),new n(23,132,132,20,20,new T(62,new I(8,163))),new n(24,144,144,22,22,new T(62,new I(8,156),new I(2,155))),new n(25,8,18,6,16,new T(7,new I(1,5))),new n(26,8,32,6,14,new T(11,new I(1,10))),new n(27,12,26,10,24,new T(14,new I(1,16))),new n(28,12,36,10,16,new T(18,new I(1,22))),new n(29,16,36,14,16,new T(24,new I(1,32))),new n(30,16,48,14,22,new T(28,new I(1,49)))]},n.VERSIONS=n.buildVersions(),n})(),or=je;var Ke=(function(){function n(t){var r=t.getHeight();if(r<8||r>144||(r&1)!==0)throw new M;this.version=n.readVersion(t),this.mappingBitMatrix=this.extractDataRegion(t),this.readMappingMatrix=new q(this.mappingBitMatrix.getWidth(),this.mappingBitMatrix.getHeight())}return n.prototype.getVersion=function(){return this.version},n.readVersion=function(t){var r=t.getHeight(),e=t.getWidth();return or.getVersionForDimensions(r,e)},n.prototype.readCodewords=function(){var t=new Int8Array(this.version.getTotalCodewords()),r=0,e=4,i=0,o=this.mappingBitMatrix.getHeight(),a=this.mappingBitMatrix.getWidth(),s=!1,f=!1,h=!1,u=!1;do if(e===o&&i===0&&!s)t[r++]=this.readCorner1(o,a)&255,e-=2,i+=2,s=!0;else if(e===o-2&&i===0&&(a&3)!==0&&!f)t[r++]=this.readCorner2(o,a)&255,e-=2,i+=2,f=!0;else if(e===o+4&&i===2&&(a&7)===0&&!h)t[r++]=this.readCorner3(o,a)&255,e-=2,i+=2,h=!0;else if(e===o-2&&i===0&&(a&7)===4&&!u)t[r++]=this.readCorner4(o,a)&255,e-=2,i+=2,u=!0;else{do e<o&&i>=0&&!this.readMappingMatrix.get(i,e)&&(t[r++]=this.readUtah(e,i,o,a)&255),e-=2,i+=2;while(e>=0&&i<a);e+=1,i+=3;do e>=0&&i<a&&!this.readMappingMatrix.get(i,e)&&(t[r++]=this.readUtah(e,i,o,a)&255),e+=2,i-=2;while(e<o&&i>=0);e+=3,i+=1}while(e<o||i<a);if(r!==this.version.getTotalCodewords())throw new M;return t},n.prototype.readModule=function(t,r,e,i){return t<0&&(t+=e,r+=4-(e+4&7)),r<0&&(r+=i,t+=4-(i+4&7)),this.readMappingMatrix.set(r,t),this.mappingBitMatrix.get(r,t)},n.prototype.readUtah=function(t,r,e,i){var o=0;return this.readModule(t-2,r-2,e,i)&&(o|=1),o<<=1,this.readModule(t-2,r-1,e,i)&&(o|=1),o<<=1,this.readModule(t-1,r-2,e,i)&&(o|=1),o<<=1,this.readModule(t-1,r-1,e,i)&&(o|=1),o<<=1,this.readModule(t-1,r,e,i)&&(o|=1),o<<=1,this.readModule(t,r-2,e,i)&&(o|=1),o<<=1,this.readModule(t,r-1,e,i)&&(o|=1),o<<=1,this.readModule(t,r,e,i)&&(o|=1),o},n.prototype.readCorner1=function(t,r){var e=0;return this.readModule(t-1,0,t,r)&&(e|=1),e<<=1,this.readModule(t-1,1,t,r)&&(e|=1),e<<=1,this.readModule(t-1,2,t,r)&&(e|=1),e<<=1,this.readModule(0,r-2,t,r)&&(e|=1),e<<=1,this.readModule(0,r-1,t,r)&&(e|=1),e<<=1,this.readModule(1,r-1,t,r)&&(e|=1),e<<=1,this.readModule(2,r-1,t,r)&&(e|=1),e<<=1,this.readModule(3,r-1,t,r)&&(e|=1),e},n.prototype.readCorner2=function(t,r){var e=0;return this.readModule(t-3,0,t,r)&&(e|=1),e<<=1,this.readModule(t-2,0,t,r)&&(e|=1),e<<=1,this.readModule(t-1,0,t,r)&&(e|=1),e<<=1,this.readModule(0,r-4,t,r)&&(e|=1),e<<=1,this.readModule(0,r-3,t,r)&&(e|=1),e<<=1,this.readModule(0,r-2,t,r)&&(e|=1),e<<=1,this.readModule(0,r-1,t,r)&&(e|=1),e<<=1,this.readModule(1,r-1,t,r)&&(e|=1),e},n.prototype.readCorner3=function(t,r){var e=0;return this.readModule(t-1,0,t,r)&&(e|=1),e<<=1,this.readModule(t-1,r-1,t,r)&&(e|=1),e<<=1,this.readModule(0,r-3,t,r)&&(e|=1),e<<=1,this.readModule(0,r-2,t,r)&&(e|=1),e<<=1,this.readModule(0,r-1,t,r)&&(e|=1),e<<=1,this.readModule(1,r-3,t,r)&&(e|=1),e<<=1,this.readModule(1,r-2,t,r)&&(e|=1),e<<=1,this.readModule(1,r-1,t,r)&&(e|=1),e},n.prototype.readCorner4=function(t,r){var e=0;return this.readModule(t-3,0,t,r)&&(e|=1),e<<=1,this.readModule(t-2,0,t,r)&&(e|=1),e<<=1,this.readModule(t-1,0,t,r)&&(e|=1),e<<=1,this.readModule(0,r-2,t,r)&&(e|=1),e<<=1,this.readModule(0,r-1,t,r)&&(e|=1),e<<=1,this.readModule(1,r-1,t,r)&&(e|=1),e<<=1,this.readModule(2,r-1,t,r)&&(e|=1),e<<=1,this.readModule(3,r-1,t,r)&&(e|=1),e},n.prototype.extractDataRegion=function(t){var r=this.version.getSymbolSizeRows(),e=this.version.getSymbolSizeColumns();if(t.getHeight()!==r)throw new _("Dimension of bitMatrix must match the version size");for(var i=this.version.getDataRegionSizeRows(),o=this.version.getDataRegionSizeColumns(),a=r/i|0,s=e/o|0,f=a*i,h=s*o,u=new q(h,f),l=0;l<a;++l)for(var c=l*i,p=0;p<s;++p)for(var d=p*o,v=0;v<i;++v)for(var w=l*(i+2)+1+v,E=c+v,y=0;y<o;++y){var m=p*(o+2)+1+y;if(t.get(m,w)){var C=d+y;u.set(C,E)}}return u},n})(),ar=Ke;var sr=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ye=(function(){function n(t,r){this.numDataCodewords=t,this.codewords=r}return n.getDataBlocks=function(t,r){var e,i,o,a,s=r.getECBlocks(),f=0,h=s.getECBlocks();try{for(var u=sr(h),l=u.next();!l.done;l=u.next()){var c=l.value;f+=c.getCount()}}catch(At){e={error:At}}finally{try{l&&!l.done&&(i=u.return)&&i.call(u)}finally{if(e)throw e.error}}var p=new Array(f),d=0;try{for(var v=sr(h),w=v.next();!w.done;w=v.next())for(var c=w.value,E=0;E<c.getCount();E++){var y=c.getDataCodewords(),m=s.getECCodewords()+y;p[d++]=new n(y,new Uint8Array(m))}}catch(At){o={error:At}}finally{try{w&&!w.done&&(a=v.return)&&a.call(v)}finally{if(o)throw o.error}}for(var C=p[0].codewords.length,z=C-s.getECCodewords(),Y=z-1,W=0,E=0;E<Y;E++)for(var Z=0;Z<d;Z++)p[Z].codewords[E]=t[W++];for(var V=r.getVersionNumber()===24,kr=V?8:d,Z=0;Z<kr;Z++)p[Z].codewords[z-1]=t[W++];for(var Ur=p[0].codewords.length,E=z;E<Ur;E++)for(var Z=0;Z<d;Z++){var Kt=V?(Z+8)%d:Z,zr=V&&Kt>7?E-1:E;p[Kt].codewords[zr]=t[W++]}if(W!==t.length)throw new _;return p},n.prototype.getNumDataCodewords=function(){return this.numDataCodewords},n.prototype.getCodewords=function(){return this.codewords},n})(),fr=Ye;var qe=(function(){function n(t,r,e,i,o,a){o===void 0&&(o=-1),a===void 0&&(a=-1),this.rawBytes=t,this.text=r,this.byteSegments=e,this.ecLevel=i,this.structuredAppendSequenceNumber=o,this.structuredAppendParity=a,this.numBits=t==null?0:8*t.length}return n.prototype.getRawBytes=function(){return this.rawBytes},n.prototype.getNumBits=function(){return this.numBits},n.prototype.setNumBits=function(t){this.numBits=t},n.prototype.getText=function(){return this.text},n.prototype.getByteSegments=function(){return this.byteSegments},n.prototype.getECLevel=function(){return this.ecLevel},n.prototype.getErrorsCorrected=function(){return this.errorsCorrected},n.prototype.setErrorsCorrected=function(t){this.errorsCorrected=t},n.prototype.getErasures=function(){return this.erasures},n.prototype.setErasures=function(t){this.erasures=t},n.prototype.getOther=function(){return this.other},n.prototype.setOther=function(t){this.other=t},n.prototype.hasStructuredAppend=function(){return this.structuredAppendParity>=0&&this.structuredAppendSequenceNumber>=0},n.prototype.getStructuredAppendParity=function(){return this.structuredAppendParity},n.prototype.getStructuredAppendSequenceNumber=function(){return this.structuredAppendSequenceNumber},n})(),hr=qe;var Je=(function(){function n(t){this.bytes=t,this.byteOffset=0,this.bitOffset=0}return n.prototype.getBitOffset=function(){return this.bitOffset},n.prototype.getByteOffset=function(){return this.byteOffset},n.prototype.readBits=function(t){if(t<1||t>32||t>this.available())throw new _(""+t);var r=0,e=this.bitOffset,i=this.byteOffset,o=this.bytes;if(e>0){var a=8-e,s=t<a?t:a,f=a-s,h=255>>8-s<<f;r=(o[i]&h)>>f,t-=s,e+=s,e===8&&(e=0,i++)}if(t>0){for(;t>=8;)r=r<<8|o[i]&255,i++,t-=8;if(t>0){var f=8-t,h=255>>f<<f;r=r<<t|(o[i]&h)>>f,e+=t}}return this.bitOffset=e,this.byteOffset=i,r},n.prototype.available=function(){return 8*(this.bytes.length-this.byteOffset)-this.bitOffset},n})(),ur=Je;var P;(function(n){n[n.PAD_ENCODE=0]="PAD_ENCODE",n[n.ASCII_ENCODE=1]="ASCII_ENCODE",n[n.C40_ENCODE=2]="C40_ENCODE",n[n.TEXT_ENCODE=3]="TEXT_ENCODE",n[n.ANSIX12_ENCODE=4]="ANSIX12_ENCODE",n[n.EDIFACT_ENCODE=5]="EDIFACT_ENCODE",n[n.BASE256_ENCODE=6]="BASE256_ENCODE"})(P||(P={}));var Qe=(function(){function n(){}return n.decode=function(t){var r=new ur(t),e=new D,i=new D,o=new Array,a=P.ASCII_ENCODE;do if(a===P.ASCII_ENCODE)a=this.decodeAsciiSegment(r,e,i);else{switch(a){case P.C40_ENCODE:this.decodeC40Segment(r,e);break;case P.TEXT_ENCODE:this.decodeTextSegment(r,e);break;case P.ANSIX12_ENCODE:this.decodeAnsiX12Segment(r,e);break;case P.EDIFACT_ENCODE:this.decodeEdifactSegment(r,e);break;case P.BASE256_ENCODE:this.decodeBase256Segment(r,e,o);break;default:throw new M}a=P.ASCII_ENCODE}while(a!==P.PAD_ENCODE&&r.available()>0);return i.length()>0&&e.append(i.toString()),new hr(t,e.toString(),o.length===0?null:o,null)},n.decodeAsciiSegment=function(t,r,e){var i=!1;do{var o=t.readBits(8);if(o===0)throw new M;if(o<=128)return i&&(o+=128),r.append(String.fromCharCode(o-1)),P.ASCII_ENCODE;if(o===129)return P.PAD_ENCODE;if(o<=229){var a=o-130;a<10&&r.append("0"),r.append(""+a)}else switch(o){case 230:return P.C40_ENCODE;case 231:return P.BASE256_ENCODE;case 232:r.append("");break;case 233:case 234:break;case 235:i=!0;break;case 236:r.append("[)>05"),e.insert(0,"");break;case 237:r.append("[)>06"),e.insert(0,"");break;case 238:return P.ANSIX12_ENCODE;case 239:return P.TEXT_ENCODE;case 240:return P.EDIFACT_ENCODE;case 241:break;default:if(o!==254||t.available()!==0)throw new M;break}}while(t.available()>0);return P.ASCII_ENCODE},n.decodeC40Segment=function(t,r){var e=!1,i=[],o=0;do{if(t.available()===8)return;var a=t.readBits(8);if(a===254)return;this.parseTwoBytes(a,t.readBits(8),i);for(var s=0;s<3;s++){var f=i[s];switch(o){case 0:if(f<3)o=f+1;else if(f<this.C40_BASIC_SET_CHARS.length){var h=this.C40_BASIC_SET_CHARS[f];e?(r.append(String.fromCharCode(h.charCodeAt(0)+128)),e=!1):r.append(h)}else throw new M;break;case 1:e?(r.append(String.fromCharCode(f+128)),e=!1):r.append(String.fromCharCode(f)),o=0;break;case 2:if(f<this.C40_SHIFT2_SET_CHARS.length){var h=this.C40_SHIFT2_SET_CHARS[f];e?(r.append(String.fromCharCode(h.charCodeAt(0)+128)),e=!1):r.append(h)}else switch(f){case 27:r.append("");break;case 30:e=!0;break;default:throw new M}o=0;break;case 3:e?(r.append(String.fromCharCode(f+224)),e=!1):r.append(String.fromCharCode(f+96)),o=0;break;default:throw new M}}}while(t.available()>0)},n.decodeTextSegment=function(t,r){var e=!1,i=[],o=0;do{if(t.available()===8)return;var a=t.readBits(8);if(a===254)return;this.parseTwoBytes(a,t.readBits(8),i);for(var s=0;s<3;s++){var f=i[s];switch(o){case 0:if(f<3)o=f+1;else if(f<this.TEXT_BASIC_SET_CHARS.length){var h=this.TEXT_BASIC_SET_CHARS[f];e?(r.append(String.fromCharCode(h.charCodeAt(0)+128)),e=!1):r.append(h)}else throw new M;break;case 1:e?(r.append(String.fromCharCode(f+128)),e=!1):r.append(String.fromCharCode(f)),o=0;break;case 2:if(f<this.TEXT_SHIFT2_SET_CHARS.length){var h=this.TEXT_SHIFT2_SET_CHARS[f];e?(r.append(String.fromCharCode(h.charCodeAt(0)+128)),e=!1):r.append(h)}else switch(f){case 27:r.append("");break;case 30:e=!0;break;default:throw new M}o=0;break;case 3:if(f<this.TEXT_SHIFT3_SET_CHARS.length){var h=this.TEXT_SHIFT3_SET_CHARS[f];e?(r.append(String.fromCharCode(h.charCodeAt(0)+128)),e=!1):r.append(h),o=0}else throw new M;break;default:throw new M}}}while(t.available()>0)},n.decodeAnsiX12Segment=function(t,r){var e=[];do{if(t.available()===8)return;var i=t.readBits(8);if(i===254)return;this.parseTwoBytes(i,t.readBits(8),e);for(var o=0;o<3;o++){var a=e[o];switch(a){case 0:r.append("\r");break;case 1:r.append("*");break;case 2:r.append(">");break;case 3:r.append(" ");break;default:if(a<14)r.append(String.fromCharCode(a+44));else if(a<40)r.append(String.fromCharCode(a+51));else throw new M;break}}}while(t.available()>0)},n.parseTwoBytes=function(t,r,e){var i=(t<<8)+r-1,o=Math.floor(i/1600);e[0]=o,i-=o*1600,o=Math.floor(i/40),e[1]=o,e[2]=i-o*40},n.decodeEdifactSegment=function(t,r){do{if(t.available()<=16)return;for(var e=0;e<4;e++){var i=t.readBits(6);if(i===31){var o=8-t.getBitOffset();o!==8&&t.readBits(o);return}(i&32)===0&&(i|=64),r.append(String.fromCharCode(i))}}while(t.available()>0)},n.decodeBase256Segment=function(t,r,e){var i=1+t.getByteOffset(),o=this.unrandomize255State(t.readBits(8),i++),a;if(o===0?a=t.available()/8|0:o<250?a=o:a=250*(o-249)+this.unrandomize255State(t.readBits(8),i++),a<0)throw new M;for(var s=new Uint8Array(a),f=0;f<a;f++){if(t.available()<8)throw new M;s[f]=this.unrandomize255State(t.readBits(8),i++)}e.push(s);try{r.append(tt.decode(s,X.ISO88591))}catch(h){throw new yt("Platform does not support required encoding: "+h.message)}},n.unrandomize255State=function(t,r){var e=149*r%255+1,i=t-e;return i>=0?i:i+256},n.C40_BASIC_SET_CHARS=["*","*","*"," ","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],n.C40_SHIFT2_SET_CHARS=["!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/",":",";","<","=",">","?","@","[","\\","]","^","_"],n.TEXT_BASIC_SET_CHARS=["*","*","*"," ","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],n.TEXT_SHIFT2_SET_CHARS=n.C40_SHIFT2_SET_CHARS,n.TEXT_SHIFT3_SET_CHARS=["`","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","{","|","}","~","\x7F"],n})(),lr=Qe;var $e=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ve=(function(){function n(){this.rsDecoder=new nr(Et.DATA_MATRIX_FIELD_256)}return n.prototype.decode=function(t){var r,e,i=new ar(t),o=i.getVersion(),a=i.readCodewords(),s=fr.getDataBlocks(a,o),f=0;try{for(var h=$e(s),u=h.next();!u.done;u=h.next()){var l=u.value;f+=l.getNumDataCodewords()}}catch(m){r={error:m}}finally{try{u&&!u.done&&(e=h.return)&&e.call(h)}finally{if(r)throw r.error}}for(var c=new Uint8Array(f),p=s.length,d=0;d<p;d++){var v=s[d],w=v.getCodewords(),E=v.getNumDataCodewords();this.correctErrors(w,E);for(var y=0;y<E;y++)c[y*p+d]=w[y]}return lr.decode(c)},n.prototype.correctErrors=function(t,r){var e=new Int32Array(t);try{this.rsDecoder.decode(e,t.length-r)}catch{throw new rr}for(var i=0;i<r;i++)t[i]=e[i]},n})(),cr=Ve;var tn=(function(){function n(){}return n.round=function(t){return isNaN(t)?0:t<=Number.MIN_SAFE_INTEGER?Number.MIN_SAFE_INTEGER:t>=Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:t+(t<0?-.5:.5)|0},n.distance=function(t,r,e,i){var o=t-e,a=r-i;return Math.sqrt(o*o+a*a)},n.sum=function(t){for(var r=0,e=0,i=t.length;e!==i;e++){var o=t[e];r+=o}return r},n})(),ot=tn;var rn=(function(){function n(){}return n.floatToIntBits=function(t){return t},n.MAX_VALUE=Number.MAX_SAFE_INTEGER,n})(),Bt=rn;var en=(function(){function n(t,r){this.x=t,this.y=r}return n.prototype.getX=function(){return this.x},n.prototype.getY=function(){return this.y},n.prototype.equals=function(t){if(t instanceof n){var r=t;return this.x===r.x&&this.y===r.y}return!1},n.prototype.hashCode=function(){return 31*Bt.floatToIntBits(this.x)+Bt.floatToIntBits(this.y)},n.prototype.toString=function(){return"("+this.x+","+this.y+")"},n.orderBestPatterns=function(t){var r=this.distance(t[0],t[1]),e=this.distance(t[1],t[2]),i=this.distance(t[0],t[2]),o,a,s;if(e>=r&&e>=i?(a=t[0],o=t[1],s=t[2]):i>=e&&i>=r?(a=t[1],o=t[0],s=t[2]):(a=t[2],o=t[0],s=t[1]),this.crossProductZ(o,a,s)<0){var f=o;o=s,s=f}t[0]=o,t[1]=a,t[2]=s},n.distance=function(t,r){return ot.distance(t.x,t.y,r.x,r.y)},n.crossProductZ=function(t,r,e){var i=r.x,o=r.y;return(e.x-i)*(t.y-o)-(e.y-o)*(t.x-i)},n})(),K=en;var nn=(function(){function n(t,r,e,i){this.image=t,this.height=t.getHeight(),this.width=t.getWidth(),r==null&&(r=n.INIT_SIZE),e==null&&(e=t.getWidth()/2|0),i==null&&(i=t.getHeight()/2|0);var o=r/2|0;if(this.leftInit=e-o,this.rightInit=e+o,this.upInit=i-o,this.downInit=i+o,this.upInit<0||this.leftInit<0||this.downInit>=this.height||this.rightInit>=this.width)throw new B}return n.prototype.detect=function(){for(var t=this.leftInit,r=this.rightInit,e=this.upInit,i=this.downInit,o=!1,a=!0,s=!1,f=!1,h=!1,u=!1,l=!1,c=this.width,p=this.height;a;){a=!1;for(var d=!0;(d||!f)&&r<c;)d=this.containsBlackPoint(e,i,r,!1),d?(r++,a=!0,f=!0):f||r++;if(r>=c){o=!0;break}for(var v=!0;(v||!h)&&i<p;)v=this.containsBlackPoint(t,r,i,!0),v?(i++,a=!0,h=!0):h||i++;if(i>=p){o=!0;break}for(var w=!0;(w||!u)&&t>=0;)w=this.containsBlackPoint(e,i,t,!1),w?(t--,a=!0,u=!0):u||t--;if(t<0){o=!0;break}for(var E=!0;(E||!l)&&e>=0;)E=this.containsBlackPoint(t,r,e,!0),E?(e--,a=!0,l=!0):l||e--;if(e<0){o=!0;break}a&&(s=!0)}if(!o&&s){for(var y=r-t,m=null,C=1;m===null&&C<y;C++)m=this.getBlackPointOnSegment(t,i-C,t+C,i);if(m==null)throw new B;for(var z=null,C=1;z===null&&C<y;C++)z=this.getBlackPointOnSegment(t,e+C,t+C,e);if(z==null)throw new B;for(var Y=null,C=1;Y===null&&C<y;C++)Y=this.getBlackPointOnSegment(r,e+C,r-C,e);if(Y==null)throw new B;for(var W=null,C=1;W===null&&C<y;C++)W=this.getBlackPointOnSegment(r,i-C,r-C,i);if(W==null)throw new B;return this.centerEdges(W,m,Y,z)}else throw new B},n.prototype.getBlackPointOnSegment=function(t,r,e,i){for(var o=ot.round(ot.distance(t,r,e,i)),a=(e-t)/o,s=(i-r)/o,f=this.image,h=0;h<o;h++){var u=ot.round(t+h*a),l=ot.round(r+h*s);if(f.get(u,l))return new K(u,l)}return null},n.prototype.centerEdges=function(t,r,e,i){var o=t.getX(),a=t.getY(),s=r.getX(),f=r.getY(),h=e.getX(),u=e.getY(),l=i.getX(),c=i.getY(),p=n.CORR;return o<this.width/2?[new K(l-p,c+p),new K(s+p,f+p),new K(h-p,u-p),new K(o+p,a-p)]:[new K(l+p,c+p),new K(s+p,f-p),new K(h-p,u+p),new K(o-p,a-p)]},n.prototype.containsBlackPoint=function(t,r,e,i){var o=this.image;if(i){for(var a=t;a<=r;a++)if(o.get(a,e))return!0}else for(var s=t;s<=r;s++)if(o.get(e,s))return!0;return!1},n.INIT_SIZE=10,n.CORR=1,n})(),pr=nn;var on=(function(){function n(t,r){this.bits=t,this.points=r}return n.prototype.getBits=function(){return this.bits},n.prototype.getPoints=function(){return this.points},n})(),dr=on;var an=(function(){function n(){}return n.checkAndNudgePoints=function(t,r){for(var e=t.getWidth(),i=t.getHeight(),o=!0,a=0;a<r.length&&o;a+=2){var s=Math.floor(r[a]),f=Math.floor(r[a+1]);if(s<-1||s>e||f<-1||f>i)throw new B;o=!1,s===-1?(r[a]=0,o=!0):s===e&&(r[a]=e-1,o=!0),f===-1?(r[a+1]=0,o=!0):f===i&&(r[a+1]=i-1,o=!0)}o=!0;for(var a=r.length-2;a>=0&&o;a-=2){var s=Math.floor(r[a]),f=Math.floor(r[a+1]);if(s<-1||s>e||f<-1||f>i)throw new B;o=!1,s===-1?(r[a]=0,o=!0):s===e&&(r[a]=e-1,o=!0),f===-1?(r[a+1]=0,o=!0):f===i&&(r[a+1]=i-1,o=!0)}},n})(),Nt=an;var sn=(function(){function n(t,r,e,i,o,a,s,f,h){this.a11=t,this.a21=r,this.a31=e,this.a12=i,this.a22=o,this.a32=a,this.a13=s,this.a23=f,this.a33=h}return n.quadrilateralToQuadrilateral=function(t,r,e,i,o,a,s,f,h,u,l,c,p,d,v,w){var E=n.quadrilateralToSquare(t,r,e,i,o,a,s,f),y=n.squareToQuadrilateral(h,u,l,c,p,d,v,w);return y.times(E)},n.prototype.transformPoints=function(t){for(var r=t.length,e=this.a11,i=this.a12,o=this.a13,a=this.a21,s=this.a22,f=this.a23,h=this.a31,u=this.a32,l=this.a33,c=0;c<r;c+=2){var p=t[c],d=t[c+1],v=o*p+f*d+l;t[c]=(e*p+a*d+h)/v,t[c+1]=(i*p+s*d+u)/v}},n.prototype.transformPointsWithValues=function(t,r){for(var e=this.a11,i=this.a12,o=this.a13,a=this.a21,s=this.a22,f=this.a23,h=this.a31,u=this.a32,l=this.a33,c=t.length,p=0;p<c;p++){var d=t[p],v=r[p],w=o*d+f*v+l;t[p]=(e*d+a*v+h)/w,r[p]=(i*d+s*v+u)/w}},n.squareToQuadrilateral=function(t,r,e,i,o,a,s,f){var h=t-e+o-s,u=r-i+a-f;if(h===0&&u===0)return new n(e-t,o-e,t,i-r,a-i,r,0,0,1);var l=e-o,c=s-o,p=i-a,d=f-a,v=l*d-c*p,w=(h*d-c*u)/v,E=(l*u-h*p)/v;return new n(e-t+w*e,s-t+E*s,t,i-r+w*i,f-r+E*f,r,w,E,1)},n.quadrilateralToSquare=function(t,r,e,i,o,a,s,f){return n.squareToQuadrilateral(t,r,e,i,o,a,s,f).buildAdjoint()},n.prototype.buildAdjoint=function(){return new n(this.a22*this.a33-this.a23*this.a32,this.a23*this.a31-this.a21*this.a33,this.a21*this.a32-this.a22*this.a31,this.a13*this.a32-this.a12*this.a33,this.a11*this.a33-this.a13*this.a31,this.a12*this.a31-this.a11*this.a32,this.a12*this.a23-this.a13*this.a22,this.a13*this.a21-this.a11*this.a23,this.a11*this.a22-this.a12*this.a21)},n.prototype.times=function(t){return new n(this.a11*t.a11+this.a21*t.a12+this.a31*t.a13,this.a11*t.a21+this.a21*t.a22+this.a31*t.a23,this.a11*t.a31+this.a21*t.a32+this.a31*t.a33,this.a12*t.a11+this.a22*t.a12+this.a32*t.a13,this.a12*t.a21+this.a22*t.a22+this.a32*t.a23,this.a12*t.a31+this.a22*t.a32+this.a32*t.a33,this.a13*t.a11+this.a23*t.a12+this.a33*t.a13,this.a13*t.a21+this.a23*t.a22+this.a33*t.a23,this.a13*t.a31+this.a23*t.a32+this.a33*t.a33)},n})(),vr=sn;var fn=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),hn=(function(n){fn(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.prototype.sampleGrid=function(r,e,i,o,a,s,f,h,u,l,c,p,d,v,w,E,y,m,C){var z=vr.quadrilateralToQuadrilateral(o,a,s,f,h,u,l,c,p,d,v,w,E,y,m,C);return this.sampleGridWithTransform(r,e,i,z)},t.prototype.sampleGridWithTransform=function(r,e,i,o){if(e<=0||i<=0)throw new B;for(var a=new q(e,i),s=new Float32Array(2*e),f=0;f<i;f++){for(var h=s.length,u=f+.5,l=0;l<h;l+=2)s[l]=l/2+.5,s[l+1]=u;o.transformPoints(s),Nt.checkAndNudgePoints(r,s);try{for(var l=0;l<h;l+=2)r.get(Math.floor(s[l]),Math.floor(s[l+1]))&&a.set(l/2,f)}catch{throw new B}}return a},t})(Nt),gr=hn;var un=(function(){function n(){}return n.setGridSampler=function(t){n.gridSampler=t},n.getInstance=function(){return n.gridSampler},n.gridSampler=new gr,n})(),Cr=un;var ln=(function(){function n(t){this.image=t,this.rectangleDetector=new pr(this.image)}return n.prototype.detect=function(){var t=this.rectangleDetector.detect(),r=this.detectSolid1(t);if(r=this.detectSolid2(r),r[3]=this.correctTopRight(r),!r[3])throw new B;r=this.shiftToModuleCenter(r);var e=r[0],i=r[1],o=r[2],a=r[3],s=this.transitionsBetween(e,a)+1,f=this.transitionsBetween(o,a)+1;(s&1)===1&&(s+=1),(f&1)===1&&(f+=1),4*s<7*f&&4*f<7*s&&(s=f=Math.max(s,f));var h=n.sampleGrid(this.image,e,i,o,a,s,f);return new dr(h,[e,i,o,a])},n.shiftPoint=function(t,r,e){var i=(r.getX()-t.getX())/(e+1),o=(r.getY()-t.getY())/(e+1);return new K(t.getX()+i,t.getY()+o)},n.moveAway=function(t,r,e){var i=t.getX(),o=t.getY();return i<r?i-=1:i+=1,o<e?o-=1:o+=1,new K(i,o)},n.prototype.detectSolid1=function(t){var r=t[0],e=t[1],i=t[3],o=t[2],a=this.transitionsBetween(r,e),s=this.transitionsBetween(e,i),f=this.transitionsBetween(i,o),h=this.transitionsBetween(o,r),u=a,l=[o,r,e,i];return u>s&&(u=s,l[0]=r,l[1]=e,l[2]=i,l[3]=o),u>f&&(u=f,l[0]=e,l[1]=i,l[2]=o,l[3]=r),u>h&&(l[0]=i,l[1]=o,l[2]=r,l[3]=e),l},n.prototype.detectSolid2=function(t){var r=t[0],e=t[1],i=t[2],o=t[3],a=this.transitionsBetween(r,o),s=n.shiftPoint(e,i,(a+1)*4),f=n.shiftPoint(i,e,(a+1)*4),h=this.transitionsBetween(s,r),u=this.transitionsBetween(f,o);return h<u?(t[0]=r,t[1]=e,t[2]=i,t[3]=o):(t[0]=e,t[1]=i,t[2]=o,t[3]=r),t},n.prototype.correctTopRight=function(t){var r=t[0],e=t[1],i=t[2],o=t[3],a=this.transitionsBetween(r,o),s=this.transitionsBetween(e,o),f=n.shiftPoint(r,e,(s+1)*4),h=n.shiftPoint(i,e,(a+1)*4);a=this.transitionsBetween(f,o),s=this.transitionsBetween(h,o);var u=new K(o.getX()+(i.getX()-e.getX())/(a+1),o.getY()+(i.getY()-e.getY())/(a+1)),l=new K(o.getX()+(r.getX()-e.getX())/(s+1),o.getY()+(r.getY()-e.getY())/(s+1));if(!this.isValid(u))return this.isValid(l)?l:null;if(!this.isValid(l))return u;var c=this.transitionsBetween(f,u)+this.transitionsBetween(h,u),p=this.transitionsBetween(f,l)+this.transitionsBetween(h,l);return c>p?u:l},n.prototype.shiftToModuleCenter=function(t){var r=t[0],e=t[1],i=t[2],o=t[3],a=this.transitionsBetween(r,o)+1,s=this.transitionsBetween(i,o)+1,f=n.shiftPoint(r,e,s*4),h=n.shiftPoint(i,e,a*4);a=this.transitionsBetween(f,o)+1,s=this.transitionsBetween(h,o)+1,(a&1)===1&&(a+=1),(s&1)===1&&(s+=1);var u=(r.getX()+e.getX()+i.getX()+o.getX())/4,l=(r.getY()+e.getY()+i.getY()+o.getY())/4;r=n.moveAway(r,u,l),e=n.moveAway(e,u,l),i=n.moveAway(i,u,l),o=n.moveAway(o,u,l);var c,p;return f=n.shiftPoint(r,e,s*4),f=n.shiftPoint(f,o,a*4),c=n.shiftPoint(e,r,s*4),c=n.shiftPoint(c,i,a*4),h=n.shiftPoint(i,o,s*4),h=n.shiftPoint(h,e,a*4),p=n.shiftPoint(o,i,s*4),p=n.shiftPoint(p,r,a*4),[f,c,h,p]},n.prototype.isValid=function(t){return t.getX()>=0&&t.getX()<this.image.getWidth()&&t.getY()>0&&t.getY()<this.image.getHeight()},n.sampleGrid=function(t,r,e,i,o,a,s){var f=Cr.getInstance();return f.sampleGrid(t,a,s,.5,.5,a-.5,.5,a-.5,s-.5,.5,s-.5,r.getX(),r.getY(),o.getX(),o.getY(),i.getX(),i.getY(),e.getX(),e.getY())},n.prototype.transitionsBetween=function(t,r){var e=Math.trunc(t.getX()),i=Math.trunc(t.getY()),o=Math.trunc(r.getX()),a=Math.trunc(r.getY()),s=Math.abs(a-i)>Math.abs(o-e);if(s){var f=e;e=i,i=f,f=o,o=a,a=f}for(var h=Math.abs(o-e),u=Math.abs(a-i),l=-h/2,c=i<a?1:-1,p=e<o?1:-1,d=0,v=this.image.get(s?i:e,s?e:i),w=e,E=i;w!==o;w+=p){var y=this.image.get(s?E:w,s?w:E);if(y!==v&&(d++,v=y),l+=u,l>0){if(E===a)break;E+=c,l-=h}}return d},n})(),wr=ln;var cn=(function(){function n(){this.decoder=new cr}return n.prototype.decode=function(t,r){r===void 0&&(r=null);var e,i;if(r!=null&&r.has(rt.PURE_BARCODE)){var o=n.extractPureBits(t.getBlackMatrix());e=this.decoder.decode(o),i=n.NO_POINTS}else{var a=new wr(t.getBlackMatrix()).detect();e=this.decoder.decode(a.getBits()),i=a.getPoints()}var s=e.getRawBytes(),f=new tr(e.getText(),s,8*s.length,i,st.DATA_MATRIX,F.currentTimeMillis()),h=e.getByteSegments();h!=null&&f.putMetadata(Mt.BYTE_SEGMENTS,h);var u=e.getECLevel();return u!=null&&f.putMetadata(Mt.ERROR_CORRECTION_LEVEL,u),f},n.prototype.reset=function(){},n.extractPureBits=function(t){var r=t.getTopLeftOnBit(),e=t.getBottomRightOnBit();if(r==null||e==null)throw new B;var i=this.moduleSize(r,t),o=r[1],a=e[1],s=r[0],f=e[0],h=(f-s+1)/i,u=(a-o+1)/i;if(h<=0||u<=0)throw new B;var l=i/2;o+=l,s+=l;for(var c=new q(h,u),p=0;p<u;p++)for(var d=o+p*i,v=0;v<h;v++)t.get(s+v*i,d)&&c.set(v,p);return c},n.moduleSize=function(t,r){for(var e=r.getWidth(),i=t[0],o=t[1];i<e&&r.get(i,o);)i++;if(i===e)throw new B;var a=i-t[0];if(a===0)throw new B;return a},n.NO_POINTS=[],n})(),Er=cn;var bt;(function(n){n[n.ERROR_CORRECTION=0]="ERROR_CORRECTION",n[n.CHARACTER_SET=1]="CHARACTER_SET",n[n.DATA_MATRIX_SHAPE=2]="DATA_MATRIX_SHAPE",n[n.DATA_MATRIX_COMPACT=3]="DATA_MATRIX_COMPACT",n[n.MIN_SIZE=4]="MIN_SIZE",n[n.MAX_SIZE=5]="MAX_SIZE",n[n.MARGIN=6]="MARGIN",n[n.PDF417_COMPACT=7]="PDF417_COMPACT",n[n.PDF417_COMPACTION=8]="PDF417_COMPACTION",n[n.PDF417_DIMENSIONS=9]="PDF417_DIMENSIONS",n[n.AZTEC_LAYERS=10]="AZTEC_LAYERS",n[n.QR_VERSION=11]="QR_VERSION",n[n.GS1_FORMAT=12]="GS1_FORMAT",n[n.FORCE_C40=13]="FORCE_C40"})(bt||(bt={}));var Q=bt;var pn=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},dn=(function(){function n(t,r){this.width=t,this.height=r;for(var e=new Array(r),i=0;i!==r;i++)e[i]=new Uint8Array(t);this.bytes=e}return n.prototype.getHeight=function(){return this.height},n.prototype.getWidth=function(){return this.width},n.prototype.get=function(t,r){return this.bytes[r][t]},n.prototype.getArray=function(){return this.bytes},n.prototype.setNumber=function(t,r,e){this.bytes[r][t]=e},n.prototype.setBoolean=function(t,r,e){this.bytes[r][t]=e?1:0},n.prototype.clear=function(t){var r,e;try{for(var i=pn(this.bytes),o=i.next();!o.done;o=i.next()){var a=o.value;G.fill(a,t)}}catch(s){r={error:s}}finally{try{o&&!o.done&&(e=i.return)&&e.call(i)}finally{if(r)throw r.error}}},n.prototype.equals=function(t){if(!(t instanceof n))return!1;var r=t;if(this.width!==r.width||this.height!==r.height)return!1;for(var e=0,i=this.height;e<i;++e)for(var o=this.bytes[e],a=r.bytes[e],s=0,f=this.width;s<f;++s)if(o[s]!==a[s])return!1;return!0},n.prototype.toString=function(){for(var t=new D,r=0,e=this.height;r<e;++r){for(var i=this.bytes[r],o=0,a=this.width;o<a;++o)switch(i[o]){case 0:t.append(" 0");break;case 1:t.append(" 1");break;default:t.append("  ");break}t.append(`
`)}return t.toString()},n})(),yr=dn;var vn=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),gn=(function(n){vn(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.forName=function(r){return this.getCharacterSetECIByName(r)},t})(j),St=gn;var Ft,Rt=[5,7,10,11,12,14,18,20,24,28,36,42,48,56,62,68],mr=[[228,48,15,111,62],[23,68,144,134,240,92,254],[28,24,185,166,223,248,116,255,110,61],[175,138,205,12,194,168,39,245,60,97,120],[41,153,158,91,61,42,142,213,97,178,100,242],[156,97,192,252,95,9,157,119,138,45,18,186,83,185],[83,195,100,39,188,75,66,61,241,213,109,129,94,254,225,48,90,188],[15,195,244,9,233,71,168,2,188,160,153,145,253,79,108,82,27,174,186,172],[52,190,88,205,109,39,176,21,155,197,251,223,155,21,5,172,254,124,12,181,184,96,50,193],[211,231,43,97,71,96,103,174,37,151,170,53,75,34,249,121,17,138,110,213,141,136,120,151,233,168,93,255],[245,127,242,218,130,250,162,181,102,120,84,179,220,251,80,182,229,18,2,4,68,33,101,137,95,119,115,44,175,184,59,25,225,98,81,112],[77,193,137,31,19,38,22,153,247,105,122,2,245,133,242,8,175,95,100,9,167,105,214,111,57,121,21,1,253,57,54,101,248,202,69,50,150,177,226,5,9,5],[245,132,172,223,96,32,117,22,238,133,238,231,205,188,237,87,191,106,16,147,118,23,37,90,170,205,131,88,120,100,66,138,186,240,82,44,176,87,187,147,160,175,69,213,92,253,225,19],[175,9,223,238,12,17,220,208,100,29,175,170,230,192,215,235,150,159,36,223,38,200,132,54,228,146,218,234,117,203,29,232,144,238,22,150,201,117,62,207,164,13,137,245,127,67,247,28,155,43,203,107,233,53,143,46],[242,93,169,50,144,210,39,118,202,188,201,189,143,108,196,37,185,112,134,230,245,63,197,190,250,106,185,221,175,64,114,71,161,44,147,6,27,218,51,63,87,10,40,130,188,17,163,31,176,170,4,107,232,7,94,166,224,124,86,47,11,204],[220,228,173,89,251,149,159,56,89,33,147,244,154,36,73,127,213,136,248,180,234,197,158,177,68,122,93,213,15,160,227,236,66,139,153,185,202,167,179,25,220,232,96,210,231,136,223,239,181,241,59,52,172,25,49,232,211,189,64,54,108,153,132,63,96,103,82,186]],Cn=301,wn=function(n,t){for(var r=1,e=0;e<255;e++)t[e]=r,n[r]=e,r*=2,r>=256&&(r^=Cn);return{LOG:n,ALOG:t}},dt=(Ft=wn([],[]),Ft.LOG),Pt=Ft.ALOG,Sr;(function(n){n[n.FORCE_NONE=0]="FORCE_NONE",n[n.FORCE_SQUARE=1]="FORCE_SQUARE",n[n.FORCE_RECTANGLE=2]="FORCE_RECTANGLE"})(Sr||(Sr={}));var Lt=129,mt=230,_r=231,Ar=235,Ir=236,Or=237,Tr=238,xr=239,Dr=240,_t=254,Mr=254,ht="[)>05",ut="[)>06",lt="",A=0,R=1,U=2,N=3,b=4,L=5;var kt=(function(){function n(){}return n.prototype.getEncodingMode=function(){return L},n.prototype.encode=function(t){var r=new D;for(r.append(0);t.hasMoreCharacters();){var e=t.getCurrentChar();r.append(e),t.pos++;var i=S.lookAheadTest(t.getMessage(),t.pos,this.getEncodingMode());if(i!==this.getEncodingMode()){t.signalEncoderChange(A);break}}var o=r.length()-1,a=1,s=t.getCodewordCount()+o+a;t.updateSymbolInfo(s);var f=t.getSymbolInfo().getDataCapacity()-s>0;if(t.hasMoreCharacters()||f)if(o<=249)r.setCharAt(0,X.getCharAt(o));else if(o<=1555)r.setCharAt(0,X.getCharAt(Math.floor(o/250)+249)),r.insert(1,X.getCharAt(o%250));else throw new Error("Message length not in valid ranges: "+o);for(var h=0,e=r.length();h<e;h++)t.writeCodeword(this.randomize255State(r.charAt(h).charCodeAt(0),t.getCodewordCount()+1))},n.prototype.randomize255State=function(t,r){var e=149*r%255+1,i=t+e;return i<=255?i:i-256},n})();var at=(function(){function n(){}return n.prototype.getEncodingMode=function(){return R},n.prototype.encodeMaximal=function(t){for(var r=new D,e=0,i=t.pos,o=0;t.hasMoreCharacters();){var a=t.getCurrentChar();t.pos++,e=this.encodeChar(a,r),r.length()%3===0&&(i=t.pos,o=r.length())}if(o!==r.length()){var s=Math.floor(r.length()/3*2),f=Math.floor(t.getCodewordCount()+s+1);t.updateSymbolInfo(f);var h=t.getSymbolInfo().getDataCapacity()-f,u=Math.floor(r.length()%3);(u===2&&h!==2||u===1&&(e>3||h!==1))&&(t.pos=i)}r.length()>0&&t.writeCodeword(mt),this.handleEOD(t,r)},n.prototype.encode=function(t){for(var r=new D;t.hasMoreCharacters();){var e=t.getCurrentChar();t.pos++;var i=this.encodeChar(e,r),o=Math.floor(r.length()/3)*2,a=t.getCodewordCount()+o;t.updateSymbolInfo(a);var s=t.getSymbolInfo().getDataCapacity()-a;if(!t.hasMoreCharacters()){var f=new D;for(r.length()%3===2&&s!==2&&(i=this.backtrackOneCharacter(t,r,f,i));r.length()%3===1&&(i>3||s!==1);)i=this.backtrackOneCharacter(t,r,f,i);break}var h=r.length();if(h%3===0){var u=S.lookAheadTest(t.getMessage(),t.pos,this.getEncodingMode());if(u!==this.getEncodingMode()){t.signalEncoderChange(A);break}}}this.handleEOD(t,r)},n.prototype.backtrackOneCharacter=function(t,r,e,i){var o=r.length(),a=r.toString().substring(0,o-i);r.setLengthToZero(),r.append(a),t.pos--;var s=t.getCurrentChar();return i=this.encodeChar(s,e),t.resetSymbolInfo(),i},n.prototype.writeNextTriplet=function(t,r){t.writeCodewords(this.encodeToCodewords(r.toString()));var e=r.toString().substring(3);r.setLengthToZero(),r.append(e)},n.prototype.handleEOD=function(t,r){var e=Math.floor(r.length()/3*2),i=r.length()%3,o=t.getCodewordCount()+e;t.updateSymbolInfo(o);var a=t.getSymbolInfo().getDataCapacity()-o;if(i===2){for(r.append("\0");r.length()>=3;)this.writeNextTriplet(t,r);t.hasMoreCharacters()&&t.writeCodeword(_t)}else if(a===1&&i===1){for(;r.length()>=3;)this.writeNextTriplet(t,r);t.hasMoreCharacters()&&t.writeCodeword(_t),t.pos--}else if(i===0){for(;r.length()>=3;)this.writeNextTriplet(t,r);(a>0||t.hasMoreCharacters())&&t.writeCodeword(_t)}else throw new Error("Unexpected case. Please report!");t.signalEncoderChange(A)},n.prototype.encodeChar=function(t,r){if(t===32)return r.append(3),1;if(t>=48&&t<=57)return r.append(t-48+4),1;if(t>=65&&t<=90)return r.append(t-65+14),1;if(t<32)return r.append(0),r.append(t),2;if(t<=47)return r.append(1),r.append(t-33),2;if(t<=64)return r.append(1),r.append(t-58+15),2;if(t<=95)return r.append(1),r.append(t-91+22),2;if(t<=127)return r.append(2),r.append(t-96),2;r.append("1");var e=2;return e+=this.encodeChar(t-128,r),e},n.prototype.encodeToCodewords=function(t){var r=1600*t.charCodeAt(0)+40*t.charCodeAt(1)+t.charCodeAt(2)+1,e=r/256,i=r%256,o=new D;return o.append(e),o.append(i),o.toString()},n})();var Ut=(function(){function n(){}return n.prototype.getEncodingMode=function(){return b},n.prototype.encode=function(t){for(var r=new D;t.hasMoreCharacters();){var e=t.getCurrentChar();this.encodeChar(e,r),t.pos++;var i=r.length();if(i>=4){t.writeCodewords(this.encodeToCodewords(r.toString()));var o=r.toString().substring(4);r.setLengthToZero(),r.append(o);var a=S.lookAheadTest(t.getMessage(),t.pos,this.getEncodingMode());if(a!==this.getEncodingMode()){t.signalEncoderChange(A);break}}}r.append(X.getCharAt(31)),this.handleEOD(t,r)},n.prototype.handleEOD=function(t,r){try{var e=r.length();if(e===0)return;if(e===1){t.updateSymbolInfo();var i=t.getSymbolInfo().getDataCapacity()-t.getCodewordCount(),o=t.getRemainingCharacters();if(o>i&&(t.updateSymbolInfo(t.getCodewordCount()+1),i=t.getSymbolInfo().getDataCapacity()-t.getCodewordCount()),o<=i&&i<=2)return}if(e>4)throw new Error("Count must not exceed 4");var a=e-1,s=this.encodeToCodewords(r.toString()),f=!t.hasMoreCharacters(),h=f&&a<=2;if(a<=2){t.updateSymbolInfo(t.getCodewordCount()+a);var i=t.getSymbolInfo().getDataCapacity()-t.getCodewordCount();i>=3&&(h=!1,t.updateSymbolInfo(t.getCodewordCount()+s.length))}h?(t.resetSymbolInfo(),t.pos-=a):t.writeCodewords(s)}finally{t.signalEncoderChange(A)}},n.prototype.encodeChar=function(t,r){t>=32&&t<=63?r.append(t):t>=64&&t<=94?r.append(X.getCharAt(t-64)):S.illegalCharacter(X.getCharAt(t))},n.prototype.encodeToCodewords=function(t){var r=t.length;if(r===0)throw new Error("StringBuilder must not be empty");var e=t.charAt(0).charCodeAt(0),i=r>=2?t.charAt(1).charCodeAt(0):0,o=r>=3?t.charAt(2).charCodeAt(0):0,a=r>=4?t.charAt(3).charCodeAt(0):0,s=(e<<18)+(i<<12)+(o<<6)+a,f=s>>16&255,h=s>>8&255,u=s&255,l=new D;return l.append(f),r>=2&&l.append(h),r>=3&&l.append(u),l.toString()},n})();var En=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),yn=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},O=(function(){function n(t,r,e,i,o,a,s,f){s===void 0&&(s=0),f===void 0&&(f=0),this.rectangular=t,this.dataCapacity=r,this.errorCodewords=e,this.matrixWidth=i,this.matrixHeight=o,this.dataRegions=a,this.rsBlockData=s,this.rsBlockError=f}return n.lookup=function(t,r,e,i,o){var a,s;r===void 0&&(r=0),e===void 0&&(e=null),i===void 0&&(i=null),o===void 0&&(o=!0);try{for(var f=yn(mn),h=f.next();!h.done;h=f.next()){var u=h.value;if(!(r===1&&u.rectangular)&&!(r===2&&!u.rectangular)&&!(e!=null&&(u.getSymbolWidth()<e.getWidth()||u.getSymbolHeight()<e.getHeight()))&&!(i!=null&&(u.getSymbolWidth()>i.getWidth()||u.getSymbolHeight()>i.getHeight()))&&t<=u.dataCapacity)return u}}catch(l){a={error:l}}finally{try{h&&!h.done&&(s=f.return)&&s.call(f)}finally{if(a)throw a.error}}if(o)throw new Error("Can't find a symbol arrangement that matches the message. Data codewords: "+t);return null},n.prototype.getHorizontalDataRegions=function(){switch(this.dataRegions){case 1:return 1;case 2:case 4:return 2;case 16:return 4;case 36:return 6;default:throw new Error("Cannot handle this number of data regions")}},n.prototype.getVerticalDataRegions=function(){switch(this.dataRegions){case 1:case 2:return 1;case 4:return 2;case 16:return 4;case 36:return 6;default:throw new Error("Cannot handle this number of data regions")}},n.prototype.getSymbolDataWidth=function(){return this.getHorizontalDataRegions()*this.matrixWidth},n.prototype.getSymbolDataHeight=function(){return this.getVerticalDataRegions()*this.matrixHeight},n.prototype.getSymbolWidth=function(){return this.getSymbolDataWidth()+this.getHorizontalDataRegions()*2},n.prototype.getSymbolHeight=function(){return this.getSymbolDataHeight()+this.getVerticalDataRegions()*2},n.prototype.getCodewordCount=function(){return this.dataCapacity+this.errorCodewords},n.prototype.getInterleavedBlockCount=function(){return this.rsBlockData?this.dataCapacity/this.rsBlockData:1},n.prototype.getDataCapacity=function(){return this.dataCapacity},n.prototype.getErrorCodewords=function(){return this.errorCodewords},n.prototype.getDataLengthForInterleavedBlock=function(t){return this.rsBlockData},n.prototype.getErrorLengthForInterleavedBlock=function(t){return this.rsBlockError},n})(),vt=O,Sn=(function(n){En(t,n);function t(){return n.call(this,!1,1558,620,22,22,36,-1,62)||this}return t.prototype.getInterleavedBlockCount=function(){return 10},t.prototype.getDataLengthForInterleavedBlock=function(r){return r<=8?156:155},t})(O),mn=[new O(!1,3,5,8,8,1),new O(!1,5,7,10,10,1),new O(!0,5,7,16,6,1),new O(!1,8,10,12,12,1),new O(!0,10,11,14,6,2),new O(!1,12,12,14,14,1),new O(!0,16,14,24,10,1),new O(!1,18,14,16,16,1),new O(!1,22,18,18,18,1),new O(!0,22,18,16,10,2),new O(!1,30,20,20,20,1),new O(!0,32,24,16,14,2),new O(!1,36,24,22,22,1),new O(!1,44,28,24,24,1),new O(!0,49,28,22,14,2),new O(!1,62,36,14,14,4),new O(!1,86,42,16,16,4),new O(!1,114,48,18,18,4),new O(!1,144,56,20,20,4),new O(!1,174,68,22,22,4),new O(!1,204,84,24,24,4,102,42),new O(!1,280,112,14,14,16,140,56),new O(!1,368,144,16,16,16,92,36),new O(!1,456,192,18,18,16,114,48),new O(!1,576,224,20,20,16,144,56),new O(!1,696,272,22,22,16,174,68),new O(!1,816,336,24,24,16,136,56),new O(!1,1050,408,18,18,36,175,68),new O(!1,1304,496,20,20,36,163,62),new Sn];var zt=(function(){function n(t){this.msg=t,this.pos=0,this.skipAtEnd=0;for(var r=t.split("").map(function(s){return s.charCodeAt(0)}),e=new D,i=0,o=r.length;i<o;i++){var a=String.fromCharCode(r[i]&255);if(a==="?"&&t.charAt(i)!=="?")throw new Error("Message contains characters outside ISO-8859-1 encoding.");e.append(a)}this.msg=e.toString(),this.shape=0,this.codewords=new D,this.newEncoding=-1}return n.prototype.setSymbolShape=function(t){this.shape=t},n.prototype.setSizeConstraints=function(t,r){this.minSize=t,this.maxSize=r},n.prototype.getMessage=function(){return this.msg},n.prototype.setSkipAtEnd=function(t){this.skipAtEnd=t},n.prototype.getCurrentChar=function(){return this.msg.charCodeAt(this.pos)},n.prototype.getCurrent=function(){return this.msg.charCodeAt(this.pos)},n.prototype.getCodewords=function(){return this.codewords},n.prototype.writeCodewords=function(t){this.codewords.append(t)},n.prototype.writeCodeword=function(t){this.codewords.append(t)},n.prototype.getCodewordCount=function(){return this.codewords.length()},n.prototype.getNewEncoding=function(){return this.newEncoding},n.prototype.signalEncoderChange=function(t){this.newEncoding=t},n.prototype.resetEncoderSignal=function(){this.newEncoding=-1},n.prototype.hasMoreCharacters=function(){return this.pos<this.getTotalMessageCharCount()},n.prototype.getTotalMessageCharCount=function(){return this.msg.length-this.skipAtEnd},n.prototype.getRemainingCharacters=function(){return this.getTotalMessageCharCount()-this.pos},n.prototype.getSymbolInfo=function(){return this.symbolInfo},n.prototype.updateSymbolInfo=function(t){t===void 0&&(t=this.getCodewordCount()),(this.symbolInfo==null||t>this.symbolInfo.getDataCapacity())&&(this.symbolInfo=vt.lookup(t,this.shape,this.minSize,this.maxSize,!0))},n.prototype.resetSymbolInfo=function(){this.symbolInfo=null},n})();var _n=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Xt=(function(n){_n(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.prototype.getEncodingMode=function(){return N},t.prototype.encode=function(r){for(var e=new D;r.hasMoreCharacters();){var i=r.getCurrentChar();r.pos++,this.encodeChar(i,e);var o=e.length();if(o%3===0){this.writeNextTriplet(r,e);var a=S.lookAheadTest(r.getMessage(),r.pos,this.getEncodingMode());if(a!==this.getEncodingMode()){r.signalEncoderChange(A);break}}}this.handleEOD(r,e)},t.prototype.encodeChar=function(r,e){switch(r){case 13:e.append(0);break;case 42:e.append(1);break;case 62:e.append(2);break;case 32:e.append(3);break;default:r>=48&&r<=57?e.append(r-48+4):r>=65&&r<=90?e.append(r-65+14):S.illegalCharacter(X.getCharAt(r));break}return 1},t.prototype.handleEOD=function(r,e){r.updateSymbolInfo();var i=r.getSymbolInfo().getDataCapacity()-r.getCodewordCount(),o=e.length();r.pos-=o,(r.getRemainingCharacters()>1||i>1||r.getRemainingCharacters()!==i)&&r.writeCodeword(Mr),r.getNewEncoding()<0&&r.signalEncoderChange(A)},t})(at);var An=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),Gt=(function(n){An(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.prototype.getEncodingMode=function(){return U},t.prototype.encodeChar=function(r,e){if(r===32)return e.append(3),1;if(r>=48&&r<=57)return e.append(r-48+4),1;if(r>=97&&r<=122)return e.append(r-97+14),1;if(r<32)return e.append(0),e.append(r),2;if(r<=47)return e.append(1),e.append(r-33),2;if(r<=64)return e.append(1),e.append(r-58+15),2;if(r>=91&&r<=95)return e.append(1),e.append(r-91+22),2;if(r===96)return e.append(2),e.append(0),2;if(r<=90)return e.append(2),e.append(r-65+1),2;if(r<=127)return e.append(2),e.append(r-123+27),2;e.append("1");var i=2;return i+=this.encodeChar(r-128,e),i},t})(at);var In=(function(){function n(){}return n.randomize253State=function(t){var r=149*t%253+1,e=Lt+r;return e<=254?e:e-254},n.encodeHighLevel=function(t,r,e,i,o){r===void 0&&(r=0),e===void 0&&(e=null),i===void 0&&(i=null),o===void 0&&(o=!1);var a=new at,s=[new Ht,a,new Gt,new Xt,new Ut,new kt],f=new zt(t);f.setSymbolShape(r),f.setSizeConstraints(e,i),t.startsWith(ht)&&t.endsWith(lt)?(f.writeCodeword(Ir),f.setSkipAtEnd(2),f.pos+=ht.length):t.startsWith(ut)&&t.endsWith(lt)&&(f.writeCodeword(Or),f.setSkipAtEnd(2),f.pos+=ut.length);var h=A;for(o&&(a.encodeMaximal(f),h=f.getNewEncoding(),f.resetEncoderSignal());f.hasMoreCharacters();)s[h].encode(f),f.getNewEncoding()>=0&&(h=f.getNewEncoding(),f.resetEncoderSignal());var u=f.getCodewordCount();f.updateSymbolInfo();var l=f.getSymbolInfo().getDataCapacity();u<l&&h!==A&&h!==L&&h!==b&&f.writeCodeword("\xFE");var c=f.getCodewords();for(c.length()<l&&c.append(Lt);c.length()<l;)c.append(this.randomize253State(c.length()+1));return f.getCodewords().toString()},n.lookAheadTest=function(t,r,e){var i=this.lookAheadTestIntern(t,r,e);if(e===N&&i===N){for(var o=Math.min(r+3,t.length),a=r;a<o;a++)if(!this.isNativeX12(t.charCodeAt(a)))return A}else if(e===b&&i===b){for(var o=Math.min(r+4,t.length),a=r;a<o;a++)if(!this.isNativeEDIFACT(t.charCodeAt(a)))return A}return i},n.lookAheadTestIntern=function(t,r,e){if(r>=t.length)return e;var i;e===A?i=[0,1,1,1,1,1.25]:(i=[1,2,2,2,2,2.25],i[e]=0);for(var o=0,a=new Uint8Array(6),s=[];;){if(r+o===t.length){G.fill(a,0),G.fill(s,0);var f=this.findMinimums(i,s,J.MAX_VALUE,a),h=this.getMinimumCount(a);if(s[A]===f)return A;if(h===1){if(a[L]>0)return L;if(a[b]>0)return b;if(a[U]>0)return U;if(a[N]>0)return N}return R}var u=t.charCodeAt(r+o);if(o++,this.isDigit(u)?i[A]+=.5:this.isExtendedASCII(u)?(i[A]=Math.ceil(i[A]),i[A]+=2):(i[A]=Math.ceil(i[A]),i[A]++),this.isNativeC40(u)?i[R]+=2/3:this.isExtendedASCII(u)?i[R]+=8/3:i[R]+=4/3,this.isNativeText(u)?i[U]+=2/3:this.isExtendedASCII(u)?i[U]+=8/3:i[U]+=4/3,this.isNativeX12(u)?i[N]+=2/3:this.isExtendedASCII(u)?i[N]+=13/3:i[N]+=10/3,this.isNativeEDIFACT(u)?i[b]+=3/4:this.isExtendedASCII(u)?i[b]+=17/4:i[b]+=13/4,this.isSpecialB256(u)?i[L]+=4:i[L]++,o>=4){if(G.fill(a,0),G.fill(s,0),this.findMinimums(i,s,J.MAX_VALUE,a),s[A]<this.min(s[L],s[R],s[U],s[N],s[b]))return A;if(s[L]<s[A]||s[L]+1<this.min(s[R],s[U],s[N],s[b]))return L;if(s[b]+1<this.min(s[L],s[R],s[U],s[N],s[A]))return b;if(s[U]+1<this.min(s[L],s[R],s[b],s[N],s[A]))return U;if(s[N]+1<this.min(s[L],s[R],s[b],s[U],s[A]))return N;if(s[R]+1<this.min(s[A],s[L],s[b],s[U])){if(s[R]<s[N])return R;if(s[R]===s[N]){for(var l=r+o+1;l<t.length;){var c=t.charCodeAt(l);if(this.isX12TermSep(c))return N;if(!this.isNativeX12(c))break;l++}return R}}}}},n.min=function(t,r,e,i,o){var a=Math.min(t,Math.min(r,Math.min(e,i)));return o===void 0?a:Math.min(a,o)},n.findMinimums=function(t,r,e,i){for(var o=0;o<6;o++){var a=r[o]=Math.ceil(t[o]);e>a&&(e=a,G.fill(i,0)),e===a&&(i[o]=i[o]+1)}return e},n.getMinimumCount=function(t){for(var r=0,e=0;e<6;e++)r+=t[e];return r||0},n.isDigit=function(t){return t>=48&&t<=57},n.isExtendedASCII=function(t){return t>=128&&t<=255},n.isNativeC40=function(t){return t===32||t>=48&&t<=57||t>=65&&t<=90},n.isNativeText=function(t){return t===32||t>=48&&t<=57||t>=97&&t<=122},n.isNativeX12=function(t){return this.isX12TermSep(t)||t===32||t>=48&&t<=57||t>=65&&t<=90},n.isX12TermSep=function(t){return t===13||t===42||t===62},n.isNativeEDIFACT=function(t){return t>=32&&t<=94},n.isSpecialB256=function(t){return!1},n.determineConsecutiveDigitCount=function(t,r){r===void 0&&(r=0);for(var e=t.length,i=r;i<e&&this.isDigit(t.charCodeAt(i));)i++;return i-r},n.illegalCharacter=function(t){var r=J.toHexString(t.charCodeAt(0));throw r="0000".substring(0,4-r.length)+r,new Error("Illegal character: "+t+" (0x"+r+")")},n})(),S=In;var Ht=(function(){function n(){}return n.prototype.getEncodingMode=function(){return A},n.prototype.encode=function(t){var r=S.determineConsecutiveDigitCount(t.getMessage(),t.pos);if(r>=2)t.writeCodeword(this.encodeASCIIDigits(t.getMessage().charCodeAt(t.pos),t.getMessage().charCodeAt(t.pos+1))),t.pos+=2;else{var e=t.getCurrentChar(),i=S.lookAheadTest(t.getMessage(),t.pos,this.getEncodingMode());if(i!==this.getEncodingMode())switch(i){case L:t.writeCodeword(_r),t.signalEncoderChange(L);return;case R:t.writeCodeword(mt),t.signalEncoderChange(R);return;case N:t.writeCodeword(Tr),t.signalEncoderChange(N);break;case U:t.writeCodeword(xr),t.signalEncoderChange(U);break;case b:t.writeCodeword(Dr),t.signalEncoderChange(b);break;default:throw new Error("Illegal mode: "+i)}else S.isExtendedASCII(e)?(t.writeCodeword(Ar),t.writeCodeword(e-128+1),t.pos++):(t.writeCodeword(e+1),t.pos++)}},n.prototype.encodeASCIIDigits=function(t,r){if(S.isDigit(t)&&S.isDigit(r)){var e=(t-48)*10+(r-48);return e+130}throw new Error("not digits: "+t+r)},n})();var On=(function(){function n(t,r,e){this.codewords=t,this.numcols=r,this.numrows=e,this.bits=new Uint8Array(r*e),G.fill(this.bits,2)}return n.prototype.getNumrows=function(){return this.numrows},n.prototype.getNumcols=function(){return this.numcols},n.prototype.getBits=function(){return this.bits},n.prototype.getBit=function(t,r){return this.bits[r*this.numcols+t]===1},n.prototype.setBit=function(t,r,e){this.bits[r*this.numcols+t]=e?1:0},n.prototype.noBit=function(t,r){return this.bits[r*this.numcols+t]===2},n.prototype.place=function(){var t=0,r=4,e=0;do{r===this.numrows&&e===0&&this.corner1(t++),r===this.numrows-2&&e===0&&this.numcols%4!==0&&this.corner2(t++),r===this.numrows-2&&e===0&&this.numcols%8===4&&this.corner3(t++),r===this.numrows+4&&e===2&&this.numcols%8===0&&this.corner4(t++);do r<this.numrows&&e>=0&&this.noBit(e,r)&&this.utah(r,e,t++),r-=2,e+=2;while(r>=0&&e<this.numcols);r++,e+=3;do r>=0&&e<this.numcols&&this.noBit(e,r)&&this.utah(r,e,t++),r+=2,e-=2;while(r<this.numrows&&e>=0);r+=3,e++}while(r<this.numrows||e<this.numcols);this.noBit(this.numcols-1,this.numrows-1)&&(this.setBit(this.numcols-1,this.numrows-1,!0),this.setBit(this.numcols-2,this.numrows-2,!0))},n.prototype.module=function(t,r,e,i){t<0&&(t+=this.numrows,r+=4-(this.numrows+4)%8),r<0&&(r+=this.numcols,t+=4-(this.numcols+4)%8);var o=this.codewords.charCodeAt(e);o&=1<<8-i,this.setBit(r,t,o!==0)},n.prototype.utah=function(t,r,e){this.module(t-2,r-2,e,1),this.module(t-2,r-1,e,2),this.module(t-1,r-2,e,3),this.module(t-1,r-1,e,4),this.module(t-1,r,e,5),this.module(t,r-2,e,6),this.module(t,r-1,e,7),this.module(t,r,e,8)},n.prototype.corner1=function(t){this.module(this.numrows-1,0,t,1),this.module(this.numrows-1,1,t,2),this.module(this.numrows-1,2,t,3),this.module(0,this.numcols-2,t,4),this.module(0,this.numcols-1,t,5),this.module(1,this.numcols-1,t,6),this.module(2,this.numcols-1,t,7),this.module(3,this.numcols-1,t,8)},n.prototype.corner2=function(t){this.module(this.numrows-3,0,t,1),this.module(this.numrows-2,0,t,2),this.module(this.numrows-1,0,t,3),this.module(0,this.numcols-4,t,4),this.module(0,this.numcols-3,t,5),this.module(0,this.numcols-2,t,6),this.module(0,this.numcols-1,t,7),this.module(1,this.numcols-1,t,8)},n.prototype.corner3=function(t){this.module(this.numrows-3,0,t,1),this.module(this.numrows-2,0,t,2),this.module(this.numrows-1,0,t,3),this.module(0,this.numcols-2,t,4),this.module(0,this.numcols-1,t,5),this.module(1,this.numcols-1,t,6),this.module(2,this.numcols-1,t,7),this.module(3,this.numcols-1,t,8)},n.prototype.corner4=function(t){this.module(this.numrows-1,0,t,1),this.module(this.numrows-1,this.numcols-1,t,2),this.module(0,this.numcols-3,t,3),this.module(0,this.numcols-2,t,4),this.module(0,this.numcols-1,t,5),this.module(1,this.numcols-3,t,6),this.module(1,this.numcols-2,t,7),this.module(1,this.numcols-1,t,8)},n})(),Wt=On;var Tn=(function(){function n(){}return n.encodeECC200=function(t,r){if(t.length!==r.getDataCapacity())throw new Error("The number of codewords does not match the selected symbol");var e=new D;e.append(t);var i=r.getInterleavedBlockCount();if(i===1){var o=this.createECCBlock(t,r.getErrorCodewords());e.append(o)}else{for(var a=[],s=[],f=0;f<i;f++)a[f]=r.getDataLengthForInterleavedBlock(f+1),s[f]=r.getErrorLengthForInterleavedBlock(f+1);for(var h=0;h<i;h++){for(var u=new D,l=h;l<r.getDataCapacity();l+=i)u.append(t.charAt(l));for(var o=this.createECCBlock(u.toString(),s[h]),c=0,p=h;p<s[h]*i;p+=i)e.setCharAt(r.getDataCapacity()+p,o.charAt(c++))}}return e.toString()},n.createECCBlock=function(t,r){for(var e=-1,i=0;i<Rt.length;i++)if(Rt[i]===r){e=i;break}if(e<0)throw new Error("Illegal number of error correction codewords specified: "+r);for(var o=mr[e],a=[],i=0;i<r;i++)a[i]=0;for(var i=0;i<t.length;i++){for(var s=a[r-1]^t.charAt(i).charCodeAt(0),f=r-1;f>0;f--)s!==0&&o[f]!==0?a[f]=a[f-1]^Pt[(dt[s]+dt[o[f]])%255]:a[f]=a[f-1];s!==0&&o[0]!==0?a[0]=Pt[(dt[s]+dt[o[0]])%255]:a[0]=0}for(var h=[],i=0;i<r;i++)h[i]=a[r-i-1];return h.map(function(u){return String.fromCharCode(u)}).join("")},n})(),Zt=Tn;var xn=(function(){function n(){}return n.ISO_8859_1=j.ISO8859_1,n})(),Br=xn;var jt=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Nr=(function(){function n(t){this.charset=t,this.name=t.name}return n.prototype.canEncode=function(t){try{return tt.encode(t,this.charset)!=null}catch{return!1}},n})(),br=(function(){function n(t,r,e){var i,o,a,s,f,h;this.ENCODERS=["IBM437","ISO-8859-2","ISO-8859-3","ISO-8859-4","ISO-8859-5","ISO-8859-6","ISO-8859-7","ISO-8859-8","ISO-8859-9","ISO-8859-10","ISO-8859-11","ISO-8859-13","ISO-8859-14","ISO-8859-15","ISO-8859-16","windows-1250","windows-1251","windows-1252","windows-1256","Shift_JIS"].map(function(V){return new Nr(St.forName(V))}),this.encoders=[];var u=[];u.push(new Nr(Br.ISO_8859_1));for(var l=r!=null&&r.name.startsWith("UTF"),c=0;c<t.length;c++){var p=!1;try{for(var d=(i=void 0,jt(u)),v=d.next();!v.done;v=d.next()){var w=v.value,E=t.charAt(c),y=E.charCodeAt(0);if(y===e||w.canEncode(E)){p=!0;break}}}catch(V){i={error:V}}finally{try{v&&!v.done&&(o=d.return)&&o.call(d)}finally{if(i)throw i.error}}if(!p)try{for(var m=(a=void 0,jt(this.ENCODERS)),C=m.next();!C.done;C=m.next()){var w=C.value;if(w.canEncode(t.charAt(c))){u.push(w),p=!0;break}}}catch(V){a={error:V}}finally{try{C&&!C.done&&(s=m.return)&&s.call(m)}finally{if(a)throw a.error}}p||(l=!0)}if(u.length===1&&!l)this.encoders=[u[0]];else{this.encoders=[];var z=0;try{for(var Y=jt(u),W=Y.next();!W.done;W=Y.next()){var w=W.value;this.encoders[z++]=w}}catch(V){f={error:V}}finally{try{W&&!W.done&&(h=Y.return)&&h.call(Y)}finally{if(f)throw f.error}}}var Z=-1;if(r!=null){for(var c=0;c<this.encoders.length;c++)if(this.encoders[c]!=null&&r.name===this.encoders[c].name){Z=c;break}}this.priorityEncoderIndex=Z}return n.prototype.length=function(){return this.encoders.length},n.prototype.getCharsetName=function(t){if(!(t<this.length()))throw new Error("index must be less than length");return this.encoders[t].name},n.prototype.getCharset=function(t){if(!(t<this.length()))throw new Error("index must be less than length");return this.encoders[t].charset},n.prototype.getECIValue=function(t){return this.encoders[t].charset.getValueIdentifier()},n.prototype.getPriorityEncoderIndex=function(){return this.priorityEncoderIndex},n.prototype.canEncode=function(t,r){if(!(r<this.length()))throw new Error("index must be less than length");return!0},n.prototype.encode=function(t,r){if(!(r<this.length()))throw new Error("index must be less than length");return tt.encode(X.getCharAt(t),this.encoders[r].name)},n})();var Dn=3,Rr=(function(){function n(t,r,e){this.fnc1=e;var i=new br(t,r,e);if(i.length()===1)for(var o=0;o<this.bytes.length;o++){var a=t.charAt(o).charCodeAt(0);this.bytes[o]=a===e?1e3:a}else this.bytes=this.encodeMinimally(t,i,e)}return n.prototype.getFNC1Character=function(){return this.fnc1},n.prototype.length=function(){return this.bytes.length},n.prototype.haveNCharacters=function(t,r){if(t+r-1>=this.bytes.length)return!1;for(var e=0;e<r;e++)if(this.isECI(t+e))return!1;return!0},n.prototype.charAt=function(t){if(t<0||t>=this.length())throw new Error(""+t);if(this.isECI(t))throw new Error("value at "+t+" is not a character but an ECI");return this.isFNC1(t)?this.fnc1:this.bytes[t]},n.prototype.subSequence=function(t,r){if(t<0||t>r||r>this.length())throw new Error(""+t);for(var e=new D,i=t;i<r;i++){if(this.isECI(i))throw new Error("value at "+i+" is not a character but an ECI");e.append(this.charAt(i))}return e.toString()},n.prototype.isECI=function(t){if(t<0||t>=this.length())throw new Error(""+t);return this.bytes[t]>255&&this.bytes[t]<=999},n.prototype.isFNC1=function(t){if(t<0||t>=this.length())throw new Error(""+t);return this.bytes[t]===1e3},n.prototype.getECIValue=function(t){if(t<0||t>=this.length())throw new Error(""+t);if(!this.isECI(t))throw new Error("value at "+t+" is not an ECI but a character");return this.bytes[t]-256},n.prototype.addEdge=function(t,r,e){(t[r][e.encoderIndex]==null||t[r][e.encoderIndex].cachedTotalSize>e.cachedTotalSize)&&(t[r][e.encoderIndex]=e)},n.prototype.addEdges=function(t,r,e,i,o,a){var s=t.charAt(i).charCodeAt(0),f=0,h=r.length();r.getPriorityEncoderIndex()>=0&&(s===a||r.canEncode(s,r.getPriorityEncoderIndex()))&&(f=r.getPriorityEncoderIndex(),h=f+1);for(var u=f;u<h;u++)(s===a||r.canEncode(s,u))&&this.addEdge(e,i+1,new Fr(s,r,u,o,a))},n.prototype.encodeMinimally=function(t,r,e){var i=t.length,o=new Fr[i+1][r.length()];this.addEdges(t,r,o,0,null,e);for(var a=1;a<=i;a++){for(var s=0;s<r.length();s++)o[a][s]!=null&&a<i&&this.addEdges(t,r,o,a,o[a][s],e);for(var s=0;s<r.length();s++)o[a-1][s]=null}for(var f=-1,h=J.MAX_VALUE,s=0;s<r.length();s++)if(o[i][s]!=null){var u=o[i][s];u.cachedTotalSize<h&&(h=u.cachedTotalSize,f=s)}if(f<0)throw new Error('Failed to encode "'+t+'"');for(var l=[],c=o[i][f];c!=null;){if(c.isFNC1())l.unshift(1e3);else for(var p=r.encode(c.c,c.encoderIndex),a=p.length-1;a>=0;a--)l.unshift(p[a]&255);var d=c.previous===null?0:c.previous.encoderIndex;d!==c.encoderIndex&&l.unshift(256+r.getECIValue(c.encoderIndex)),c=c.previous}for(var v=[],a=0;a<v.length;a++)v[a]=l[a];return v},n})();var Fr=(function(){function n(t,r,e,i,o){this.c=t,this.encoderSet=r,this.encoderIndex=e,this.previous=i,this.fnc1=o,this.c=t===o?1e3:t;var a=this.isFNC1()?1:r.encode(t,e).length,s=i===null?0:i.encoderIndex;s!==e&&(a+=Dn),i!=null&&(a+=i.cachedTotalSize),this.cachedTotalSize=a}return n.prototype.isFNC1=function(){return this.c===1e3},n})();var Mn=(function(){var n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])},n(t,r)};return function(t,r){n(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}})(),gt=function(n){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&n[t],e=0;if(r)return r.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&e>=n.length&&(n=void 0),{value:n&&n[e++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Bn=function(n,t){var r=typeof Symbol=="function"&&n[Symbol.iterator];if(!r)return n;var e=r.call(n),i,o=[],a;try{for(;(t===void 0||t-- >0)&&!(i=e.next()).done;)o.push(i.value)}catch(s){a={error:s}}finally{try{i&&!i.done&&(r=e.return)&&r.call(e)}finally{if(a)throw a.error}}return o},Nn=function(){for(var n=[],t=0;t<arguments.length;t++)n=n.concat(Bn(arguments[t]));return n},g;(function(n){n[n.ASCII=0]="ASCII",n[n.C40=1]="C40",n[n.TEXT=2]="TEXT",n[n.X12=3]="X12",n[n.EDF=4]="EDF",n[n.B256=5]="B256"})(g||(g={}));var bn=["!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/",":",";","<","=",">","?","@","[","\\","]","^","_"],H=(function(){function n(){}return n.isExtendedASCII=function(t,r){return t!==r&&t>=128&&t<=255},n.isInC40Shift1Set=function(t){return t<=31},n.isInC40Shift2Set=function(t,r){var e,i;try{for(var o=gt(bn),a=o.next();!a.done;a=o.next()){var s=a.value;if(s.charCodeAt(0)===t)return!0}}catch(f){e={error:f}}finally{try{a&&!a.done&&(i=o.return)&&i.call(o)}finally{if(e)throw e.error}}return t===r},n.isInTextShift1Set=function(t){return this.isInC40Shift1Set(t)},n.isInTextShift2Set=function(t,r){return this.isInC40Shift2Set(t,r)},n.encodeHighLevel=function(t,r,e,i){r===void 0&&(r=null),e===void 0&&(e=-1),i===void 0&&(i=0);var o=0;return t.startsWith(ht)&&t.endsWith(lt)?(o=5,t=t.substring(ht.length,t.length-2)):t.startsWith(ut)&&t.endsWith(lt)&&(o=6,t=t.substring(ut.length,t.length-2)),decodeURIComponent(escape(String.fromCharCode.apply(String,Nn(this.encode(t,r,e,i,o)))))},n.encode=function(t,r,e,i,o){return this.encodeMinimally(new Rn(t,r,e,i,o)).getBytes()},n.addEdge=function(t,r){var e=r.fromPosition+r.characterLength;(t[e][r.getEndMode()]===null||t[e][r.getEndMode()].cachedTotalSize>r.cachedTotalSize)&&(t[e][r.getEndMode()]=r)},n.getNumberOfC40Words=function(t,r,e,i){for(var o=0,a=r;a<t.length();a++){if(t.isECI(a))return i[0]=0,0;var s=t.charAt(a);if(e&&S.isNativeC40(s)||!e&&S.isNativeText(s))o++;else if(!n.isExtendedASCII(s,t.getFNC1Character()))o+=2;else{var f=s&255;f>=128&&(e&&S.isNativeC40(f-128)||!e&&S.isNativeText(f-128))?o+=3:o+=4}if(o%3===0||(o-2)%3===0&&a+1===t.length())return i[0]=a-r+1,Math.ceil(o/3)}return i[0]=0,0},n.addEdges=function(t,r,e,i){var o,a;if(t.isECI(e)){this.addEdge(r,new $(t,g.ASCII,e,1,i));return}var s=t.charAt(e);if(i===null||i.getEndMode()!==g.EDF){S.isDigit(s)&&t.haveNCharacters(e,2)&&S.isDigit(t.charAt(e+1))?this.addEdge(r,new $(t,g.ASCII,e,2,i)):this.addEdge(r,new $(t,g.ASCII,e,1,i));var f=[g.C40,g.TEXT];try{for(var h=gt(f),u=h.next();!u.done;u=h.next()){var l=u.value,c=[];n.getNumberOfC40Words(t,e,l===g.C40,c)>0&&this.addEdge(r,new $(t,l,e,c[0],i))}}catch(v){o={error:v}}finally{try{u&&!u.done&&(a=h.return)&&a.call(h)}finally{if(o)throw o.error}}t.haveNCharacters(e,3)&&S.isNativeX12(t.charAt(e))&&S.isNativeX12(t.charAt(e+1))&&S.isNativeX12(t.charAt(e+2))&&this.addEdge(r,new $(t,g.X12,e,3,i)),this.addEdge(r,new $(t,g.B256,e,1,i))}var p;for(p=0;p<3;p++){var d=e+p;if(t.haveNCharacters(d,1)&&S.isNativeEDIFACT(t.charAt(d)))this.addEdge(r,new $(t,g.EDF,e,p+1,i));else break}p===3&&t.haveNCharacters(e,4)&&S.isNativeEDIFACT(t.charAt(e+3))&&this.addEdge(r,new $(t,g.EDF,e,4,i))},n.encodeMinimally=function(t){var r=t.length(),e=Array(r+1).fill(null).map(function(){return Array(6).fill(0)});this.addEdges(t,e,0,null);for(var i=1;i<=r;i++){for(var o=0;o<6;o++)e[i][o]!==null&&i<r&&this.addEdges(t,e,i,e[i][o]);for(var o=0;o<6;o++)e[i-1][o]=null}for(var a=-1,s=J.MAX_VALUE,o=0;o<6;o++)if(e[r][o]!==null){var f=e[r][o],h=o>=1&&o<=3?f.cachedTotalSize+1:f.cachedTotalSize;h<s&&(s=h,a=o)}if(a<0)throw new Error('Failed to encode "'+t+'"');return new Fn(e[r][a])},n})();var Fn=(function(){function n(t){var r=t.input,e=0,i=[],o=[],a=[];(t.mode===g.C40||t.mode===g.TEXT||t.mode===g.X12)&&t.getEndMode()!==g.ASCII&&(e+=this.prepend($.getBytes(254),i));for(var s=t;s!==null;)e+=this.prepend(s.getDataBytes(),i),(s.previous===null||s.getPreviousStartMode()!==s.getMode())&&(s.getMode()===g.B256&&(e<=249?(i.unshift(e),e++):(i.unshift(e%250),i.unshift(e/250+249),e+=2),o.push(i.length),a.push(e)),this.prepend(s.getLatchBytes(),i),e=0),s=s.previous;r.getMacroId()===5?e+=this.prepend($.getBytes(236),i):r.getMacroId()===6&&(e+=this.prepend($.getBytes(237),i)),r.getFNC1Character()>0&&(e+=this.prepend($.getBytes(232),i));for(var f=0;f<o.length;f++)this.applyRandomPattern(i,i.length-o[f],a[f]);var h=t.getMinSymbolSize(i.length);for(i.length<h&&i.push(129);i.length<h;)i.push(this.randomize253State(i.length+1));this.bytes=new Uint8Array(i.length);for(var f=0;f<this.bytes.length;f++)this.bytes[f]=i[f]}return n.prototype.prepend=function(t,r){for(var e=t.length-1;e>=0;e--)r.unshift(t[e]);return t.length},n.prototype.randomize253State=function(t){var r=149*t%253+1,e=129+r;return e<=254?e:e-254},n.prototype.applyRandomPattern=function(t,r,e){for(var i=0;i<e;i++){var o=r+i,a=t[o]&255,s=149*(o+1)%255+1,f=a+s;t[o]=f<=255?f:f-256}},n.prototype.getBytes=function(){return this.bytes},n})(),$=(function(){function n(t,r,e,i,o){if(this.input=t,this.mode=r,this.fromPosition=e,this.characterLength=i,this.previous=o,this.allCodewordCapacities=[3,5,8,10,12,16,18,22,30,32,36,44,49,62,86,114,144,174,204,280,368,456,576,696,816,1050,1304,1558],this.squareCodewordCapacities=[3,5,8,12,18,22,30,36,44,62,86,114,144,174,204,280,368,456,576,696,816,1050,1304,1558],this.rectangularCodewordCapacities=[5,10,16,33,32,49],!(e+i<=t.length()))throw new Error("Invalid edge");var a=o!==null?o.cachedTotalSize:0,s=this.getPreviousMode();switch(r){case g.ASCII:a++,(t.isECI(e)||H.isExtendedASCII(t.charAt(e),t.getFNC1Character()))&&a++,(s===g.C40||s===g.TEXT||s===g.X12)&&a++;break;case g.B256:a++,(s!==g.B256||this.getB256Size()===250)&&a++,s===g.ASCII?a++:(s===g.C40||s===g.TEXT||s===g.X12)&&(a+=2);break;case g.C40:case g.TEXT:case g.X12:if(r===g.X12)a+=2;else{var f=[];a+=H.getNumberOfC40Words(t,e,r===g.C40,f)*2}s===g.ASCII||s===g.B256?a++:s!==r&&(s===g.C40||s===g.TEXT||s===g.X12)&&(a+=2);break;case g.EDF:a+=3,s===g.ASCII||s===g.B256?a++:(s===g.C40||s===g.TEXT||s===g.X12)&&(a+=2);break}this.cachedTotalSize=a}return n.prototype.getB256Size=function(){for(var t=0,r=this;r!==null&&r.mode===g.B256&&t<=250;)t++,r=r.previous;return t},n.prototype.getPreviousStartMode=function(){return this.previous===null?g.ASCII:this.previous.mode},n.prototype.getPreviousMode=function(){return this.previous===null?g.ASCII:this.previous.getEndMode()},n.prototype.getEndMode=function(){if(this.mode===g.EDF){if(this.characterLength<4)return g.ASCII;var t=this.getLastASCII();if(t>0&&this.getCodewordsRemaining(this.cachedTotalSize+t)<=2-t)return g.ASCII}if(this.mode===g.C40||this.mode===g.TEXT||this.mode===g.X12){if(this.fromPosition+this.characterLength>=this.input.length()&&this.getCodewordsRemaining(this.cachedTotalSize)===0)return g.ASCII;var t=this.getLastASCII();if(t===1&&this.getCodewordsRemaining(this.cachedTotalSize+1)===0)return g.ASCII}return this.mode},n.prototype.getMode=function(){return this.mode},n.prototype.getLastASCII=function(){var t=this.input.length(),r=this.fromPosition+this.characterLength;return t-r>4||r>=t?0:t-r===1?H.isExtendedASCII(this.input.charAt(r),this.input.getFNC1Character())?0:1:t-r===2?H.isExtendedASCII(this.input.charAt(r),this.input.getFNC1Character())||H.isExtendedASCII(this.input.charAt(r+1),this.input.getFNC1Character())?0:S.isDigit(this.input.charAt(r))&&S.isDigit(this.input.charAt(r+1))?1:2:t-r===3?S.isDigit(this.input.charAt(r))&&S.isDigit(this.input.charAt(r+1))&&!H.isExtendedASCII(this.input.charAt(r+2),this.input.getFNC1Character())||S.isDigit(this.input.charAt(r+1))&&S.isDigit(this.input.charAt(r+2))&&!H.isExtendedASCII(this.input.charAt(r),this.input.getFNC1Character())?2:0:S.isDigit(this.input.charAt(r))&&S.isDigit(this.input.charAt(r+1))&&S.isDigit(this.input.charAt(r+2))&&S.isDigit(this.input.charAt(r+3))?2:0},n.prototype.getMinSymbolSize=function(t){var r,e,i,o,a,s;switch(this.input.getShapeHint()){case 1:try{for(var f=gt(this.squareCodewordCapacities),h=f.next();!h.done;h=f.next()){var u=h.value;if(u>=t)return u}}catch(v){r={error:v}}finally{try{h&&!h.done&&(e=f.return)&&e.call(f)}finally{if(r)throw r.error}}break;case 2:try{for(var l=gt(this.rectangularCodewordCapacities),c=l.next();!c.done;c=l.next()){var u=c.value;if(u>=t)return u}}catch(v){i={error:v}}finally{try{c&&!c.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}break}try{for(var p=gt(this.allCodewordCapacities),d=p.next();!d.done;d=p.next()){var u=d.value;if(u>=t)return u}}catch(v){a={error:v}}finally{try{d&&!d.done&&(s=p.return)&&s.call(p)}finally{if(a)throw a.error}}return this.allCodewordCapacities[this.allCodewordCapacities.length-1]},n.prototype.getCodewordsRemaining=function(t){return this.getMinSymbolSize(t)-t},n.getBytes=function(t,r){var e=new Uint8Array(r?2:1);return e[0]=t,r&&(e[1]=r),e},n.prototype.setC40Word=function(t,r,e,i,o){var a=1600*(e&255)+40*(i&255)+(o&255)+1;t[r]=a/256,t[r+1]=a%256},n.prototype.getX12Value=function(t){return t===13?0:t===42?1:t===62?2:t===32?3:t>=48&&t<=57?t-44:t>=65&&t<=90?t-51:t},n.prototype.getX12Words=function(){if(this.characterLength%3!==0)throw new Error("X12 words must be a multiple of 3");for(var t=new Uint8Array(this.characterLength/3*2),r=0;r<t.length;r+=2)this.setC40Word(t,r,this.getX12Value(this.input.charAt(this.fromPosition+r/2*3)),this.getX12Value(this.input.charAt(this.fromPosition+r/2*3+1)),this.getX12Value(this.input.charAt(this.fromPosition+r/2*3+2)));return t},n.prototype.getShiftValue=function(t,r,e){return r&&H.isInC40Shift1Set(t)||!r&&H.isInTextShift1Set(t)?0:r&&H.isInC40Shift2Set(t,e)||!r&&H.isInTextShift2Set(t,e)?1:2},n.prototype.getC40Value=function(t,r,e,i){if(e===i){if(r!==2)throw new Error("FNC1 cannot be used in C40 shift 2");return 27}return t?e<=31?e:e===32?3:e<=47?e-33:e<=57?e-44:e<=64?e-43:e<=90?e-51:e<=95?e-69:e<=127?e-96:e:e===0?0:r===0&&e<=3?e-1:r===1&&e<=31?e:e===32?3:e>=33&&e<=47?e-33:e>=48&&e<=57?e-44:e>=58&&e<=64?e-43:e>=65&&e<=90?e-64:e>=91&&e<=95?e-69:e===96?0:e>=97&&e<=122?e-83:e>=123&&e<=127?e-96:e},n.prototype.getC40Words=function(t,r){for(var e=[],i=0;i<this.characterLength;i++){var o=this.input.charAt(this.fromPosition+i);if(t&&S.isNativeC40(o)||!t&&S.isNativeText(o))e.push(this.getC40Value(t,0,o,r));else if(H.isExtendedASCII(o,r)){var s=(o&255)-128;if(t&&S.isNativeC40(s)||!t&&S.isNativeText(s))e.push(1),e.push(30),e.push(this.getC40Value(t,0,s,r));else{e.push(1),e.push(30);var a=this.getShiftValue(s,t,r);e.push(a),e.push(this.getC40Value(t,a,s,r))}}else{var a=this.getShiftValue(o,t,r);e.push(a),e.push(this.getC40Value(t,a,o,r))}}if(e.length%3!==0){if(!((e.length-2)%3===0&&this.fromPosition+this.characterLength===this.input.length()))throw new Error("C40 words must be a multiple of 3");e.push(0)}for(var f=new Uint8Array(e.length/3*2),h=0,i=0;i<e.length;i+=3)this.setC40Word(f,h,e[i]&255,e[i+1]&255,e[i+2]&255),h+=2;return f},n.prototype.getEDFBytes=function(){for(var t=Math.ceil(this.characterLength/4),r=new Uint8Array(t*3),e=this.fromPosition,i=Math.min(this.fromPosition+this.characterLength-1,this.input.length()-1),o=0;o<t;o+=3){for(var a=[],s=0;s<4;s++)e<=i?a[s]=this.input.charAt(e++)&63:a[s]=e===i+1?31:0;var f=a[0]<<18;f|=a[1]<<12,f|=a[2]<<6,f|=a[3],r[o]=f>>16&255,r[o+1]=f>>8&255,r[o+2]=f&255}return r},n.prototype.getLatchBytes=function(){switch(this.getPreviousMode()){case g.ASCII:case g.B256:switch(this.mode){case g.B256:return n.getBytes(231);case g.C40:return n.getBytes(230);case g.TEXT:return n.getBytes(239);case g.X12:return n.getBytes(238);case g.EDF:return n.getBytes(240)}break;case g.C40:case g.TEXT:case g.X12:if(this.mode!==this.getPreviousMode())switch(this.mode){case g.ASCII:return n.getBytes(254);case g.B256:return n.getBytes(254,231);case g.C40:return n.getBytes(254,230);case g.TEXT:return n.getBytes(254,239);case g.X12:return n.getBytes(254,238);case g.EDF:return n.getBytes(254,240)}break;case g.EDF:if(this.mode!==g.EDF)throw new Error("Cannot switch from EDF to "+this.mode);break}return new Uint8Array(0)},n.prototype.getDataBytes=function(){switch(this.mode){case g.ASCII:return this.input.isECI(this.fromPosition)?n.getBytes(241,this.input.getECIValue(this.fromPosition)+1):H.isExtendedASCII(this.input.charAt(this.fromPosition),this.input.getFNC1Character())?n.getBytes(235,this.input.charAt(this.fromPosition)-127):this.characterLength===2?n.getBytes(this.input.charAt(this.fromPosition)*10+this.input.charAt(this.fromPosition+1)+130):this.input.isFNC1(this.fromPosition)?n.getBytes(232):n.getBytes(this.input.charAt(this.fromPosition)+1);case g.B256:return n.getBytes(this.input.charAt(this.fromPosition));case g.C40:return this.getC40Words(!0,this.input.getFNC1Character());case g.TEXT:return this.getC40Words(!1,this.input.getFNC1Character());case g.X12:return this.getX12Words();case g.EDF:return this.getEDFBytes()}},n})(),Rn=(function(n){Mn(t,n);function t(r,e,i,o,a){var s=n.call(this,r,e,i)||this;return s.shape=o,s.macroId=a,s}return t.prototype.getMacroId=function(){return this.macroId},t.prototype.getShapeHint=function(){return this.shape},t})(Rr);var Pn=(function(){function n(){}return n.prototype.encode=function(t,r,e,i,o){if(o===void 0&&(o=null),t.trim()==="")throw new Error("Found empty contents");if(r!==st.DATA_MATRIX)throw new Error("Can only encode DATA_MATRIX, but got "+r);if(e<0||i<0)throw new Error("Requested dimensions can't be negative: "+e+"x"+i);var a=0,s=null,f=null;if(o!=null){var h=o.get(Q.DATA_MATRIX_SHAPE);h!=null&&(a=h);var u=o.get(Q.MIN_SIZE);u!=null&&(s=u);var l=o.get(Q.MAX_SIZE);l!=null&&(f=l)}var c,p=o!=null&&o.has(Q.DATA_MATRIX_COMPACT)&&!!o.get(Q.DATA_MATRIX_COMPACT).toString();if(p){var d=o.has(Q.GS1_FORMAT)&&!!o.get(Q.GS1_FORMAT).toString(),v=null,w=o.has(Q.CHARACTER_SET);w&&(v=St.forName(o.get(Q.CHARACTER_SET).toString())),c=H.encodeHighLevel(t,v,d?29:-1,a)}else{var E=o!=null&&o.has(Q.FORCE_C40)&&!!o.get(Q.FORCE_C40).toString();c=S.encodeHighLevel(t,a,s,f,E)}var y=vt.lookup(c.length,a,s,f,!0),m=Zt.encodeECC200(c,y),C=new Wt(m,y.getSymbolDataWidth(),y.getSymbolDataHeight());return C.place(),this.encodeLowLevel(C,y,e,i)},n.prototype.encodeLowLevel=function(t,r,e,i){for(var o=r.getSymbolDataWidth(),a=r.getSymbolDataHeight(),s=new yr(r.getSymbolWidth(),r.getSymbolHeight()),f=0,h=0;h<a;h++){var u=void 0;if(h%r.matrixHeight===0){u=0;for(var l=0;l<r.getSymbolWidth();l++)s.setBoolean(u,f,l%2===0),u++;f++}u=0;for(var l=0;l<o;l++)l%r.matrixWidth===0&&(s.setBoolean(u,f,!0),u++),s.setBoolean(u,f,t.getBit(l,h)),u++,l%r.matrixWidth===r.matrixWidth-1&&(s.setBoolean(u,f,h%2===0),u++);if(f++,h%r.matrixHeight===r.matrixHeight-1){u=0;for(var l=0;l<r.getSymbolWidth();l++)s.setBoolean(u,f,!0),u++;f++}}return this.convertByteMatrixToBitMatrix(s,e,i)},n.prototype.convertByteMatrixToBitMatrix=function(t,r,e){var i=t.getWidth(),o=t.getHeight(),a=Math.max(r,i),s=Math.max(e,o),f=Math.min(a/i,s/o),h=(a-i*f)/2,u=(s-o*f)/2,l;e<o||r<i?(h=0,u=0,l=new q(i,o)):l=new q(r,e),l.clear();for(var c=0,p=u;c<o;c++,p+=f)for(var d=0,v=h;d<i;d++,v+=f)t.get(d,c)===1&&l.setRegion(v,p,f,f);return l},n})(),Pr=Pn;/*! Data Matrix codec powered by @zxing/library (Apache-2.0). Bundled into the userscript at build time. */var Lr=new Map([[rt.PURE_BARCODE,!0]]);function Ln(n,t,r){let e=new Uint8ClampedArray(t*r);for(let i=0,o=0;o<e.length;i+=4,o+=1)e[o]=n[i]+2*n[i+1]+n[i+2]>>2;return e}function kn(n,t,r=null){let e=new qt(new t(n));return new Er().decode(e,r)}function Un(n,t,r){if(!n||!Number.isInteger(t)||!Number.isInteger(r)||t<1||r<1)throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 DataMatrix.");let e=new Qt(Ln(n,t,r),t,r),i=[[e,ct,null],[e,ct,Lr],[e.invert(),ct,null],[e.invert(),ct,Lr],[e,wt,null]],o;for(let[s,f,h]of i)try{let u=kn(s,f,h);return{text:u.getText(),rawBytes:u.getRawBytes()||null,format:"DATA_MATRIX"}}catch(u){o=u}let a=new Error("DataMatrix \u043D\u0430 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041E\u0431\u0440\u0435\u0436\u044C\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0431\u043B\u0438\u0436\u0435 \u043A \u043A\u043E\u0434\u0443 \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430.");throw a.cause=o,a}function zn(n,t=320){let r=String(n||"");if(!r)throw new Error("\u041F\u0443\u0441\u0442\u0443\u044E \u043C\u0430\u0440\u043A\u0443 \u043D\u0435\u043B\u044C\u0437\u044F \u0437\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u0442\u044C.");let e=new Pr().encode(r,st.DATA_MATRIX,0,0),i=e.getWidth(),o=e.getHeight(),a=2,s=Math.max(1,Math.floor(t/(Math.max(i,o)+a*2))),f=(i+a*2)*s,h=(o+a*2)*s,u=new Uint8Array(f*h);for(let l=0;l<o;l+=1)for(let c=0;c<i;c+=1){if(!e.get(c,l))continue;let p=(c+a)*s,d=(l+a)*s;for(let v=0;v<s;v+=1)u.fill(1,(d+v)*f+p,(d+v)*f+p+s)}return{width:f,height:h,bits:u}}return jr(Xn);})();

  const VERSION = '9.0.0';
  const HOST_ID = 'dxbx-support-toolkit-v2';
  const STORAGE_PREFIX = 'dxbx-support-toolkit.v2';
  const API_PREFIX = '/api';

  if (document.getElementById(HOST_ID)) return;

  const app = {
    currentView: 'rests',
    profile: null,
    profilePromise: null,
    selectedLegalPersonPublicId: storageGet('selectedLegalPersonPublicId', ''),
    routeVersion: 0,
    modules: new Map(),
  };

  function storageGet(key, fallback) {
    try {
      return GM_getValue(`${STORAGE_PREFIX}.${key}`, fallback);
    } catch {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      GM_setValue(`${STORAGE_PREFIX}.${key}`, value);
    } catch (error) {
      console.warn('[DXBX Support Toolkit] Не удалось сохранить настройку', key, error);
    }
  }

  function readJsonStorage(storage, key) {
    try {
      const value = storage.getItem(key);
      return value === null ? null : JSON.parse(value);
    } catch {
      return null;
    }
  }

  function getSpaceId() {
    return readJsonStorage(sessionStorage, 'space-id') ?? readJsonStorage(localStorage, 'space-id') ?? null;
  }

  function apiPath(path) {
    if (/^https?:\/\//i.test(path)) {
      const url = new URL(path);
      if (url.origin !== location.origin) throw new Error('Внешние запросы в toolkit запрещены');
      return `${url.pathname}${url.search}`;
    }
    if (path.startsWith('/api/')) return path;
    if (path.startsWith('/')) return path;
    return `${API_PREFIX}/${path}`;
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const spaceId = getSpaceId();
    if (spaceId !== null && !headers.has('X-DxBx-SpaceId')) headers.set('X-DxBx-SpaceId', String(spaceId));

    let body = options.body;
    if (body !== undefined && body !== null && typeof body !== 'string' && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }
    headers.set('Accept', headers.get('Accept') || 'application/json, text/plain, */*');

    const response = await fetch(apiPath(path), {
      ...options,
      body,
      headers,
      credentials: 'include',
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';
    const text = response.status === 204 ? '' : await response.text();
    let data = text;
    if (text && contentType.includes('json')) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const error = new Error(extractErrorMessage(data, response.status));
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return { data, response };
  }

  function extractErrorMessage(data, status) {
    if (typeof data === 'string' && data.trim()) return data.trim().slice(0, 500);
    if (data && typeof data === 'object') {
      for (const key of ['message', 'errorMessage', 'description', 'details', 'error', 'reason']) {
        if (typeof data[key] === 'string' && data[key].trim()) return data[key].trim();
      }
      if (typeof data.code === 'string') return data.code;
    }
    return `HTTP ${status}`;
  }

  async function getProfile({ refresh = false } = {}) {
    if (refresh) {
      app.profile = null;
      app.profilePromise = null;
    }
    if (app.profile) return app.profile;
    if (!app.profilePromise) {
      app.profilePromise = request('/api/rest/v1/profile')
        .then(({ data }) => {
          app.profile = data;
          const legalPersons = Array.isArray(data?.legalPersons) ? data.legalPersons : [];
          if (!legalPersons.some((item) => item.publicId === app.selectedLegalPersonPublicId)) {
            app.selectedLegalPersonPublicId = legalPersons[0]?.publicId || '';
            storageSet('selectedLegalPersonPublicId', app.selectedLegalPersonPublicId);
          }
          return data;
        })
        .finally(() => {
          app.profilePromise = null;
        });
    }
    return app.profilePromise;
  }

  function getSelectedLegalPerson() {
    const legalPersons = Array.isArray(app.profile?.legalPersons) ? app.profile.legalPersons : [];
    return legalPersons.find((item) => item.publicId === app.selectedLegalPersonPublicId) || legalPersons[0] || null;
  }

  function setSelectedLegalPerson(publicId) {
    app.selectedLegalPersonPublicId = publicId || '';
    storageSet('selectedLegalPersonPublicId', app.selectedLegalPersonPublicId);
  }

  function frontendUrl(path) {
    if (/^https?:\/\//.test(path)) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${location.origin}/fe${normalized}`;
  }

  function h(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'className') node.className = value;
      else if (key === 'text') node.textContent = String(value);
      else if (key === 'html') node.innerHTML = value;
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key in node && key !== 'list') node[key] = value;
      else node.setAttribute(key, String(value));
    }
    const normalized = Array.isArray(children) ? children : [children];
    for (const child of normalized.flat(Infinity)) {
      if (child === undefined || child === null || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function clear(node) {
    node.replaceChildren();
    return node;
  }

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDateForLegacy(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}`;
  }

  function parseDxbxDate(value) {
    const source = String(value || '').trim();
    let match = source.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
    match = source.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return null;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function copyText(value) {
    const text = String(value);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = h('textarea', { value: text, readonly: true });
    Object.assign(textarea.style, { position: 'fixed', opacity: '0', pointerEvents: 'none' });
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function registerModule(module) {
    app.modules.set(module.id, module);
  }


  const ui = {
    host: null,
    shadow: null,
    panel: null,
    content: null,
    nav: null,
    toast: null,
    launcher: null,
    suppressLauncherClick: false,
    open: false,
    renderToken: 0,

    mount() {
      this.host = h('div', { id: HOST_ID });
      this.shadow = this.host.attachShadow({ mode: 'open' });
      this.shadow.append(h('style', { text: STYLES }));

      this.launcher = h('button', {
        className: 'launcher',
        type: 'button',
        title: 'DXBX Support Toolkit',
        text: 'DXBX',
        onclick: (event) => {
          if (this.suppressLauncherClick) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          this.toggle();
        },
      });

      const close = h('button', {
        className: 'icon-button',
        type: 'button',
        title: 'Закрыть',
        text: '×',
        onclick: () => this.hide(),
      });
      const title = h('div', { className: 'panel-title' }, [
        h('strong', { text: 'DXBX Support Toolkit' }),
        h('span', { text: `v${VERSION}` }),
      ]);
      const header = h('header', { className: 'panel-header' }, [title, close]);
      this.nav = h('nav', { className: 'nav' });
      this.content = h('main', { className: 'content' });
      this.toast = h('div', { className: 'toast', role: 'status' });
      this.panel = h('section', { className: 'panel', hidden: true }, [header, this.nav, this.content]);
      this.shadow.append(this.launcher, this.panel, this.toast);
      document.documentElement.append(this.host);
      this.restoreLauncherPosition();
      this.enableLauncherDrag();
      window.addEventListener('resize', () => this.restoreLauncherPosition(true), { passive: true });
      this.renderNav();
    },

    clampLauncherPosition(x, y) {
      const rect = this.launcher.getBoundingClientRect();
      const margin = 8;
      return {
        x: Math.round(Math.min(Math.max(Number(x) || margin, margin), Math.max(margin, innerWidth - (rect.width || 58) - margin))),
        y: Math.round(Math.min(Math.max(Number(y) || margin, margin), Math.max(margin, innerHeight - (rect.height || 32) - margin))),
      };
    },

    applyLauncherPosition(position) {
      const next = this.clampLauncherPosition(position?.x, position?.y);
      this.host.style.left = `${next.x}px`;
      this.host.style.top = `${next.y}px`;
      return next;
    },

    restoreLauncherPosition(persist = false) {
      const saved = storageGet('launcher.position', null);
      const fallback = { x: innerWidth - 74, y: 64 };
      const next = this.applyLauncherPosition(saved || fallback);
      if (persist && saved) storageSet('launcher.position', next);
    },

    enableLauncherDrag() {
      let drag = null;
      this.launcher.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        const rect = this.host.getBoundingClientRect();
        drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          left: rect.left,
          top: rect.top,
          moved: false,
        };
        this.launcher.setPointerCapture?.(event.pointerId);
        this.launcher.classList.add('dragging');
      });
      this.launcher.addEventListener('pointermove', (event) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
        if (drag.moved) event.preventDefault();
        this.applyLauncherPosition({ x: drag.left + dx, y: drag.top + dy });
      });
      const finish = (event) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const moved = drag.moved;
        drag = null;
        this.launcher.releasePointerCapture?.(event.pointerId);
        this.launcher.classList.remove('dragging');
        if (!moved) return;
        this.suppressLauncherClick = true;
        storageSet('launcher.position', this.applyLauncherPosition({
          x: parseFloat(this.host.style.left),
          y: parseFloat(this.host.style.top),
        }));
        setTimeout(() => { this.suppressLauncherClick = false; }, 0);
      };
      this.launcher.addEventListener('pointerup', finish);
      this.launcher.addEventListener('pointercancel', finish);
    },

    renderNav() {
      clear(this.nav);
      for (const module of app.modules.values()) {
        const button = h('button', {
          className: `nav-button${app.currentView === module.id ? ' active' : ''}`,
          type: 'button',
          text: module.label,
          onclick: () => this.setView(module.id),
        });
        this.nav.append(button);
      }
    },

    async render() {
      const token = ++this.renderToken;
      const module = app.modules.get(app.currentView) || app.modules.values().next().value;
      if (!module) return;
      clear(this.content).append(this.loading('Загрузка...'));
      this.renderNav();
      try {
        const result = await module.render();
        if (token !== this.renderToken) return;
        clear(this.content).append(result);
      } catch (error) {
        if (token !== this.renderToken) return;
        clear(this.content).append(this.error(error));
      }
    },

    setView(id) {
      if (!app.modules.has(id)) return;
      app.currentView = id;
      this.render();
    },

    show() {
      this.open = true;
      this.panel.hidden = false;
      this.render();
    },

    hide() {
      this.open = false;
      this.panel.hidden = true;
    },

    toggle() {
      if (this.open) this.hide();
      else this.show();
    },

    notify(message, type = 'info', timeout = 4000) {
      this.toast.textContent = String(message);
      this.toast.dataset.type = type;
      this.toast.classList.add('visible');
      clearTimeout(this.toast._timer);
      this.toast._timer = setTimeout(() => this.toast.classList.remove('visible'), timeout);
    },

    modal(title, content = [], options = {}) {
      const body = h('div', { className: 'modal-body' }, content);
      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        overlay.remove();
        document.removeEventListener('keydown', onKeydown, true);
        options.onClose?.();
      };
      const onKeydown = (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        close();
      };
      const overlay = h('div', {
        className: 'modal-overlay',
        onclick: (event) => {
          if (event.target === overlay) close();
        },
      });
      const dialog = h('section', {
        className: `modal${options.wide ? ' wide' : ''}${options.workspace ? ' workspace' : ''}`,
        role: 'dialog',
      }, [
        h('header', { className: 'modal-header' }, [
          h('strong', { text: title }),
          h('button', { className: 'icon-button', type: 'button', title: 'Закрыть', text: '×', onclick: close }),
        ]),
        body,
      ]);
      overlay.append(dialog);
      this.shadow.append(overlay);
      document.addEventListener('keydown', onKeydown, true);
      return { overlay, dialog, body, close };
    },

    loading(message) {
      return h('div', { className: 'state' }, [h('span', { className: 'spinner' }), message]);
    },

    error(error) {
      return h('div', { className: 'alert error' }, [
        h('strong', { text: 'Ошибка' }),
        h('div', { text: error?.message || String(error) }),
      ]);
    },

    section(title, description, children = []) {
      return h('section', { className: 'section' }, [
        h('div', { className: 'section-heading' }, [
          h('h2', { text: title }),
          description ? h('p', { text: description }) : null,
        ]),
        children,
      ]);
    },

    button(label, options = {}) {
      return h('button', {
        type: 'button',
        className: `button ${options.variant || 'secondary'}${options.small ? ' small' : ''}`,
        text: label,
        disabled: options.disabled,
        onclick: options.onclick,
      });
    },

    field(label, control, hint) {
      return h('label', { className: 'field' }, [
        h('span', { className: 'field-label', text: label }),
        control,
        hint ? h('small', { text: hint }) : null,
      ]);
    },

    legalPersonSelect(profile, selectedPublicId = app.selectedLegalPersonPublicId) {
      const select = h('select', { className: 'control' });
      for (const item of profile?.legalPersons || []) {
        select.append(h('option', {
          value: item.publicId,
          text: `${item.name} · ${item.inn}${item.kpp ? ` / ${item.kpp}` : ''}`,
          selected: item.publicId === selectedPublicId,
        }));
      }
      return select;
    },
  };

  const STYLES = `
    :host {
      all: initial; position: fixed; z-index: 2147483645;
      display: inline-flex; color-scheme: light;
    }
    *, *::before, *::after { box-sizing: border-box; }
    button, input, select { font: inherit; }
    .launcher {
      height: 32px; border: 1px solid #69b1ff; border-radius: 6px; padding: 0 12px;
      background: #1677ff; color: #fff; font: 800 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: .04em; box-shadow: 0 3px 12px rgba(22,119,255,.3); cursor: grab; touch-action: none; user-select: none;
    }
    .launcher:hover { background: #0958d9; transform: translateY(-1px); }
    .launcher.dragging { cursor: grabbing; transform: none; box-shadow: 0 5px 18px rgba(22,119,255,.42); }
    .panel {
      position: fixed; top: 53px; right: 20px; z-index: 2147483646;
      width: min(760px, calc(100vw - 32px)); max-height: min(780px, calc(100vh - 69px));
      overflow: hidden; border: 1px solid #d9d9d9; border-radius: 16px; background: #fff;
      color: #1f1f1f; box-shadow: 0 18px 60px rgba(0,0,0,.22);
      font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .panel[hidden] { display: none; }
    .panel-header { height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-bottom: 1px solid #f0f0f0; }
    .panel-title { display: flex; align-items: baseline; gap: 8px; }
    .panel-title strong { font-size: 16px; }
    .panel-title span { color: #8c8c8c; font-size: 12px; }
    .icon-button { border: 0; background: transparent; color: #595959; font-size: 28px; line-height: 1; cursor: pointer; padding: 4px 8px; }
    .nav { height: 46px; display: flex; gap: 4px; padding: 6px 12px; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
    .nav-button { border: 0; border-radius: 8px; padding: 0 14px; background: transparent; color: #595959; cursor: pointer; font-weight: 600; }
    .nav-button:hover { background: #f0f0f0; color: #1f1f1f; }
    .nav-button.active { background: #e6f4ff; color: #0958d9; }
    .content { max-height: calc(100vh - 214px); overflow: auto; padding: 18px; }
    .section { border: 1px solid #f0f0f0; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    .section-heading { margin-bottom: 14px; }
    .section-heading h2 { margin: 0 0 3px; font-size: 15px; }
    .section-heading p { margin: 0; color: #8c8c8c; font-size: 12px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .card { border: 1px solid #f0f0f0; border-radius: 10px; padding: 12px; background: #fafafa; min-width: 0; }
    .card-label { color: #8c8c8c; font-size: 11px; text-transform: uppercase; letter-spacing: .03em; }
    .card-value { margin-top: 4px; font-weight: 600; word-break: break-word; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .button { border: 1px solid transparent; border-radius: 8px; min-height: 34px; padding: 7px 13px; cursor: pointer; font-weight: 600; }
    .button.small { min-height: 28px; padding: 4px 9px; font-size: 12px; }
    .button:disabled { opacity: .45; cursor: not-allowed; }
    .button.primary { background: #1677ff; color: #fff; }
    .button.primary:hover:not(:disabled) { background: #0958d9; }
    .button.secondary { background: #fff; color: #1f1f1f; border-color: #d9d9d9; }
    .button.secondary:hover:not(:disabled) { color: #0958d9; border-color: #69b1ff; }
    .button.danger { background: #ff4d4f; color: #fff; }
    .button.danger:hover:not(:disabled) { background: #cf1322; }
    .field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .field-label { color: #595959; font-size: 12px; font-weight: 600; }
    .field small { color: #8c8c8c; }
    .control { width: 100%; height: 36px; border: 1px solid #d9d9d9; border-radius: 8px; background: #fff; color: #1f1f1f; padding: 0 10px; }
    .control:focus { outline: 2px solid #bae0ff; border-color: #1677ff; }
    textarea.control { height: auto; min-height: 72px; padding: 8px 10px; resize: vertical; }
    .check-group { display: flex; flex-wrap: wrap; gap: 8px 12px; }
    .check { display: inline-flex; gap: 5px; align-items: center; font-size: 12px; }
    .alert { border-radius: 9px; padding: 10px 12px; margin: 10px 0; background: #e6f4ff; border: 1px solid #91caff; color: #003eb3; }
    .alert.warning { background: #fffbe6; border-color: #ffe58f; color: #874d00; }
    .alert.error { background: #fff2f0; border-color: #ffccc7; color: #a8071a; }
    .alert.success { background: #f6ffed; border-color: #b7eb8f; color: #135200; }
    .state { min-height: 120px; display: flex; gap: 10px; align-items: center; justify-content: center; color: #8c8c8c; }
    .spinner { width: 18px; height: 18px; border: 2px solid #bae0ff; border-top-color: #1677ff; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .toast { position: fixed; right: 20px; bottom: 78px; z-index: 2147483647; transform: translateY(12px); opacity: 0; pointer-events: none; border-radius: 8px; padding: 9px 13px; background: #262626; color: white; transition: .18s ease; max-width: min(420px, calc(100vw - 32px)); font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .toast.visible { opacity: 1; transform: translateY(0); }
    .toast[data-type="error"] { background: #a8071a; }
    .toast[data-type="success"] { background: #237804; }
    .modal-overlay {
      position: fixed; inset: 0; z-index: 2147483647; display: grid; place-items: center;
      padding: 18px; background: rgba(0,0,0,.38);
      font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .modal {
      width: min(520px, 100%); max-height: min(760px, calc(100vh - 36px)); overflow: hidden;
      border: 1px solid #d9d9d9; border-radius: 14px; background: #fff; color: #1f1f1f;
      box-shadow: 0 20px 70px rgba(0,0,0,.28);
    }
    .modal.wide { width: min(900px, 100%); }
    .modal.workspace { width: min(1380px, 100%); }
    .modal.workspace .modal-body { padding: 14px; background: #f7f9fc; }
    .modal-header { height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px 0 18px; border-bottom: 1px solid #f0f0f0; }
    .modal-header strong { font-size: 16px; }
    .modal-body { max-height: calc(100vh - 90px); overflow: auto; padding: 16px 18px 18px; }
    .fskatr-screen { display: grid; gap: 22px; }
    .fskatr-product-header { display: flex; align-items: flex-start; gap: 12px; }
    .fskatr-product-icon { display: grid; place-items: center; flex: 0 0 48px; width: 48px; height: 48px; border-radius: 16px; background: #e6f4ff; color: #1677ff; font-size: 25px; }
    .fskatr-product-main { min-width: 0; flex: 1; }
    .fskatr-product-name { margin: 0 0 9px; color: #1f1f1f; font-size: 16px; font-weight: 700; line-height: 1.35; }
    .fskatr-invoice-line { display: flex; flex-wrap: wrap; align-items: center; gap: 7px 12px; color: #595959; }
    .fskatr-tag { display: inline-flex; align-items: center; min-height: 24px; border-radius: 8px; padding: 1px 8px; background: #f6ffed; color: #237804; font-size: 11px; font-weight: 700; }
    .fskatr-tag.inactive { background: #fff2f0; color: #a8071a; }
    .fskatr-code-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .fskatr-code-card { min-width: 0; border-radius: 14px; padding: 13px 14px; background: #f5f5f5; }
    .fskatr-code-card.mark { grid-column: 1 / -1; }
    .fskatr-code-label { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; color: #8c8c8c; font-size: 11px; }
    .fskatr-copy { border: 0; padding: 1px 3px; background: transparent; color: #8c8c8c; cursor: pointer; }
    .fskatr-code { overflow: hidden; color: #262626; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
    .fskatr-section-title { margin: 0 0 11px; font-size: 15px; font-weight: 700; }
    .fskatr-info-list { display: grid; gap: 11px; }
    .fskatr-info-row { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 9px; }
    .fskatr-info-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #fafafa; color: #8c8c8c; font-size: 16px; }
    .fskatr-info-label { color: #8c8c8c; font-size: 11px; }
    .fskatr-info-value { color: #262626; font-weight: 600; }
    .fskatr-info-meta { margin-top: 2px; color: #8c8c8c; font-size: 11px; }
    .fskatr-history-card { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 12px; }
    .fskatr-history-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: #f6ffed; color: #52c41a; font-size: 20px; }
    .fskatr-history-head { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: baseline; margin-bottom: 10px; }
    .fskatr-history-head strong { font-size: 15px; }
    .fskatr-history-head span { color: #8c8c8c; }
    .fskatr-statuses { display: grid; gap: 10px; }
    .fskatr-status { border-left: 2px solid #bae0ff; padding-left: 11px; }
    .fskatr-status-label { display: inline-flex; border-radius: 7px; padding: 2px 8px; background: #e6f4ff; color: #0958d9; font-size: 11px; font-weight: 700; }
    .fskatr-status-date { margin-top: 3px; color: #8c8c8c; font-size: 11px; }
    .fskatr-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 2px; }
    .fskatr-open { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .table-wrap { overflow: auto; max-height: 330px; border: 1px solid #f0f0f0; border-radius: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { position: sticky; top: 0; z-index: 1; background: #fafafa; color: #595959; text-align: left; }
    th, td { padding: 8px 9px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    tr:last-child td { border-bottom: 0; }
    tr.done { background: #f6ffed; }
    tr.failed { background: #fff2f0; }
    a { color: #0958d9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .muted { color: #8c8c8c; }
    .mono { font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; word-break: break-all; }
    .result-json { margin: 10px 0; max-height: 300px; overflow: auto; border: 1px solid #f0f0f0; border-radius: 8px; background: #fafafa; padding: 10px; white-space: pre-wrap; }
    .dm-drop-zone { margin-top: 10px; border: 2px dashed #d9d9d9; border-radius: 10px; padding: 24px; text-align: center; color: #8c8c8c; background: #fafafa; }
    .dm-drop-zone[data-active="true"] { border-color: #1677ff; background: #e6f4ff; color: #0958d9; }
    .dm-result-text { user-select: all; }
    .dm-generated-wrap { display: flex; justify-content: center; padding: 12px; margin-bottom: 10px; background: #fafafa; border-radius: 10px; }
    .dm-generated-canvas { width: min(320px, 100%); height: auto; image-rendering: pixelated; background: #fff; }
    .badge { display: inline-block; border-radius: 999px; padding: 2px 7px; background: #f0f0f0; color: #595959; font-size: 11px; }
    .bottle-searchbar { display: grid; grid-template-columns: 190px minmax(260px, 1fr) auto; gap: 8px; margin-bottom: 12px; padding: 12px; border: 1px solid #d6e7ff; border-radius: 10px; background: #eef6ff; }
    .bottle-searchbar .control { width: 100%; }
    .bottle-stats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 9px; }
    .bottle-stat { display: inline-flex; align-items: center; min-height: 25px; border: 1px solid #d9d9d9; border-radius: 999px; padding: 3px 9px; background: #fff; color: #595959; font-size: 11px; font-weight: 700; }
    .bottle-stat.active { border-color: #91caff; background: #e6f4ff; color: #0958d9; }
    .bottle-stat.present { border-color: #b7eb8f; background: #f6ffed; color: #237804; }
    .bottle-stat.absent { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
    .bottle-filterbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid #e8eaed; border-radius: 10px 10px 0 0; background: #fff; }
    .bottle-filterbar .control { width: auto; min-width: 150px; }
    .bottle-filterbar .grow { flex: 1 1 300px; }
    .bottle-bulkbar { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; padding: 9px 12px; border: 1px solid #e8eaed; border-top: 0; background: #fafafa; }
    .bottle-bulkbar strong { min-width: 105px; color: #595959; font-size: 12px; }
    .bottle-bulk-spacer { flex: 1 1 20px; }
    .bottle-bulkbar .button[data-kind="bar-add"] { border-color: #52c41a; background: #52c41a; color: #fff; }
    .bottle-bulkbar .button[data-kind="bar-remove"] { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
    .bottle-bulkbar .button[data-kind="blank"] { border-color: #d3adf7; background: #f9f0ff; color: #531dab; }
    .bottle-bulkbar .button[data-kind="xlsx"] { border-color: #1677ff; background: #1677ff; color: #fff; }
    .bottle-bulkbar .button[data-kind="xlsx-selected"] { border-color: #91caff; background: #e6f4ff; color: #0958d9; }
    .workspace-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-bottom: 8px; }
    .workspace-bar .control { width: auto; min-width: 140px; }
    .workspace-bar .grow { flex: 1 1 240px; }
    .workspace-count { margin-left: auto; color: #8c8c8c; font-size: 12px; white-space: nowrap; }
    .workspace-table { max-height: calc(100vh - 302px); border-radius: 0 0 10px 10px; border-color: #e8eaed; background: #fff; }
    .workspace-table table { min-width: 1260px; table-layout: fixed; }
    .workspace-table th, .workspace-table td { padding: 8px 9px; vertical-align: middle; }
    .workspace-table th { background: #f5f7fa; color: #3d4652; font-weight: 700; }
    .workspace-table tbody tr:hover { background: #f5f9ff; }
    .workspace-table th[data-sort] { cursor: pointer; user-select: none; }
    .workspace-table th[data-sort]:hover { color: #0958d9; }
    .workspace-table tr[data-active="false"] { background: #fafafa; opacity: .6; }
    .workspace-table .col-check { width: 34px; text-align: center; }
    .workspace-table .col-name { width: 245px; }
    .workspace-table .col-mark { width: 215px; }
    .workspace-table .col-volume { width: 125px; }
    .workspace-table .col-status { width: 145px; text-align: center; }
    .workspace-table .col-formb { width: 145px; }
    .workspace-table .col-actions { width: 355px; }
    .workspace-name { font-weight: 600; line-height: 1.3; }
    .workspace-meta { margin-top: 2px; color: #8c8c8c; font-size: 11px; }
    .workspace-mark { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .workspace-mark[title] { cursor: copy; }
    .workspace-actions { display: flex; flex-wrap: wrap; gap: 4px; }
    .workspace-actions .button { min-height: 25px; padding: 3px 7px; font-size: 11px; border-radius: 6px; }
    .workspace-actions .button.active { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
    .workspace-actions .button[data-kind="bottle"] { border-color: #91caff; background: #e6f4ff; color: #0958d9; font-weight: 700; }
    .workspace-actions .button[data-kind="datamatrix"] { border-color: #d3adf7; background: #f9f0ff; color: #531dab; }
    .workspace-actions .button[data-kind="invoice"] { border-color: #ffd591; background: #fff7e6; color: #ad4e00; }
    .workspace-actions .button[data-kind="bar"], .workspace-actions .button[data-kind="writeoff"] { border-color: #b7eb8f; background: #f6ffed; color: #237804; }
    .workspace-actions .button[data-kind="bar"].active, .workspace-actions .button[data-kind="writeoff"].active { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
    .workspace-actions .button[data-kind="blank"] { border-color: #d3adf7; background: #f9f0ff; color: #531dab; }
    .dxbx-support-tz-status { display: inline-flex; align-items: center; justify-content: center; min-height: 28px; border: 1px solid #d9d9d9; border-radius: 999px; padding: 3px 10px; background: #fafafa; color: #595959; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .dxbx-support-tz-status[data-state="present"] { border-color: #95de64; background: #f6ffed; color: #237804; }
    .dxbx-support-tz-status[data-state="absent"] { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
    .dxbx-support-tz-status[data-state="error"] { border-color: #ffe58f; background: #fffbe6; color: #874d00; }
    .workspace-empty { padding: 28px; text-align: center; color: #8c8c8c; }
    .workspace-progress { height: 3px; margin: -1px 0 8px; overflow: hidden; border-radius: 3px; background: #f0f0f0; }
    .workspace-progress > span { display: block; height: 100%; background: #1677ff; transition: width .15s ease; }
    .spacer { height: 4px; }
    @media (max-width: 640px) {
      .panel { top: 53px; right: 8px; width: calc(100vw - 16px); max-height: calc(100vh - 61px); }
      .fskatr-code-grid { grid-template-columns: 1fr; }
      .fskatr-code-card.mark { grid-column: auto; }
      .grid, .grid.three { grid-template-columns: 1fr; }
      .bottle-searchbar { grid-template-columns: 1fr; }
      .content { padding: 12px; }
      .nav-button { padding: 0 9px; font-size: 12px; }
    }
  `;


  const BOTTLE_SEARCH_PATH = '/app/egaisbottle/search';
  const BAR_BOTTLE_SEARCH_PATH = '/app/egaisbarbottle/search';
  const BOTTLE_EDIT_PATH = '/index#app/edit/egaisbottle/';
  const MOBILE_API_PREFIX = '/apis/dxbx/egais';
  const MOBILE_AUTH_PATH = '/apis/auth/authenticate';
  const MOBILE_USER_AGENT = 'DxBx.React (ios; 1.41.0) (iPhone 15 Pro)';
  const MOBILE_SESSION_TTL = 24 * 60 * 60 * 1000;
  const MOBILE_STATUS_TTL = 60 * 1000;
  const MOBILE_STATUS_CONCURRENCY = 4;
  const RESTS_MARK_WRAPPER_SELECTOR = '[data-full-mark], [class*="MarkItemWrapper"], [data-testid*="mark" i]';
  const BLANK_API_PREFIX = '/apis/dxbx/acc/blank';
  const MOBILE_STORAGE = {
    credentials: 'mobile.credentials',
    auth: 'mobile.auth',
    deviceId: 'mobile.deviceId',
  };

  const BOTTLE_COLUMNS = [
    'legalPerson', 'egaisActItem', 'shortMarkCode', 'restsItem', 'egaisNomenclatureInfo',
    'egaisVolume', 'egaisVolumeUpdateDate', 'active', 'availableVolume',
  ].map((data) => ({
    data,
    name: '',
    searchable: true,
    orderable: data !== 'availableVolume',
    search: { value: '', regex: false },
  }));

  const restsState = {
    mobileLogin: '',
    mobilePassword: '',
    mobileRemember: true,
    observer: null,
    surface: '',
    enhancementScheduled: false,
    bottleCache: new Map(),
    queue: [],
    activeSearches: 0,
    expandedItemsCache: new Map(),
    mobileStatusCache: new Map(),
    mobileStatusQueue: [],
    activeMobileStatusChecks: 0,
    currentBlank: null,
    currentBlankLegalPersonId: null,
  };

  const MOBILE_OPERATIONS = Object.freeze({
    barCheck: Object.freeze({ kind: 'bar', label: 'Проверить ТЗ', method: 'POST', path: '/bars/bottles/check', apiVersion: 'v4' }),
    barAdd: Object.freeze({ kind: 'bar', label: 'Добавить в ТЗ', method: 'POST', path: '/bars/bottles', apiVersion: 'v4', includeVolume: true }),
    barDelete: Object.freeze({ kind: 'bar', label: 'Удалить из ТЗ', method: 'DELETE', path: '/bars/bottles', apiVersion: 'v4' }),
    writeoffCheck: Object.freeze({ kind: 'writeoff', label: 'Проверить ПС', method: 'POST', path: '/volume-act/bottles/check', apiVersion: 'v4' }),
    writeoffAdd: Object.freeze({ kind: 'writeoff', label: 'Добавить в прочие списания', method: 'PUT', path: '/volume-act/bottles', apiVersion: 'v4', includeVolume: true }),
    writeoffDelete: Object.freeze({ kind: 'writeoff', label: 'Удалить из прочих списаний', method: 'DELETE', path: '/volume-act/bottles', apiVersion: 'v4' }),
  });

  const mobileAuthState = {
    auth: null,
    credentials: null,
    tokens: new Map(),
    deviceId: storageGet(MOBILE_STORAGE.deviceId, '') || createMobileDeviceId(),

    init() {
      this.credentials = storageGet(MOBILE_STORAGE.credentials, null);
      restsState.mobileLogin = this.credentials?.login || '';
      restsState.mobilePassword = this.credentials?.password || '';
      const saved = storageGet(MOBILE_STORAGE.auth, null);
      if (saved?.timestamp && Date.now() - saved.timestamp < MOBILE_SESSION_TTL) this.setAuth(saved, false);
      storageSet(MOBILE_STORAGE.deviceId, this.deviceId);
    },

    setAuth(data, persist) {
      this.auth = data;
      this.tokens.clear();
      for (const subject of data?.subjects || []) {
        if (subject?.role?.code === 'barman' && subject?.token && subject?.organization?.id) {
          this.tokens.set(String(subject.organization.id), subject.token);
        }
      }
      if (persist) storageSet(MOBILE_STORAGE.auth, { user: data.user, subjects: data.subjects, timestamp: Date.now() });
      restsState.mobileStatusCache.clear();
      queueMicrotask(() => refreshVisibleMobileStatuses());
    },

    tokenFor(legalPersonId) {
      return legalPersonId ? this.tokens.get(String(legalPersonId)) || '' : '';
    },

    clear() {
      this.auth = null;
      this.credentials = null;
      this.tokens.clear();
      restsState.mobileLogin = '';
      restsState.mobilePassword = '';
      storageSet(MOBILE_STORAGE.credentials, null);
      storageSet(MOBILE_STORAGE.auth, null);
      restsState.mobileStatusCache.clear();
      refreshAllMobileButtons();
    },
  };

  mobileAuthState.init();

  const restsRuntime = {
    init() {
      this.onRouteChange();
    },

    onRouteChange() {
      const surface = getEgaisSurface();
      if (surface === restsState.surface) {
        if (surface) scheduleEgaisEnhancement();
        return;
      }
      restsState.observer?.disconnect();
      restsState.observer = null;
      restsState.surface = surface;
      if (!surface) return;
      ensureRestsPageStyle();
      restsState.observer = new MutationObserver(() => scheduleEgaisEnhancement());
      restsState.observer.observe(document.body, { childList: true, characterData: true, subtree: true });
      scheduleEgaisEnhancement();
    },
  };

  registerModule({
    id: 'rests',
    label: 'Остатки',
    init: () => restsRuntime.init(),
    onRouteChange: () => restsRuntime.onRouteChange(),
    render: renderMobileAccount,
  });

  function getEgaisSurface() {
    const route = `${location.pathname}/${location.hash.replace(/^#/, '')}`.replace(/\/+/g, '/');
    if (/\/(?:fe\/)?egais\/rests(?:\/|$)/.test(route)) return 'rests';
    if (/\/app\/edit\/egaisbottle\/\d+(?:\/|$)/.test(route)) return 'bottle';
    if (/\/app\/edit\/invoice\/\d+(?:\/|$)/.test(route)) return 'invoice';
    if (/\/(?:fe\/)?egais\/documents-writeoff\/acts\/\d+(?:\/|$)/.test(route)) return 'act';
    return '';
  }

  function getRestsPageLegalPersonId() {
    const value = Number(localStorage.getItem('savedRestsLegalPersonId'));
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  function getWorkingLegalPersonId() {
    return getRestsPageLegalPersonId() || getSelectedLegalPerson()?.id || null;
  }

  async function renderMobileAccount() {
    await getProfile().catch(() => null);
    const legalPersonId = getWorkingLegalPersonId();
    const hasToken = Boolean(mobileAuthState.tokenFor(legalPersonId));
    const status = mobileAuthState.auth
      ? `${mobileAuthState.auth.user?.name || mobileAuthState.auth.user?.email || 'Аккаунт'} · ${hasToken ? 'доступ есть' : 'нет доступа к ЮЛ'}`
      : 'Не выполнен вход';
    return ui.section('Мобильный аккаунт', '', [
      h('div', { className: 'actions' }, [
        h('span', { className: 'badge', text: status }),
        ui.button(mobileAuthState.auth ? 'Обновить' : 'Войти', {
          variant: 'primary',
          onclick: async () => {
            try {
              if (mobileAuthState.credentials?.login && mobileAuthState.credentials?.password) {
                await reauthenticateMobileAccount();
                ui.notify('Токены обновлены.', 'success');
                ui.render();
              } else {
                await openMobileAuthModal();
                ui.render();
              }
            } catch (error) {
              ui.notify(error.message, 'error');
            }
          },
        }),
        mobileAuthState.auth ? ui.button('Выйти', {
          onclick: () => {
            if (!confirm('Удалить сохранённые данные мобильного аккаунта?')) return;
            mobileAuthState.clear();
            ui.render();
          },
        }) : null,
      ]),
    ]);
  }

  function openMobileAuthModal() {
    return new Promise((resolve, reject) => {
      let settled = false;
      const loginInput = h('input', {
        className: 'control', type: 'text', value: restsState.mobileLogin, autocomplete: 'username',
      });
      const passwordInput = h('input', {
        className: 'control', type: 'password', value: restsState.mobilePassword, autocomplete: 'current-password',
      });
      const rememberInput = h('input', { type: 'checkbox', checked: restsState.mobileRemember });
      const errorBox = h('div', { className: 'alert error', hidden: true });
      let modal;
      const submit = async () => {
        loginButton.disabled = true;
        errorBox.hidden = true;
        try {
          restsState.mobileLogin = loginInput.value.trim();
          restsState.mobilePassword = passwordInput.value;
          restsState.mobileRemember = rememberInput.checked;
          const data = await authenticateMobileAccount({
            login: restsState.mobileLogin,
            password: restsState.mobilePassword,
            remember: restsState.mobileRemember,
          });
          settled = true;
          modal.close();
          resolve(data);
        } catch (error) {
          errorBox.textContent = error.message;
          errorBox.hidden = false;
          loginButton.disabled = false;
        }
      };
      const loginButton = ui.button('Войти', { variant: 'primary', onclick: submit });
      passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') submit();
      });
      modal = ui.modal('Мобильный аккаунт', [
        h('div', { className: 'grid' }, [ui.field('Логин', loginInput), ui.field('Пароль', passwordInput)]),
        h('div', { className: 'spacer' }),
        h('label', { className: 'check' }, [rememberInput, 'Запомнить']),
        errorBox,
        h('div', { className: 'actions' }, loginButton),
      ], { onClose: () => { if (!settled) reject(new Error('Авторизация отменена.')); } });
      queueMicrotask(() => loginInput.focus());
    });
  }

  function createMobileDeviceId() {
    if (crypto?.randomUUID) return crypto.randomUUID().toUpperCase();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const value = Math.floor(Math.random() * 16);
      return (char === 'x' ? value : (value & 0x3) | 0x8).toString(16);
    }).toUpperCase();
  }

  async function authenticateMobileAccount({ login, password, remember }) {
    if (!login || !password) throw new Error('Введите логин и пароль.');
    const { data } = await mobileRequest(MOBILE_AUTH_PATH, { method: 'POST', body: { login, password } });
    if (!data?.user || !Array.isArray(data?.subjects)) throw new Error('Неожиданный ответ авторизации DXBX.');
    mobileAuthState.credentials = { login, password };
    storageSet(MOBILE_STORAGE.credentials, remember ? { login, password, timestamp: Date.now() } : null);
    if (!remember) storageSet(MOBILE_STORAGE.auth, null);
    mobileAuthState.setAuth(data, remember);
    return data;
  }

  function reauthenticateMobileAccount() {
    const credentials = mobileAuthState.credentials || {
      login: restsState.mobileLogin,
      password: restsState.mobilePassword,
    };
    return authenticateMobileAccount({
      login: credentials?.login,
      password: credentials?.password,
      remember: restsState.mobileRemember,
    });
  }

  async function ensureMobileToken(actionLabel, legalPersonId = getWorkingLegalPersonId()) {
    if (!legalPersonId) throw new Error('Не определён ID юридического лица.');
    let token = mobileAuthState.tokenFor(legalPersonId);
    if (token) return token;
    if (!mobileAuthState.auth) {
      if (mobileAuthState.credentials?.login && mobileAuthState.credentials?.password) await reauthenticateMobileAccount();
      else await openMobileAuthModal();
      token = mobileAuthState.tokenFor(legalPersonId);
      if (token) return token;
    }
    const userName = mobileAuthState.auth?.user?.name || mobileAuthState.auth?.user?.email || `#${mobileAuthState.auth?.user?.id || '—'}`;
    if (!confirm(`У ${userName} нет доступа к ЮЛ ${legalPersonId}. Добавить доступ для операции «${actionLabel}»?`)) {
      throw new Error('Операция отменена.');
    }
    await grantMobileAccess(legalPersonId);
    token = mobileAuthState.tokenFor(legalPersonId);
    if (!token) throw new Error(`Токен для ЮЛ ${legalPersonId} не получен.`);
    return token;
  }

  async function grantMobileAccess(legalPersonId) {
    const userId = mobileAuthState.auth?.user?.id;
    if (!userId) throw new Error('В мобильной сессии отсутствует ID пользователя.');
    if (!mobileAuthState.credentials?.login || !mobileAuthState.credentials?.password) {
      throw new Error('Для переавторизации нужны логин и пароль.');
    }
    const profileId = await findOrCreateAccessProfile(userId);
    await addLegalPersonToAccessProfile(profileId, legalPersonId);
    await reauthenticateMobileAccount();
  }

  async function findOrCreateAccessProfile(userId) {
    try {
      const { data: html } = await request(`/app/edit/user/${encodeURIComponent(userId)}`);
      if (typeof html === 'string') {
        const match = html.match(/(?:#|\/)app\/edit\/accessprofile\/(\d+)/i);
        if (match?.[1]) return match[1];
      }
    } catch {
      // Поиск ниже покрывает форму пользователя без прямой ссылки.
    }
    const columns = ['user', 'name'].map((data) => ({
      data, name: '', searchable: true, orderable: true, search: { value: '', regex: false },
    }));
    const { data: rawSearchData } = await request('/app/accessprofile/search', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: {
        draw: 1, start: 0, length: 50, columns, order: [{ column: 0, dir: 'asc' }],
        search: { value: '', regex: false }, model: 'accessprofile', searchFormName: 'accessprofile.default',
        simpleCrit: { crits: [{ attr: 'user', value: userId, oper: 'EQUALS', clauses: [] }] },
      },
    });
    const searchData = parseMaybeJson(rawSearchData);
    const existingId = searchData?.data?.[0]?.DT_RowId;
    if (existingId) return String(existingId);
    const createBody = new URLSearchParams({ 'user.id': String(userId), name: `Профиль ${userId}`, _method: 'POST' }).toString();
    const { data: rawCreated } = await request('/app/save/accessprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: createBody,
    });
    const created = parseMaybeJson(rawCreated);
    if (created?.success && created?.id) return String(created.id);
    throw new Error(created?.error || created?.message || 'Не удалось создать профиль доступа.');
  }

  async function addLegalPersonToAccessProfile(profileId, legalPersonId) {
    const { data: html } = await request(`/app/edit/accessprofile/${encodeURIComponent(profileId)}`);
    if (typeof html !== 'string') throw new Error('Монолит не вернул форму профиля доступа.');
    const documentNode = new DOMParser().parseFromString(html, 'text/html');
    const form = documentNode.querySelector('#entityForm');
    if (!form) throw new Error('Форма профиля доступа не найдена.');
    const existingIds = extractAccessLegalPersonIds(documentNode, html);
    if (existingIds.has(String(legalPersonId))) return;
    const body = new URLSearchParams();
    body.append('id', String(profileId));
    body.append('_method', 'PUT');
    for (const control of form.querySelectorAll('input, select, textarea')) {
      if (!control.name || control.disabled || control.name === 'id' || control.name === '_method') continue;
      if (control.name.includes('accessprofile.accessLegalPersons.id')) continue;
      if ((control.type === 'checkbox' || control.type === 'radio') && !control.checked) continue;
      if (control.tagName === 'SELECT' && control.multiple) {
        for (const option of control.selectedOptions) body.append(control.name, option.value);
      } else body.append(control.name, control.value);
    }
    for (const id of [...existingIds, String(legalPersonId)]) body.append('accessprofile.accessLegalPersons.id[]', id);
    const { data: rawData } = await request('/app/save/accessprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: body.toString(),
    });
    const data = parseMaybeJson(rawData);
    if (data && typeof data === 'object' && data.success === false) {
      throw new Error(data.error || data.message || 'Монолит отклонил изменение профиля доступа.');
    }
  }

  function parseMaybeJson(value) {
    if (typeof value !== 'string') return value;
    try { return JSON.parse(value); } catch { return value; }
  }

  function extractAccessLegalPersonIds(documentNode, html) {
    const ids = new Set();
    for (const pattern of [
      /textIdPairs\[[^\]]+\]\s*=\s*['"`]?([0-9]+)['"`]?/g,
      /textIdPairs\[text\]\s*=\s*['"`]?([0-9]+)['"`]?/g,
    ]) {
      let match;
      while ((match = pattern.exec(html))) ids.add(match[1]);
    }
    for (const input of documentNode.querySelectorAll('input[name*="accessprofile.accessLegalPersons.id"]')) {
      if (input.value) ids.add(input.value);
    }
    return ids;
  }

  async function mobileRequest(path, options = {}) {
    if (typeof GM_xmlhttpRequest !== 'function') throw new Error('Мобильные операции требуют Tampermonkey.');
    const url = new URL(path, location.origin);
    if (url.origin !== location.origin) throw new Error('Запрос вне DXBX запрещён.');
    const headers = {
      'User-Agent': MOBILE_USER_AGENT,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ApiVersion: options.apiVersion || 'v4',
      'Device-Id': mobileAuthState.deviceId,
      ...(options.headers || {}),
    };
    const requestBody = options.body === undefined ? undefined : JSON.stringify(options.body);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url: url.href,
        headers,
        data: requestBody,
        timeout: 20000,
        onload: (response) => {
          const text = response.responseText?.trim() || '';
          let data = text;
          if (text) {
            try { data = JSON.parse(text); } catch { data = text; }
          }
          if (response.status < 200 || response.status >= 300) {
            const error = new Error(extractErrorMessage(data, response.status));
            error.status = response.status;
            reject(error);
            return;
          }
          resolve({ data, status: response.status });
        },
        onerror: () => reject(new Error('Сетевая ошибка мобильного API.')),
        ontimeout: () => reject(new Error('Таймаут мобильного API.')),
      });
    });
  }

  function bottleCriterion(legalPersonId, attr, value) {
    return {
      attr: 'legalPerson',
      value: String(legalPersonId),
      oper: 'EQUALS',
      clauses: [{
        oper: 'AND',
        criterion: {
          attr,
          value,
          oper: attr === 'egaisNomenclatureInfo.name' ? 'LIKE' : 'EQUALS',
          clauses: [],
        },
      }],
    };
  }

  async function searchMonolithBottles({ legalPersonId, attr, value, start = 0, length = 100 }) {
    const { data } = await request(BOTTLE_SEARCH_PATH, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: {
        draw: 1,
        columns: BOTTLE_COLUMNS,
        order: [{ column: 0, dir: 'asc' }],
        start,
        length,
        search: { value: '', regex: false },
        model: 'egaisbottle',
        searchFormName: 'egaisbottle.default',
        simpleCrit: { crits: [bottleCriterion(legalPersonId, attr, value)] },
      },
    });
    if (!data || typeof data !== 'object' || !Array.isArray(data.data)) throw new Error('Неожиданный ответ монолита.');
    return {
      items: data.data,
      total: Number(data.recordsFiltered ?? data.recordsTotal ?? data.data.length),
    };
  }

  async function searchMonolithBarBottle(legalPersonId, mark) {
    const column = (data, orderable = false) => ({
      data, name: '', searchable: true, orderable, search: { value: '', regex: false },
    });
    const { data } = await request(BAR_BOTTLE_SEARCH_PATH, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: {
        draw: 1,
        start: 0,
        length: 1,
        model: 'egaisbarbottle',
        searchFormName: 'egaisbarbottle.default',
        columns: [
          column('createDate', true), column('egaisBottle', true), column('availableVolume'),
          column('bottleCapacity'), column('egaisNomenclatureInfo'), column('markInfo'),
        ],
        order: [{ column: 0, dir: 'asc' }],
        search: { value: '', regex: false },
        simpleCrit: {
          crits: [{
            attr: 'legalPerson', value: String(legalPersonId), oper: 'EQUALS',
            clauses: [{
              oper: 'AND',
              criterion: { attr: 'egaisBottle.markInfo', value: String(mark), oper: 'EQUALS', clauses: [] },
            }],
          }],
        },
      },
    });
    return Array.isArray(data?.data) && data.data.length > 0;
  }

  function bottleAlcoCode(bottle) {
    const value = bottle?.restsItem;
    if (value && typeof value === 'object') {
      return String(value.alcCode || value.alcoCode || value.alkoCode || '').trim();
    }
    return String(value || '').match(/(?:Алк\.?\s*код|alcCode)\s*:?\s*(\d+)/i)?.[1] || '';
  }

  function bottleIsActive(value) {
    if (value === undefined || value === null || value === '') return true;
    if (typeof value === 'boolean') return value;
    return !/^(?:нет|false|0|inactive)$/i.test(String(value).trim());
  }

  function normalizeBottleResult(bottle) {
    return {
      id: String(bottle?.DT_RowId ?? bottle?.id ?? ''),
      name: bottleNomenclatureName(bottle) || '—',
      alcoCode: bottleAlcoCode(bottle),
      shortCode: String(bottle?.shortMarkCode || bottle?.title || '').trim(),
      mark: String(bottle?.markInfo || '').trim(),
      availableVolume: bottle?.availableVolume ?? '',
      egaisVolume: bottle?.egaisVolume ?? '',
      updateDate: String(bottle?.egaisVolumeUpdateDate || '').trim(),
      formB: '',
      active: bottleIsActive(bottle?.active),
      detailState: bottle?.markInfo ? 'ready' : 'idle',
      raw: bottle,
    };
  }

  function parseBottleEditDetails(html) {
    const documentNode = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const value = (selector) => documentNode.querySelector(selector)?.value?.trim() || '';
    const restsLabel = documentNode.querySelector('#id_restsItem')?.parentElement?.textContent || '';
    return {
      availableVolume: value('input[name="availableVolume"]'),
      mark: value('input[name="markInfo"], textarea[name="markInfo"]'),
      egaisVolume: value('#id_egaisVolume'),
      updateDate: value('#id_egaisVolumeUpdateDate'),
      formB: restsLabel.match(/спр\.?\s*2\s*:\s*(FB-[\w-]+)/i)?.[1] || '',
    };
  }

  async function hydrateBottleResult(item) {
    if (!item?.id || item.detailState === 'ready') return item;
    if (item.detailPromise) return item.detailPromise;
    item.detailState = 'loading';
    item.detailPromise = request(`/app/edit/egaisbottle/${encodeURIComponent(item.id)}`)
      .then(({ data }) => {
        const detail = parseBottleEditDetails(data);
        Object.assign(item, {
          availableVolume: detail.availableVolume || item.availableVolume,
          mark: detail.mark || item.mark,
          egaisVolume: detail.egaisVolume || item.egaisVolume,
          updateDate: detail.updateDate || item.updateDate,
          formB: detail.formB || item.formB,
          detailState: 'ready',
        });
        return item;
      })
      .catch((error) => {
        item.detailState = 'error';
        item.detailError = error.message;
        return item;
      })
      .finally(() => { delete item.detailPromise; });
    return item.detailPromise;
  }

  function bottleWorkspaceStatus(item, legalPersonId, kind) {
    if (!item?.mark) return null;
    return restsState.mobileStatusCache.get(mobileStatusKey(kind, legalPersonId, item.mark)) || null;
  }

  function bottleWorkspaceRows(items, state) {
    const query = state.tableQuery.toLocaleLowerCase('ru');
    const filtered = items.filter((item) => {
      if (state.activeOnly && !item.active) return false;
      const tz = bottleWorkspaceStatus(item, state.legalPersonId, 'bar');
      if (state.tzFilter === 'yes' && tz?.present !== true) return false;
      if (state.tzFilter === 'no' && tz?.present !== false) return false;
      if (!query) return true;
      return [item.name, item.alcoCode, item.shortCode, item.mark, item.formB]
        .some((value) => String(value || '').toLocaleLowerCase('ru').includes(query));
    });
    const direction = state.sortDirection === 'desc' ? -1 : 1;
    const valueFor = (item) => {
      if (state.sortField === 'volume') return Number(item.availableVolume || 0);
      if (state.sortField === 'date') return parseDxbxDate(item.updateDate)?.getTime() || 0;
      if (state.sortField === 'tz') return bottleWorkspaceStatus(item, state.legalPersonId, 'bar')?.present === true ? 1 : 0;
      return String(item[state.sortField] || '').toLocaleLowerCase('ru');
    };
    return filtered.sort((left, right) => {
      const a = valueFor(left);
      const b = valueFor(right);
      return (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'ru')) * direction;
    });
  }

  function xlsxXml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function xlsxInlineCell(reference, value, style = 0) {
    return `<c r="${reference}" t="inlineStr"${style ? ` s="${style}"` : ''}><is><t xml:space="preserve">${xlsxXml(value)}</t></is></c>`;
  }

  async function exportBottleWorkspaceXlsx(items, legalPersonId, button) {
    if (!items.length) return;
    const original = button.textContent;
    button.disabled = true;
    try {
      const rows = [];
      const images = [];
      for (let index = 0; index < items.length; index += 1) {
        button.textContent = `${index + 1}/${items.length}`;
        const item = items[index];
        await hydrateBottleResult(item);
        if (item.mark) await syncMobileMarkStatus('bar', item.mark, legalPersonId).catch(() => null);
        const tz = bottleWorkspaceStatus(item, legalPersonId, 'bar');
        rows.push({
          ...item,
          tzText: tz?.present === true ? 'В ТЗ' : tz?.present === false ? 'Не в ТЗ' : 'Не проверено',
        });
        if (item.mark) {
          const canvas = h('canvas', { width: 240, height: 240 });
          drawDataMatrix(canvas, item.mark);
          images.push({ row: index + 1, data: new Uint8Array(await (await canvasToBlob(canvas, 'image/png')).arrayBuffer()) });
        }
        if (index % 8 === 7) await sleep(0);
      }

      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      const headers = ['Номенклатура', 'Алкокод', 'Короткий код', 'Остаток, мл', 'ЕГАИС, мл', 'Статус ТЗ', 'Справка Б', 'DataMatrix', 'Полная марка', 'Обновлено'];
      const sheetRows = [
        `<row r="1" ht="24" customHeight="1">${headers.map((value, index) => xlsxInlineCell(`${letters[index]}1`, value, 1)).join('')}</row>`,
      ];
      rows.forEach((item, index) => {
        const rowNumber = index + 2;
        const statusStyle = item.tzText === 'В ТЗ' ? 2 : item.tzText === 'Не в ТЗ' ? 3 : 4;
        const values = [
          item.name, item.alcoCode, item.shortCode || extractShortCode(item.mark), item.availableVolume,
          item.egaisVolume, item.tzText, item.formB, '', item.mark, item.updateDate,
        ];
        sheetRows.push(`<row r="${rowNumber}" ht="94" customHeight="1">${values.map((value, cellIndex) =>
          xlsxInlineCell(`${letters[cellIndex]}${rowNumber}`, value, cellIndex === 5 ? statusStyle : 0)).join('')}</row>`);
      });

      const drawingAnchors = images.map((entry, index) => `<xdr:oneCellAnchor>
        <xdr:from><xdr:col>7</xdr:col><xdr:colOff>76200</xdr:colOff><xdr:row>${entry.row}</xdr:row><xdr:rowOff>76200</xdr:rowOff></xdr:from>
        <xdr:ext cx="1066800" cy="1066800"/>
        <xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${index + 2}" name="DataMatrix ${index + 1}"/><xdr:cNvPicPr/></xdr:nvPicPr>
        <xdr:blipFill><a:blip r:embed="rId${index + 1}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>
        <xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1066800" cy="1066800"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic>
        <xdr:clientData/></xdr:oneCellAnchor>`).join('');
      const drawingRels = images.map((_, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${index + 1}.png"/>`).join('');
      const statusCount = (present) => rows.filter((item) => item.tzText === present).length;
      const stats = [
        ['Дата экспорта', new Date().toLocaleString('ru-RU')],
        ['Всего бутылок', rows.length],
        ['В ТЗ', statusCount('В ТЗ')],
        ['Не в ТЗ', statusCount('Не в ТЗ')],
      ];
      const statsRows = [
        `<row r="1">${xlsxInlineCell('A1', 'Параметр', 1)}${xlsxInlineCell('B1', 'Значение', 1)}</row>`,
        ...stats.map(([name, value], index) => `<row r="${index + 2}">${xlsxInlineCell(`A${index + 2}`, name)}${xlsxInlineCell(`B${index + 2}`, value)}</row>`),
      ];
      const encoder = new TextEncoder();
      const xml = (value) => encoder.encode(value);
      const entries = [
        { name: '[Content_Types].xml', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${images.length ? '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>' : ''}</Types>`) },
        { name: '_rels/.rels', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`) },
        { name: 'xl/workbook.xml', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Бутылки" sheetId="1" r:id="rId1"/><sheet name="Статистика" sheetId="2" r:id="rId2"/></sheets></workbook>`) },
        { name: 'xl/_rels/workbook.xml.rels', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`) },
        { name: 'xl/styles.xml', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Arial"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1677FF"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF7DF"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFE7E5"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="0" xfId="0" applyFill="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1"/><xf numFmtId="0" fontId="0" fillId="1" borderId="0" xfId="0"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`) },
        { name: 'xl/worksheets/sheet1.xml', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="36" customWidth="1"/><col min="2" max="3" width="22" customWidth="1"/><col min="4" max="7" width="16" customWidth="1"/><col min="8" max="8" width="18" customWidth="1"/><col min="9" max="9" width="55" customWidth="1"/><col min="10" max="10" width="22" customWidth="1"/></cols><sheetData>${sheetRows.join('')}</sheetData>${images.length ? '<drawing r:id="rId1"/>' : ''}</worksheet>`) },
        { name: 'xl/worksheets/sheet2.xml', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="2" width="22" customWidth="1"/></cols><sheetData>${statsRows.join('')}</sheetData></worksheet>`) },
      ];
      if (images.length) {
        entries.push(
          { name: 'xl/worksheets/_rels/sheet1.xml.rels', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/></Relationships>`) },
          { name: 'xl/drawings/drawing1.xml', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${drawingAnchors}</xdr:wsDr>`) },
          { name: 'xl/drawings/_rels/drawing1.xml.rels', data: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${drawingRels}</Relationships>`) },
          ...images.map((image, index) => ({ name: `xl/media/image${index + 1}.png`, data: image.data })),
        );
      }
      const blob = new Blob([buildStoreZip(entries)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      downloadBlob(blob, `egais_bottles_${legalPersonId}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      ui.notify('XLSX готов.', 'success');
    } catch (error) {
      ui.notify(`Не удалось собрать XLSX: ${error.message}`, 'error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  async function runBottleWorkspaceToggle(kind, item, state, button) {
    if (!item.mark) await hydrateBottleResult(item);
    if (!item.mark) throw new Error('Полная марка не найдена.');
    const token = await ensureMobileToken(kind === 'bar' ? 'ТЗ' : 'Прочие списания', state.legalPersonId);
    const current = await syncMobileMarkStatus(kind, item.mark, state.legalPersonId, { token, force: true });
    const operation = kind === 'bar'
      ? (current.present ? MOBILE_OPERATIONS.barDelete : MOBILE_OPERATIONS.barAdd)
      : (current.present ? MOBILE_OPERATIONS.writeoffDelete : MOBILE_OPERATIONS.writeoffAdd);
    button.disabled = true;
    try {
      await executeMobileOperation(operation, {
        mark: item.mark, volume: item.availableVolume, legalPersonId: state.legalPersonId, token,
      });
      restsState.mobileStatusCache.delete(mobileStatusKey(kind, state.legalPersonId, item.mark));
      await syncMobileMarkStatus(kind, item.mark, state.legalPersonId, { token, force: true });
      state.render();
    } finally {
      button.disabled = false;
    }
  }

  async function runBottleWorkspaceBulk(kind, desiredPresent, state) {
    const items = [...state.selected.values()];
    if (!items.length) return;
    const label = kind === 'blank' ? 'добавить в бланк' : desiredPresent ? 'добавить в ТЗ' : 'удалить из ТЗ';
    if (!confirm(`${label[0].toUpperCase()}${label.slice(1)}: ${items.length} шт.?`)) return;
    state.bulkBusy = true;
    state.bulkDone = 0;
    state.render();
    let failed = 0;
    try {
      const token = kind === 'blank' ? '' : await ensureMobileToken('ТЗ', state.legalPersonId);
      let blank = null;
      if (kind === 'blank') {
        blank = await getOpenBlank(state.legalPersonId);
        if (!blank?.id) throw new Error('Нет открытого бланка.');
      }
      for (const item of items) {
        try {
          await hydrateBottleResult(item);
          if (!item.mark) throw new Error('Марка не найдена.');
          if (kind === 'blank') {
            if (blankMarkState(blank.id, item.mark) !== true) {
              await changeBlankMark(blank.id, item.mark, 'POST', state.legalPersonId);
              setBlankMark(blank.id, item.mark, true);
            }
          } else {
            const current = await syncMobileMarkStatus('bar', item.mark, state.legalPersonId, { token, force: true });
            if (current.present !== desiredPresent) {
              await executeMobileOperation(desiredPresent ? MOBILE_OPERATIONS.barAdd : MOBILE_OPERATIONS.barDelete, {
                mark: item.mark, volume: item.availableVolume, legalPersonId: state.legalPersonId, token,
              });
              restsState.mobileStatusCache.delete(mobileStatusKey('bar', state.legalPersonId, item.mark));
              await syncMobileMarkStatus('bar', item.mark, state.legalPersonId, { token, force: true });
            }
          }
        } catch {
          failed += 1;
        }
        state.bulkDone += 1;
        state.render();
      }
      ui.notify(failed ? `Готово, ошибок: ${failed}.` : 'Готово.', failed ? 'error' : 'success');
    } catch (error) {
      ui.notify(error.message, 'error');
    } finally {
      state.bulkBusy = false;
      state.render();
    }
  }

  function openBottleSearchModal({ legalPersonId = getWorkingLegalPersonId(), alcoCode = '', nomenclature = '' } = {}) {
    if (!legalPersonId) {
      ui.notify('Не определён ID юридического лица.', 'error');
      return;
    }
    const typeSelect = h('select', { className: 'control' }, [
      h('option', { value: 'egaisNomenclatureInfo.name', text: 'Номенклатура', selected: !alcoCode }),
      h('option', { value: 'restsItem.alcCode', text: 'Алкокод', selected: Boolean(alcoCode) }),
    ]);
    const queryInput = h('input', {
      className: 'control grow', type: 'search', value: alcoCode || nomenclature,
      autocomplete: 'off', placeholder: 'Номенклатура или алкокод',
    });
    const results = h('div');
    const searchButton = ui.button('Найти', { variant: 'primary' });
    const pageSize = 100;
    const state = {
      legalPersonId,
      page: 0,
      pageSize,
      total: 0,
      items: [],
      selected: new Map(),
      tableQuery: '',
      activeOnly: true,
      tzFilter: 'all',
      sortField: 'name',
      sortDirection: 'asc',
      bulkBusy: false,
      bulkDone: 0,
      render: () => {},
      onPage: () => {},
    };
    state.render = () => results.replaceChildren(renderBottleResults(state));

    const hydratePage = async (items) => {
      const token = mobileAuthState.tokenFor(legalPersonId);
      for (let offset = 0; offset < items.length; offset += 4) {
        const batch = items.slice(offset, offset + 4);
        await Promise.all(batch.map(async (item) => {
          await hydrateBottleResult(item);
          if (!item.mark) return;
          await syncMobileMarkStatus('bar', item.mark, legalPersonId, { token }).catch(() => null);
          if (token) await syncMobileMarkStatus('writeoff', item.mark, legalPersonId, { token }).catch(() => null);
        }));
        if (state.items === items) state.render();
      }
    };
    const runSearch = async (nextPage = 0) => {
      const value = queryInput.value.trim();
      if (!value) return;
      state.page = Math.max(0, nextPage);
      searchButton.disabled = true;
      results.replaceChildren(ui.loading('Поиск…'));
      try {
        const found = await searchMonolithBottles({
          legalPersonId,
          attr: typeSelect.value,
          value,
          start: state.page * pageSize,
          length: pageSize,
        });
        state.items = found.items.map(normalizeBottleResult);
        state.total = found.total;
        state.render();
        void hydratePage(state.items);
      } catch (error) {
        results.replaceChildren(h('div', { className: 'alert error', text: error.message }));
      } finally {
        searchButton.disabled = false;
      }
    };
    searchButton.addEventListener('click', () => void runSearch(0));
    queryInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      void runSearch(0);
    });
    state.onPage = (value) => void runSearch(value);
    const modal = ui.modal('Поиск бутылок ЕГАИС', [
      h('div', { className: 'bottle-searchbar' }, [typeSelect, queryInput, searchButton]),
      results,
    ], { workspace: true });
    queueMicrotask(() => {
      queryInput.focus();
      if (queryInput.value) void runSearch(0);
    });
    return modal;
  }

  function renderBottleResults(state) {
    if (!state.items.length) return h('div', { className: 'workspace-empty', text: 'Ничего не найдено' });
    const visible = bottleWorkspaceRows(state.items, state);
    const tableSearch = h('input', {
      className: 'control grow', type: 'search', value: state.tableQuery,
      placeholder: 'Фильтр: марка, код, справка Б…', dataset: { role: 'bottle-filter' },
      oninput: (event) => {
        state.tableQuery = event.target.value;
        const cursor = event.target.selectionStart;
        state.render();
        queueMicrotask(() => {
          const next = resultsFromState(state)?.querySelector('[data-role="bottle-filter"]');
          next?.focus();
          next?.setSelectionRange?.(cursor, cursor);
        });
      },
    });
    const activeOnly = h('input', {
      type: 'checkbox', checked: state.activeOnly,
      onchange: (event) => { state.activeOnly = event.target.checked; state.render(); },
    });
    const tzFilter = h('select', {
      className: 'control', value: state.tzFilter,
      onchange: (event) => { state.tzFilter = event.target.value; state.render(); },
    }, [
      h('option', { value: 'all', text: 'Любой ТЗ' }),
      h('option', { value: 'yes', text: 'В ТЗ' }),
      h('option', { value: 'no', text: 'Не в ТЗ' }),
    ]);
    const selectedCount = state.selected.size;
    const bulkDisabled = state.bulkBusy || !selectedCount;
    const counts = {
      active: state.items.filter((item) => item.active).length,
      inTz: state.items.filter((item) => item.active && bottleWorkspaceStatus(item, state.legalPersonId, 'bar')?.present === true).length,
      outsideTz: state.items.filter((item) => item.active && bottleWorkspaceStatus(item, state.legalPersonId, 'bar')?.present === false).length,
    };
    const stats = h('div', { className: 'bottle-stats' }, [
      h('span', { className: 'bottle-stat', text: `Найдено ${state.total}` }),
      h('span', { className: 'bottle-stat active', text: `Активных ${counts.active}` }),
      h('span', { className: 'bottle-stat present', text: `В ТЗ ${counts.inTz}` }),
      h('span', { className: 'bottle-stat absent', text: `Не в ТЗ ${counts.outsideTz}` }),
    ]);
    const controls = h('div', { className: 'bottle-filterbar', dataset: { role: 'bottle-controls' } }, [
      tableSearch,
      h('label', { className: 'check' }, [activeOnly, 'Только активные']),
      tzFilter,
      h('span', { className: 'workspace-count', text: `Показано ${visible.length}` }),
    ]);
    const bulkAction = (label, kind, onclick, disabled = bulkDisabled) => {
      const button = ui.button(label, { small: true, disabled, onclick });
      button.dataset.kind = kind;
      return button;
    };
    let xlsxAllButton;
    xlsxAllButton = bulkAction('XLSX все', 'xlsx', () => void exportBottleWorkspaceXlsx(visible, state.legalPersonId, xlsxAllButton), !visible.length || state.bulkBusy);
    let xlsxSelectedButton;
    xlsxSelectedButton = bulkAction('XLSX выбранные', 'xlsx-selected', () => void exportBottleWorkspaceXlsx([...state.selected.values()], state.legalPersonId, xlsxSelectedButton));
    const bulkBar = h('div', { className: 'bottle-bulkbar' }, [
      h('strong', { text: selectedCount ? `Выбрано: ${selectedCount}` : 'Выберите бутылки' }),
      bulkAction('Добавить в ТЗ', 'bar-add', () => void runBottleWorkspaceBulk('bar', true, state)),
      bulkAction('Удалить из ТЗ', 'bar-remove', () => void runBottleWorkspaceBulk('bar', false, state)),
      bulkAction('Добавить в БЛ', 'blank', () => void runBottleWorkspaceBulk('blank', true, state)),
      h('span', { className: 'bottle-bulk-spacer' }),
      xlsxAllButton,
      xlsxSelectedButton,
    ]);
    const sortHeader = (label, field, className) => h('th', {
      className,
      dataset: { sort: field },
      text: `${label}${state.sortField === field ? (state.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}`,
      onclick: () => {
        if (state.sortField === field) state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        else { state.sortField = field; state.sortDirection = 'asc'; }
        state.render();
      },
    });
    const body = h('tbody');
    for (const item of visible) {
      const selected = state.selected.has(item.id);
      const tz = bottleWorkspaceStatus(item, state.legalPersonId, 'bar');
      const writeoff = bottleWorkspaceStatus(item, state.legalPersonId, 'writeoff');
      const checkbox = h('input', {
        type: 'checkbox', checked: selected,
        onchange: (event) => {
          if (event.target.checked) state.selected.set(item.id, item);
          else state.selected.delete(item.id);
          state.render();
        },
      });
      const action = (label, onclick, options = {}) => {
        const button = ui.button(label, {
          small: true, disabled: options.disabled || item.detailState === 'loading', onclick,
        });
        if (options.kind) button.dataset.kind = options.kind;
        return button;
      };
      const tzButton = action(tz?.state === 'loading' ? '…ТЗ' : tz?.present ? '-ТЗ' : '+ТЗ', async () => {
        try { await runBottleWorkspaceToggle('bar', item, state, tzButton); } catch (error) { ui.notify(error.message, 'error'); }
      }, { kind: 'bar' });
      tzButton.dataset.kind = 'bar';
      configureMarkButton(tzButton, item.mark, state.legalPersonId);
      if (tz?.present) tzButton.classList.add('active');
      const writeoffButton = action(writeoff?.state === 'loading' ? '…ПС' : writeoff?.present ? '-ПС' : 'ПС', async () => {
        try { await runBottleWorkspaceToggle('writeoff', item, state, writeoffButton); } catch (error) { ui.notify(error.message, 'error'); }
      }, { kind: 'writeoff' });
      writeoffButton.dataset.kind = 'writeoff';
      configureMarkButton(writeoffButton, item.mark, state.legalPersonId);
      if (writeoff?.present) writeoffButton.classList.add('active');
      const blankButton = action('БЛ', () => void toggleBlankMark(item.mark, blankButton, state.legalPersonId), { disabled: !item.mark, kind: 'blank' });
      blankButton.dataset.kind = 'blank';
      configureMarkButton(blankButton, item.mark, state.legalPersonId);
      updateBlankButtonState(blankButton, item.mark);
      let invoiceButton;
      invoiceButton = action('Накладная', () => void openInvoiceByRestsMark(item.mark, invoiceButton, state.legalPersonId), { disabled: !item.mark, kind: 'invoice' });
      const actions = h('div', { className: 'workspace-actions' }, [
        item.id ? h('a', {
          className: 'button secondary', href: `${location.origin}${BOTTLE_EDIT_PATH}${item.id}`,
          target: '_blank', rel: 'noopener noreferrer', text: 'Бутылка ↗', dataset: { kind: 'bottle' },
        }) : null,
        action('DataMatrix', () => showDataMatrixPreview(item.mark), { disabled: !item.mark, kind: 'datamatrix' }),
        invoiceButton,
        tzButton,
        writeoffButton,
        blankButton,
      ]);
      body.append(h('tr', { dataset: { active: String(item.active) } }, [
        h('td', { className: 'col-check' }, checkbox),
        h('td', { className: 'col-name' }, [
          h('div', { className: 'workspace-name', text: item.name }),
          h('div', { className: 'workspace-meta', text: `${item.alcoCode || 'без алкокода'}${item.active ? '' : ' · неактивна'}` }),
        ]),
        h('td', { className: 'col-mark' }, [
          h('div', { className: 'mono', text: item.shortCode || extractShortCode(item.mark) || '—' }),
          h('div', {
            className: 'workspace-mark workspace-meta mono',
            text: item.detailState === 'loading' ? 'загрузка…' : item.mark || (item.detailState === 'error' ? 'ошибка' : '—'),
            title: item.mark || item.detailError || '',
            onclick: () => { if (item.mark) void copyText(item.mark); },
          }),
        ]),
        h('td', { className: 'col-volume' }, [
          h('div', { text: item.availableVolume === '' ? '—' : `${item.availableVolume} мл` }),
          h('div', { className: 'workspace-meta', text: `ЕГАИС ${item.egaisVolume === '' ? '—' : `${item.egaisVolume} мл`}` }),
          item.updateDate ? h('div', { className: 'workspace-meta', text: item.updateDate }) : null,
        ]),
        h('td', { className: 'col-status' }, createTzStatusBadge(item.mark, state.legalPersonId, false)),
        h('td', { className: 'col-formb' }, h('div', { className: 'mono', text: item.formB || '—', title: item.formB || '' })),
        h('td', { className: 'col-actions' }, actions),
      ]));
    }
    const from = state.page * state.pageSize + 1;
    const to = Math.min(state.total, from + state.items.length - 1);
    const loadingCount = state.items.filter((item) => item.detailState === 'loading' || item.detailState === 'idle').length;
    const progress = state.bulkBusy || loadingCount ? h('div', {
      className: 'workspace-progress',
      title: state.bulkBusy ? `${state.bulkDone}/${state.selected.size}` : `Загрузка: ${state.items.length - loadingCount}/${state.items.length}`,
    }) : null;
    if (progress) {
      const fill = h('span');
      const percent = state.bulkBusy
        ? (state.selected.size ? state.bulkDone / state.selected.size : 0)
        : (state.items.length ? (state.items.length - loadingCount) / state.items.length : 0);
      fill.style.width = `${percent * 100}%`;
      progress.append(fill);
    }
    const pager = state.total > state.pageSize ? h('div', { className: 'workspace-bar' }, [
      ui.button('←', { small: true, disabled: state.page === 0, onclick: () => state.onPage(state.page - 1) }),
      h('span', { className: 'muted', text: `${from}–${to} из ${state.total}` }),
      ui.button('→', { small: true, disabled: to >= state.total, onclick: () => state.onPage(state.page + 1) }),
    ]) : null;
    return h('div', {}, [
      stats,
      controls,
      bulkBar,
      progress,
      h('div', { className: 'table-wrap workspace-table' }, h('table', {}, [
        h('thead', {}, h('tr', {}, [
          h('th', { className: 'col-check' }, h('input', {
            type: 'checkbox', checked: Boolean(visible.length && visible.every((item) => state.selected.has(item.id))),
            onchange: (event) => {
              for (const item of visible) {
                if (event.target.checked) state.selected.set(item.id, item);
                else state.selected.delete(item.id);
              }
              state.render();
            },
          })),
          sortHeader('Номенклатура', 'name', 'col-name'),
          sortHeader('Марка', 'shortCode', 'col-mark'),
          sortHeader('Остаток', 'volume', 'col-volume'),
          sortHeader('Статус ТЗ', 'tz', 'col-status'),
          h('th', { className: 'col-formb', text: 'Справка Б' }),
          h('th', { className: 'col-actions', text: 'Действия' }),
        ])),
        body,
      ])),
      pager,
    ]);
  }

  function resultsFromState(state) {
    return ui.shadow?.querySelector('[data-role="bottle-controls"]')?.parentElement || null;
  }

  function bottleNomenclatureName(bottle) {
    const value = bottle?.egaisNomenclatureInfo;
    if (typeof value === 'string') {
      const node = document.createElement('div');
      node.innerHTML = value;
      return node.textContent?.trim() || value;
    }
    return value?.name || value?.fullName || '';
  }

  function formatBottleVolume(bottle) {
    if (bottle?.availableVolume !== null && bottle?.availableVolume !== undefined && bottle.availableVolume !== '') {
      return `${bottle.availableVolume} мл`;
    }
    if (bottle?.egaisVolume !== null && bottle?.egaisVolume !== undefined && bottle.egaisVolume !== '') {
      return `${bottle.egaisVolume} мл`;
    }
    return '—';
  }

  function scheduleEgaisEnhancement() {
    if (!restsState.surface || restsState.enhancementScheduled) return;
    restsState.enhancementScheduled = true;
    requestAnimationFrame(() => {
      restsState.enhancementScheduled = false;
      if (restsState.surface === 'rests') enhanceRestsPage();
      else if (restsState.surface === 'bottle') enhanceBottlePage();
      else if (restsState.surface === 'invoice') enhanceInvoicePage();
      else if (restsState.surface === 'act') enhanceActPage();
    });
  }

  function enhanceRestsPage() {
    const legalPersonId = getWorkingLegalPersonId();
    if (!legalPersonId) return;
    installMappingsSegment(legalPersonId);
    installRestsToolbar(legalPersonId);
    enhanceStrongNomenclatureRows(legalPersonId);
    for (const row of collectStrongRestsRows()) {
      const context = readStrongRestsRow(row);
      if (context) {
        context.alcoCode = getStrongRestsAlcoCode(row);
        enhanceStrongRestsRow(row, legalPersonId, context);
      } else {
        void hydrateStrongRestsRow(row, legalPersonId);
      }
    }
  }

  function installRestsToolbar(legalPersonId) {
    const existing = document.querySelector('.dxbx-support-rests-toolbar');
    if (existing?.dataset.legalPersonId === String(legalPersonId)) return;
    existing?.remove();
    const anchor = document.querySelector('[data-testid="strong-table"], [data-testid="beer-table"]');
    const form = anchor?.closest('form') || document.querySelector('form.ant-form');
    if (!anchor && !form) return;
    const toolbar = h('div', { className: 'dxbx-support-rests-toolbar', dataset: { legalPersonId } }, [
      h('button', {
        className: 'dxbx-support-rests-button', type: 'button', text: 'Поиск бутылок', dataset: { kind: 'search' },
        onclick: () => openBottleSearchModal({ legalPersonId }),
      }),
      h('button', {
        className: 'dxbx-support-rests-button', type: 'button', text: 'Бланк', dataset: { kind: 'blank' },
        onclick: () => void openBlankModal(legalPersonId),
      }),
      h('button', {
        className: 'dxbx-support-rests-button', type: 'button', text: 'Заказы', dataset: { kind: 'orders' },
        onclick: () => void openEgaisOrdersModal(legalPersonId),
      }),
      h('button', {
        className: 'dxbx-support-rests-button', type: 'button', text: 'Собрать остатки', dataset: { kind: 'collect' },
        onclick: (event) => void collectStrongRests(legalPersonId, event.currentTarget),
      }),
    ]);
    if (anchor) anchor.before(toolbar);
    else form?.append(toolbar);
  }

  async function runStrongNomenclatureBulk(alcoCode, kind, desiredPresent, button, legalPersonId) {
    const original = button.textContent;
    button.dataset.busy = 'true';
    let failed = 0;
    let skipped = 0;
    try {
      const items = (await getStrongRestsItems(legalPersonId, alcoCode, { force: true }))
        .filter((item) => item?.markInfo)
        .map((item) => ({ mark: String(item.markInfo), volume: item.calculatedVolume ?? '' }));
      if (!items.length) throw new Error('Бутылки не найдены.');
      const label = kind === 'blank' ? 'добавить в бланк' : desiredPresent ? 'добавить в ТЗ' : 'удалить из ТЗ';
      if (!confirm(`${label[0].toUpperCase()}${label.slice(1)}: ${items.length} шт.?`)) return;
      const token = kind === 'blank' ? '' : await ensureMobileToken('ТЗ', legalPersonId);
      let blank = null;
      if (kind === 'blank') {
        blank = await getOpenBlank(legalPersonId);
        if (!blank?.id) throw new Error('Нет открытого бланка.');
      }
      for (let index = 0; index < items.length; index += 1) {
        button.textContent = `${index + 1}/${items.length}`;
        const item = items[index];
        try {
          if (kind === 'blank') {
            if (blankMarkState(blank.id, item.mark) === true) skipped += 1;
            else {
              await changeBlankMark(blank.id, item.mark, 'POST', legalPersonId);
              setBlankMark(blank.id, item.mark, true);
            }
          } else {
            const current = await syncMobileMarkStatus('bar', item.mark, legalPersonId, { token, force: true });
            if (current.present === desiredPresent || (desiredPresent && Number(item.volume) <= 0)) skipped += 1;
            else {
              await executeMobileOperation(desiredPresent ? MOBILE_OPERATIONS.barAdd : MOBILE_OPERATIONS.barDelete, {
                mark: item.mark, volume: item.volume, legalPersonId, token,
              });
              restsState.mobileStatusCache.delete(mobileStatusKey('bar', legalPersonId, item.mark));
            }
          }
        } catch {
          failed += 1;
        }
      }
      refreshVisibleMobileStatuses();
      const suffix = [skipped ? `пропущено ${skipped}` : '', failed ? `ошибок ${failed}` : ''].filter(Boolean).join(', ');
      ui.notify(suffix ? `Готово: ${suffix}.` : 'Готово.', failed ? 'error' : 'success');
    } catch (error) {
      ui.notify(error.message, 'error');
    } finally {
      delete button.dataset.busy;
      button.textContent = original;
    }
  }

  function enhanceStrongNomenclatureRows(legalPersonId) {
    for (const tableRoot of document.querySelectorAll('[data-testid="strong-table"]')) {
      for (const row of tableRoot.querySelectorAll('tbody > tr[data-row-key]')) {
        if (row.closest('[data-testid="strong-expanded-table"]')) continue;
        const alcoCode = row.dataset.rowKey?.trim();
        if (!alcoCode) continue;
        const existing = row.querySelector('.dxbx-support-nomenclature-search');
        if (existing?.dataset.legalPersonId === String(legalPersonId)) continue;
        existing?.remove();
        row.dataset.dxbxSupportAlcoCode = alcoCode;
        const cells = [...row.querySelectorAll(':scope > td')];
        const alcoIndex = cells.findIndex((cell) => getCellTextWithoutToolkit(cell) === alcoCode);
        const nameCell = cells[alcoIndex + 1] || cells[2] || cells.at(-1);
        if (!nameCell) continue;
        const nomenclature = getCellTextWithoutToolkit(nameCell);
        const stop = (action) => (event) => {
          event.preventDefault();
          event.stopPropagation();
          action(event.currentTarget);
        };
        const group = h('span', {
          className: 'dxbx-support-nomenclature-search', dataset: { legalPersonId },
        });
        group.append(
          h('button', {
            className: 'dxbx-support-rests-button', type: 'button', text: 'Поиск бутылок', dataset: { kind: 'search' },
            onclick: stop(() => openBottleSearchModal({ legalPersonId, alcoCode, nomenclature })),
          }),
          h('button', {
            className: 'dxbx-support-rests-button', type: 'button', text: 'Все в ТЗ', dataset: { kind: 'bar-add' },
            onclick: stop((button) => void runStrongNomenclatureBulk(alcoCode, 'bar', true, button, legalPersonId)),
          }),
          h('button', {
            className: 'dxbx-support-rests-button', type: 'button', text: 'Все из ТЗ', dataset: { kind: 'bar-remove' },
            onclick: stop((button) => void runStrongNomenclatureBulk(alcoCode, 'bar', false, button, legalPersonId)),
          }),
          h('button', {
            className: 'dxbx-support-rests-button', type: 'button', text: 'Все в БЛ', dataset: { kind: 'blank' },
            onclick: stop((button) => void runStrongNomenclatureBulk(alcoCode, 'blank', true, button, legalPersonId)),
          }),
        );
        nameCell.append(group);
      }
    }
  }

  async function searchOpenEgaisOrders(legalPersonId) {
    const column = (data, orderable = true) => ({
      data, name: '', searchable: true, orderable, search: { value: '', regex: false },
    });
    const { data } = await request('/app/egaisorder/search', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: {
        draw: 1,
        start: 0,
        length: 200,
        model: 'egaisorder',
        searchFormName: 'egaisorder.default',
        columns: [
          column('identity'), column('status'), column('legalPerson'), column('firstCloseAttemptDate'),
          column('createDate'), column('creator', false), column('updateDate'),
        ],
        order: [{ column: 4, dir: 'desc' }],
        search: { value: '', regex: false },
        simpleCrit: {
          crits: [{
            attr: 'legalPerson', value: String(legalPersonId), oper: 'EQUALS',
            clauses: [{ oper: 'AND', criterion: { attr: 'status', value: ['CREATED'], oper: 'IN', clauses: [] } }],
          }],
        },
      },
    });
    return Array.isArray(data?.data) ? data.data : [];
  }

  async function getEgaisOrderItems(orderId) {
    const { data } = await request(`/app/edit/egaisorder/${encodeURIComponent(orderId)}`);
    if (typeof data !== 'string') return [];
    const documentNode = new DOMParser().parseFromString(data, 'text/html');
    return [...documentNode.querySelectorAll('tr[data-href*="egaisorderitem"]')]
      .map((row) => row.getAttribute('data-href')?.match(/egaisorderitem\/(\d+)/)?.[1])
      .filter(Boolean);
  }

  async function getEgaisOrderItemBottles(itemId, orderId) {
    const { data } = await request(`/app/edit/egaisorderitem/${encodeURIComponent(itemId)}?ref=egaisorder/${encodeURIComponent(orderId)}`);
    if (typeof data !== 'string') return [];
    const documentNode = new DOMParser().parseFromString(data, 'text/html');
    const nomenclature = documentNode.querySelector('#fgr_nomenclature .label, #fgr_nomenclature')?.textContent?.replace(/\s+/g, ' ').trim() || '—';
    return [...documentNode.querySelectorAll('tr[data-href*="egaisbottlerestreserve"]')]
      .map((row) => {
        const cells = row.querySelectorAll('td');
        const mark = cells[1]?.textContent?.trim() || '';
        return mark ? { mark, shortCode: extractShortCode(mark), volume: cells[2]?.textContent?.trim() || '', nomenclature } : null;
      })
      .filter(Boolean);
  }

  async function loadEgaisOrders(legalPersonId, onProgress = () => {}) {
    const cached = restsState.ordersCache?.get(String(legalPersonId));
    if (cached?.expiresAt > Date.now()) return cached.items;
    const orders = await searchOpenEgaisOrders(legalPersonId);
    const result = [];
    for (let index = 0; index < orders.length; index += 1) {
      const order = orders[index];
      const orderId = String(order?.DT_RowId || '');
      if (!orderId) continue;
      const itemIds = await getEgaisOrderItems(orderId).catch(() => []);
      for (const itemId of itemIds) {
        const bottles = await getEgaisOrderItemBottles(itemId, orderId).catch(() => []);
        for (const bottle of bottles) result.push({ orderId, itemId, ...bottle, bottle: null });
      }
      onProgress(index + 1, orders.length);
    }
    for (let offset = 0; offset < result.length; offset += 4) {
      await Promise.all(result.slice(offset, offset + 4).map(async (item) => {
        if (!item.shortCode) return;
        const found = await searchMonolithBottles({
          legalPersonId, attr: 'shortMarkCode', value: item.shortCode, start: 0, length: 1,
        }).catch(() => ({ items: [] }));
        item.bottle = found.items[0] || null;
      }));
    }
    if (!restsState.ordersCache) restsState.ordersCache = new Map();
    restsState.ordersCache.set(String(legalPersonId), { items: result, expiresAt: Date.now() + 5 * 60 * 1000 });
    return result;
  }

  async function openEgaisOrdersModal(legalPersonId) {
    const content = h('div');
    let modal;
    const render = (items) => {
      if (!items.length) {
        content.replaceChildren(h('div', { className: 'workspace-empty', text: 'Открытых заказов нет' }));
        return;
      }
      const body = h('tbody');
      for (const item of items) {
        const bottleId = item.bottle?.DT_RowId;
        body.append(h('tr', {}, [
          h('td', {}, h('a', {
            href: `${location.origin}/index#app/edit/egaisorder/${item.orderId}`,
            target: '_blank', rel: 'noopener noreferrer', text: `#${item.orderId}`,
          })),
          h('td', { text: item.nomenclature }),
          h('td', { className: 'mono', text: item.shortCode || '—', title: item.mark }),
          h('td', { text: item.volume || '—' }),
          h('td', {}, bottleId ? h('a', {
            href: `${location.origin}${BOTTLE_EDIT_PATH}${bottleId}`,
            target: '_blank', rel: 'noopener noreferrer', text: 'Найдена ↗',
          }) : h('span', { text: 'Нет', className: 'muted' })),
        ]));
      }
      content.replaceChildren(
        h('div', { className: 'workspace-bar' }, [
          h('span', { className: 'badge', text: `Заказов ${new Set(items.map((item) => item.orderId)).size}` }),
          h('span', { className: 'badge', text: `Бутылок ${items.length}` }),
          h('span', { className: 'badge', text: `Найдено ${items.filter((item) => item.bottle).length}` }),
          ui.button('Обновить', {
            small: true,
            onclick: () => {
              restsState.ordersCache?.delete(String(legalPersonId));
              modal.close();
              void openEgaisOrdersModal(legalPersonId);
            },
          }),
        ]),
        h('div', { className: 'table-wrap workspace-table' }, h('table', {}, [
          h('thead', {}, h('tr', {}, ['Заказ', 'Номенклатура', 'Марка', 'Объём', 'Бутылка'].map((text) => h('th', { text })))),
          body,
        ])),
      );
    };
    modal = ui.modal('Открытые заказы ЕГАИС', [content], { workspace: true });
    content.replaceChildren(ui.loading('Загрузка заказов…'));
    try {
      render(await loadEgaisOrders(legalPersonId, (done, total) => {
        if (content.isConnected) content.replaceChildren(ui.loading(`Заказы ${done}/${total}`));
      }));
    } catch (error) {
      content.replaceChildren(h('div', { className: 'alert error', text: error.message }));
    }
    return modal;
  }

  async function getNomenclatureMappings(legalPersonId, { query = '', onlyEmpty = false, offset = 0, limit = 100 } = {}) {
    const { data } = await request('/api/front/egais/nomenclature/links/view', {
      method: 'POST',
      body: {
        legalPersonId: Number(legalPersonId),
        page: { limit, offset },
        filter: { egaisNomenclature: query, view: onlyEmpty ? 'EMPTY' : 'ALL' },
      },
    });
    return { items: Array.isArray(data?.items) ? data.items : [], total: Number(data?.total || 0) };
  }

  async function searchBuyerNomenclature(legalPersonId, query) {
    const { data } = await request(`/api/front/common/nomenclature/matching/buyer/search?filter=${encodeURIComponent(query)}&legalPersonId=${encodeURIComponent(legalPersonId)}`);
    return Array.isArray(data) ? data : [];
  }

  async function setNomenclatureMapping(legalPersonId, egaisNomenclatureId, nomenclatureId = null) {
    await request(`/api/front/egais/nomenclature/links/${nomenclatureId ? 'create' : 'delete'}`, {
      method: 'POST',
      body: {
        legalPersonId: Number(legalPersonId),
        egaisNomenclatureId: Number(egaisNomenclatureId),
        ...(nomenclatureId ? { nomenclatureId: Number(nomenclatureId) } : {}),
      },
    });
  }

  function installMappingsSegment(legalPersonId) {
    const group = document.querySelector('form .ant-segmented-group');
    if (!group) return;
    let tab = group.querySelector('[data-dxbx-mappings-tab]');
    if (tab?.dataset.legalPersonId !== String(legalPersonId)) {
      tab?.remove();
      document.querySelector('.dxbx-support-mappings-surface')?.remove();
      tab = null;
    }
    if (!tab) {
      const nativeInput = group.querySelector('input.ant-segmented-item-input');
      const input = h('input', {
        className: 'ant-segmented-item-input', type: 'radio', value: 'dxbx-mappings',
        name: nativeInput?.name || 'dxbx-rests-segment',
      });
      tab = h('label', {
        className: 'ant-segmented-item dxbx-support-mappings-tab',
        dataset: { dxbxMappingsTab: '1', legalPersonId },
      }, [input, h('div', { className: 'ant-segmented-item-label', text: 'Сопоставления', title: 'Сопоставления' })]);
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        queueMicrotask(() => setMappingsPageActive(true, legalPersonId));
      });
      group.append(tab);
    }
    for (const nativeTab of group.querySelectorAll('.ant-segmented-item:not([data-dxbx-mappings-tab])')) {
      if (nativeTab.dataset.dxbxMappingsListener === '1') continue;
      nativeTab.dataset.dxbxMappingsListener = '1';
      nativeTab.addEventListener('click', () => setMappingsPageActive(false, legalPersonId));
    }
  }

  function setMappingsPageActive(active, legalPersonId) {
    const form = document.querySelector('form.ant-form') || document.querySelector('form');
    const group = form?.querySelector('.ant-segmented-group');
    const tab = group?.querySelector('[data-dxbx-mappings-tab]');
    if (!form || !group || !tab) return;
    const surface = ensureMappingsSurface(legalPersonId);
    const targets = form.querySelectorAll(
      '[data-testid="strong-table"], [data-testid="beer-table"], .dxbx-support-rests-toolbar',
    );
    targets.forEach((node) => node.classList.toggle('dxbx-support-rests-hidden', active));
    surface.hidden = !active;
    tab.classList.toggle('ant-segmented-item-selected', active);
    const input = tab.querySelector('input');
    if (input) input.checked = active;
    if (active) {
      for (const nativeTab of group.querySelectorAll('.ant-segmented-item:not([data-dxbx-mappings-tab])')) {
        nativeTab.classList.remove('ant-segmented-item-selected');
        const nativeInput = nativeTab.querySelector('input');
        if (nativeInput) nativeInput.checked = false;
      }
      void surface.dxbxMappings?.load(false);
    }
  }

  function ensureMappingsSurface(legalPersonId) {
    const group = document.querySelector('form .ant-segmented-group');
    if (!group) return null;
    let surface = document.querySelector('.dxbx-support-mappings-surface');
    if (surface?.dataset.legalPersonId === String(legalPersonId)) return surface;
    surface?.remove();

    const queryInput = h('input', {
      className: 'dxbx-support-mappings-search', type: 'search',
      placeholder: 'Поиск по таблице', autocomplete: 'off',
    });
    const onlyEmpty = h('input', { className: 'dxbx-support-mappings-switch', type: 'checkbox' });
    const stats = h('div', { className: 'dxbx-support-mappings-stats' });
    const content = h('div', { className: 'dxbx-support-mappings-content' });
    const state = { items: [], filtered: [], page: 1, pageSize: 20, loaded: false, loading: false };

    const filter = () => {
      const query = queryInput.value.trim().toLocaleLowerCase('ru');
      state.filtered = state.items.filter((item) => {
        if (onlyEmpty.checked && item.nomenclature?.id) return false;
        if (!query) return true;
        return [
          item.egaisNomenclature?.code,
          item.egaisNomenclature?.name,
          item.nomenclature?.name,
          item.nomenclature?.measure,
        ].some((value) => String(value || '').toLocaleLowerCase('ru').includes(query));
      });
      state.page = Math.min(state.page, Math.max(1, Math.ceil(state.filtered.length / state.pageSize)));
      render();
    };

    const updateMapping = (egaisNomenclatureId, nomenclature) => {
      state.items = state.items.map((item) => (
        Number(item.egaisNomenclature?.id) === Number(egaisNomenclatureId)
          ? { ...item, nomenclature }
          : item
      ));
      filter();
    };

    const createMappingSelect = (item) => {
      const mapped = item.nomenclature || null;
      const egaisId = Number(item.egaisNomenclature?.id);
      const input = h('input', {
        className: 'ant-select-selection-search-input', type: 'search', autocomplete: 'off',
        'aria-label': `Номенклатура ресторана для ${item.egaisNomenclature?.name || item.egaisNomenclature?.code || ''}`,
      });
      const selection = mapped ? h('span', {
        className: 'ant-select-selection-item',
        text: `${mapped.name}${mapped.measure ? `, ${mapped.measure}` : ''}`,
        title: `${mapped.name}${mapped.measure ? `, ${mapped.measure}` : ''}`,
      }) : h('span', { className: 'ant-select-selection-placeholder', text: 'Не выбрано' });
      const dropdown = h('div', { className: 'dxbx-support-mapping-dropdown', hidden: true });
      let timer;

      const select = h('div', {
        className: 'ant-select ant-select-single ant-select-allow-clear ant-select-show-search dxbx-support-mapping-select',
        dataset: { egaisId },
      });
      const close = () => {
        dropdown.hidden = true;
        select.classList.remove('ant-select-focused', 'ant-select-open');
        input.value = '';
      };
      const showSearchState = () => {
        select.classList.add('ant-select-focused', 'ant-select-open');
        dropdown.hidden = false;
        dropdown.replaceChildren(h('div', { className: 'dxbx-support-mapping-hint', text: 'Введите ещё символов: 3' }));
        input.focus();
      };
      const search = async () => {
        const query = input.value.trim();
        if (query.length < 3) {
          dropdown.hidden = false;
          dropdown.replaceChildren(h('div', {
            className: 'dxbx-support-mapping-hint', text: `Введите ещё символов: ${3 - query.length}`,
          }));
          return;
        }
        dropdown.hidden = false;
        dropdown.replaceChildren(h('div', { className: 'dxbx-support-mapping-hint', text: 'Поиск…' }));
        try {
          const found = await searchBuyerNomenclature(legalPersonId, query);
          const options = found.slice(0, 30).map((nomenclature) => h('button', {
            className: 'ant-select-item ant-select-item-option dxbx-support-mapping-option',
            type: 'button',
            text: `${nomenclature.name}${nomenclature.measure ? `, ${nomenclature.measure}` : ''}`,
            onmousedown: (event) => event.preventDefault(),
            onclick: async (event) => {
              event.stopPropagation();
              try {
                await setNomenclatureMapping(legalPersonId, egaisId, nomenclature.id);
                updateMapping(egaisId, {
                  id: nomenclature.id,
                  name: nomenclature.name,
                  measure: nomenclature.measure || '',
                });
              } catch (error) { ui.notify(error.message, 'error'); }
            },
          }));
          dropdown.replaceChildren(...(options.length ? options : [
            h('div', { className: 'dxbx-support-mapping-hint', text: 'Ничего не найдено' }),
          ]));
        } catch (error) {
          dropdown.replaceChildren(h('div', { className: 'dxbx-support-mapping-hint error', text: error.message }));
        }
      };

      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => void search(), 300);
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
      });
      input.addEventListener('blur', () => setTimeout(() => {
        if (!select.contains(document.activeElement)) close();
      }, 100));

      const selector = h('div', { className: 'ant-select-selector', onclick: showSearchState }, [
        h('span', { className: 'ant-select-selection-search' }, input),
        selection,
      ]);
      const arrow = h('span', { className: 'ant-select-arrow', text: '⌕', 'aria-hidden': 'true' });
      const clearButton = mapped ? h('button', {
        className: 'ant-select-clear', type: 'button', text: '×', title: 'Удалить сопоставление',
        onclick: async (event) => {
          event.stopPropagation();
          try {
            await setNomenclatureMapping(legalPersonId, egaisId);
            updateMapping(egaisId, null);
          } catch (error) { ui.notify(error.message, 'error'); }
        },
      }) : null;
      select.append(selector, arrow);
      if (clearButton) select.append(clearButton);
      select.append(dropdown);
      return select;
    };

    const renderPagination = () => {
      const total = state.filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
      const page = Math.min(state.page, totalPages);
      const from = total ? (page - 1) * state.pageSize + 1 : 0;
      const to = Math.min(page * state.pageSize, total);
      const pagination = h('ul', {
        className: 'ant-pagination ant-pagination-mini ant-table-pagination ant-table-pagination-right dxbx-support-mappings-pagination',
      });
      pagination.append(
        h('li', { className: 'ant-pagination-total-text', text: `${from}-${to} из ${total}` }),
        h('li', { className: `ant-pagination-prev${page === 1 ? ' ant-pagination-disabled' : ''}` }, h('button', {
          className: 'ant-pagination-item-link', type: 'button', text: '‹', disabled: page === 1,
          onclick: () => { state.page -= 1; render(); },
        })),
      );
      let start = Math.max(1, page - 2);
      const end = Math.min(totalPages, start + 4);
      start = Math.max(1, end - 4);
      for (let number = start; number <= end; number += 1) {
        pagination.append(h('li', {
          className: `ant-pagination-item ant-pagination-item-${number}${number === page ? ' ant-pagination-item-active' : ''}`,
        }, h('button', { type: 'button', text: number, onclick: () => { state.page = number; render(); } })));
      }
      pagination.append(h('li', {
        className: `ant-pagination-next${page === totalPages ? ' ant-pagination-disabled' : ''}`,
      }, h('button', {
        className: 'ant-pagination-item-link', type: 'button', text: '›', disabled: page === totalPages,
        onclick: () => { state.page += 1; render(); },
      })));
      return pagination;
    };

    const render = () => {
      const start = (state.page - 1) * state.pageSize;
      const items = state.filtered.slice(start, start + state.pageSize);
      const from = items.length ? start + 1 : 0;
      stats.textContent = `${from}-${Math.min(start + items.length, state.filtered.length)} из ${state.filtered.length}`;
      if (!items.length) {
        content.replaceChildren(h('div', { className: 'dxbx-support-mappings-empty', text: 'Ничего не найдено' }));
        return;
      }
      const body = h('tbody', { className: 'ant-table-tbody' });
      for (const item of items) {
        const egais = item.egaisNomenclature || {};
        const mapped = item.nomenclature || null;
        body.append(h('tr', {
          className: `ant-table-row ant-table-row-level-0${mapped ? '' : ' not-matched'}`,
          dataset: { rowKey: `${egais.id || 'egais'}_${mapped?.id || 'none'}` },
        }, [
          h('td', { className: 'ant-table-cell dxbx-support-mapping-code', text: egais.code || '—' }),
          h('td', { className: 'ant-table-cell', text: egais.name || '—' }),
          h('td', { className: 'ant-table-cell', text: egais.capacity || '—' }),
          h('td', { className: 'ant-table-cell dxbx-support-mapping-cell' }, createMappingSelect(item)),
        ]));
      }
      content.replaceChildren(
        h('div', { className: 'ant-table-wrapper dxbx-support-mappings-table' }, [
          h('div', { className: 'ant-table ant-table-scroll-horizontal' }, h('div', { className: 'ant-table-container' },
            h('div', { className: 'ant-table-content' }, h('table', {}, [
              h('colgroup', {}, [
                h('col', { style: 'width:220px' }),
                h('col', { style: 'width:600px' }),
                h('col', { style: 'width:90px' }),
                h('col', { style: 'width:500px' }),
              ]),
              h('thead', { className: 'ant-table-thead' }, h('tr', {}, [
                h('th', { className: 'ant-table-cell', text: 'Алк. код' }),
                h('th', { className: 'ant-table-cell', text: 'Номенклатура ЕГАИС' }),
                h('th', { className: 'ant-table-cell', text: 'Объем' }),
                h('th', { className: 'ant-table-cell', text: 'Номенклатура ресторана' }),
              ])),
              body,
            ]))),
          ),
          renderPagination(),
        ]),
      );
    };

    const load = async (force = false) => {
      if (state.loading || (state.loaded && !force)) { filter(); return; }
      state.loading = true;
      content.replaceChildren(h('div', { className: 'dxbx-support-mappings-empty', text: 'Загрузка…' }));
      try {
        const data = await getNomenclatureMappings(legalPersonId, { offset: 0, limit: 100000 });
        state.items = data.items;
        state.loaded = true;
        state.page = 1;
        filter();
      } catch (error) {
        content.replaceChildren(h('div', { className: 'dxbx-support-mappings-error', text: error.message }));
      } finally { state.loading = false; }
    };

    const refreshButton = h('button', {
      className: 'dxbx-support-rests-button', type: 'button', text: 'Обновить', dataset: { kind: 'search' },
      onclick: () => void load(true),
    });
    queryInput.addEventListener('input', () => { state.page = 1; filter(); });
    onlyEmpty.addEventListener('change', () => { state.page = 1; filter(); });
    surface = h('section', {
      className: 'dxbx-support-mappings-surface', hidden: true, dataset: { legalPersonId },
    }, [
      h('div', { className: 'dxbx-support-mappings-header' }, [
        h('h2', { text: 'Сопоставление номенклатур ЕГАИС' }),
        refreshButton,
      ]),
      h('div', { className: 'dxbx-support-mappings-controls' }, [
        h('label', { className: 'dxbx-support-mappings-toggle' }, [onlyEmpty, h('span', { text: 'Только без сопоставлений' })]),
        queryInput,
      ]),
      stats,
      content,
    ]);
    surface.dxbxMappings = { load };
    const segmented = group.closest('.ant-segmented');
    const anchor = segmented?.closest('.ant-col') || segmented || group;
    anchor.after(surface);
    return surface;
  }

  async function collectStrongRests(legalPersonId, button) {
    const original = button.textContent;
    button.disabled = true;
    try {
      const pageSize = 100;
      const loadPage = async (page) => {
        const { data } = await request(`/api/front/egais/rests/legalpersons/${encodeURIComponent(legalPersonId)}/strong`, {
          method: 'POST',
          body: {
            pagination: { page, size: pageSize },
            sort: [],
            alcoCodeSearch: '',
            nomenclatureSearch: '',
          },
        });
        return { records: Array.isArray(data?.records) ? data.records : [], total: Number(data?.total || 0) };
      };
      const first = await loadPage(0);
      const pages = Math.max(1, Math.ceil(first.total / pageSize));
      const records = [...first.records];
      for (let page = 1; page < pages; page += 1) {
        button.textContent = `Алкокоды ${page + 1}/${pages}`;
        records.push(...(await loadPage(page)).records);
      }

      const alcoCodes = [...new Set(records.map((item) => String(item?.alcoCode || '').trim()).filter(Boolean))];
      const lines = [];
      const itemPageSize = 500;
      const loadItems = async (alcoCode) => {
        const firstItems = await request(`/api/front/egais/rests/legalpersons/${encodeURIComponent(legalPersonId)}/strong/alcocode/${encodeURIComponent(alcoCode)}/items?page=0&size=${itemPageSize}`);
        const items = Array.isArray(firstItems.data?.items) ? [...firstItems.data.items] : [];
        const itemPages = Math.ceil(Number(firstItems.data?.total || items.length) / itemPageSize);
        for (let page = 1; page < itemPages; page += 1) {
          const { data } = await request(`/api/front/egais/rests/legalpersons/${encodeURIComponent(legalPersonId)}/strong/alcocode/${encodeURIComponent(alcoCode)}/items?page=${page}&size=${itemPageSize}`);
          if (Array.isArray(data?.items)) items.push(...data.items);
        }
        return items;
      };

      for (let offset = 0; offset < alcoCodes.length; offset += 6) {
        const batch = alcoCodes.slice(offset, offset + 6);
        const results = await Promise.allSettled(batch.map(loadItems));
        for (const result of results) {
          if (result.status !== 'fulfilled') continue;
          for (const item of result.value) {
            if (!item?.markInfo || !item?.formB) continue;
            lines.push(String(item.markInfo), String(item.formB));
          }
        }
        button.textContent = `Марки ${Math.min(offset + batch.length, alcoCodes.length)}/${alcoCodes.length}`;
      }
      if (!lines.length) throw new Error('Марки со справками Б не найдены.');
      downloadBlob(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }),
        `rests_${legalPersonId}_${new Date().toISOString().slice(0, 10)}.txt`);
      ui.notify(`Собрано марок: ${lines.length / 2}.`, 'success');
    } catch (error) {
      ui.notify(`Не удалось собрать остатки: ${error.message}`, 'error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  function collectStrongRestsRows() {
    const rows = new Set();
    const tables = [...document.querySelectorAll('[data-testid="strong-expanded-table"]')];
    const roots = tables.length ? tables : [...document.querySelectorAll('tr.ant-table-expanded-row, [class*="ExpandedTableWrapper"]')];
    for (const root of roots) {
      root.querySelectorAll('tbody > tr[data-row-key], tbody > tr.ant-table-row, tbody > tr').forEach((row) => rows.add(row));
    }
    return [...rows];
  }

  function readStrongRestsRow(row) {
    const cells = [...row.querySelectorAll(':scope > td')];
    if (!cells.length) return null;
    for (const cell of cells) {
      const wrapper = cell.querySelector(RESTS_MARK_WRAPPER_SELECTOR);
      const explicit = wrapper?.getAttribute('data-full-mark') || wrapper?.textContent?.trim();
      if (looksLikeStrongRestsMark(explicit)) return { cells, markCell: cell, mark: explicit, volume: getRestsRowVolume(cells, cell) };
    }
    const candidates = cells
      .map((cell, index) => ({ cell, index, value: getCellTextWithoutToolkit(cell) }))
      .filter((item) => looksLikeStrongRestsMark(item.value))
      .sort((left, right) => (right.value.length - left.value.length) || (Math.abs(left.index - 1) - Math.abs(right.index - 1)));
    const match = candidates[0];
    return match ? { cells, markCell: match.cell, mark: match.value, volume: getRestsRowVolume(cells, match.cell) } : null;
  }

  function getCellTextWithoutToolkit(cell) {
    const clone = cell.cloneNode(true);
    clone.querySelectorAll('.dxbx-support-rests-actions, .dxbx-support-nomenclature-search').forEach((node) => node.remove());
    return clone.textContent?.trim() || '';
  }

  function looksLikeStrongRestsMark(value) {
    const text = String(value || '').replace(/[\u200b-\u200d\ufeff]/g, '').trim();
    if (text.length < 20 || /https?:\/\//i.test(text)) return false;
    if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(text)) return false;
    if (/^\d{1,10}(?:[.,]\d+)?\s*(?:мл|л)$/i.test(text)) return false;
    if ((text.match(/\s/g) || []).length > 1) return false;
    return /[0-9A-Za-zА-Яа-я]/.test(text);
  }

  function getRestsRowVolume(cells, markCell) {
    for (const cell of cells) {
      if (cell === markCell) continue;
      const match = getCellTextWithoutToolkit(cell).match(/(?:^|\s)(\d{1,5}(?:[.,]\d+)?)\s*мл(?:\s|$)/i);
      if (match) return Number(match[1].replace(',', '.'));
    }
    const fallback = getCellTextWithoutToolkit(cells[4] || document.createElement('td')).match(/^\s*(\d{1,5})\s*$/);
    return fallback ? Number(fallback[1]) : '';
  }

  function getStrongRestsAlcoCode(row) {
    const expandedTable = row.closest('[data-testid="strong-expanded-table"], [class*="ExpandedTableWrapper"]');
    let expandedRow = expandedTable?.closest('tr.ant-table-expanded-row, tr[class*="expanded-row" i]');
    let sibling = expandedRow?.previousElementSibling || null;
    while (sibling) {
      const alcoCode = sibling.dataset?.dxbxSupportAlcoCode || sibling.dataset?.rowKey;
      if (alcoCode) return String(alcoCode).trim();
      sibling = sibling.previousElementSibling;
    }
    return '';
  }

  async function getStrongRestsItems(legalPersonId, alcoCode, { force = false } = {}) {
    if (!legalPersonId || !alcoCode) return [];
    const key = `${legalPersonId}:${alcoCode}`;
    const cached = restsState.expandedItemsCache.get(key);
    if (!force && cached?.expiresAt > Date.now()) return cached.promise;
    const promise = request(`/api/front/egais/rests/legalpersons/${legalPersonId}/strong/alcocode/${encodeURIComponent(alcoCode)}/items?page=0&size=500`)
      .then(({ data }) => Array.isArray(data?.items) ? data.items : [])
      .catch((error) => {
        restsState.expandedItemsCache.delete(key);
        throw error;
      });
    restsState.expandedItemsCache.set(key, { expiresAt: Date.now() + 30_000, promise });
    return promise;
  }

  async function hydrateStrongRestsRow(row, legalPersonId) {
    if (row.dataset.dxbxSupportHydrating === 'true') return;
    const restsId = Number(row.dataset.rowKey);
    const alcoCode = getStrongRestsAlcoCode(row);
    if (!Number.isSafeInteger(restsId) || !alcoCode) return;
    row.dataset.dxbxSupportHydrating = 'true';
    try {
      const items = await getStrongRestsItems(legalPersonId, alcoCode);
      const item = items.find((candidate) => Number(candidate?.restsId) === restsId);
      const cells = [...row.querySelectorAll(':scope > td')];
      const markCell = cells[1];
      if (!item?.markInfo || !markCell || !looksLikeStrongRestsMark(item.markInfo)) return;
      enhanceStrongRestsRow(row, legalPersonId, {
        cells,
        markCell,
        mark: item.markInfo,
        volume: item.calculatedVolume ?? '',
        alcoCode,
      });
    } catch (error) {
      console.warn('[DXBX Support Toolkit] Не удалось восстановить строку остатков по API', error);
    } finally {
      delete row.dataset.dxbxSupportHydrating;
    }
  }

  function enhanceStrongRestsRow(row, legalPersonId, context) {
    const { markCell, mark, volume, alcoCode = '' } = context;
    const existing = markCell.querySelector('.dxbx-support-rests-actions');
    if (existing && row.dataset.dxbxSupportLp === String(legalPersonId) && row.dataset.dxbxSupportMark === mark) return;
    existing?.remove();
    row.dataset.dxbxSupportLp = String(legalPersonId);
    row.dataset.dxbxSupportMark = mark;
    if (alcoCode) row.dataset.dxbxSupportAlcoCode = alcoCode;

    const bottleLink = h('span', { className: 'dxbx-support-rests-link', text: 'ЕГАИС', dataset: { state: 'loading' } });
    const dataMatrixButton = inlineButton('DataMatrix', () => showDataMatrixPreview(mark), 'datamatrix');
    const invoiceButton = inlineButton('Накладная', () => void openInvoiceByRestsMark(mark, invoiceButton, legalPersonId), 'invoice');
    const tzButton = inlineButton('+ТЗ', () => void toggleRestsBarBottle(mark, volume, tzButton, legalPersonId), 'bar');
    const writeoffButton = inlineButton('ПС', () => void toggleRestsWriteoffBottle(mark, volume, writeoffButton, legalPersonId), 'writeoff');
    const blankButton = inlineButton('БЛ', () => void toggleBlankMark(mark, blankButton, legalPersonId), 'blank');
    configureMarkButton(tzButton, mark, legalPersonId);
    configureMarkButton(writeoffButton, mark, legalPersonId);
    configureMarkButton(blankButton, mark, legalPersonId);
    updateBlankButtonState(blankButton, mark);
    const shortCode = h('span', { className: 'dxbx-support-rests-meta', text: extractShortCode(mark) || '—' });
    const tzStatus = createTzStatusBadge(mark, legalPersonId);
    const group = h('div', { className: 'dxbx-support-rests-actions' }, [
      bottleLink, dataMatrixButton, invoiceButton, tzStatus, tzButton, writeoffButton, blankButton, shortCode,
    ]);
    markCell.append(group);
    scheduleMobileStatusSync(mark, legalPersonId);

    enqueueBottleResolution(async () => {
      if (!group.isConnected || row.dataset.dxbxSupportMark !== mark) return;
      try {
        const bottle = await resolveBottleByMark(legalPersonId, mark);
        if (!group.isConnected) return;
        if (!bottle?.DT_RowId) {
          bottleLink.dataset.state = 'missing';
          bottleLink.title = 'Бутылка не найдена';
          return;
        }
        bottleLink.replaceWith(h('a', {
          className: 'dxbx-support-rests-link',
          href: `${location.origin}${BOTTLE_EDIT_PATH}${bottle.DT_RowId}`,
          target: '_blank', rel: 'noopener noreferrer', text: 'ЕГАИС ↗',
        }));
        shortCode.textContent = bottle.shortMarkCode || extractShortCode(mark) || '—';
      } catch (error) {
        bottleLink.dataset.state = 'error';
        bottleLink.title = error.message;
      }
    });
  }

  function inlineButton(text, action, kind = '') {
    return h('button', {
      className: 'dxbx-support-rests-button',
      type: 'button',
      text,
      dataset: kind ? { kind } : undefined,
      onclick: (event) => {
        event.preventDefault();
        event.stopPropagation();
        action();
      },
    });
  }

  function configureMarkButton(button, mark, legalPersonId) {
    button.dataset.mark = String(mark);
    button.dataset.legalPersonId = String(legalPersonId || '');
    return button;
  }

  function buildMobileOperationBody(operation, mark, volume = '') {
    const body = { markInfo: String(mark || '').trim() };
    if (operation.includeVolume && volume !== '') {
      const actualVolume = Number(volume);
      if (!Number.isInteger(actualVolume) || actualVolume < 0) throw new Error('Некорректный объём.');
      body.actualVolume = actualVolume;
    }
    return body;
  }

  function mobileMembership(kind, data) {
    if (kind === 'bar') return data?.status === 'ALREADY_EXIST';
    if (kind === 'writeoff') return data?.status === 'ALREADY_EXIST';
    return false;
  }

  function mobileStatusKey(kind, legalPersonId, mark) {
    return `${kind}:${legalPersonId}:${mark}`;
  }

  function createTzStatusBadge(mark, legalPersonId, compact = true) {
    const badge = h('span', {
      className: `dxbx-support-tz-status${compact ? ' compact' : ''}`,
      dataset: { dxbxTzStatus: '1', mark, legalPersonId },
      text: compact ? 'ТЗ: …' : 'Проверка ТЗ…',
    });
    updateTzStatusBadge(badge, restsState.mobileStatusCache.get(mobileStatusKey('bar', legalPersonId, mark)) || null);
    return badge;
  }

  function updateTzStatusBadge(badge, entry = null) {
    const compact = badge.classList.contains('compact');
    let state = 'loading';
    let text = compact ? 'ТЗ: …' : 'Проверка ТЗ…';
    if (entry?.state === 'error') {
      state = 'error';
      text = compact ? 'ТЗ: ошибка' : 'Статус ТЗ недоступен';
    } else if (entry && typeof entry.present === 'boolean') {
      state = entry.present ? 'present' : 'absent';
      text = compact ? (entry.present ? 'В ТЗ' : 'Не в ТЗ') : (entry.present ? 'В торговом зале' : 'Не в торговом зале');
    }
    badge.dataset.state = state;
    badge.textContent = text;
    badge.title = entry?.error || text;
  }

  function updateMobileButtonState(button, entry = null) {
    const kind = button.dataset.kind;
    const present = entry?.present === true;
    button.classList.toggle('active', present);
    button.dataset.state = entry?.state || (entry ? (present ? 'present' : 'absent') : 'unknown');
    if (kind === 'bar') {
      button.textContent = present ? '-ТЗ' : '+ТЗ';
      button.title = entry?.state === 'loading' ? 'Проверка ТЗ…' : present ? 'Удалить из ТЗ' : 'Добавить в ТЗ';
    } else if (kind === 'writeoff') {
      button.textContent = present ? '-ПС' : 'ПС';
      button.title = entry?.state === 'loading' ? 'Проверка ПС…' : present ? 'Удалить из прочих списаний' : 'Добавить в прочие списания';
    }
    if (entry?.error) button.title = entry.error;
  }

  function refreshAllMobileButtons(kind = '', legalPersonId = '', mark = '') {
    const selector = '[data-kind="bar"], [data-kind="writeoff"]';
    const buttons = [...document.querySelectorAll(
      '.dxbx-support-rests-button[data-kind="bar"], .dxbx-support-rests-button[data-kind="writeoff"]',
    )];
    if (ui.shadow) buttons.push(...ui.shadow.querySelectorAll(selector));
    buttons.forEach((button) => {
      if (kind && button.dataset.kind !== kind) return;
      if (legalPersonId && button.dataset.legalPersonId !== String(legalPersonId)) return;
      if (mark && button.dataset.mark !== String(mark)) return;
      const key = mobileStatusKey(button.dataset.kind, button.dataset.legalPersonId, button.dataset.mark);
      updateMobileButtonState(button, restsState.mobileStatusCache.get(key) || null);
    });
    if (!kind || kind === 'bar') {
      const badges = [...document.querySelectorAll('[data-dxbx-tz-status]')];
      if (ui.shadow) badges.push(...ui.shadow.querySelectorAll('[data-dxbx-tz-status]'));
      badges.forEach((badge) => {
        if (legalPersonId && badge.dataset.legalPersonId !== String(legalPersonId)) return;
        if (mark && badge.dataset.mark !== String(mark)) return;
        updateTzStatusBadge(badge, restsState.mobileStatusCache.get(
          mobileStatusKey('bar', badge.dataset.legalPersonId, badge.dataset.mark),
        ) || null);
      });
    }
  }

  function enqueueMobileStatus(task) {
    restsState.mobileStatusQueue.push(task);
    pumpMobileStatusQueue();
  }

  function pumpMobileStatusQueue() {
    while (restsState.activeMobileStatusChecks < MOBILE_STATUS_CONCURRENCY && restsState.mobileStatusQueue.length) {
      const task = restsState.mobileStatusQueue.shift();
      restsState.activeMobileStatusChecks += 1;
      Promise.resolve().then(task).catch(() => null).finally(() => {
        restsState.activeMobileStatusChecks -= 1;
        pumpMobileStatusQueue();
      });
    }
  }

  function scheduleMobileStatusSync(mark, legalPersonId) {
    const token = mobileAuthState.tokenFor(legalPersonId);
    for (const kind of token ? ['bar', 'writeoff'] : ['bar']) {
      const key = mobileStatusKey(kind, legalPersonId, mark);
      const cached = restsState.mobileStatusCache.get(key);
      if (cached?.promise || cached?.expiresAt > Date.now()) {
        refreshAllMobileButtons(kind, legalPersonId, mark);
        continue;
      }
      enqueueMobileStatus(() => syncMobileMarkStatus(kind, mark, legalPersonId, { token }));
    }
  }

  function refreshVisibleMobileStatuses() {
    const seen = new Set();
    const buttons = [...document.querySelectorAll(
      '.dxbx-support-rests-button[data-kind="bar"], .dxbx-support-rests-button[data-kind="writeoff"]',
    )];
    if (ui.shadow) buttons.push(...ui.shadow.querySelectorAll('[data-kind="bar"], [data-kind="writeoff"]'));
    buttons.forEach((button) => {
      const mark = button.dataset.mark;
      const legalPersonId = button.dataset.legalPersonId;
      const key = `${legalPersonId}:${mark}`;
      if (!mark || !legalPersonId || seen.has(key)) return;
      seen.add(key);
      scheduleMobileStatusSync(mark, legalPersonId);
    });
  }

  async function syncMobileMarkStatus(kind, mark, legalPersonId, { token = '', force = false } = {}) {
    const key = mobileStatusKey(kind, legalPersonId, mark);
    const cached = restsState.mobileStatusCache.get(key);
    if (!force && cached?.expiresAt > Date.now()) return cached;
    if (cached?.promise) return cached.promise;
    const authToken = token || mobileAuthState.tokenFor(legalPersonId);
    if (kind === 'bar' && !authToken) {
      const promise = searchMonolithBarBottle(legalPersonId, mark).then((present) => {
        const entry = { kind, present, source: 'monolith', expiresAt: Date.now() + MOBILE_STATUS_TTL };
        restsState.mobileStatusCache.set(key, entry);
        refreshAllMobileButtons(kind, legalPersonId, mark);
        return entry;
      }).catch((error) => {
        const entry = { kind, state: 'error', error: error.message, expiresAt: Date.now() + 10_000 };
        restsState.mobileStatusCache.set(key, entry);
        refreshAllMobileButtons(kind, legalPersonId, mark);
        throw error;
      });
      restsState.mobileStatusCache.set(key, { kind, state: 'loading', promise, expiresAt: 0 });
      refreshAllMobileButtons(kind, legalPersonId, mark);
      return promise;
    }
    if (!authToken) throw new Error('Для проверки прочих списаний нужен мобильный аккаунт.');
    const operation = kind === 'bar' ? MOBILE_OPERATIONS.barCheck : MOBILE_OPERATIONS.writeoffCheck;
    const promise = mobileRequest(`${MOBILE_API_PREFIX}${operation.path}`, {
      method: operation.method,
      headers: { token: authToken },
      apiVersion: operation.apiVersion,
      body: buildMobileOperationBody(operation, mark),
    }).then(({ data }) => {
      const entry = {
        kind,
        present: mobileMembership(kind, data),
        status: data?.status || '',
        data,
        expiresAt: Date.now() + MOBILE_STATUS_TTL,
      };
      restsState.mobileStatusCache.set(key, entry);
      refreshAllMobileButtons(kind, legalPersonId, mark);
      return entry;
    }).catch((error) => {
      restsState.mobileStatusCache.set(key, {
        kind,
        state: 'error',
        present: typeof cached?.present === 'boolean' ? cached.present : undefined,
        error: error.message,
        expiresAt: Date.now() + 10_000,
      });
      refreshAllMobileButtons(kind, legalPersonId, mark);
      throw error;
    });
    restsState.mobileStatusCache.set(key, { state: 'loading', promise, expiresAt: 0 });
    refreshAllMobileButtons(kind, legalPersonId, mark);
    return promise;
  }

  async function executeMobileOperation(operation, { mark, volume = '', legalPersonId, token = '' } = {}) {
    const sourceMark = String(mark || '').trim();
    if (!sourceMark) throw new Error('Марка не найдена.');
    const authToken = token || await ensureMobileToken(operation.label, legalPersonId);
    const body = buildMobileOperationBody(operation, sourceMark, volume);
    const { data, status } = await mobileRequest(`${MOBILE_API_PREFIX}${operation.path}`, {
      method: operation.method,
      headers: { token: authToken },
      apiVersion: operation.apiVersion,
      body,
    });
    return data === '' ? { success: true, status } : data;
  }

  async function toggleRestsBarBottle(mark, volume, button, legalPersonId) {
    button.dataset.busy = 'true';
    button.textContent = '…';
    try {
      const token = await ensureMobileToken('ТЗ', legalPersonId);
      const state = await syncMobileMarkStatus('bar', mark, legalPersonId, { token, force: true });
      await executeMobileOperation(state.present ? MOBILE_OPERATIONS.barDelete : MOBILE_OPERATIONS.barAdd, {
        mark, volume, legalPersonId, token,
      });
      restsState.mobileStatusCache.delete(mobileStatusKey('bar', legalPersonId, mark));
      await syncMobileMarkStatus('bar', mark, legalPersonId, { token, force: true });
      ui.notify('Готово.', 'success');
    } catch (error) {
      refreshAllMobileButtons('bar', legalPersonId, mark);
      ui.notify(error.message, 'error');
    } finally {
      delete button.dataset.busy;
    }
  }

  async function toggleRestsWriteoffBottle(mark, volume, button, legalPersonId) {
    button.dataset.busy = 'true';
    button.textContent = '…';
    try {
      const token = await ensureMobileToken('Прочие списания', legalPersonId);
      const state = await syncMobileMarkStatus('writeoff', mark, legalPersonId, { token, force: true });
      await executeMobileOperation(state.present ? MOBILE_OPERATIONS.writeoffDelete : MOBILE_OPERATIONS.writeoffAdd, {
        mark, volume, legalPersonId, token,
      });
      restsState.mobileStatusCache.delete(mobileStatusKey('writeoff', legalPersonId, mark));
      await syncMobileMarkStatus('writeoff', mark, legalPersonId, { token, force: true });
      await refreshStrongRestsMark(mark, legalPersonId);
      ui.notify('Готово.', 'success');
    } catch (error) {
      refreshAllMobileButtons('writeoff', legalPersonId, mark);
      ui.notify(error.message, 'error');
    } finally {
      delete button.dataset.busy;
    }
  }

  async function openInvoiceByRestsMark(mark, button, legalPersonId) {
    const original = button.textContent;
    const modal = ui.modal('Проверка ФСКАТР', [ui.loading('Получение информации о бутылке…')], { wide: true });
    button.dataset.busy = 'true';
    button.textContent = '…';
    try {
      const token = await ensureMobileToken('Поиск накладной', legalPersonId);
      const { data: productInfo } = await mobileRequest(`${MOBILE_API_PREFIX}/verification-mode/products`, {
        method: 'POST', headers: { token }, body: { mark },
      });
      const invoiceInfo = productInfo?.invoice;
      let invoiceId = null;
      let searchError = '';
      if (invoiceInfo?.ttnNumber && invoiceInfo?.date) {
        try {
          const result = await searchLegacyInvoiceByEgaisInfo(invoiceInfo.ttnNumber, invoiceInfo.date);
          invoiceId = result?.data?.[0]?.DT_RowId || null;
        } catch (error) {
          searchError = error.message;
        }
      }
      modal.body.replaceChildren(renderFskatrInvoiceResult(productInfo, mark, invoiceId, searchError));
    } catch (error) {
      modal.body.replaceChildren(h('div', { className: 'alert error', text: error.message }));
    } finally {
      button.textContent = original;
      delete button.dataset.busy;
    }
  }

  function fskatrCodeCard(label, value, extraClass = '') {
    const source = String(value || 'Не найдено');
    const copyButton = h('button', {
      className: 'fskatr-copy', type: 'button', title: 'Копировать', text: '⧉',
      onclick: async () => {
        await copyText(source);
        copyButton.textContent = '✓';
        setTimeout(() => { if (copyButton.isConnected) copyButton.textContent = '⧉'; }, 1000);
      },
    });
    return h('div', { className: `fskatr-code-card${extraClass ? ` ${extraClass}` : ''}` }, [
      h('div', { className: 'fskatr-code-label' }, [label, copyButton]),
      h('div', { className: 'fskatr-code', title: source, text: source }),
    ]);
  }

  function fskatrInfoRow(icon, label, value, meta = '') {
    return h('div', { className: 'fskatr-info-row' }, [
      h('span', { className: 'fskatr-info-icon', text: icon }),
      h('div', {}, [
        h('div', { className: 'fskatr-info-label', text: label }),
        h('div', { className: 'fskatr-info-value', text: value || 'Не найдено' }),
        meta ? h('div', { className: 'fskatr-info-meta', text: meta }) : null,
      ]),
    ]);
  }

  function formatFskatrStatus(status) {
    return ({
      RECEIVED_FROM_EGAIS: 'Получена из ЕГАИС',
      ACCEPTANCE_ACT_SENT: 'Акт приёмки отправлен',
      ACCEPTANCE_ACT_SENDING_IN_PROCESS: 'Акт приёмки отправляется',
      ACCEPTED_IN_EGAIS: 'Принята в ЕГАИС',
      ACCEPTED_WITH_SHORTFALL: 'Принята с расхождениями',
      DISCREPANCIES_ACT_SENT: 'Акт расхождений отправлен',
      REJECT_ACT_SENT: 'Отказ отправлен',
      CANCELED_IN_EGAIS: 'Отменена в ЕГАИС',
      REPEALED_IN_EGAIS: 'Распроведена в ЕГАИС',
      EGAIS_ERROR: 'Ошибка ЕГАИС',
    })[status] || status || 'Статус неизвестен';
  }

  function renderFskatrInvoiceResult(productInfo, sourceMark, invoiceId, searchError = '') {
    const bottle = productInfo?.bottle || {};
    const invoice = productInfo?.invoice || {};
    const nomenclature = bottle.nomenclature || {};
    const mark = bottle.mark || sourceMark;
    const ownerMeta = bottle.actualOwner?.inn
      ? `ИНН: ${bottle.actualOwner.inn}${bottle.actualOwner.kpp ? ` · КПП: ${bottle.actualOwner.kpp}` : ''}` : '';
    const supplierMeta = invoice.supplier?.inn
      ? `ИНН: ${invoice.supplier.inn}${invoice.supplier.kpp ? ` · КПП: ${invoice.supplier.kpp}` : ''}` : '';
    const statuses = Array.isArray(invoice.statusHistory) ? invoice.statusHistory : [];
    const invoiceUrl = invoiceId ? `${location.origin}/index#app/edit/invoice/${invoiceId}` : '';
    const history = statuses.length
      ? statuses.map((item) => h('div', { className: 'fskatr-status' }, [
        h('span', { className: 'fskatr-status-label', text: formatFskatrStatus(item.egaisStatus) }),
        h('div', { className: 'fskatr-status-date', text: item.date || '' }),
      ]))
      : [h('div', { className: 'fskatr-status' }, [
        h('span', { className: 'fskatr-status-label', text: `Справка Б: ${bottle.formB || 'Не найдена'}` }),
      ])];
    return h('div', { className: 'fskatr-screen' }, [
      h('section', {}, [
        h('div', { className: 'fskatr-product-header' }, [
          h('span', { className: 'fskatr-product-icon', text: '🍾' }),
          h('div', { className: 'fskatr-product-main' }, [
            h('h3', { className: 'fskatr-product-name', text: nomenclature.name || 'Не найдено' }),
            h('div', { className: 'fskatr-invoice-line' }, [
              h('span', { text: invoice.ttnNumber || 'ТТН не найдена' }),
              invoice.date ? h('span', { text: `От ${invoice.date}` }) : null,
              h('span', {
                className: `fskatr-tag${bottle.active === false ? ' inactive' : ''}`,
                text: bottle.active === false ? 'Списана в ЕГАИС' : 'На балансе ЕГАИС',
              }),
            ]),
          ]),
        ]),
      ]),
      h('section', { className: 'fskatr-code-grid' }, [
        fskatrCodeCard('Алкокод:', nomenclature.alcoCode),
        fskatrCodeCard('Серия/номер:', bottle.shortMarkCode || extractShortCode(mark)),
        fskatrCodeCard('Марка:', mark, 'mark'),
      ]),
      h('section', {}, [
        h('h3', { className: 'fskatr-section-title', text: 'Общая информация' }),
        h('div', { className: 'fskatr-info-list' }, [
          fskatrInfoRow('●', 'Текущий владелец', bottle.actualOwner?.name, ownerMeta),
          fskatrInfoRow('↗', 'Поставщик', invoice.supplier?.name, supplierMeta),
          fskatrInfoRow('◷', 'Дата розлива', bottle.bottlingDate),
          fskatrInfoRow('◒', 'Объём', nomenclature.amount !== null && nomenclature.amount !== undefined ? `${nomenclature.amount} л` : ''),
          fskatrInfoRow('％', 'Крепость', nomenclature.volume !== null && nomenclature.volume !== undefined ? `${nomenclature.volume} %` : ''),
        ]),
      ]),
      h('section', {}, [
        h('h3', { className: 'fskatr-section-title', text: 'История операций ЕГАИС' }),
        h('div', { className: 'fskatr-history-card' }, [
          h('span', { className: 'fskatr-history-icon', text: '▤' }),
          h('div', {}, [
            h('div', { className: 'fskatr-history-head' }, [
              h('strong', { text: 'Накладная' }),
              h('span', { text: invoice.ttnNumber || 'Не найдена' }),
            ]),
            h('div', { className: 'fskatr-statuses' }, history),
          ]),
        ]),
      ]),
      searchError ? h('div', { className: 'alert error', text: `Поиск накладной DXBX: ${searchError}` }) : null,
      !invoiceId && !searchError ? h('div', { className: 'alert warning', text: 'Накладная есть в ЕГАИС, но не найдена в DXBX.' }) : null,
      invoiceUrl ? h('div', { className: 'fskatr-footer' }, [
        h('a', { className: 'button primary fskatr-open', href: invoiceUrl, target: '_blank', rel: 'noopener noreferrer', text: 'Открыть накладную' }),
      ]) : null,
    ]);
  }

  async function searchLegacyInvoiceByEgaisInfo(ttnNumber, date) {
    const columns = [
      'system_list_icon', 'number', 'date', 'supplier', 'buyerLegalPerson', 'sum', 'status',
      'acceptStatus', 'egaisStatus', 'unloadingDate', 'acceptDate', 'exchangeChannel', 'egaisId', 'createDate',
    ].map((data, index) => ({
      data, name: '', searchable: true, orderable: index !== 0, search: { value: '', regex: false },
    }));
    const { data } = await request('/app/invoice/search', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: {
        draw: 1, start: 0, length: 25, columns, order: [{ column: 1, dir: 'desc' }],
        search: { value: String(ttnNumber), regex: false }, model: 'invoice', searchFormName: 'invoice.default',
        simpleCrit: { crits: [{ attr: 'date', value: `${date} - ${date}`, oper: 'EQUALS', clauses: [] }] },
      },
    });
    return data;
  }

  async function resolveBottleByMark(legalPersonId, mark) {
    const key = `${legalPersonId}:${mark}`;
    if (!restsState.bottleCache.has(key)) {
      restsState.bottleCache.set(key, searchMonolithBottles({ legalPersonId, attr: 'markInfo', value: mark, length: 1 })
        .then((result) => result.items[0] || null)
        .catch((error) => {
          restsState.bottleCache.delete(key);
          throw error;
        }));
    }
    return restsState.bottleCache.get(key);
  }

  function enqueueBottleResolution(task) {
    restsState.queue.push(task);
    pumpBottleQueue();
  }

  function pumpBottleQueue() {
    while (restsState.activeSearches < 3 && restsState.queue.length) {
      const task = restsState.queue.shift();
      restsState.activeSearches += 1;
      Promise.resolve().then(task).finally(() => {
        restsState.activeSearches -= 1;
        pumpBottleQueue();
      });
    }
  }

  async function refreshStrongRestsMark(mark, legalPersonId) {
    const rows = [...document.querySelectorAll('tr[data-dxbx-support-mark]')]
      .filter((row) => row.dataset.dxbxSupportMark === String(mark)
        && row.dataset.dxbxSupportLp === String(legalPersonId));
    const alcoCodes = [...new Set(rows.map((row) => row.dataset.dxbxSupportAlcoCode || getStrongRestsAlcoCode(row)).filter(Boolean))];
    for (const alcoCode of alcoCodes) {
      const items = await getStrongRestsItems(legalPersonId, alcoCode, { force: true });
      const item = items.find((candidate) => candidate?.markInfo === mark);
      if (!item) continue;
      for (const row of rows.filter((candidate) => (candidate.dataset.dxbxSupportAlcoCode || getStrongRestsAlcoCode(candidate)) === alcoCode)) {
        const cells = [...row.querySelectorAll(':scope > td')];
        const volumeCell = cells[4];
        if (volumeCell && item.calculatedVolume !== null && item.calculatedVolume !== undefined) {
          volumeCell.textContent = `${item.calculatedVolume} мл`;
        }
      }
    }
  }

  async function getOpenBlank(legalPersonId) {
    const token = await ensureMobileToken('Бланк', legalPersonId);
    try {
      const { data } = await mobileRequest(`${BLANK_API_PREFIX}/type/all/status/open/offset/0`, {
        method: 'GET', headers: { token }, apiVersion: 'v3',
      });
      const blank = Array.isArray(data) ? data[0] || null : null;
      restsState.currentBlank = blank;
      restsState.currentBlankLegalPersonId = legalPersonId;
      refreshBlankButtons();
      return blank;
    } catch (error) {
      if (error.status === 404) {
        restsState.currentBlank = null;
        restsState.currentBlankLegalPersonId = legalPersonId;
        refreshBlankButtons();
        return null;
      }
      throw error;
    }
  }

  async function getBlank(blankId, legalPersonId) {
    const token = await ensureMobileToken('Бланк', legalPersonId);
    const { data } = await mobileRequest(`${BLANK_API_PREFIX}/${encodeURIComponent(blankId)}`, {
      method: 'GET', headers: { token }, apiVersion: 'v3',
    });
    restsState.currentBlank = data;
    restsState.currentBlankLegalPersonId = legalPersonId;
    refreshBlankButtons();
    return data;
  }

  async function createBlank(type, legalPersonId) {
    const token = await ensureMobileToken('Создать бланк', legalPersonId);
    const { data } = await mobileRequest(`${BLANK_API_PREFIX}/type/${encodeURIComponent(type)}`, {
      method: 'POST', headers: { token }, body: {}, apiVersion: 'v3',
    });
    restsState.currentBlank = data;
    restsState.currentBlankLegalPersonId = legalPersonId;
    refreshBlankButtons();
    return data;
  }

  async function changeBlankStatus(blankId, action, legalPersonId) {
    const token = await ensureMobileToken(action === 'accept' ? 'Подтвердить бланк' : 'Отменить бланк', legalPersonId);
    await mobileRequest(`${BLANK_API_PREFIX}/${encodeURIComponent(blankId)}/${action}`, {
      method: 'PUT', headers: { token }, apiVersion: 'v3',
    });
    restsState.currentBlank = null;
    restsState.currentBlankLegalPersonId = null;
    refreshBlankButtons();
  }

  async function changeBlankMark(blankId, mark, method, legalPersonId) {
    const token = await ensureMobileToken('Марка в бланке', legalPersonId);
    const decodedString = method === 'DELETE' ? extractShortCode(mark) || mark : mark;
    await mobileRequest(`${BLANK_API_PREFIX}/${encodeURIComponent(blankId)}/mark`, {
      method, headers: { token }, body: { decodedString }, apiVersion: 'v3',
    });
  }

  function extractShortCode(mark) {
    const code = String(mark || '').trim();
    if (code.length === 11) return code;
    return code.length >= 14 ? code.substring(3, 14) : '';
  }

  function blankMarks(blankId) {
    return storageGet(`blank.marks.${blankId}`, {}) || {};
  }

  function blankMarkState(blankId, mark) {
    if (!blankId) return null;
    const marks = blankMarks(blankId);
    return Object.prototype.hasOwnProperty.call(marks, mark) ? marks[mark] === true : null;
  }

  function setBlankMark(blankId, mark, present) {
    const marks = blankMarks(blankId);
    marks[mark] = Boolean(present);
    storageSet(`blank.marks.${blankId}`, marks);
  }

  function updateBlankButtonState(button, mark) {
    const legalPersonId = Number(button.dataset.legalPersonId || '');
    const blank = restsState.currentBlankLegalPersonId === legalPersonId ? restsState.currentBlank : null;
    const present = blank?.id ? blankMarkState(blank.id, mark) : null;
    button.dataset.inBlank = present === null ? 'unknown' : String(present);
    button.classList.toggle('active', present === true);
    button.title = present === true
      ? 'Удалить из бланка'
      : present === false
        ? 'Добавить в бланк'
        : blank?.id ? 'Добавить в бланк' : 'Открыть бланк';
  }

  function refreshBlankButtons() {
    const buttons = [...document.querySelectorAll('.dxbx-support-rests-button[data-kind="blank"]')];
    if (ui.shadow) buttons.push(...ui.shadow.querySelectorAll('[data-kind="blank"]'));
    buttons.forEach((button) => {
      const row = button.closest('tr');
      const panel = button.closest('.dxbx-support-bottle-tools');
      const mark = button.dataset.mark || row?.dataset.dxbxSupportMark || panel?.dataset.mark;
      if (mark) updateBlankButtonState(button, mark);
    });
  }

  async function toggleBlankMark(mark, button, legalPersonId) {
    button.dataset.busy = 'true';
    const original = button.textContent;
    button.textContent = '…';
    try {
      const blank = restsState.currentBlankLegalPersonId === legalPersonId && restsState.currentBlank
        ? restsState.currentBlank
        : await getOpenBlank(legalPersonId);
      if (!blank?.id) {
        button.textContent = original;
        await openBlankModal(legalPersonId);
        return;
      }
      const present = blankMarkState(blank.id, mark);
      try {
        await changeBlankMark(blank.id, mark, present === true ? 'DELETE' : 'POST', legalPersonId);
        setBlankMark(blank.id, mark, present !== true);
      } catch (error) {
        if (present === null && (error.status === 409 || /уже|already|exist/i.test(error.message))) {
          setBlankMark(blank.id, mark, true);
        } else {
          throw error;
        }
      }
      refreshBlankButtons();
      ui.notify('Готово.', 'success');
    } catch (error) {
      ui.notify(error.message, 'error');
    } finally {
      button.textContent = original;
      delete button.dataset.busy;
    }
  }

  async function openBlankModal(legalPersonId = getWorkingLegalPersonId()) {
    let modal;
    const render = async () => {
      modal.body.replaceChildren(ui.loading('Загрузка…'));
      try {
        let blank = restsState.currentBlankLegalPersonId === legalPersonId && restsState.currentBlank
          ? restsState.currentBlank
          : await getOpenBlank(legalPersonId);
        if (blank?.id) blank = await getBlank(blank.id, legalPersonId);
        if (!blank) {
          const make = (type, label) => ui.button(label, {
            onclick: async () => {
              modal.body.replaceChildren(ui.loading('Создание…'));
              try {
                await createBlank(type, legalPersonId);
                refreshBlankButtons();
                await render();
              } catch (error) {
                modal.body.replaceChildren(h('div', { className: 'alert error', text: error.message }), creationButtons());
              }
            },
          });
          const creationButtons = () => h('div', { className: 'actions' }, [
            make('return', 'Возврат'), make('movement', 'Перемещение'), make('inventory', 'Инвентаризация'),
          ]);
          modal.body.replaceChildren(creationButtons());
          return;
        }

        const typeNames = { return: 'Возврат', movement: 'Перемещение', inventory: 'Инвентаризация' };
        const itemsBody = h('tbody');
        for (const item of blank.items || []) {
          itemsBody.append(h('tr', {}, [
            h('td', { text: item.info?.name || item.id || '—' }),
            h('td', { className: 'mono', text: item.id || '—' }),
            h('td', { text: item.count ?? '—' }),
          ]));
        }
        const content = [h('div', { className: 'actions' }, [
          h('span', { className: 'badge', text: typeNames[blank.type] || blank.type || 'Бланк' }),
          h('strong', { text: blank.docNumber || blank.id }),
          h('span', { className: 'muted', text: blank.date || '' }),
        ])];
        if (blank.items?.length) {
          content.push(h('div', { className: 'table-wrap' }, h('table', {}, [
            h('thead', {}, h('tr', {}, ['Номенклатура', 'Алкокод', 'Кол-во'].map((text) => h('th', { text })))),
            itemsBody,
          ])));
        }
        content.push(h('div', { className: 'actions' }, [
          ui.button('Подтвердить', {
            variant: 'primary',
            onclick: async () => {
              if (!confirm(`Подтвердить бланк ${blank.docNumber || blank.id}?`)) return;
              try {
                await changeBlankStatus(blank.id, 'accept', legalPersonId);
                modal.close();
                refreshBlankButtons();
                ui.notify('Бланк подтверждён.', 'success');
              } catch (error) { ui.notify(error.message, 'error'); }
            },
          }),
          ui.button('Отменить', {
            variant: 'danger',
            onclick: async () => {
              if (!confirm(`Отменить бланк ${blank.docNumber || blank.id}?`)) return;
              try {
                await changeBlankStatus(blank.id, 'decline', legalPersonId);
                modal.close();
                refreshBlankButtons();
                ui.notify('Бланк отменён.', 'success');
              } catch (error) { ui.notify(error.message, 'error'); }
            },
          }),
          ui.button('Обновить', { onclick: async () => {
            restsState.currentBlank = null;
            restsState.currentBlankLegalPersonId = null;
            await render();
          } }),
        ]));
        modal.body.replaceChildren(...content);
      } catch (error) {
        modal.body.replaceChildren(h('div', { className: 'alert error', text: error.message }));
      }
    };
    modal = ui.modal('Бланк', []);
    await render();
    return modal;
  }

  function enhanceBottlePage() {
    if (document.querySelector('.dxbx-support-bottle-tools')) return;
    const markInput = document.querySelector('#id_markInfo, input[name="markInfo"], textarea[name="markInfo"]');
    const mark = markInput?.value?.trim();
    if (!mark) return;
    const legalPersonId = readNumericControl('#id_legalPerson, [name="legalPerson.id"]') || getWorkingLegalPersonId();
    const availableVolume = readControlValue('#id_availableVolume, [name="availableVolume"]');
    const egaisVolume = readControlValue('#id_egaisVolume, [name="egaisVolume"]');
    const updateDate = readControlValue('#id_egaisVolumeUpdateDate, [name="egaisVolumeUpdateDate"]');
    const restsText = document.querySelector('#id_restsItem, [name="restsItem"]')?.parentElement?.textContent || '';
    const formB = restsText.match(/спр\.?:?\s*2\s*:\s*([^\s]+)/i)?.[1] || '—';
    const shortCode = document.querySelector('#id_shortMarkCode, [name="shortMarkCode"]')?.value || extractShortCode(mark);
    const canvas = h('canvas', { className: 'dxbx-support-bottle-dm', width: 180, height: 180 });
    try { drawDataMatrix(canvas, mark); } catch { return; }
    const tzButton = inlineButton('+ТЗ', () => void toggleRestsBarBottle(mark, availableVolume, tzButton, legalPersonId), 'bar');
    const writeoffButton = inlineButton('ПС', () => void toggleRestsWriteoffBottle(mark, availableVolume, writeoffButton, legalPersonId), 'writeoff');
    const blankButton = inlineButton('БЛ', () => void toggleBlankMark(mark, blankButton, legalPersonId), 'blank');
    configureMarkButton(tzButton, mark, legalPersonId);
    configureMarkButton(writeoffButton, mark, legalPersonId);
    configureMarkButton(blankButton, mark, legalPersonId);
    updateBlankButtonState(blankButton, mark);
    const invoiceButton = inlineButton('Накладная', () => void openInvoiceByRestsMark(mark, invoiceButton, legalPersonId), 'invoice');
    const status = createTzStatusBadge(mark, legalPersonId, false);
    const dataMatrixButton = inlineButton('Открыть DataMatrix', () => showDataMatrixPreview(mark), 'datamatrix');
    const copyButton = inlineButton('Копировать марку', () => void copyText(mark), 'copy');
    const pngButton = inlineButton('Скачать PNG', () => downloadDataMatrixCanvas(canvas, mark), 'export');
    canvas.addEventListener('click', () => showDataMatrixPreview(mark));
    const tools = h('div', { className: 'dxbx-support-bottle-tools', dataset: { mark } }, [
      h('div', { className: 'dxbx-support-bottle-header' }, [
        h('div', {}, [
          h('span', { className: 'dxbx-support-bottle-kicker', text: 'DXBX SUPPORT' }),
          h('h3', { text: 'Бутылка ЕГАИС' }),
          h('span', { className: 'dxbx-support-bottle-short mono', text: shortCode || '—' }),
        ]),
        status,
      ]),
      h('div', { className: 'dxbx-support-bottle-body' }, [
        h('div', { className: 'dxbx-support-bottle-canvas' }, canvas),
        h('div', { className: 'dxbx-support-bottle-actions' }, [
          h('div', { className: 'dxbx-support-bottle-metrics' }, [
            h('div', { className: 'dxbx-support-bottle-metric' }, [h('span', { text: 'Остаток' }), h('strong', { text: availableVolume !== '' ? `${availableVolume} мл` : '—' })]),
            h('div', { className: 'dxbx-support-bottle-metric' }, [h('span', { text: 'ЕГАИС' }), h('strong', { text: egaisVolume !== '' ? `${egaisVolume} мл` : '—' })]),
            h('div', { className: 'dxbx-support-bottle-metric' }, [h('span', { text: 'Справка Б' }), h('strong', { className: 'mono', text: formB })]),
          ]),
          updateDate ? h('div', { className: 'dxbx-support-bottle-updated', text: `Обновлено ${updateDate}` }) : null,
          h('div', { className: 'dxbx-support-bottle-action-row' }, [dataMatrixButton, copyButton, pngButton, invoiceButton]),
          h('div', { className: 'dxbx-support-bottle-action-row operational' }, [tzButton, writeoffButton, blankButton]),
        ]),
      ]),
    ]);
    const anchor = markInput.closest('.form-group, .field, .row') || markInput;
    anchor.after(tools);
    scheduleMobileStatusSync(mark, legalPersonId);
  }

  function readControlValue(selector) {
    const node = document.querySelector(selector);
    return String(node?.value ?? node?.textContent ?? '').trim();
  }

  function readNumericControl(selector) {
    const node = document.querySelector(selector);
    const value = Number(node?.value || node?.dataset?.id || '');
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  function enhanceInvoicePage() {
    const rawInput = document.querySelector('#id_invoiceRawBody, textarea[name="invoiceRawBody"], input[name="invoiceRawBody"]');
    if (!rawInput?.value) return;
    const bottles = parseInvoicePositions(rawInput.value);
    if (!bottles.length) return;
    const legalPersonId = readNumericControl('#id_buyerLegalPerson, [name="buyerLegalPerson.id"]') || getWorkingLegalPersonId();
    const signature = `${bottles.length}:${bottles[0].mark}:${bottles.at(-1).mark}:${legalPersonId || ''}`;
    const existing = document.querySelector('.dxbx-support-invoice-tools');
    if (existing?.dataset.signature === signature) return;
    existing?.remove();
    const downloadButton = h('button', {
      className: 'dxbx-support-invoice-download',
      type: 'button',
      text: 'Скачать DataMatrix ZIP',
      onclick: () => void downloadInvoiceDataMatrixZip(bottles, downloadButton),
    });
    const addAllButton = h('button', {
      className: 'dxbx-support-invoice-add-all',
      type: 'button',
      text: 'Добавить все в ТЗ',
      disabled: !legalPersonId,
      onclick: () => void addInvoiceBottlesToTz(bottles, legalPersonId, addAllButton),
    });
    const tools = h('section', { className: 'dxbx-support-invoice-tools', dataset: { signature } }, [
      h('div', { className: 'dxbx-support-invoice-header' }, [
        h('div', { className: 'dxbx-support-invoice-heading' }, [
          h('span', { className: 'dxbx-support-bottle-kicker', text: 'DXBX SUPPORT' }),
          h('h3', { text: 'Бутылки из накладной' }),
        ]),
        h('div', { className: 'dxbx-support-invoice-actions' }, [
          h('span', { className: 'dxbx-support-invoice-count', text: `${bottles.length} шт.` }),
          addAllButton,
          downloadButton,
        ]),
      ]),
      renderInvoiceBottleList(bottles, legalPersonId),
    ]);
    const anchor = rawInput.closest('.form-group, .field, .row') || rawInput;
    anchor.after(tools);
    if (legalPersonId) bottles.forEach((bottle) => scheduleMobileStatusSync(bottle.mark, legalPersonId));
  }

  function parseInvoiceMarks(rawBody) {
    return parseInvoicePositions(rawBody).map(({ mark, nomenclature }) => ({ mark, nomenclature }));
  }

  function parseInvoicePositions(rawBody) {
    let invoice;
    try { invoice = JSON.parse(rawBody); } catch { return []; }
    const result = [];
    for (const item of invoice?.items || []) {
      const nomenclature = item?.productInfo?.fullName || item?.productInfo?.name || item?.name || 'Номенклатура';
      const capacity = Number(item?.productInfo?.capacity);
      const volume = Number.isFinite(capacity) && capacity > 0 ? Math.round(capacity * 1000) : 750;
      for (const bottle of item?.bottleList || item?.bottles || []) {
        const mark = typeof bottle === 'string' ? bottle : bottle?.mark || bottle?.markInfo || bottle?.code;
        if (mark) result.push({ mark: String(mark), nomenclature: String(nomenclature), volume });
      }
    }
    return result;
  }

  function renderInvoiceBottleList(bottles, legalPersonId) {
    const body = h('tbody');
    bottles.forEach((bottle, index) => {
      const markCell = h('button', {
        className: 'dxbx-support-invoice-mark mono', type: 'button', title: bottle.mark, text: bottle.mark,
        onclick: async () => {
          await copyText(bottle.mark);
          ui.notify('Марка скопирована.', 'success');
        },
      });
      let tzButton;
      tzButton = inlineButton('+ТЗ', () => void toggleRestsBarBottle(bottle.mark, bottle.volume, tzButton, legalPersonId), 'bar');
      configureMarkButton(tzButton, bottle.mark, legalPersonId);
      if (!legalPersonId) tzButton.disabled = true;
      const status = legalPersonId
        ? createTzStatusBadge(bottle.mark, legalPersonId)
        : h('span', { className: 'dxbx-support-tz-status compact', dataset: { state: 'error' }, text: 'ЮЛ не найдено' });
      body.append(h('tr', { dataset: { mark: bottle.mark } }, [
        h('td', { className: 'dxbx-support-invoice-num', text: index + 1 }),
        h('td', { className: 'dxbx-support-invoice-name', text: bottle.nomenclature }),
        h('td', {}, markCell),
        h('td', { className: 'dxbx-support-invoice-volume', text: `${bottle.volume} мл` }),
        h('td', { className: 'dxbx-support-invoice-status' }, status),
        h('td', { className: 'dxbx-support-invoice-tz' }, tzButton),
      ]));
    });
    return h('div', { className: 'dxbx-support-invoice-list' }, h('table', {}, [
      h('thead', {}, h('tr', {}, [
        h('th', { text: '№' }),
        h('th', { text: 'Номенклатура' }),
        h('th', { text: 'Марка' }),
        h('th', { text: 'Объём' }),
        h('th', { text: 'Статус' }),
        h('th', { text: 'ТЗ' }),
      ])),
      body,
    ]));
  }

  async function addInvoiceBottlesToTz(bottles, legalPersonId, button) {
    if (!legalPersonId || !bottles.length) return;
    if (!confirm(`Добавить в ТЗ ${bottles.length} бутылок?`)) return;
    const original = button.textContent;
    button.disabled = true;
    let added = 0;
    let skipped = 0;
    let failed = 0;
    try {
      const token = await ensureMobileToken('ТЗ', legalPersonId);
      for (let index = 0; index < bottles.length; index += 1) {
        const bottle = bottles[index];
        button.textContent = `${index + 1}/${bottles.length}`;
        try {
          const current = await syncMobileMarkStatus('bar', bottle.mark, legalPersonId, { token, force: true });
          if (current.present) skipped += 1;
          else {
            await executeMobileOperation(MOBILE_OPERATIONS.barAdd, {
              mark: bottle.mark, volume: bottle.volume, legalPersonId, token,
            });
            restsState.mobileStatusCache.delete(mobileStatusKey('bar', legalPersonId, bottle.mark));
            await syncMobileMarkStatus('bar', bottle.mark, legalPersonId, { token, force: true });
            added += 1;
          }
        } catch {
          failed += 1;
        }
      }
      ui.notify(`Добавлено: ${added}${skipped ? ` · уже в ТЗ: ${skipped}` : ''}${failed ? ` · ошибок: ${failed}` : ''}.`, failed ? 'error' : 'success');
    } catch (error) {
      ui.notify(error.message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  async function downloadInvoiceDataMatrixZip(marks, button) {
    const original = button.textContent;
    button.disabled = true;
    try {
      const entries = [];
      const usedNames = new Map();
      for (let index = 0; index < marks.length; index += 1) {
        button.textContent = `${index + 1}/${marks.length}`;
        const { mark, nomenclature } = marks[index];
        const canvas = h('canvas', { width: 320, height: 320 });
        drawDataMatrix(canvas, mark);
        const data = new Uint8Array(await (await canvasToBlob(canvas, 'image/png')).arrayBuffer());
        const base = `${extractShortCode(mark) || `mark_${index + 1}`}_${safeZipFilePart(nomenclature)}`.slice(0, 150);
        const count = (usedNames.get(base) || 0) + 1;
        usedNames.set(base, count);
        entries.push({ name: `${base}${count > 1 ? `_${count}` : ''}.png`, data });
        if (index % 10 === 9) await sleep(0);
      }
      const blob = new Blob([buildStoreZip(entries)], { type: 'application/zip' });
      const invoiceId = `${location.hash}${location.pathname}`.match(/app\/edit\/invoice\/(\d+)/)?.[1] || 'invoice';
      downloadBlob(blob, `datamatrix_${invoiceId}.zip`);
      ui.notify('Архив готов.', 'success');
    } catch (error) {
      ui.notify(error.message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  function canvasToBlob(canvas, type) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Не удалось создать PNG.')), type);
    });
  }

  function safeZipFilePart(value) {
    return String(value || '')
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
      .replace(/\s+/g, ' ')
      .replace(/[. ]+$/g, '')
      .trim() || 'Номенклатура';
  }

  function buildStoreZip(entries) {
    const encoder = new TextEncoder();
    const locals = [];
    const centrals = [];
    let offset = 0;
    for (const entry of entries) {
      const name = encoder.encode(entry.name);
      const data = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(entry.data);
      const crc = crc32(data);
      const local = new Uint8Array(30 + name.length + data.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(8, 0, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, name.length, true);
      local.set(name, 30);
      local.set(data, 30 + name.length);
      locals.push(local);

      const central = new Uint8Array(46 + name.length);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, name.length, true);
      centralView.setUint32(42, offset, true);
      central.set(name, 46);
      centrals.push(central);
      offset += local.length;
    }
    const centralSize = centrals.reduce((sum, value) => sum + value.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    return concatBytes([...locals, ...centrals, end]);
  }

  function concatBytes(parts) {
    const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let offset = 0;
    for (const part of parts) {
      result.set(part, offset);
      offset += part.length;
    }
    return result;
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = h('a', { href: url, download: filename });
    Object.assign(link.style, { position: 'fixed', left: '-9999px' });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function ensureRestsPageStyle() {
    if (document.getElementById('dxbx-support-rests-style')) return;
    document.head.append(h('style', { id: 'dxbx-support-rests-style', text: `
      .dxbx-support-rests-hidden { display: none !important; }
      .dxbx-support-rests-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 10px; }
      .dxbx-support-rests-actions { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; margin-top: 5px; }
      .dxbx-support-rests-link, .dxbx-support-rests-button {
        display: inline-flex; align-items: center; min-height: 24px; border-radius: 6px; padding: 2px 8px;
        font: 600 12px/1.3 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; text-decoration: none;
      }
      .dxbx-support-rests-link { border: 1px solid #91caff; background: #e6f4ff; color: #0958d9; }
      .dxbx-support-rests-link[data-state="loading"] { opacity: .65; }
      .dxbx-support-rests-link[data-state="missing"] { border-color: #d9d9d9; background: #fafafa; color: #8c8c8c; }
      .dxbx-support-rests-link[data-state="error"] { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
      .dxbx-support-rests-button { border: 1px solid #d9d9d9; background: #fff; color: #262626; cursor: pointer; }
      .dxbx-support-rests-button:hover { border-color: #69b1ff; color: #0958d9; }
      .dxbx-support-rests-button[data-kind="search"] { border-color: #1677ff; background: #1677ff; color: #fff; }
      .dxbx-support-rests-button[data-kind="search"]:hover { border-color: #0958d9; background: #0958d9; color: #fff; }
      .dxbx-support-rests-button[data-kind="orders"] { border-color: #ffd591; background: #fff7e6; color: #ad4e00; }
      .dxbx-support-rests-button[data-kind="collect"] { border-color: #52c41a; background: #52c41a; color: #fff; }
      .dxbx-support-rests-button[data-kind="bar-add"] { border-color: #95de64; background: #f6ffed; color: #237804; }
      .dxbx-support-rests-button[data-kind="bar-remove"] { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
      .dxbx-support-rests-button[data-kind="invoice"] { border-color: #ffd591; background: #fff7e6; color: #ad4e00; }
      .dxbx-support-rests-button[data-kind="bar"], .dxbx-support-rests-button[data-kind="writeoff"] { border-color: #b7eb8f; background: #f6ffed; color: #237804; }
      .dxbx-support-rests-button[data-kind="bar"].active, .dxbx-support-rests-button[data-kind="writeoff"].active { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
      .dxbx-support-rests-button[data-kind="blank"] { border-color: #d3adf7; background: #f9f0ff; color: #531dab; }
      .dxbx-support-rests-button[data-kind="blank"].active { text-decoration: line-through; opacity: .65; }
      .dxbx-support-rests-button[data-kind="danger"] { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
      .dxbx-support-rests-button[data-state="loading"] { opacity: .65; }
      .dxbx-support-rests-button[data-busy="true"] { opacity: .55; pointer-events: none; }
      .dxbx-support-rests-meta { color: #8c8c8c; font: 500 11px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; }
      .dxbx-support-act-egais-volume { display: block; margin-top: 3px; text-decoration: none; }
      .dxbx-support-act-egais-volume.warning { color: #cf1322; font-weight: 700; }
      .dxbx-support-nomenclature-search { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px; vertical-align: middle; }
      .dxbx-support-nomenclature-search .dxbx-support-rests-button { min-height: 27px; }
      .dxbx-support-tz-status { display: inline-flex; align-items: center; min-height: 28px; border-radius: 999px; padding: 3px 10px; border: 1px solid #d9d9d9; background: #fafafa; color: #595959; font: 700 12px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; white-space: nowrap; }
      .dxbx-support-tz-status.compact { min-height: 24px; padding: 2px 8px; font-size: 11px; }
      .dxbx-support-tz-status[data-state="present"] { border-color: #95de64; background: #f6ffed; color: #237804; }
      .dxbx-support-tz-status[data-state="absent"] { border-color: #ffccc7; background: #fff2f0; color: #a8071a; }
      .dxbx-support-tz-status[data-state="error"] { border-color: #ffe58f; background: #fffbe6; color: #874d00; }
      .dxbx-support-bottle-tools { width: min(1120px, calc(100% - 32px)); margin: 16px auto; border: 1px solid #d9e8fb; border-radius: 12px; background: #fff; box-shadow: 0 6px 22px rgba(22,119,255,.08); overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .dxbx-support-bottle-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 18px; border-bottom: 1px solid #edf3fa; background: linear-gradient(90deg, #f5f9ff, #fff); }
      .dxbx-support-bottle-header h3 { margin: 1px 0 2px; font-size: 19px; line-height: 1.25; color: #1f1f1f; }
      .dxbx-support-bottle-kicker { color: #1677ff; font-size: 10px; font-weight: 800; letter-spacing: .08em; }
      .dxbx-support-bottle-short { color: #595959; font-size: 12px; }
      .dxbx-support-bottle-body { display: grid; grid-template-columns: 176px minmax(0, 1fr); gap: 22px; align-items: center; padding: 18px; }
      .dxbx-support-bottle-canvas { display: grid; place-items: center; min-height: 164px; border: 1px solid #f0f0f0; border-radius: 10px; background: #fafafa; }
      .dxbx-support-bottle-dm { width: 148px; height: 148px; image-rendering: pixelated; cursor: zoom-in; }
      .dxbx-support-bottle-actions { min-width: 0; }
      .dxbx-support-bottle-metrics { display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap: 8px; }
      .dxbx-support-bottle-metric { min-width: 0; padding: 9px 11px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fafafa; }
      .dxbx-support-bottle-metric span { display: block; margin-bottom: 3px; color: #8c8c8c; font-size: 11px; }
      .dxbx-support-bottle-metric strong { display: block; overflow: hidden; color: #262626; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
      .dxbx-support-bottle-updated { margin-top: 6px; color: #8c8c8c; font-size: 11px; }
      .dxbx-support-bottle-action-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 13px; }
      .dxbx-support-bottle-action-row.operational { margin-top: 7px; padding-top: 9px; border-top: 1px solid #f0f0f0; }
      .dxbx-support-rests-button[data-kind="datamatrix"] { border-color: #b37feb; background: #f9f0ff; color: #531dab; }
      .dxbx-support-rests-button[data-kind="export"] { border-color: #91caff; background: #e6f4ff; color: #0958d9; }
      .dxbx-support-invoice-tools { width: min(1120px, calc(100% - 32px)); margin: 16px auto; border: 1px solid #d9e8fb; border-radius: 12px; background: #fff; box-shadow: 0 6px 22px rgba(22,119,255,.08); overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .dxbx-support-invoice-header { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 14px 18px; border-bottom: 1px solid #edf3fa; background: linear-gradient(90deg, #f5f9ff, #fff); }
      .dxbx-support-invoice-heading h3 { margin: 1px 0 0; color: #1f1f1f; font-size: 18px; line-height: 1.25; }
      .dxbx-support-invoice-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; }
      .dxbx-support-invoice-count { display: inline-flex; align-items: center; min-height: 28px; border: 1px solid #d9e8fb; border-radius: 999px; padding: 3px 10px; background: #fff; color: #595959; font-size: 12px; font-weight: 700; white-space: nowrap; }
      .dxbx-support-invoice-download, .dxbx-support-invoice-add-all { min-height: 36px; border-radius: 7px; padding: 6px 14px; font: 700 13px/1.3 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; cursor: pointer; }
      .dxbx-support-invoice-download { border: 1px solid #1677ff; background: #1677ff; color: #fff; }
      .dxbx-support-invoice-download:hover { border-color: #0958d9; background: #0958d9; }
      .dxbx-support-invoice-add-all { border: 1px solid #52c41a; background: #52c41a; color: #fff; }
      .dxbx-support-invoice-add-all:hover { border-color: #389e0d; background: #389e0d; }
      .dxbx-support-invoice-download:disabled, .dxbx-support-invoice-add-all:disabled { opacity: .6; cursor: wait; }
      .dxbx-support-invoice-list { max-height: 420px; overflow: auto; background: #fff; }
      .dxbx-support-invoice-list table { width: 100%; min-width: 940px; border-collapse: collapse; table-layout: fixed; }
      .dxbx-support-invoice-list th { position: sticky; top: 0; z-index: 1; padding: 9px 10px; border-bottom: 1px solid #e8eaed; background: #f5f7fa; color: #3d4652; text-align: left; font-size: 12px; }
      .dxbx-support-invoice-list td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; color: #262626; vertical-align: middle; font-size: 12px; }
      .dxbx-support-invoice-list tbody tr:hover { background: #f5f9ff; }
      .dxbx-support-invoice-list th:nth-child(1) { width: 44px; text-align: right; }
      .dxbx-support-invoice-list th:nth-child(2) { width: 260px; }
      .dxbx-support-invoice-list th:nth-child(3) { width: 330px; }
      .dxbx-support-invoice-list th:nth-child(4) { width: 90px; }
      .dxbx-support-invoice-list th:nth-child(5) { width: 120px; text-align: center; }
      .dxbx-support-invoice-list th:nth-child(6) { width: 72px; text-align: center; }
      .dxbx-support-invoice-num, .dxbx-support-invoice-volume { text-align: right; white-space: nowrap; }
      .dxbx-support-invoice-name { font-weight: 600; line-height: 1.35; }
      .dxbx-support-invoice-mark { display: block; width: 100%; overflow: hidden; border: 0; padding: 0; background: transparent; color: #262626; text-align: left; text-overflow: ellipsis; white-space: nowrap; cursor: copy; }
      .dxbx-support-invoice-status, .dxbx-support-invoice-tz { text-align: center; }
      .dxbx-support-mappings-surface { margin: 12px 0 0; background: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .dxbx-support-mappings-surface[hidden] { display: none; }
      .dxbx-support-mappings-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
      .dxbx-support-mappings-header h2 { margin: 0; color: #262626; font-size: 20px; font-weight: 500; }
      .dxbx-support-mappings-controls { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin: 0 0 18px; }
      .dxbx-support-mappings-search { width: min(420px, 50%); height: 34px; border: 1px solid #d9d9d9; border-radius: 6px; padding: 4px 11px; background: #fff; color: #262626; font-size: 14px; transition: border-color .2s, box-shadow .2s; }
      .dxbx-support-mappings-search:focus { outline: 0; border-color: #40a9ff; box-shadow: 0 0 0 2px rgba(24,144,255,.2); }
      .dxbx-support-mappings-toggle { display: inline-flex; align-items: center; gap: 10px; color: #262626; font-size: 14px; white-space: nowrap; cursor: pointer; }
      .dxbx-support-mappings-switch { position: relative; width: 44px; height: 22px; margin: 0; border: 0; border-radius: 100px; appearance: none; background: rgba(0,0,0,.25); cursor: pointer; transition: background .2s; }
      .dxbx-support-mappings-switch::after { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 2px 4px rgba(0,35,11,.2); content: ''; transition: transform .2s; }
      .dxbx-support-mappings-switch:checked { background: #1890ff; }
      .dxbx-support-mappings-switch:checked::after { transform: translateX(22px); }
      .dxbx-support-mappings-stats { min-height: 18px; margin: 0 0 8px; color: rgba(0,0,0,.45); font-size: 12px; }
      .dxbx-support-mappings-table { width: 100%; }
      .dxbx-support-mappings-table .ant-table-content { overflow-x: auto; }
      .dxbx-support-mappings-table table { width: 1410px; min-width: 100%; border-spacing: 0; table-layout: fixed; }
      .dxbx-support-mappings-table .ant-table-thead > tr > th { position: relative; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; background: #fafafa; color: rgba(0,0,0,.85); text-align: left; font-size: 14px; font-weight: 500; }
      .dxbx-support-mappings-table .ant-table-tbody > tr > td { position: relative; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; background: #fff; color: rgba(0,0,0,.85); vertical-align: middle; font-size: 14px; transition: background .3s; }
      .dxbx-support-mappings-table .ant-table-tbody > tr:hover > td { background: #fafafa; }
      .dxbx-support-mappings-table .ant-table-tbody > tr.not-matched > td { background: #fff1f0; }
      .dxbx-support-mappings-table .ant-table-tbody > tr.not-matched:hover > td { background: #ffccc7; }
      .dxbx-support-mapping-code { font-variant-numeric: tabular-nums; }
      .dxbx-support-mapping-cell { overflow: visible; }
      .dxbx-support-mapping-select { position: relative; display: block; width: 100%; min-width: 260px; color: rgba(0,0,0,.85); cursor: text; }
      .dxbx-support-mapping-select .ant-select-selector { position: relative; display: flex; align-items: center; width: 100%; height: 32px; border: 1px solid #d9d9d9; border-radius: 2px; padding: 0 34px 0 11px; background: #fff; transition: border-color .2s, box-shadow .2s; }
      .dxbx-support-mapping-select:hover .ant-select-selector { border-color: #40a9ff; }
      .dxbx-support-mapping-select.ant-select-focused .ant-select-selector { border-color: #40a9ff; box-shadow: 0 0 0 2px rgba(24,144,255,.2); }
      .dxbx-support-mapping-select .ant-select-selection-search { position: absolute; inset: 0 34px 0 11px; display: flex; align-items: center; }
      .dxbx-support-mapping-select .ant-select-selection-search-input { width: 100%; height: 28px; border: 0; outline: 0; background: transparent; color: rgba(0,0,0,.85); font: inherit; }
      .dxbx-support-mapping-select:not(.ant-select-focused) .ant-select-selection-search-input { color: transparent; cursor: text; }
      .dxbx-support-mapping-select .ant-select-selection-item, .dxbx-support-mapping-select .ant-select-selection-placeholder { position: relative; z-index: 1; max-width: 100%; overflow: hidden; line-height: 30px; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
      .dxbx-support-mapping-select .ant-select-selection-placeholder { color: #bfbfbf; }
      .dxbx-support-mapping-select.ant-select-focused .ant-select-selection-item, .dxbx-support-mapping-select.ant-select-focused .ant-select-selection-placeholder { visibility: hidden; }
      .dxbx-support-mapping-select .ant-select-arrow { position: absolute; top: 50%; right: 11px; z-index: 2; color: rgba(0,0,0,.25); font-size: 14px; transform: translateY(-50%); pointer-events: none; }
      .dxbx-support-mapping-select .ant-select-clear { position: absolute; top: 50%; right: 28px; z-index: 3; width: 18px; height: 18px; border: 0; padding: 0; background: #fff; color: rgba(0,0,0,.25); font-size: 15px; line-height: 18px; transform: translateY(-50%); cursor: pointer; }
      .dxbx-support-mapping-dropdown { position: absolute; top: calc(100% + 4px); left: 0; z-index: 10020; width: 100%; min-width: 320px; max-height: 260px; overflow-y: auto; border-radius: 4px; padding: 4px 0; background: #fff; box-shadow: 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05); }
      .dxbx-support-mapping-dropdown[hidden] { display: none; }
      .dxbx-support-mapping-option { display: block; width: 100%; min-height: 32px; border: 0; padding: 5px 12px; background: #fff; color: rgba(0,0,0,.85); text-align: left; font-size: 14px; line-height: 22px; cursor: pointer; }
      .dxbx-support-mapping-option:hover, .dxbx-support-mapping-option:focus { outline: 0; background: #f5f5f5; }
      .dxbx-support-mapping-hint { padding: 7px 12px; color: rgba(0,0,0,.45); font-size: 14px; }
      .dxbx-support-mapping-hint.error { color: #cf1322; }
      .dxbx-support-mappings-empty, .dxbx-support-mappings-error { padding: 32px; color: #8c8c8c; text-align: center; }
      .dxbx-support-mappings-error { color: #a8071a; }
      .dxbx-support-mappings-pagination { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin: 16px 0 0; padding: 0; color: rgba(0,0,0,.85); list-style: none; font-size: 12px; }
      .dxbx-support-mappings-pagination li { display: inline-flex; align-items: center; min-width: 24px; height: 24px; margin: 0; }
      .dxbx-support-mappings-pagination button { min-width: 24px; height: 24px; border: 1px solid transparent; border-radius: 2px; padding: 0 6px; background: transparent; color: inherit; cursor: pointer; }
      .dxbx-support-mappings-pagination .ant-pagination-item { justify-content: center; border: 1px solid transparent; border-radius: 2px; }
      .dxbx-support-mappings-pagination .ant-pagination-item-active { border-color: #1890ff; }
      .dxbx-support-mappings-pagination .ant-pagination-item-active button { color: #1890ff; }
      .dxbx-support-mappings-pagination .ant-pagination-disabled { color: rgba(0,0,0,.25); }
      .dxbx-support-mappings-pagination .ant-pagination-disabled button { cursor: default; }
      @media (max-width: 760px) {
        .dxbx-support-bottle-tools, .dxbx-support-invoice-tools { width: calc(100% - 16px); }
        .dxbx-support-bottle-body { grid-template-columns: 1fr; }
        .dxbx-support-bottle-metrics { grid-template-columns: 1fr; }
        .dxbx-support-invoice-header, .dxbx-support-invoice-actions { align-items: stretch; flex-direction: column; }
        .dxbx-support-mappings-controls { align-items: stretch; flex-direction: column; gap: 12px; }
        .dxbx-support-mappings-search { width: 100%; }
      }
    ` }));
  }


  const DATA_MATRIX_MAX_SIDE = 2400;
  const dataMatrixState = {
    busy: false,
    status: '',
    error: '',
    result: null,
    previewText: '',
  };

  registerModule({
    id: 'datamatrix',
    label: 'DataMatrix',
    render: renderDataMatrixModule,
  });

  async function renderDataMatrixModule() {
    const root = h('div');

    const fileInput = h('input', {
      type: 'file',
      accept: 'image/*',
      hidden: true,
      onchange: () => {
        const file = fileInput.files?.[0];
        if (file) void recognizeDataMatrix(file, file.name || 'файл');
        fileInput.value = '';
      },
    });
    const uploadButton = ui.button('Выбрать файл', {
      variant: 'primary',
      disabled: dataMatrixState.busy,
      onclick: () => fileInput.click(),
    });
    const pasteButton = ui.button('Вставить изображение', {
      disabled: dataMatrixState.busy,
      onclick: () => void recognizeDataMatrixFromClipboard(),
    });
    const screenButton = ui.button('Захватить экран', {
      disabled: dataMatrixState.busy,
      onclick: () => void recognizeDataMatrixFromScreen(),
    });
    const dropZone = h('div', {
      className: 'dm-drop-zone',
      text: 'Перетащите сюда изображение с DataMatrix',
      tabindex: 0,
    });
    dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.dataset.active = 'true';
    });
    dropZone.addEventListener('dragleave', () => delete dropZone.dataset.active);
    dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      delete dropZone.dataset.active;
      const file = [...(event.dataTransfer?.files || [])].find((item) => item.type.startsWith('image/'));
      if (file) void recognizeDataMatrix(file, file.name || 'drag-and-drop');
      else ui.notify('В перетаскиваемых данных нет изображения.', 'error');
    });

    root.append(ui.section('Распознать DataMatrix', '', [
      h('div', { className: 'actions' }, [uploadButton, pasteButton, screenButton, fileInput]),
      h('div', { className: 'spacer' }),
      dropZone,
    ]));

    if (dataMatrixState.busy) root.append(ui.loading(dataMatrixState.status || 'Распознаю DataMatrix…'));
    if (dataMatrixState.error) root.append(h('div', { className: 'alert error', text: dataMatrixState.error }));
    if (dataMatrixState.result) root.append(renderDataMatrixResult(dataMatrixState.result));
    if (dataMatrixState.previewText) root.append(renderGeneratedDataMatrix(dataMatrixState.previewText));
    return root;
  }

  function renderDataMatrixResult(result) {
    const visibleText = visualizeDataMatrixText(result.text);
    const copyRaw = ui.button('Скопировать как есть', {
      variant: 'primary',
      onclick: async () => {
        await copyText(result.text);
        ui.notify('Результат DataMatrix скопирован.', 'success');
      },
    });
    const regenerate = ui.button('Показать DataMatrix', {
      onclick: () => {
        dataMatrixState.previewText = result.text;
        ui.render();
      },
    });
    return ui.section('Результат', '', [
      h('pre', { className: 'result-json mono dm-result-text', text: visibleText }),
      h('div', { className: 'actions' }, [copyRaw, regenerate]),
    ]);
  }

  function renderGeneratedDataMatrix(text) {
    const canvas = h('canvas', { className: 'dm-generated-canvas', width: 320, height: 320 });
    try {
      drawDataMatrix(canvas, text);
    } catch (error) {
      return h('div', { className: 'alert error', text: `Не удалось построить DataMatrix: ${error.message}` });
    }
    const copyMark = ui.button('Скопировать марку', {
      onclick: async () => {
        await copyText(text);
        ui.notify('Марка скопирована.', 'success');
      },
    });
    const download = ui.button('Скачать PNG', {
      onclick: () => downloadDataMatrixCanvas(canvas, text),
    });
    const close = ui.button('Скрыть', {
      onclick: () => {
        dataMatrixState.previewText = '';
        ui.render();
      },
    });
    return ui.section('DataMatrix марки', '', [
      h('div', { className: 'dm-generated-wrap' }, canvas),
      h('div', { className: 'actions' }, [copyMark, download, close]),
    ]);
  }

  function showDataMatrixPreview(mark) {
    const text = String(mark || '');
    const canvas = h('canvas', { className: 'dm-generated-canvas', width: 320, height: 320 });
    try {
      drawDataMatrix(canvas, text);
    } catch (error) {
      ui.notify(error.message, 'error');
      return;
    }
    const modal = ui.modal('DataMatrix', [
      h('div', { className: 'dm-generated-wrap' }, canvas),
      h('div', { className: 'actions' }, [
        ui.button('Копировать марку', { onclick: async () => {
          await copyText(text);
          ui.notify('Марка скопирована.', 'success');
        } }),
        ui.button('Скачать PNG', { variant: 'primary', onclick: () => downloadDataMatrixCanvas(canvas, text) }),
      ]),
    ]);
    return modal;
  }

  function drawDataMatrix(canvas, text) {
    const encoded = DxbxDataMatrixCodec.encodeDataMatrix(text, 320);
    canvas.width = encoded.width;
    canvas.height = encoded.height;
    const context = canvas.getContext('2d', { alpha: false });
    const image = context.createImageData(encoded.width, encoded.height);
    for (let index = 0; index < encoded.bits.length; index += 1) {
      const color = encoded.bits[index] ? 0 : 255;
      const offset = index * 4;
      image.data[offset] = color;
      image.data[offset + 1] = color;
      image.data[offset + 2] = color;
      image.data[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }

  function downloadDataMatrixCanvas(canvas, text) {
    const link = h('a', {
      download: `datamatrix_${safeFilePart(text.slice(0, 20)) || 'mark'}.png`,
      href: canvas.toDataURL('image/png'),
    });
    Object.assign(link.style, { position: 'fixed', left: '-9999px' });
    document.body.append(link);
    link.click();
    link.remove();
  }

  function safeFilePart(value) {
    return String(value || '').replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '');
  }

  function visualizeDataMatrixText(value) {
    return String(value || '')
      .replace(/\u001d/g, '␝')
      .replace(/[\u0000-\u001c\u001e-\u001f]/g, (char) => `\\x${char.charCodeAt(0).toString(16).padStart(2, '0')}`);
  }

  function normalizeRecognizedMark(value) {
    return String(value || '').replace(/^\]d[0-9]/i, '').replace(/^\u001d/, '').trim();
  }

  async function recognizeDataMatrix(source, sourceLabel) {
    dataMatrixState.busy = true;
    dataMatrixState.status = 'Готовлю изображение…';
    dataMatrixState.error = '';
    dataMatrixState.result = null;
    dataMatrixState.previewText = '';
    ui.render();
    try {
      const canvas = source instanceof HTMLCanvasElement ? source : await imageSourceToCanvas(source);
      dataMatrixState.status = 'Ищу DataMatrix…';
      ui.render();
      const decoded = await decodeDataMatrixCanvas(canvas);
      dataMatrixState.result = { ...decoded, sourceLabel };
      dataMatrixState.previewText = decoded.text;
    } catch (error) {
      dataMatrixState.error = error.message || String(error);
    } finally {
      dataMatrixState.busy = false;
      dataMatrixState.status = '';
      ui.render();
    }
  }

  async function decodeDataMatrixCanvas(canvas) {
    const native = await decodeWithNativeBarcodeDetector(canvas);
    if (native) return native;

    const candidates = [canvas, rotateCanvas(canvas, 90), rotateCanvas(canvas, 180), rotateCanvas(canvas, 270)];
    let lastError;
    for (const candidate of candidates) {
      try {
        const context = candidate.getContext('2d', { willReadFrequently: true });
        const image = context.getImageData(0, 0, candidate.width, candidate.height);
        const decoded = DxbxDataMatrixCodec.decodeDataMatrixRgba(image.data, candidate.width, candidate.height);
        return { text: decoded.text, decoder: 'ZXing (локально)', format: decoded.format };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('DataMatrix не найден.');
  }

  async function decodeWithNativeBarcodeDetector(canvas) {
    if (typeof BarcodeDetector !== 'function' || typeof BarcodeDetector.getSupportedFormats !== 'function') return null;
    try {
      const formats = await BarcodeDetector.getSupportedFormats();
      if (!formats.includes('data_matrix')) return null;
      const results = await new BarcodeDetector({ formats: ['data_matrix'] }).detect(canvas);
      const match = results.find((item) => item.format === 'data_matrix' && item.rawValue);
      return match ? { text: match.rawValue, decoder: 'BarcodeDetector (локально)', format: 'DATA_MATRIX' } : null;
    } catch {
      return null;
    }
  }

  async function imageSourceToCanvas(source) {
    let bitmap;
    try {
      bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });
    } catch {
      bitmap = await createImageBitmap(source);
    }
    try {
      const largest = Math.max(bitmap.width, bitmap.height);
      const scale = Math.min(1, DATA_MATRIX_MAX_SIDE / largest);
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = h('canvas', { width, height });
      canvas.getContext('2d', { alpha: false }).drawImage(bitmap, 0, 0, width, height);
      return canvas;
    } finally {
      bitmap.close();
    }
  }

  function rotateCanvas(source, degrees) {
    const swap = degrees % 180 !== 0;
    const canvas = h('canvas', {
      width: swap ? source.height : source.width,
      height: swap ? source.width : source.height,
    });
    const context = canvas.getContext('2d', { alpha: false });
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(source, -source.width / 2, -source.height / 2);
    return canvas;
  }

  async function recognizeDataMatrixFromClipboard() {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((candidate) => candidate.startsWith('image/'));
        if (!type) continue;
        const blob = await item.getType(type);
        await recognizeDataMatrix(blob, 'буфер обмена');
        return;
      }
      ui.notify('В буфере обмена нет изображения.', 'error');
    } catch (error) {
      ui.notify(error.name === 'NotAllowedError' ? 'Браузер не разрешил чтение изображения из буфера.' : error.message, 'error');
    }
  }

  async function recognizeDataMatrixFromScreen() {
    let stream;
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) throw new Error('Захват экрана недоступен в этом браузере.');
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false,
        preferCurrentTab: true,
      });
      const frame = await captureDisplayFrame(stream);
      const crop = await selectDataMatrixRegion(frame);
      await recognizeDataMatrix(crop, 'область экрана');
    } catch (error) {
      if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') ui.notify(error.message, 'error');
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
    }
  }

  async function captureDisplayFrame(stream) {
    const video = h('video', { muted: true, playsInline: true });
    video.srcObject = stream;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise((resolve) => video.addEventListener('loadedmetadata', resolve, { once: true }));
    }
    await video.play();
    if (!video.videoWidth || !video.videoHeight) throw new Error('Не удалось получить кадр экрана.');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const canvas = h('canvas', { width: video.videoWidth, height: video.videoHeight });
    canvas.getContext('2d', { alpha: false }).drawImage(video, 0, 0);
    video.pause();
    video.srcObject = null;
    return canvas;
  }

  function selectDataMatrixRegion(source) {
    return new Promise((resolve, reject) => {
      const overlay = h('div', { className: 'dxbx-dm-crop-overlay' });
      const stage = h('div', { className: 'dxbx-dm-crop-stage' });
      const selection = h('div', { className: 'dxbx-dm-crop-selection', hidden: true });
      const hint = h('div', { className: 'dxbx-dm-crop-hint', text: 'Выделите DataMatrix. Esc — отмена.' });
      const fullButton = h('button', { type: 'button', text: 'Распознать весь кадр', className: 'dxbx-dm-crop-button' });
      const cancelButton = h('button', { type: 'button', text: 'Отмена', className: 'dxbx-dm-crop-button secondary' });
      const actions = h('div', { className: 'dxbx-dm-crop-actions' }, [fullButton, cancelButton]);
      stage.append(source, selection);
      overlay.append(hint, stage, actions);
      document.documentElement.append(overlay);

      let start = null;
      const finish = (value, error) => {
        overlay.remove();
        document.removeEventListener('keydown', onKeydown, true);
        if (error) reject(error);
        else resolve(value);
      };
      const onKeydown = (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        finish(null, new DOMException('Отменено', 'AbortError'));
      };
      const localPoint = (event) => {
        const bounds = source.getBoundingClientRect();
        return {
          x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
          y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top)),
          bounds,
        };
      };
      const updateSelection = (point) => {
        const left = Math.min(start.x, point.x);
        const top = Math.min(start.y, point.y);
        Object.assign(selection.style, {
          left: `${left}px`,
          top: `${top}px`,
          width: `${Math.abs(point.x - start.x)}px`,
          height: `${Math.abs(point.y - start.y)}px`,
        });
      };
      source.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        source.setPointerCapture(event.pointerId);
        start = localPoint(event);
        selection.hidden = false;
        updateSelection(start);
      });
      source.addEventListener('pointermove', (event) => {
        if (!start) return;
        updateSelection(localPoint(event));
      });
      source.addEventListener('pointerup', (event) => {
        if (!start) return;
        const end = localPoint(event);
        const left = Math.min(start.x, end.x);
        const top = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);
        if (width < 12 || height < 12) {
          start = null;
          selection.hidden = true;
          return;
        }
        const scaleX = source.width / end.bounds.width;
        const scaleY = source.height / end.bounds.height;
        finish(cropCanvas(source, left * scaleX, top * scaleY, width * scaleX, height * scaleY));
      });
      fullButton.addEventListener('click', () => finish(source));
      cancelButton.addEventListener('click', () => finish(null, new DOMException('Отменено', 'AbortError')));
      document.addEventListener('keydown', onKeydown, true);
    });
  }

  function cropCanvas(source, x, y, width, height) {
    const target = h('canvas', { width: Math.round(width), height: Math.round(height) });
    target.getContext('2d', { alpha: false }).drawImage(
      source,
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height),
      0,
      0,
      target.width,
      target.height,
    );
    return target;
  }

  function installDataMatrixStyles() {
    if (document.getElementById('dxbx-support-datamatrix-style')) return;
    document.head.append(h('style', { id: 'dxbx-support-datamatrix-style', text: `
      .dxbx-dm-crop-overlay { position: fixed; inset: 0; z-index: 2147483647; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px; background: rgba(0,0,0,.88); font: 14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
      .dxbx-dm-crop-stage { position: relative; max-width: 100%; max-height: calc(100vh - 110px); }
      .dxbx-dm-crop-stage canvas { display: block; max-width: 100%; max-height: calc(100vh - 110px); width: auto; height: auto; cursor: crosshair; }
      .dxbx-dm-crop-selection { position: absolute; pointer-events: none; border: 2px solid #52c41a; background: rgba(82,196,26,.14); box-shadow: 0 0 0 9999px rgba(0,0,0,.34); }
      .dxbx-dm-crop-selection[hidden] { display: none; }
      .dxbx-dm-crop-hint { color: #fff; font-weight: 700; }
      .dxbx-dm-crop-actions { display: flex; gap: 8px; }
      .dxbx-dm-crop-button { border: 0; border-radius: 8px; padding: 8px 13px; background: #1677ff; color: #fff; cursor: pointer; font: inherit; font-weight: 600; }
      .dxbx-dm-crop-button.secondary { background: #595959; }
    ` }));
  }

  installDataMatrixStyles();


  const EGAIS_RECEIPT_STATUSES = [
    ['ERROR', 'Ошибка'],
    ['INTERMEDIATE_SENT', 'Промежуточно отправлен'],
    ['AWAITING_FOR_DISPATCH', 'Ожидает отправки'],
    ['SENT', 'Отправлен'],
    ['NOT_REQUIRED_SENT', 'Отправка не требуется'],
  ];
  const EGAIS_ACT_STATUSES = [
    ['SEND_ERROR', 'Ошибка отправки'],
    ['REJECTED', 'Не принят ЕГАИС'],
    ['NEED_AUTOCORRECTION', 'Нужна автокорректировка'],
    ['DRAFT', 'Черновик'],
    ['PENDING', 'Ожидает отправки'],
    ['SENT', 'Отправлен'],
    ['ACCEPTED', 'Принят ЕГАИС'],
    ['REPEALED', 'Отменён ЕГАИС'],
  ];

  const actPageState = {
    actId: '',
    legalPersonId: null,
    itemsPromise: null,
  };

  function getActPageId() {
    return `${location.pathname}/${location.hash}`.match(/\/acts\/(\d+)/)?.[1] || '';
  }

  function resetActPageState(actId) {
    if (actPageState.actId === actId) return;
    actPageState.actId = actId;
    actPageState.legalPersonId = null;
    actPageState.itemsPromise = null;
  }

  async function getActPageItems(actId, { force = false } = {}) {
    resetActPageState(String(actId));
    if (!force && actPageState.itemsPromise) return actPageState.itemsPromise;
    actPageState.itemsPromise = request(`/api/front/egais/writeoffdocuments/acts/${actId}/items/volumetric`)
      .then(({ data }) => Array.isArray(data) ? data : [])
      .catch((error) => {
        actPageState.itemsPromise = null;
        throw error;
      });
    return actPageState.itemsPromise;
  }

  async function getActPageLegalPersonId(actId) {
    resetActPageState(String(actId));
    if (actPageState.legalPersonId) return actPageState.legalPersonId;
    const { data } = await request(`/api/front/egais/writeoffdocuments/acts/${actId}`);
    const legalPersonId = Number(data?.legalPerson?.id);
    actPageState.legalPersonId = Number.isSafeInteger(legalPersonId) && legalPersonId > 0 ? legalPersonId : null;
    return actPageState.legalPersonId;
  }

  function enhanceActPage() {
    const actId = getActPageId();
    if (!actId) return;
    resetActPageState(actId);
    const table = document.querySelector('[data-testid="act-volume-table"]');
    if (!table) return;
    installActPageToolbar(table, actId);
    void Promise.all([getActPageItems(actId), getActPageLegalPersonId(actId)])
      .then(([items, legalPersonId]) => {
        enhanceActTopRows(items, legalPersonId);
        enhanceActExpandedRows(items, legalPersonId);
      })
      .catch((error) => console.warn('[DXBX Support Toolkit] Не удалось расширить страницу акта', error));
  }

  function installActPageToolbar(table, actId) {
    const existing = document.querySelector('.dxbx-support-act-toolbar');
    if (existing?.dataset.actId === String(actId)) return;
    existing?.remove();
    const make = (label, action, kind = '') => {
      const button = h('button', {
        className: 'dxbx-support-rests-button',
        type: 'button',
        text: label,
        dataset: kind ? { kind } : undefined,
        onclick: () => void runActPageAction(button, action),
      });
      return button;
    };
    const toolbar = h('div', { className: 'dxbx-support-rests-toolbar dxbx-support-act-toolbar', dataset: { actId } }, [
      make('Марки TXT', () => downloadActMarks(actId)),
      make('Объём ≤ ЕГАИС', () => limitActVolumesToEgais(actId)),
      make('Объёмы ↓ XML', () => updateActVolumesFromXml(actId, true)),
      make('Объёмы = XML', () => updateActVolumesFromXml(actId, false)),
      make('Удалить вне XML', () => deleteActItemsOutsideXml(actId), 'danger'),
    ]);
    const title = table.querySelector('.ant-table-title');
    if (title) title.append(toolbar);
    else table.before(toolbar);
  }

  function enhanceActTopRows(items, legalPersonId) {
    if (!legalPersonId) return;
    const byId = new Map(items.map((item) => [String(item.id), item]));
    const table = document.querySelector('[data-testid="act-volume-table"]');
    for (const row of table?.querySelectorAll('tbody > tr[data-row-key]') || []) {
      if (row.closest('[data-testid="act-volume-expanded-table"]')) continue;
      const item = byId.get(String(row.dataset.rowKey || ''));
      if (!item?.mark) continue;
      const cells = [...row.querySelectorAll(':scope > td')];
      const anchor = cells[1] || cells[0];
      if (!anchor) continue;
      const existing = anchor.querySelector('.dxbx-support-act-egais-volume');
      if (existing?.dataset.mark === item.mark) continue;
      existing?.remove();
      const meta = h('span', {
        className: 'dxbx-support-rests-meta dxbx-support-act-egais-volume',
        text: 'ЕГАИС: …',
        dataset: { mark: item.mark },
      });
      anchor.append(meta);
      enqueueBottleResolution(async () => {
        try {
          const bottle = await resolveBottleByMark(legalPersonId, item.mark);
          if (!meta.isConnected) return;
          const egaisVolume = Number(bottle?.egaisVolume);
          const hasVolume = Number.isFinite(egaisVolume);
          const content = hasVolume ? `ЕГАИС: ${egaisVolume} мл` : 'ЕГАИС: —';
          if (bottle?.DT_RowId) {
            meta.replaceWith(h('a', {
              className: `dxbx-support-rests-meta dxbx-support-act-egais-volume${hasVolume && egaisVolume < Number(item.volume) ? ' warning' : ''}`,
              href: `${location.origin}${BOTTLE_EDIT_PATH}${bottle.DT_RowId}`,
              target: '_blank', rel: 'noopener noreferrer', text: content,
              title: hasVolume && egaisVolume < Number(item.volume) ? `В акте ${item.volume} мл` : '',
              dataset: { mark: item.mark },
            }));
          } else {
            meta.textContent = content;
          }
        } catch (error) {
          meta.textContent = 'ЕГАИС: !';
          meta.title = error.message;
        }
      });
    }
  }

  async function runActPageAction(button, action) {
    if (button.dataset.busy === 'true') return;
    const original = button.textContent;
    button.dataset.busy = 'true';
    try {
      const result = await action((text) => { button.textContent = text; });
      if (result?.message) ui.notify(result.message, result.errors ? 'error' : 'success', 6000);
      if (result?.changed) setTimeout(() => location.reload(), 500);
    } catch (error) {
      ui.notify(error.message, 'error', 6000);
    } finally {
      button.textContent = original;
      delete button.dataset.busy;
    }
  }

  function enhanceActExpandedRows(items, legalPersonId) {
    const byId = new Map(items.map((item) => [String(item.id), item]));
    for (const table of document.querySelectorAll('[data-testid="act-volume-expanded-table"]')) {
      for (const row of table.querySelectorAll('tbody > tr[data-row-key], tbody > tr')) {
        const item = byId.get(String(row.dataset.rowKey || ''));
        const mark = item?.mark || readActExpandedMark(row);
        if (!mark) continue;
        const cells = [...row.querySelectorAll(':scope > td')];
        const markCell = cells.find((cell) => looksLikeStrongRestsMark(getCellTextWithoutToolkit(cell)));
        if (!markCell) continue;
        const existing = markCell.querySelector('.dxbx-support-rests-actions');
        if (existing?.dataset.mark === mark) continue;
        existing?.remove();
        const bottleLink = h('span', { className: 'dxbx-support-rests-link', text: 'ЕГАИС', dataset: { state: 'loading' } });
        const actions = h('div', { className: 'dxbx-support-rests-actions', dataset: { mark } }, [
          bottleLink,
          inlineButton('DataMatrix', () => showDataMatrixPreview(mark)),
          inlineButton('Копировать', () => void copyText(mark)),
        ]);
        markCell.append(actions);
        if (!legalPersonId) {
          bottleLink.dataset.state = 'error';
          bottleLink.title = 'Не определено юридическое лицо акта';
          continue;
        }
        enqueueBottleResolution(async () => {
          try {
            const bottle = await resolveBottleByMark(legalPersonId, mark);
            if (!bottleLink.isConnected) return;
            if (!bottle?.DT_RowId) {
              bottleLink.dataset.state = 'missing';
              bottleLink.title = 'Бутылка не найдена';
              return;
            }
            bottleLink.replaceWith(h('a', {
              className: 'dxbx-support-rests-link',
              href: `${location.origin}${BOTTLE_EDIT_PATH}${bottle.DT_RowId}`,
              target: '_blank', rel: 'noopener noreferrer', text: 'ЕГАИС ↗',
            }));
          } catch (error) {
            bottleLink.dataset.state = 'error';
            bottleLink.title = error.message;
          }
        });
      }
    }
  }

  function readActExpandedMark(row) {
    for (const cell of row.querySelectorAll(':scope > td')) {
      const value = getCellTextWithoutToolkit(cell);
      if (looksLikeStrongRestsMark(value)) return value;
    }
    return '';
  }

  function parseWriteOffXml(xmlText) {
    const documentNode = new DOMParser().parseFromString(String(xmlText || ''), 'text/xml');
    if (documentNode.querySelector('parsererror')) throw new Error('Некорректный XML.');
    const positions = [...documentNode.getElementsByTagName('*')].filter((node) => node.localName === 'Position');
    return positions.map((position) => {
      let mark = '';
      let volume = null;
      for (const node of position.getElementsByTagName('*')) {
        if (node.localName === 'amc') mark = node.textContent?.trim() || '';
        if (node.localName === 'volume') {
          const value = Number.parseInt(node.textContent?.trim() || '', 10);
          volume = Number.isInteger(value) ? value : null;
        }
      }
      return { mark, volume };
    }).filter((item) => item.mark);
  }

  function selectActXmlFile() {
    return new Promise((resolve) => {
      const input = h('input', { type: 'file', accept: '.xml,text/xml,application/xml' });
      input.addEventListener('change', () => resolve(input.files?.[0] || null), { once: true });
      input.click();
    });
  }

  async function readActXml() {
    const file = await selectActXmlFile();
    if (!file) return null;
    const positions = parseWriteOffXml(await file.text());
    if (!positions.length) throw new Error('В XML нет позиций с марками.');
    return positions;
  }

  async function downloadActMarks(actId, progress) {
    progress('Загрузка…');
    const items = await getActPageItems(actId, { force: true });
    const marks = items.map((item) => item.mark).filter(Boolean);
    if (!marks.length) throw new Error('В акте нет марок.');
    downloadBlob(new Blob([marks.join('\n')], { type: 'text/plain;charset=utf-8' }), `marks_act_${actId}.txt`);
    return { message: `Марок: ${marks.length}` };
  }

  async function updateActVolumesFromXml(actId, onlyDecrease, progress) {
    const positions = await readActXml();
    if (!positions) return null;
    progress('Сравнение…');
    const xmlVolumes = new Map(positions.filter((item) => item.volume !== null).map((item) => [item.mark, item.volume]));
    const items = await getActPageItems(actId, { force: true });
    const changes = items.filter((item) => {
      const next = xmlVolumes.get(item.mark);
      if (!Number.isInteger(next)) return false;
      const current = Number(item.volume);
      return Number.isFinite(current) && (onlyDecrease ? current > next : current !== next);
    }).map((item) => ({ item, volume: xmlVolumes.get(item.mark) }));
    if (!changes.length) return { message: 'Изменений нет.' };
    if (!confirm(`${onlyDecrease ? 'Уменьшить' : 'Изменить'} объём у ${changes.length} позиций?`)) return null;
    let changed = 0;
    let errors = 0;
    for (let index = 0; index < changes.length; index += 1) {
      const { item, volume } = changes[index];
      progress(`${index + 1}/${changes.length}`);
      try {
        await request(`/api/front/egais/writeoffdocuments/acts/${actId}/items/${item.id}/volumetric`, {
          method: 'PUT', body: { volume },
        });
        changed += 1;
      } catch {
        errors += 1;
      }
    }
    actPageState.itemsPromise = null;
    return { changed, errors, message: `Изменено: ${changed}${errors ? ` · ошибок: ${errors}` : ''}` };
  }

  async function limitActVolumesToEgais(actId, progress) {
    progress('Сравнение…');
    const [items, legalPersonId] = await Promise.all([
      getActPageItems(actId, { force: true }),
      getActPageLegalPersonId(actId),
    ]);
    if (!legalPersonId) throw new Error('Не определено юридическое лицо акта.');
    const changes = [];
    for (let index = 0; index < items.length; index += 4) {
      const chunk = items.slice(index, index + 4);
      progress(`${Math.min(index + chunk.length, items.length)}/${items.length}`);
      const bottles = await Promise.all(chunk.map((item) => item.mark ? resolveBottleByMark(legalPersonId, item.mark).catch(() => null) : null));
      chunk.forEach((item, offset) => {
        const egaisVolume = Number(bottles[offset]?.egaisVolume);
        const currentVolume = Number(item.volume);
        if (Number.isFinite(egaisVolume) && Number.isFinite(currentVolume) && egaisVolume >= 0 && egaisVolume < currentVolume) {
          changes.push({ item, volume: egaisVolume });
        }
      });
    }
    if (!changes.length) return { message: 'Корректировать нечего.' };
    if (!confirm(`Уменьшить объём у ${changes.length} позиций до текущего объёма ЕГАИС?`)) return null;
    let changed = 0;
    let errors = 0;
    for (let index = 0; index < changes.length; index += 1) {
      progress(`${index + 1}/${changes.length}`);
      const { item, volume } = changes[index];
      try {
        await request(`/api/front/egais/writeoffdocuments/acts/${actId}/items/${item.id}/volumetric`, {
          method: 'PUT', body: { volume },
        });
        changed += 1;
      } catch {
        errors += 1;
      }
    }
    actPageState.itemsPromise = null;
    return { changed, errors, message: `Изменено: ${changed}${errors ? ` · ошибок: ${errors}` : ''}` };
  }

  async function deleteActItemsOutsideXml(actId, progress) {
    const positions = await readActXml();
    if (!positions) return null;
    progress('Сравнение…');
    const xmlMarks = new Set(positions.map((item) => item.mark));
    const items = await getActPageItems(actId, { force: true });
    const toDelete = items.filter((item) => item.mark && !xmlMarks.has(item.mark));
    if (!toDelete.length) return { message: 'Удалять нечего.' };
    if (!confirm(`Удалить из акта ${toDelete.length} позиций, которых нет в XML?`)) return null;
    let changed = 0;
    let errors = 0;
    for (let index = 0; index < toDelete.length; index += 1) {
      progress(`${index + 1}/${toDelete.length}`);
      try {
        await request(`/api/front/egais/writeoffdocuments/acts/${actId}/items/${toDelete[index].id}`, { method: 'DELETE' });
        changed += 1;
      } catch {
        errors += 1;
      }
    }
    actPageState.itemsPromise = null;
    return { changed, errors, message: `Удалено: ${changed}${errors ? ` · ошибок: ${errors}` : ''}` };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const egaisCleanupState = {
    kind: 'receipts',
    legalPersonPublicId: app.selectedLegalPersonPublicId,
    cutoff: formatDateForInput(yesterday),
    statuses: new Set(['ERROR']),
    items: [],
    selectedIds: new Set(),
    totalBeforeCutoff: 0,
    busy: false,
    progress: '',
    error: '',
  };

  registerModule({
    id: 'writeoff',
    label: 'Чеки/акты',
    async render() {
      const profile = await getProfile();
      if (!egaisCleanupState.legalPersonPublicId) egaisCleanupState.legalPersonPublicId = app.selectedLegalPersonPublicId;
      const root = h('div');

      const kindSelect = h('select', { className: 'control' }, [
        h('option', { value: 'receipts', text: 'Чеки', selected: egaisCleanupState.kind === 'receipts' }),
        h('option', { value: 'acts', text: 'Акты списания', selected: egaisCleanupState.kind === 'acts' }),
      ]);
      const lpSelect = ui.legalPersonSelect(profile, egaisCleanupState.legalPersonPublicId);
      const cutoffInput = h('input', { className: 'control', type: 'date', value: egaisCleanupState.cutoff });
      kindSelect.addEventListener('change', () => {
        egaisCleanupState.kind = kindSelect.value;
        egaisCleanupState.statuses = new Set(kindSelect.value === 'receipts' ? ['ERROR'] : ['SEND_ERROR', 'REJECTED']);
        resetEgaisResults();
        ui.render();
      });
      lpSelect.addEventListener('change', () => {
        egaisCleanupState.legalPersonPublicId = lpSelect.value;
        setSelectedLegalPerson(lpSelect.value);
        resetEgaisResults();
      });

      const statuses = egaisCleanupState.kind === 'receipts' ? EGAIS_RECEIPT_STATUSES : EGAIS_ACT_STATUSES;
      const statusGroup = h('div', { className: 'check-group' });
      for (const [code, label] of statuses) {
        const checkbox = h('input', { type: 'checkbox', value: code, checked: egaisCleanupState.statuses.has(code) });
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) egaisCleanupState.statuses.add(code);
          else egaisCleanupState.statuses.delete(code);
        });
        statusGroup.append(h('label', { className: 'check' }, [checkbox, label]));
      }

      const searchButton = ui.button('Найти документы', {
        variant: 'primary',
        disabled: egaisCleanupState.busy,
        onclick: async () => {
          egaisCleanupState.legalPersonPublicId = lpSelect.value;
          egaisCleanupState.cutoff = cutoffInput.value;
          setSelectedLegalPerson(lpSelect.value);
          await searchEgaisCleanup(profile);
        },
      });

      const filters = h('div', { className: 'grid' }, [
        ui.field('Тип документов', kindSelect),
        ui.field('Юридическое лицо', lpSelect),
        ui.field('Только старше даты', cutoffInput),
        ui.field('Статусы', statusGroup),
      ]);
      root.append(ui.section('Поиск проблемных документов', '', [filters, h('div', { className: 'spacer' }), searchButton]));

      if (egaisCleanupState.error) root.append(h('div', { className: 'alert error', text: egaisCleanupState.error }));
      if (egaisCleanupState.progress) root.append(h('div', { className: 'alert', text: egaisCleanupState.progress }));
      if (egaisCleanupState.busy) root.append(ui.loading('Выполняется операция...'));
      if (egaisCleanupState.items.length) root.append(renderEgaisResults());
      else if (egaisCleanupState.totalBeforeCutoff > 0 && !egaisCleanupState.busy) {
        root.append(h('div', { className: 'alert success', text: 'По выбранной дате документов для обработки нет.' }));
      }
      return root;
    },
  });

  function resetEgaisResults() {
    egaisCleanupState.items = [];
    egaisCleanupState.selectedIds.clear();
    egaisCleanupState.totalBeforeCutoff = 0;
    egaisCleanupState.error = '';
    egaisCleanupState.progress = '';
  }

  function getEgaisColumns(kind) {
    const data = kind === 'receipts'
      ? ['createDate', 'legalPerson', 'type', 'identity', 'date', 'status']
      : ['createDate', 'legalPerson', 'type', 'typeWriteOff', 'number', 'date', 'status', 'egaisComment'];
    return data.map((name) => ({
      data: name,
      name: '',
      searchable: name !== 'legalPerson' && name !== 'egaisComment',
      orderable: name !== 'egaisComment',
      search: { value: '', regex: false },
    }));
  }

  async function searchEgaisCleanup(profile) {
    const legalPerson = (profile.legalPersons || []).find((item) => item.publicId === egaisCleanupState.legalPersonPublicId);
    if (!legalPerson) {
      egaisCleanupState.error = 'Юридическое лицо не найдено в профиле.';
      ui.render();
      return;
    }
    if (!egaisCleanupState.cutoff || egaisCleanupState.statuses.size === 0) {
      egaisCleanupState.error = 'Укажите дату и хотя бы один статус.';
      ui.render();
      return;
    }

    resetEgaisResults();
    egaisCleanupState.busy = true;
    egaisCleanupState.progress = 'Запрашиваю документы...';
    ui.render();
    try {
      const kind = egaisCleanupState.kind;
      const endpoint = kind === 'receipts'
        ? '/api/front/egais/writeoffdocuments/receipts/search'
        : '/api/front/egais/writeoffdocuments/acts/search';
      const payload = {
        columns: getEgaisColumns(kind),
        order: [{ column: 'date', dir: 'desc' }],
        start: 0,
        length: 1000,
        search: { value: '', regex: false },
        model: kind === 'receipts' ? 'egaisreceipt' : 'egaisact',
        simpleCrit: {
          crits: [{ attr: 'status', oper: 'IN', value: [...egaisCleanupState.statuses], clauses: [] }],
        },
        legalPersonIds: [legalPerson.id],
      };
      const { data } = await request(endpoint, { method: 'POST', body: payload });
      const raw = Array.isArray(data?.items) ? data.items : Array.isArray(data?.data) ? data.data : [];
      const cutoff = new Date(`${egaisCleanupState.cutoff}T00:00:00`);
      egaisCleanupState.totalBeforeCutoff = raw.length;
      egaisCleanupState.items = raw
        .map((item) => ({ ...item, id: item.id ?? item.DT_RowId }))
        .filter((item) => {
          const itemDate = parseDxbxDate(item.date);
          return itemDate && itemDate < cutoff;
        });
      egaisCleanupState.progress = `Получено: ${raw.length}. Старше выбранной даты: ${egaisCleanupState.items.length}.`;
    } catch (error) {
      egaisCleanupState.error = error.message;
    } finally {
      egaisCleanupState.busy = false;
      ui.render();
    }
  }

  function renderEgaisResults() {
    const section = ui.section(`Результаты · ${egaisCleanupState.items.length}`, '');
    const table = h('table');
    const selectAll = h('input', { type: 'checkbox' });
    selectAll.addEventListener('change', () => {
      egaisCleanupState.selectedIds.clear();
      if (selectAll.checked) {
        for (const item of egaisCleanupState.items) if (item._result !== 'done') egaisCleanupState.selectedIds.add(String(item.id));
      }
      ui.render();
    });
    table.append(h('thead', {}, h('tr', {}, [
      h('th', {}, selectAll),
      h('th', { text: 'Документ' }),
      h('th', { text: 'Дата' }),
      h('th', { text: 'Статус' }),
      h('th', { text: 'Действие' }),
    ])));
    const body = h('tbody');
    for (const item of egaisCleanupState.items) {
      const id = String(item.id);
      const checkbox = h('input', {
        type: 'checkbox',
        checked: egaisCleanupState.selectedIds.has(id),
        disabled: item._result === 'done' || egaisCleanupState.busy,
      });
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) egaisCleanupState.selectedIds.add(id);
        else egaisCleanupState.selectedIds.delete(id);
        ui.render();
      });
      const href = egaisCleanupState.kind === 'receipts'
        ? frontendUrl(`/egais/documents-writeoff/checks/${id}`)
        : frontendUrl(`/egais/documents-writeoff/acts/${id}`);
      const title = item.number || item.identity || `${egaisCleanupState.kind === 'receipts' ? 'Чек' : 'Акт'} #${id}`;
      const action = ui.button(item._result === 'done' ? 'Удалён' : 'Удалить', {
        variant: 'danger',
        small: true,
        disabled: item._result === 'done' || egaisCleanupState.busy,
        onclick: async () => {
          if (!confirm(`Удалить ${title}? Это действие нельзя отменить через toolkit.`)) return;
          await runEgaisDelete([item]);
        },
      });
      const row = h('tr', { className: item._result === 'done' ? 'done' : item._result === 'failed' ? 'failed' : '' }, [
        h('td', {}, checkbox),
        h('td', {}, [h('a', { href, target: '_blank', rel: 'noopener', text: title }), h('div', { className: 'muted mono', text: `ID ${id}` })]),
        h('td', { text: item.date || '—' }),
        h('td', {}, [h('span', { className: 'badge', text: item.status || '—' }), item._error ? h('div', { className: 'muted', text: item._error }) : null]),
        h('td', {}, action),
      ]);
      body.append(row);
    }
    table.append(body);
    section.append(h('div', { className: 'table-wrap' }, table));

    const confirmation = h('input', {
      className: 'control',
      placeholder: `УДАЛИТЬ ${egaisCleanupState.selectedIds.size}`,
      autocomplete: 'off',
    });
    const bulkButton = ui.button('Удалить отмеченные', {
      variant: 'danger',
      disabled: true,
      onclick: async () => {
        const selected = egaisCleanupState.items.filter((item) => egaisCleanupState.selectedIds.has(String(item.id)) && item._result !== 'done');
        await runEgaisDelete(selected);
      },
    });
    confirmation.addEventListener('input', () => {
      const count = egaisCleanupState.selectedIds.size;
      bulkButton.disabled = egaisCleanupState.busy || count === 0 || count > 100 || confirmation.value !== `УДАЛИТЬ ${count}`;
    });
    const limitWarning = egaisCleanupState.selectedIds.size > 100
      ? h('div', { className: 'alert error', text: 'За одну операцию можно удалить не более 100 документов.' })
      : null;
    section.append(h('div', { className: 'spacer' }), h('div', { className: 'grid' }, [
      ui.field('Подтверждение', confirmation, `Введите: УДАЛИТЬ ${egaisCleanupState.selectedIds.size}`),
      h('div', { className: 'actions' }, bulkButton),
    ]));
    if (limitWarning) section.append(limitWarning);
    return section;
  }

  async function runEgaisDelete(items) {
    if (!items.length || items.length > 100) return;
    egaisCleanupState.busy = true;
    egaisCleanupState.error = '';
    let completed = 0;
    for (const item of items) {
      egaisCleanupState.progress = `Удаление: ${completed}/${items.length}. Текущий ID: ${item.id}`;
      try {
        await deleteEgaisItem(item);
        item._result = 'done';
        egaisCleanupState.selectedIds.delete(String(item.id));
      } catch (error) {
        item._result = 'failed';
        item._error = error.message;
      }
      completed += 1;
      if (items.length > 1) await sleep(150);
    }
    egaisCleanupState.busy = false;
    egaisCleanupState.progress = `Готово: обработано ${completed}. Успешно ${items.filter((item) => item._result === 'done').length}.`;
    ui.render();
  }

  async function deleteEgaisItem(item) {
    if (egaisCleanupState.kind === 'acts') {
      await request(`/api/front/egais/writeoffdocuments/acts/${item.id}`, { method: 'DELETE' });
      return;
    }
    let identity = item.identity;
    if (!identity) {
      const { data } = await request(`/api/front/egais/writeoffdocuments/receipts/${item.id}`);
      identity = data?.identity;
    }
    const legalPersonId = item.legalPerson?.id;
    if (!identity || !legalPersonId) throw new Error('Не удалось определить identity или legalPerson.id');
    await request(`/api/front/egais/legalpersons/${legalPersonId}/writeoffdocuments/receipts/${encodeURIComponent(identity)}/remove`, {
      method: 'DELETE',
    });
  }


  function installRouteListener() {
    let previousUrl = location.href;
    let scheduled = false;
    const check = () => {
      scheduled = false;
      if (location.href === previousUrl) return;
      previousUrl = location.href;
      app.routeVersion += 1;
      for (const module of app.modules.values()) module.onRouteChange?.();
      if (ui.open) ui.render();
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(check);
    };

    window.addEventListener('popstate', schedule);
    window.addEventListener('hashchange', schedule);
    document.addEventListener('click', schedule, true);
    document.addEventListener('submit', schedule, true);
    if (window.navigation?.addEventListener) window.navigation.addEventListener('navigate', schedule);
  }

  function boot() {
    ui.mount();
    installRouteListener();
    for (const module of app.modules.values()) module.init?.();
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.shiftKey && event.code === 'KeyD' && !event.repeat) {
        event.preventDefault();
        ui.toggle();
      }
    });
    try {
      GM_registerMenuCommand('DXBX Support Toolkit: открыть', () => ui.show());
    } catch (error) {
      console.warn('[DXBX Support Toolkit] Не удалось зарегистрировать меню', error);
    }
    globalThis.__DXBX_SUPPORT_TOOLKIT_V2__ = Object.freeze({
      version: VERSION,
      open: () => ui.show(),
      close: () => ui.hide(),
    });
    console.info(`[DXBX Support Toolkit] v${VERSION} готов. Alt+Shift+D`);
  }

  boot();

})();
