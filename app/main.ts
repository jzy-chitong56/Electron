import { app, BrowserWindow, dialog, Menu, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as remote from '@electron/remote/main';
import { InstallModel } from '../commons/models';
const ipcMain = require('electron').ipcMain;
const cp = require('child_process');

type Settings = {
  TFT_PATH?: string | null;
  ROC_PATH?: string | null;
  REFORGED_PATH?: string | null;
  [key: string]: any;
};

type AppConfig = {
  paths: {
    REFORGED_PATH?: string;
    TFT_PATH?: string;
    ROC_PATH?: string;
  };
  settings: {
    commander?: number;
    optimize?: boolean;
    forceLang?: boolean;
  };
};

let win: BrowserWindow = null;
let translations: { [key: string]: string } = {};
let currentLanguage: string = "English";
const documentsPath = app.getPath('documents');
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

// needed to call remote inside app
remote.initialize();

// disable default menu
Menu.setApplicationMenu(null);

const isDev = () => {
  return require.main.filename.indexOf('app.asar') === -1;
}

const createWindow = (): BrowserWindow => {
  const size = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    minWidth: 1280,
    minHeight: 940,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  // needed to remote work with electron > 14...
  remote.enable(win.webContents);

  if (serve) {
    const debug = require('electron-debug');
    debug();

    // hot reload frontend
    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

const getversionpath = (pathver: string, settings: Settings): string => {
  win.webContents.send('on-install-console', `get version path : ${JSON.stringify(settings)}, settings path : ${settings[`${pathver}_PATH`]}`);
  if (pathver == "REFORGED") {
    return settings.REFORGED_PATH || '';
  } else if (pathver == "TFT") {
    return settings.TFT_PATH || '';
  } else if (pathver == "ROC") {
    return settings.ROC_PATH || '';
  }
  return '';
}

const loadSet = (): AppConfig => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  const defaultConfig: AppConfig = {
    paths: {
      REFORGED_PATH: undefined,
      TFT_PATH: undefined,
      ROC_PATH: undefined
    },
    settings: {
      commander: 1,
      optimize: false,
      forceLang: false
    }
  };

  try {
    if (!fs.existsSync(configPath)) {
      win.webContents.send('on-install-console', 'Config file not found, using defaults');
      // 自动创建默认配置文件
      try {
        const defaultContent = `REFORGED_PATH=\nTFT_PATH=\nROC_PATH=\ncommander=1\noptimize=true\nforceLang=false`;
        fs.writeFileSync(configPath, defaultContent, 'utf8');
        win.webContents.send('on-install-console', 'Created default config file');
      } catch (createErr: any) {
        win.webContents.send('on-install-console', `Failed to create config file: ${createErr.message}`);
      }
      return defaultConfig;
    }

    const content = fs.readFileSync(configPath, 'utf8');

    // 尝试解析 JSON 格式（向后兼容）
    try {
      const jsonConfig = JSON.parse(content);
      win.webContents.send('on-install-console', 'Loaded config in JSON format');

      return {
        paths: {
          REFORGED_PATH: jsonConfig.REFORGED_PATH || undefined,
          TFT_PATH: jsonConfig.TFT_PATH || undefined,
          ROC_PATH: jsonConfig.ROC_PATH || undefined
        },
        settings: {
          commander: jsonConfig.commander !== undefined ? jsonConfig.commander : 1,
          optimize: jsonConfig.optimize !== undefined ? jsonConfig.optimize : true,
          forceLang: jsonConfig.forceLang || false
        }
      };
    } catch (jsonError) {
      // JSON 解析失败，尝试按行解析文本格式
      win.webContents.send('on-install-console', 'Loading config in line-by-line format');

      try {
        const lines = content.split('\n').map((line: string) => line.trim()).filter((line: string) => line && !line.startsWith('#'));

        const config: AppConfig = {
          paths: {},
          settings: {}
        };

        for (const line of lines) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const trimmedKey = key.trim();
            const value = valueParts.join('=').trim();

            if (trimmedKey.endsWith('_PATH')) {
              (config.paths as any)[trimmedKey] = value || undefined;
            } else {
              if (value === 'true') {
                (config.settings as any)[trimmedKey] = true;
              } else if (value === 'false') {
                (config.settings as any)[trimmedKey] = false;
              } else {
                (config.settings as any)[trimmedKey] = value;
              }
            }
          }
        }

        return {
          paths: {
            ...defaultConfig.paths,
            ...config.paths
          },
          settings: {
            ...defaultConfig.settings,
            ...config.settings
          }
        };
      } catch (parseErr: any) {
        // 文本格式也解析失败，返回默认配置
        win.webContents.send('on-install-console', `Failed to parse config file: ${parseErr.message}, using defaults`);
        return defaultConfig;
      }
    }
  } catch (err: any) {
    win.webContents.send('on-install-console', `Error loading config: ${err.message}, using defaults`);
    return defaultConfig;
  }
};

const getSingleConfigValue = (key: string): string | boolean | null => {
  const configPath = path.join(app.getPath('userData'), 'config.json');

  try {
    if (!fs.existsSync(configPath)) {
      return null;
    }

    const content = fs.readFileSync(configPath, 'utf8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // 跳过空行和注释
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      // 查找匹配的配置项
      const [configKey, ...valueParts] = trimmedLine.split('=');
      if (configKey && configKey.trim() === key) {
        const value = valueParts.join('=').trim();

        // 自动转换布尔值
        if (value === 'true') return true;
        if (value === 'false') return false;

        return value || null;
      }
    }

    return null;
  } catch (err: any) {
    win.webContents.send('on-install-console', `Error reading config key ${key}: ${err.message}`);
    return null;
  }
};

const updateSingleConfigValue = (key: string, value: string | boolean | null): void => {
  const configPath = path.join(app.getPath('userData'), 'config.json');

  try {
    // 如果文件不存在，创建新文件
    if (!fs.existsSync(configPath)) {
      const valueStr = value === null ? '' : (typeof value === 'boolean' ? value.toString() : value);
      const content = valueStr ? `${key}=${valueStr}` : '';
      fs.writeFileSync(configPath, content, 'utf8');
      win.webContents.send('on-install-console', `Created new config file with ${key}`);
      return;
    }

    // 读取现有文件内容
    const content = fs.readFileSync(configPath, 'utf8');
    const lines = content.split('\n');
    let found = false;
    const updatedLines: string[] = [];

    // 遍历每一行，查找并更新目标配置项
    for (const line of lines) {
      const trimmedLine = line.trim();

      // 跳过空行和注释
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        updatedLines.push(line);
        continue;
      }

      // 检查是否是目标配置项
      const [configKey, ...valueParts] = trimmedLine.split('=');
      if (configKey && configKey.trim() === key) {
        found = true;
        // 如果值为 null，则删除该行；否则更新
        if (value !== null) {
          const valueStr = typeof value === 'boolean' ? value.toString() : value;
          updatedLines.push(`${key}=${valueStr}`);
        }
        // 如果 value 为 null，则不添加该行（相当于删除）
      } else {
        updatedLines.push(line);
      }
    }

    // 如果没找到该配置项且值不为空，则添加新行
    if (!found && value !== null) {
      const valueStr = typeof value === 'boolean' ? value.toString() : value;
      updatedLines.push(`${key}=${valueStr}`);
    }

    // 写回文件
    fs.writeFileSync(configPath, updatedLines.join('\n'), 'utf8');
    win.webContents.send('on-install-console', `Updated ${key} to: ${value === null ? '(removed)' : value}`);
  } catch (err: any) {
    win.webContents.send('on-install-console', `Error updating config: ${err.message}`);
    throw err;
  }
};

const setConfig_BJ = () => {
  ipcMain?.on('set-config-bj', async (_event, commander: number) => {
    updateSingleConfigValue(`commander`, commander.toString());
  });
};

const setConfig_optimize = () => {
  ipcMain?.on('set-config-optimize', async (_event, optimize: boolean, forceLang: boolean) => {
    updateSingleConfigValue(`optimize`, optimize);
    updateSingleConfigValue(`forceLang`, forceLang);
  });
};

const execInstall = async (signal, commander: number = 1, isMap: boolean = false, ver: string = "REFORGED", forceLang: boolean, pathver: string = "REFORGED") => {
  const controller = new AbortController();
  let response;
  const pathKey = `${pathver}_PATH`;
  let usepath = getSingleConfigValue(pathKey) as string | null;
  win.webContents.send('on-install-console', `${pathver} default path : ${usepath}`);
  if (usepath !== null && usepath !== undefined && usepath !== '') {
    if (isMap) {
      response = dialog.showOpenDialogSync(win, {
      title: translations["PAGES.ELECTRON.OPEN_MAP"] || '',
      properties: ['openFile'] ,
      filters: [
        { name: translations["PAGES.ELECTRON.MAPFILE"] || '', extensions: ['w3x', 'w3m'] },
      ],
      defaultPath: usepath,
      });
      if (response && (response?.length > 0)) {
      usepath = null; // wait updata path , maybe selected other path
      }
    } else {
      response = [usepath];
    }
  } else {
    win.webContents.send('on-install-console', 'Choose path');
    response = dialog.showOpenDialogSync(win, {
      // TODO: add i18n here
      title: isMap ? translations["PAGES.ELECTRON.OPEN_MAP"] || '': translations["PAGES.ELECTRON.OPEN_DIR"] || '',
      // TODO: Change to let multiples selections when is map
      properties: isMap ? ['openFile'] : ['openDirectory'],
      // TODO: add i18n here
      filters: isMap ? [
        { name: translations["PAGES.ELECTRON.MAPFILE"] || '', extensions: ['w3x', 'w3m'] },
      ] : null,
      defaultPath: documentsPath,
    });
  }

  let child;

  // passing reference to external call back
  signal = controller.signal;

  let currentExecDir = `./AMAI-release/`,
    currentScriptDir = './AMAI-release/';

  if (!isDev()) {
    currentExecDir = `./AMAI/`;
    currentScriptDir = path.join(
      __dirname,
      `../${currentExecDir}`
    );
  }

  /** uncomment to debbug */
  // const ls = cp.spawnSync(
  //   `ls`,
  //   [`./resources`,],
  //   { encoding : `utf8` }
  // );
  // // process.send(ls.stdout);
  // win.webContents.send('on-install-message', '__dirname: ' + __dirname);
  // win.webContents.send('on-install-message', 'ls: ' + ls.stdout);
  // win.webContents.send('on-install-message', 'isProd: ' + !isDev());
  // win.webContents.send('on-install-message', 'currentExecDir: ' + currentExecDir);
  // win.webContents.send('on-install-message', `install js path: ../${currentExecDir}install.js`);

  if (!response || (response?.length === 0)) {
    win.webContents.send('on-install-empty');
    return;
  }

  if (usepath !== null && usepath !== undefined && usepath !== '') {
    if (!isMap) {
      usepath = response[0];
    } else {
      usepath = path.dirname(response[0]);
    }
    const finalPath = usepath ? path.resolve(usepath) : null;
    updateSingleConfigValue(pathKey, finalPath);
    win.webContents.send('on-install-console', `Default path updated to: ${finalPath}`);
    win.webContents.send('path-updated', { pathver: pathver, path: finalPath });
  }
  // open modal on front
  win.webContents.send('on-install-init', <InstallModel>{
    response: response[0],
    commander,
    isMap
  });
  updateSingleConfigValue(`commander`, commander.toString());
  updateSingleConfigValue(`optimize`, isMap);
  updateSingleConfigValue(`forceLang`, forceLang);
  // Change the relative path from where the script will be executed
  // MPQEditor and AddToMPQ only work when files and folders are in same directory
  try {
    process.chdir(currentScriptDir);
  } catch (err) {
    console.log('error:', err.message);

    /** uncomment to debbug */
    // win.webContents.send('on-install-message', 'Error: ' + err.message);
  }

  // init install proccess
  try {
    child = cp.fork(
      require.resolve(
        path.join(
          __dirname,
          `../${currentExecDir}install.js`
        )
      ),
      [ response[0], commander, ver, forceLang ? currentLanguage : '-' ],
      { signal },
      (err) => {
        win.webContents.send('on-install-error', err);
      }
    );

    // send messages to modal on front
    child.on('message', (message) => {
      if (typeof message === 'object' && message.type === 'progress') {
        // Send progress updates via dedicated channel
        console.log('progress:', message);
        win.webContents.send('on-install-progress', message);
      } else {
        // Send regular messages via standard channel
        win.webContents.send('on-install-message', message);
      }
    });

    // close modal on process finishes
    child.on('exit', () => {
      win.webContents.send('on-install-exit');
    });
  } catch (err) {
    win.webContents.send('on-install-error', err.message);
  }
}

const GetDefaultSet = () => {
  ipcMain?.handle('load-config', async (_) => {
    const config = loadSet();
    win.webContents.send('on-install-console',
      `Config Set : REFORGED : ${config.paths.REFORGED_PATH} , TFT : ${config.paths.TFT_PATH} , ROC : ${config.paths.ROC_PATH};
      COMMANDER : ${config.settings.commander} , OPTIMIZE : ${config.settings.optimize} , FORCE LANG : ${config.settings.forceLang}` );
    return {
      REFORGED_PATH: config.paths.REFORGED_PATH || null,
      TFT_PATH: config.paths.TFT_PATH || null,
      ROC_PATH: config.paths.ROC_PATH || null,
      commander: config.settings.commander || 1,
      optimize: config.settings.optimize || true,
      forceLang: config.settings.forceLang || false
    };
  });
}

const SetDefaultPath = () => {
  ipcMain?.on('set-path-and-install', async (_event, toFolder: boolean, commander: number, optimize: boolean, forceLang: boolean, pathver: string = "REFORGED", install: boolean) => {
    win.webContents.send('on-install-console', `Selecting path , install : ${install}, version : ${pathver}`);
    if (install) {
      win.webContents.send('on-install-console', `Let install change path`)
      let signal = {};
      execInstall(signal, commander, !toFolder, optimize ? `OPT${pathver}` : pathver, forceLang, pathver);
    } else {
      let usepath = documentsPath;
      let result;
      const pathKey = `${pathver}_PATH`;
      const currentPath = getSingleConfigValue(pathKey) as string | null;
      if (currentPath && fs.existsSync(currentPath)) {
        win.webContents.send('on-install-console', `Get default path`);
        usepath = currentPath;
      }
      result = dialog.showOpenDialogSync(win, {
        title: translations["PAGES.ELECTRON.OPEN_DIR"] || '',
        properties: ['openDirectory'],
        defaultPath: usepath
      });
      if (result && (result?.length > 0)) {
        usepath = result[0] ? path.resolve(result[0]) : documentsPath;
        win.webContents.send('on-install-console', `Set path : ${usepath}`);
        try {
          const pathKey = `${pathver}_PATH`;
          updateSingleConfigValue(pathKey, usepath);
          win.webContents.send('path-updated', { pathver: pathver, path: usepath });
        } catch (err) {
          win.webContents.send('on-install-console', `Set path failed: ${err.message}`);
        }
      } else {
        win.webContents.send('on-install-console', `Path selection was cancelled`);
      }
    }
  });
}

const installProcess = () => {
  let signal = {};

  ipcMain?.on('install', async (_event, ver: string, toFolder: boolean, commander: number, optimize: boolean, forceLang: boolean) => {
    const pathver = ver;
    execInstall(signal, commander, !toFolder, optimize ? `OPT${ver}` : ver, forceLang, pathver);
  });

  // TODO: stop process with signal
  ipcMain?.on('on-stop-process', async () => {
    // stop process here
  });
}

const init = () => {
  try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => {
      setTimeout(() => {
        createWindow();
      }, 400)
    });


    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
        createWindow();
      }
    });

  } catch (e) {
    // Catch Error
    // throw e;
  }
}

const installTrans = () => {
  ipcMain?.on('Trans', (_event, currentLang: string, data) => {
    console.log(`Setting language to:${currentLang}`);
    switch (currentLang) {
      case 'en':
        currentLanguage = "English";
        break;
      case 'zh':
        currentLanguage = "Chinese";
        break;
      case 'fr':
        currentLanguage = "French";
        break;
      case 'de':
        currentLanguage = "Deutsch";
        break;
      case 'no':
        currentLanguage = "Norwegian";
        break;
      case 'pt':
        currentLanguage = "Portuguese";
        break;
      case 'ro':
        currentLanguage = "Romanian";
        break;
      case 'ru':
        currentLanguage = "Russian";
        break;
      case 'es':
        currentLanguage = "Spanish";
        break;
      case 'sv':
        currentLanguage = "Swedish";
        break;
      default:
        currentLanguage = "English";
        console.log('Current Language: Unknown so change to English');
    }
    translations = data as { [key: string]: string };
    if (win != null) {
      let rawVersion = __APP_VERSION__ || '';
      let version = rawVersion ? `v${rawVersion}` : '';
      let appName = translations['PAGES.HOME.TITLE'] || '';
      let WinTitle = `${appName}  ${version}`;
      win.setTitle(WinTitle)
    }
  });
}

init();
installTrans();
installProcess();
GetDefaultSet();
SetDefaultPath();
setConfig_optimize();
setConfig_BJ();