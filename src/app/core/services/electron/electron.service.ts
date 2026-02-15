import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as electron from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Menu, MenuItem } from '@electron/remote';
import { dialog } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  electron: typeof electron;
  Menu: typeof Menu;
  MenuItem: typeof MenuItem;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  dialog: typeof dialog;
  app: typeof electron.app;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.electron = window.require('electron');
      this.Menu = window.require('@electron/remote').Menu;
      this.MenuItem = window.require('@electron/remote').MenuItem;
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.app = window.require('electron').app;

      this.fs = window.require('fs');
      this.path = window.require('path');
      this.dialog = window.require('electron').dialog;

      this.childProcess = window.require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }


  async loadDefaultPath(): Promise<string | null> {
    try {
      if (this.isElectron) {
        const path = await this.ipcRenderer.invoke('load-default-path');
        console.log('IPC loaded path:', path);
        return path;
      } else {
        // 浏览器环境下的模拟实现
        const path = localStorage.getItem('defaultPath');
        console.log('LocalStorage loaded path:', path);
        return path;
      }
    } catch (error) {
      console.error('Error in loadDefaultPath:', error);
      throw error;
    }
  }

  selectFolder(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isElectron) {
          this.ipcRenderer.invoke('select-folder').then((result: string | null) => {
            console.log('IPC selected folder:', result);
            resolve(result);
          }).catch((error: any) => {
            console.error('IPC select folder error:', error);
            reject(error);
          });
        } else {
          // 浏览器环境下的模拟实现
          const result = prompt('请输入文件夹路径:');
          console.log('Prompt selected folder:', result);
          resolve(result);
        }
      } catch (error) {
        console.error('Error in selectFolder:', error);
        reject(error);
      }
    });
  }

  saveDefaultPath(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isElectron) {
          this.ipcRenderer.send('save-default-path', path);
          console.log('IPC saved path:', path);
          resolve();
        } else {
          // 浏览器环境下的模拟实现
          localStorage.setItem('defaultPath', path);
          console.log('LocalStorage saved path:', path);
          resolve();
        }
      } catch (error) {
        console.error('Error in saveDefaultPath:', error);
        reject(error);
      }
    });
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}