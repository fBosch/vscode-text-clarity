'use strict'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

const identifier = '<!-- ࿇TEXT-CLARITY࿇ -->'
const isWin = /^win/.test(process.platform)
const appDir = path.dirname(require.main.filename)
const base = appDir + (isWin ? '\\vs\\workbench' : '/vs/workbench');
const htmlFile = base + (isWin ? '\\electron-browser\\bootstrap\\index.html' : '/electron-browser/bootstrap/index.html');

export function activate(context: vscode.ExtensionContext) {
    try {
        let html = fs.readFileSync(htmlFile, 'utf-8')
        const isEnabled = "JSON.parse(localStorage['storage://global/fbosch.text-clarity']).enabled"
        const isNotDisabled = "!localStorage['storage://global/extensions/disabled'].includes('vscode-text-clarity')"
        if (!html.includes(identifier)) {
            html = html.replace('</body>', `
                ${identifier}
                <style type="text/css">
                    .text-clarity-enabled .editor-container, .text-clarity-enabled .part.panel .content {
                        -webkit-font-smoothing: none !important;
                    }
                </style>
                <script type="text/javascript">
                    document.addEventListener("DOMContentLoaded", function(event) { 
                        if (${isNotDisabled} && ${isEnabled}) {
                            document.querySelector('body').classList.add('text-clarity-enabled')
                        }
                    })
                </script>
                ${identifier}
            </body>`)
            fs.writeFileSync(htmlFile, html, 'utf-8')
            context.globalState.update('enabled', true)
        }
    } catch (e) {
        console.log(e)
    }
}

// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
    try {
        let html = fs.readFileSync(htmlFile, 'utf-8')
        if (html.includes(identifier)) {
            let identifierRegex = new RegExp(`${identifier}([\s\S]*?)${identifier}`)
            html = html.replace(identifierRegex, '')
            fs.writeFileSync(htmlFile, html, 'utf-8')
            context.globalState.update('enabled', false)            
        }
    } catch (e) {
        console.log(e)
    }
}