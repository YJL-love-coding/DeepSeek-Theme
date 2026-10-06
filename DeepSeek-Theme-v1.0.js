// ==UserScript==
// @name         DeepSeek 美化 v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  液态玻璃皮肤 + 自定义背景图 + 侧边栏换色（可恢复默认）
// @author       YJL-love-coding
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';
    // ========== ① 玻璃皮肤 + 控件样式（CSS） ==========
    GM_addStyle(`
        .fbb737a4 {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        ._546d736.b64fb9ae {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        .ds-markdown {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        .f8d1e4c0 {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        ._6ffc3c9 {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        .e5bf614e {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        ._77cefa5._3d616d3 {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        /* 侧边栏外层容器玻璃 */
        .a2f3d50e {
            background: rgba(255,255,255,0.15) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 14px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        /* ===== 设置齿轮按钮 ===== */
        #bds-gear-btn {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 99999;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.18);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #fff;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }
        /* ===== 设置面板 ===== */
        #bds-panel {
            position: fixed;
            right: 20px;
            bottom: 76px;
            z-index: 99999;
            width: 190px;
            padding: 12px;
            border-radius: 16px;
            background: rgba(255,255,255,0.18);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.35);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.25);
            color: #fff;
            font-family: system-ui, sans-serif;
            display: none;
        }
        #bds-panel button {
            display: block;
            width: 100%;
            margin: 4px 0;
            padding: 8px 10px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.12);
            color: #fff;
            font-size: 13px;
            text-align: left;
            cursor: pointer;
        }
        #bds-panel button:hover {
            background: rgba(255,255,255,0.22);
        }
        /* ===== 色板 ===== */
        #bds-palette {
            display: none;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        .bds-swatch {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.4);
            cursor: pointer;
        }
    `);

    // ========== ★ 强制玻璃覆盖（内联样式 + !important，最高优先级） ==========
    function forceGlass(selector) {
        var els = document.querySelectorAll(selector);
        els.forEach(function(el) {
            el.style.setProperty('background', 'rgba(255,255,255,0.15)', 'important');
            el.style.setProperty('backdrop-filter', 'blur(16px)', 'important');
            el.style.setProperty('-webkit-backdrop-filter', 'blur(16px)', 'important');
            el.style.setProperty('border', '1px solid rgba(255,255,255,0.35)', 'important');
            el.style.setProperty('border-radius', '14px', 'important');
            el.style.setProperty('box-shadow', 'inset 0 1px 0 rgba(255,255,255,0.3)', 'important');
        });
    }

    // 输入框容器（黑块侦探找到的 _77cefa5._3d616d3）——强制贴玻璃
    setTimeout(function() { forceGlass('._77cefa5._3d616d3'); }, 500);
    setTimeout(function() { forceGlass('._77cefa5._3d616d3'); }, 1500);

    // ========== ② 恢复上次保存的状态（刷新不丢） ==========
    var savedBg = localStorage.getItem('bds-bg');
    if (savedBg) {
        document.body.style.backgroundImage = 'url(' + savedBg + ')';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
    var savedColor = localStorage.getItem('bds-sidebar-color');
    if (savedColor) {
        setSidebarColor(savedColor);
    }
    // 防止脚本重复运行时控件被创建多次
    if (document.getElementById('bds-gear-btn')) return;
    // ========== ③ 创建齿轮按钮 ==========
    var gearBtn = document.createElement('button');
    gearBtn.id = 'bds-gear-btn';
    gearBtn.textContent = '⚙';
    document.body.appendChild(gearBtn);
    // ========== ④ 创建设置面板 ==========
    var panel = document.createElement('div');
    panel.id = 'bds-panel';
    var title = document.createElement('div');
    title.style.cssText = 'font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:6px;';
    title.textContent = '设置';
    panel.appendChild(title);
    var bgBtn = document.createElement('button');
    bgBtn.textContent = '🎨 换背景';
    panel.appendChild(bgBtn);
    var colorBtn = document.createElement('button');
    colorBtn.textContent = '🎨 边栏颜色';
    panel.appendChild(colorBtn);
    var palette = document.createElement('div');
    palette.id = 'bds-palette';
    var colors = [
        'rgba(220,60,60,0.45)',   // 红
        'rgba(240,140,60,0.45)',  // 橙
        'rgba(240,210,60,0.45)',  // 黄
        'rgba(80,200,110,0.45)',  // 绿
        'rgba(60,200,200,0.45)',  // 青
        'rgba(70,130,230,0.45)',  // 蓝
        'rgba(160,100,230,0.45)', // 紫
        'rgba(230,120,190,0.45)', // 粉
        'rgba(150,155,165,0.5)',  // 灰
        'rgba(40,50,80,0.55)'     // 深蓝黑
    ];
    colors.forEach(function(color) {
        var swatch = document.createElement('div');
        swatch.className = 'bds-swatch';
        swatch.style.background = color;
        swatch.addEventListener('click', function() {
            setSidebarColor(color);
            palette.style.display = 'none';
        });
        palette.appendChild(swatch);
    });
    var resetSwatch = document.createElement('div');
    resetSwatch.className = 'bds-swatch';
    resetSwatch.style.background = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 4px, transparent 4px 8px)';
    resetSwatch.title = '恢复默认';
    resetSwatch.addEventListener('click', function() {
        setSidebarColor(null);
        palette.style.display = 'none';
    });
    palette.appendChild(resetSwatch);
    panel.appendChild(palette);
    document.body.appendChild(panel);
    // ========== ⑤ 换背景功能 ==========
    bgBtn.addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', function() {
            var file = input.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                var imgData = e.target.result;
                localStorage.setItem('bds-bg', imgData);
                document.body.style.backgroundImage = 'url(' + imgData + ')';
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            };
            reader.readAsDataURL(file);
        });
        input.click();
    });
    // ========== ⑥ 事件绑定 ==========
    gearBtn.addEventListener('click', function() {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    });
    colorBtn.addEventListener('click', function() {
        if (palette.style.display === 'none') {
            palette.style.display = 'flex';
        } else {
            palette.style.display = 'none';
        }
    });
    document.addEventListener('click', function(e) {
        if (!panel.contains(e.target) && e.target !== gearBtn) {
            panel.style.display = 'none';
        }
    });
    // ========== ⑦ 侧边栏变色 / 恢复函数 ==========
    function setSidebarColor(color) {
        var styleEl = document.getElementById('bds-sidebar-color');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'bds-sidebar-color';
            document.head.appendChild(styleEl);
        }
        if (color) {
            styleEl.textContent = '.a2f3d50e { background: ' + color + ' !important; }';
            localStorage.setItem('bds-sidebar-color', color);
        } else {
            styleEl.textContent = '';
            localStorage.removeItem('bds-sidebar-color');
        }
    }
})();
