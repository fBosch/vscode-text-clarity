'use strict'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

const identifier = '<!-- ࿇TEXT-CLARITY࿇ -->'
const isWin = /^win/.test(process.platform)
const appDir = path.dirname(require.main.filename)
const base = appDir + (isWin ? '\\vs\\workbench' : '/vs/workbench');
const htmlFile = base + (isWin ? '\\electron-browser\\bootstrap\\index.html' : '/electron-browser/bootstrap/index.html');

function install(context) {
    try {
        let html = fs.readFileSync(htmlFile, 'utf-8')
        const isNotDisabled = "!localStorage['storage://global/extensions/disabled'].includes('fbosch.text-clarity')"
        if (html.indexOf(identifier) === -1) {
            html = html.replace('</body>', `${identifier}
            <style type="text/css">
                    .text-clarity-enabled .editor-container, .text-clarity-enabled .part.panel .content {
                        -webkit-font-smoothing: none !important;
                    }
                </style>
                <script type="text/javascript">
                    if (${isNotDisabled}) {
                        document.querySelector('body').classList.add('text-clarity-enabled')
                    }
                </script>
                ${identifier}
            </body>`)
            fs.writeFile(htmlFile, html, 'utf-8', () => {
                vscode.window.showInformationMessage('Text Clarity has been successfully installed', { title: "Restart" })
                    .then(function (msg) {
                        vscode.commands.executeCommand("workbench.action.reloadWindow");
                    })
            })
        }
    } catch (e) {
        console.log(e)
    }
}

function uninstall() {
    try {
        let html = fs.readFileSync(htmlFile, 'utf-8')
        if (html.indexOf(identifier) !== -1) {
            let identifierRegex = new RegExp(`${identifier}([\\s\\S]*?)${identifier}`)
            html = html.replace(identifierRegex, '')
            fs.writeFile(htmlFile, html, 'utf-8', () => {
                vscode.window.showInformationMessage('Text Clarity has been made ready for uninstallation')
            })
        }
    } catch (e) {
        console.log(e)
    }
}

export function activate(context: vscode.ExtensionContext) {
    install(context)
    vscode.commands.registerCommand('extension.installTextClarity', () => install(context))
    vscode.commands.registerCommand('extension.uninstallTextClarity', uninstall)
}


// this method is called when your extension is deactivated
export function deactivate() {

}