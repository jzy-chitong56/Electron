import {app, BrowserWindow, dialog, Menu, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as remote from '@electron/remote/main';
import { InstallModel } from '../commons/models';
const ipcMain = require('electron').ipcMain;
const cp = require('child_process');

// Define settings type
type Settings = {
  TFT_PATH?: string;
  ROC_PATH?: string;
  REF_PATH?: string;
  [key: string]: any; // Allow other properties
};

let win: BrowserWindow = null;
let translations : { [key: string]: string } = {};
let currentLanguage: string = "English";
let defaultPath: string | null = null;
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

// 通用路径获取方法
const getVersionPath = (settings: Settings, ver: string): string | null => {
  switch(ver) {
    case "TFT":
      return settings.TFT_PATH|| null;
    case "ROC":
      return settings.ROC_PATH|| null;
    default:
      return settings.REF_PATH|| documentsPath;
  }
};

const execInstall = async (signal, commander: number = 1, isMap: boolean = false, ver: string = "REFORGED", forceLang: boolean, pathver: string = "REFORGED") => {
  const controller = new AbortController();
  let response;
  try {
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Settings;
      defaultPath = getVersionPath(settings, pathver);
      console.log(`get ${pathver} path:`, defaultPath);
    }
  } catch (err) {
    console.error('Failed to load path:', err);
  }
  if (defaultPath) {
    response = defaultPath;
  } else {
    if (!isMap) {
      // Show dialog and save selected path as default
      response = dialog.showOpenDialogSync(win, {
        title: translations["PAGES.ELECTRON.OPEN_DIR"] || '',
        properties: ['openDirectory'],
      });
    } else {
      response = dialog.showOpenDialogSync(win, {
        title: translations["PAGES.ELECTRON.OPEN_MAP"] || '',
        properties: ['openFile'],
        filters: [
          { name: translations["PAGES.ELECTRON.MAPFILE"] || '', extensions: ['w3x', 'w3m'] },
        ],
      });
    }
  }
  if (response && response.length > 0) {
    const folderPath = path.dirname(response[0]);
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');
    let settings: Settings = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Settings;
    }
    settings[`${pathver}_PATH`] = folderPath;
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
    console.log('Default path updated to:', folderPath);
  }

  let child;

  // passing reference to external call back
  signal = controller.signal;

  let currentExecDir = `./AMAI-release/`,
    currentScriptDir = './AMAI-release/';

  if(!isDev()) {
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

  if(!response || (response?.length === 0)) {
    win.webContents.send('on-install-empty');
    return;
  }

  // open modal on front
  win.webContents.send('on-install-init', <InstallModel>{
    response: response[0],
    commander,
    isMap
  });

  // Change the relative path from where the script will be executed
  // MPQEditor and AddToMPQ only work when files and folders are in same directory
  try {
     process.chdir(currentScriptDir);
  } catch(err) {
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
  } catch(err) {
    win.webContents.send('on-install-error', err.message);
  }
}

const setupFileOperations = () => {
  ipcMain?.handle('file-operations', async (_, { operation, ver, newpath }) => {
    switch(operation) {
      case 'load-default-path': {
        const settingsPath = path.join(app.getPath('userData'), 'settings.json');
        try {
          if (fs.existsSync(settingsPath)) {
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            console.log('Loaded paths:', {
              REF: settings.REF_PATH,
              TFT: settings.TFT_PATH,
              ROC: settings.ROC_PATH
            });
            return {
              REF_PATH: settings.REF_PATH|| documentsPath,
              TFT_PATH: settings.TFT_PATH|| null,
              ROC_PATH: settings.ROC_PATH|| null
            };
          }
          console.log('No settings file found, using defaults');
          return {
            REF_PATH: documentsPath,
            TFT_PATH: null,
            ROC_PATH: null
          };
        } catch (err) {
          console.error('Error loading paths:', err);
          return null;
        }
      }
      case 'select-folder': {
        console.log('Selecting folder for version:', ver);
        try {
          const settingsPath = path.join(app.getPath('userData'), 'settings.json');
          if (fs.existsSync(settingsPath)) {
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) || {};
            const versionPath = settings[`${ver}_PATH`] || settings.REF_PATH;
            const result = dialog.showOpenDialogSync(win, {
              title: translations["PAGES.ELECTRON.OPEN_DIR"] || '',
              defaultPath: versionPath || newpath || documentsPath,
              properties: ['openDirectory'],
            });
            return result && result.length > 0 ? result[0] : null;
          }
        } catch (err) {
          console.error('Error loading settings:', err);
        }
        return dialog.showOpenDialogSync(win, {
          title: translations["PAGES.ELECTRON.OPEN_DIR"] || '',
          defaultPath: newpath || documentsPath,
          properties: ['openDirectory'],
        })?.[0] || null;
      }
      case 'save-default-path': {
        const settingsPath = path.join(app.getPath('userData'), 'settings.json');
        try {
          let settings: Settings = fs.existsSync(settingsPath)
            ? JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
            : {};
          const pathKey = `${ver}_PATH`;
          settings[pathKey] = newpath;
          fs.writeFileSync(settingsPath, JSON.stringify(settings));
          console.log(`Saved path for ${ver}: ${newpath}`);
          return true;
        } catch (err) {
          console.error('Failed to save path:', err);
          return false;
        }
      }
      default:
        throw new Error(`unknow: ${operation}`);
    }
  });
}

const installProcess = () => {
  let signal = {};

  ipcMain?.on('install', async (_event, ver: string, toFolder: boolean, commander: number, optimize: boolean, forceLang : boolean) => {
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
      win.setTitle(translations['PAGES.HOME.TITLE'] || '')
    }
  });
}

init();
installTrans();
setupFileOperations();
installProcess();
