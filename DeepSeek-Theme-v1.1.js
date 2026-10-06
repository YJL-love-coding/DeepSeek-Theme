// ==UserScript==
// @name         DeepSeek 美化 v1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  液态玻璃皮肤 + 自定义背景图 + 玻璃参数调节 + 字体黑白切换（可恢复默认）
// @author       YJL-love-coding
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';

    // ========== ① 玻璃参数（默认值 + 读取上次保存的） ==========
    var DEFAULT_GLASS = {
        blur: 16,          // 模糊度 px
        alpha: 0.15,       // 透明度 0~1
        radius: 14,        // 圆角 px
        borderW: 1,        // 边框粗细 px
        color: '255,255,255', // 玻璃颜色 RGB
        text: '#ffffff'    // 字体颜色（黑/白）
    };
    function loadGlass() {
        var g = {};
        var saved = {};
        try { saved = JSON.parse(localStorage.getItem('bds-glass-config') || '{}'); } catch (e) { saved = {}; }
        for (var key in DEFAULT_GLASS) {
            g[key] = saved[key] !== undefined ? saved[key] : DEFAULT_GLASS[key];
        }
        return g;
    }
    var glass = loadGlass();

    // ========== ② 玻璃皮肤 + 控件样式（CSS 变量 → 调参实时生效） ==========
    GM_addStyle(`
        :root {
            --bds-blur: ${glass.blur}px;
            --bds-alpha: ${glass.alpha};
            --bds-radius: ${glass.radius}px;
            --bds-border-w: ${glass.borderW}px;
            --bds-glass: ${glass.color};
            --bds-text: ${glass.text};
        }
        /* 所有玻璃区域：统一用 CSS 变量，调参即全局生效 */
        .fbb737a4, ._546d736.b64fb9ae, .ds-markdown,
        .f8d1e4c0, ._6ffc3c9, .e5bf614e,
        ._77cefa5._3d616d3, .a2f3d50e, ._77cefa5._9996a53{
            background: rgba(var(--bds-glass), var(--bds-alpha)) !important;
            backdrop-filter: blur(var(--bds-blur)) saturate(120%) !important;
            -webkit-backdrop-filter: blur(var(--bds-blur)) saturate(120%) !important;
            border: var(--bds-border-w) solid rgba(var(--bds-glass), 0.35) !important;
            border-radius: var(--bds-radius) !important;
            box-shadow: inset 0 1px 0 rgba(var(--bds-glass), 0.3) !important;
            color: var(--bds-text) !important;
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
            width: 220px;
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
            max-height: 80vh;
            overflow-y: auto;
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
        /* ===== 玻璃调参区 ===== */
        #bds-glass-ctrl {
            display: none;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        #bds-glass-ctrl .gc-row {
            margin-bottom: 10px;
        }
        #bds-glass-ctrl .gc-label {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 3px;
            color: rgba(255,255,255,0.85);
        }
        #bds-glass-ctrl .gc-label code {
            background: rgba(0,0,0,0.3);
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 11px;
        }
        #bds-glass-ctrl input[type="range"] {
            width: 100%;
            accent-color: #fff;
            cursor: pointer;
        }
        #bds-gcolors {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 4px;
        }
        .bds-gcolor, .bds-tcolor {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.4);
            cursor: pointer;
        }
        .bds-gcolor:hover, .bds-tcolor:hover {
            border-color: #fff;
        }
    `);

    // ========== ③ 强制玻璃覆盖（用当前参数，覆盖顽固黑块） ==========
    function forceGlass(selector) {
        var els = document.querySelectorAll(selector);
        els.forEach(function(el) {
            el.style.setProperty('background', 'rgba(' + glass.color + ',' + glass.alpha + ')', 'important');
            el.style.setProperty('backdrop-filter', 'blur(' + glass.blur + 'px)', 'important');
            el.style.setProperty('-webkit-backdrop-filter', 'blur(' + glass.blur + 'px)', 'important');
            el.style.setProperty('border', glass.borderW + 'px solid rgba(' + glass.color + ',0.35)', 'important');
            el.style.setProperty('border-radius', glass.radius + 'px', 'important');
            el.style.setProperty('box-shadow', 'inset 0 1px 0 rgba(' + glass.color + ',0.3)', 'important');
        });
    }
    setTimeout(function() { forceGlass('._77cefa5._3d616d3'); }, 500);
    setTimeout(function() { forceGlass('._77cefa5._3d616d3'); }, 1500);

    // ========== ④ 恢复上次的背景图（刷新不丢） ==========
    var savedBg = localStorage.getItem('bds-bg');
    if (savedBg) {
        document.body.style.backgroundImage = 'url(' + savedBg + ')';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    // ========== ⑤ 清理旧版残留（边栏颜色功能已移除，由玻璃调参统一管颜色） ==========
    localStorage.removeItem('bds-sidebar-color');

    // 防止脚本重复运行时控件被创建多次
    if (document.getElementById('bds-gear-btn')) return;

    // ========== ⑥ 创建齿轮按钮 ==========
    var gearBtn = document.createElement('button');
    gearBtn.id = 'bds-gear-btn';
    gearBtn.textContent = '⚙';
    document.body.appendChild(gearBtn);

    // ========== ⑦ 创建设置面板 ==========
    var panel = document.createElement('div');
    panel.id = 'bds-panel';

    var title = document.createElement('div');
    title.style.cssText = 'font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:6px;';
    title.textContent = '设置';
    panel.appendChild(title);

    // 按钮 1：换背景
    var bgBtn = document.createElement('button');
    bgBtn.textContent = '🎨 换背景';
    panel.appendChild(bgBtn);

    // ★ 新增：按钮 2：恢复背景
    var resetBgBtn = document.createElement('button');
    resetBgBtn.textContent = '↩️ 恢复背景';
    panel.appendChild(resetBgBtn);

    // 按钮 3：玻璃调参
    var glassBtn = document.createElement('button');
    glassBtn.textContent = '🔧 玻璃调参';
    panel.appendChild(glassBtn);

    // ★ 新增：调参区（滑块 + 颜色 + 恢复默认）
    var glassCtrl = document.createElement('div');
    glassCtrl.id = 'bds-glass-ctrl';
    glassCtrl.innerHTML =
        '<div class="gc-row">' +
            '<div class="gc-label">模糊度 blur <code id="gc-blur-v">' + glass.blur + 'px</code></div>' +
            '<input type="range" id="gc-blur" min="0" max="40" step="1" value="' + glass.blur + '">' +
        '</div>' +
        '<div class="gc-row">' +
            '<div class="gc-label">透明度 alpha <code id="gc-alpha-v">' + Number(glass.alpha).toFixed(2) + '</code></div>' +
            '<input type="range" id="gc-alpha" min="0" max="100" step="1" value="' + Math.round(glass.alpha * 100) + '">' +
        '</div>' +
        '<div class="gc-row">' +
            '<div class="gc-label">圆角 radius <code id="gc-radius-v">' + glass.radius + 'px</code></div>' +
            '<input type="range" id="gc-radius" min="0" max="60" step="1" value="' + glass.radius + '">' +
        '</div>' +
        '<div class="gc-row">' +
            '<div class="gc-label">边框粗细 <code id="gc-border-v">' + glass.borderW + 'px</code></div>' +
            '<input type="range" id="gc-border" min="0" max="6" step="1" value="' + glass.borderW + '">' +
        '</div>' +
        '<div class="gc-row">' +
            '<div class="gc-label">玻璃颜色</div>' +
            '<div id="bds-gcolors">' +
                '<div class="bds-gcolor" style="background:rgb(255,255,255)" data-c="255,255,255" title="白"></div>' +
                '<div class="bds-gcolor" style="background:rgb(180,220,255)" data-c="180,220,255" title="冰蓝"></div>' +
                '<div class="bds-gcolor" style="background:rgb(255,220,180)" data-c="255,220,180" title="暖黄"></div>' +
                '<div class="bds-gcolor" style="background:rgb(200,180,255)" data-c="200,180,255" title="淡紫"></div>' +
                '<div class="bds-gcolor" style="background:rgb(180,255,210)" data-c="180,255,210" title="薄荷"></div>' +
                '<div class="bds-gcolor" style="background:rgb(255,180,200)" data-c="255,180,200" title="粉"></div>' +
            '</div>' +
        '</div>' +
        '<div class="gc-row">' +
            '<div class="gc-label">字体颜色</div>' +
            '<div id="bds-tcolors">' +
                '<div class="bds-tcolor" style="background:#ffffff" data-t="#ffffff" title="白字"></div>' +
                '<div class="bds-tcolor" style="background:#000000" data-t="#000000" title="黑字"></div>' +
            '</div>' +
        '</div>' +
        '<button id="gc-reset" style="margin-top:2px;">↩️ 恢复默认玻璃</button>';
    panel.appendChild(glassCtrl);

    document.body.appendChild(panel);

    // ========== ⑧ 换背景功能 ==========
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

    // ========== ⑨ 事件绑定 ==========
    gearBtn.addEventListener('click', function() {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    });
    glassBtn.addEventListener('click', function() {
        if (glassCtrl.style.display === 'none') {
            glassCtrl.style.display = 'block';
        } else {
            glassCtrl.style.display = 'none';
        }
    });
    // ★ 新增：恢复背景（清除保存的背景图，回到默认）
    resetBgBtn.addEventListener('click', function() {
        localStorage.removeItem('bds-bg');
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundAttachment = '';
    });
    document.addEventListener('click', function(e) {
        if (!panel.contains(e.target) && e.target !== gearBtn) {
            panel.style.display = 'none';
        }
    });

    // ========== ⑩ 玻璃调参逻辑 ==========
    // 滑块：模糊度
    document.getElementById('gc-blur').addEventListener('input', function() {
        glass.blur = Number(this.value);
        applyGlass();
    });
    // 滑块：透明度
    document.getElementById('gc-alpha').addEventListener('input', function() {
        glass.alpha = Math.round(Number(this.value)) / 100;
        applyGlass();
    });
    // 滑块：圆角
    document.getElementById('gc-radius').addEventListener('input', function() {
        glass.radius = Number(this.value);
        applyGlass();
    });
    // 滑块：边框粗细
    document.getElementById('gc-border').addEventListener('input', function() {
        glass.borderW = Number(this.value);
        applyGlass();
    });
    // 玻璃颜色圆点
    var gcolors = document.querySelectorAll('.bds-gcolor');
    gcolors.forEach(function(c) {
        c.addEventListener('click', function() {
            glass.color = this.getAttribute('data-c');
            applyGlass();
        });
    });
    // ★ 新增：字体颜色圆点（黑/白）
    var tcolors = document.querySelectorAll('.bds-tcolor');
    tcolors.forEach(function(c) {
        c.addEventListener('click', function() {
            glass.text = this.getAttribute('data-t');
            applyGlass();
        });
    });
    // 恢复默认玻璃
    document.getElementById('gc-reset').addEventListener('click', function() {
        glass.blur = DEFAULT_GLASS.blur;
        glass.alpha = DEFAULT_GLASS.alpha;
        glass.radius = DEFAULT_GLASS.radius;
        glass.borderW = DEFAULT_GLASS.borderW;
        glass.color = DEFAULT_GLASS.color;
        glass.text = DEFAULT_GLASS.text;
        document.getElementById('gc-blur').value = glass.blur;
        document.getElementById('gc-alpha').value = Math.round(glass.alpha * 100);
        document.getElementById('gc-radius').value = glass.radius;
        document.getElementById('gc-border').value = glass.borderW;
        applyGlass();
    });

    // 应用并保存玻璃参数（改 CSS 变量 → 全页面玻璃实时更新）
    function applyGlass() {
        var r = document.documentElement.style;
        r.setProperty('--bds-blur', glass.blur + 'px');
        r.setProperty('--bds-alpha', glass.alpha);
        r.setProperty('--bds-radius', glass.radius + 'px');
        r.setProperty('--bds-border-w', glass.borderW + 'px');
        r.setProperty('--bds-glass', glass.color);
        r.setProperty('--bds-text', glass.text);
        // 更新数值显示
        document.getElementById('gc-blur-v').textContent = glass.blur + 'px';
        document.getElementById('gc-alpha-v').textContent = Number(glass.alpha).toFixed(2);
        document.getElementById('gc-radius-v').textContent = glass.radius + 'px';
        document.getElementById('gc-border-v').textContent = glass.borderW + 'px';
        // 保存到 localStorage，刷新不丢
        localStorage.setItem('bds-glass-config', JSON.stringify(glass));
    }

})();
