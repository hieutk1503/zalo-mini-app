#### Links
- https://developers.zalo.me/apps
- https://mini.zalo.me/developers

#### History
- [x] Create project from template https://github.com/Zalo-MiniApp/zaui-egovernment
- [x] Install Mini App DevTools CLI
```bash
$ npm install -g zmp-cli
```
- [x] Install Deps and upgrade ZaUI, vite plugins
```bash
$ npm install
$ npm install zmp-ui@latest
$ npm uninstall @vitejs/plugin-react-refresh
$ npm install @vitejs/plugin-react@^1
```
- [x] Update vite.config.ts to remove plugin-react-refresh

#### Notes
- Skip Git commit hooks (huskey)
```bash
$ git commit --no-verify -m "commit message"
             ^^^^^^^^
-n  
--no-verify
```