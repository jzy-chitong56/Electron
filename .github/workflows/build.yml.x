# This is a basic workflow to help you get started with Actions
name: 'AMAI 安装器 编译工作流'

# Controls when the action will run.
on:
  # Triggers the workflow on push or pull request events but only for the main branch
  push:
    branches:
      - VSAI
  #path:


  pull_request:
    branches:
      - VSAI


  # Allows you to run this workflow manually from the Actions tab
    # workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
permissions:
  contents: read

jobs:
  build:
    strategy:
      matrix:
        node-version: [21]

    # The type of runner that the job will run on
    runs-on: windows-2022

    steps:
    - name: 提交源码
      uses: actions/checkout@v4

    - name: 设置 node 缓存模组
      uses: actions/cache@v4
      env:
        cache-name: cache-node-modules
      with:
        # npm cache files are stored in `~/.npm`
        path: ~/.npm
        key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-build-${{ env.cache-name }}-
          ${{ runner.os }}-build-
          ${{ runner.os }}-

    - name: 调用 Node.js 版本号：${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}

    - name: 安装工程环境
      run: npm i
  

   # - name: 校验文件
     # run: npm run lint

   #    - name: 运行 unit 测试
      #   run: npm run test

   #    - name: 运行 e2e 测试
     #    run: npm run e2e

    - name: 打包应用
     # run: npm run electron:local
     # run: npm run electron:build
      run: npm run electron:build --ia32

    - name: 压缩打包文件
      uses: darshitsri/zip-release@v3
      with:
        filename: amai.zip
        path:  D:/a/Electron/Electron/release/win-unpacked
        directory: D:/a/Electron/Electron/release/win-unpacked
 
    - name: 上传附件
      uses: actions/upload-artifact@v4
      with:
        path: ./release/win-unpacked/amai.zip

    - name: 下载附件
      uses: actions/download-artifact@v4
      # with:
      #   path: ./release/win-unpacked/amai.zip