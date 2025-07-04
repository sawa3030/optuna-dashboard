import { JupyterFrontEnd, JupyterFrontEndPlugin } from "@jupyterlab/application"

import { ICommandPalette } from "@jupyterlab/apputils"
import optunaLogo from "../img/optuna_logo.svg"

import { ILauncher } from "@jupyterlab/launcher"
import { LabIcon } from "@jupyterlab/ui-components"

import { MainAreaWidget } from "@jupyterlab/apputils"
import { OptunaDashboardWidget } from "./widget"
// @jupyterlab/filebrowser-extension:open-with
// import { IFileBrowserFactory } from "@jupyterlab/filebrowser"

import {
  ABCWidgetFactory,
  DocumentRegistry,
  DocumentWidget
} from '@jupyterlab/docregistry';
// import { Widget } from '@lumino/widgets';

class OptunaDocWidgetFactory extends ABCWidgetFactory<DocumentWidget> {
  constructor() {
    super({
      name: 'Optuna Dashboard Viewer',
      fileTypes: ['optuna-sqlite'],
      defaultFor: [], // 自動で開く拡張子にする場合は ['optuna-sqlite']
      readOnly: true,
      canStartKernel: false,
      preferKernel: false
    });
  }

  protected createNewWidget(
    context: DocumentRegistry.Context
  ): DocumentWidget {
    const content = new OptunaDashboardWidget(context.path);
    return new DocumentWidget({ content, context });
  }
}


/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = "server:get-file"
  export const ui = "server:dashboard-ui"
}

/**
 * Initialization data for the jupyterlab-optuna extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-optuna:plugin",
  description: "A JupyterLab extension for Optuna",
  autoStart: true,
  // optional: [ILauncher, IFileBrowserFactory],
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    app.docRegistry.addFileType({
      name: 'optuna-sqlite',
      displayName: 'Optuna SQLite DB',
      extensions: ['.sqlite3'],
      mimeTypes: ['application/octet-stream']
    });

    const factory = new OptunaDocWidgetFactory();
    app.docRegistry.addWidgetFactory(factory);

    console.log("JupyterLab extension jupyterlab-optuna is activated!")
    console.log("ICommandPalette:", palette)

    const { commands, shell } = app
    const optunaIcon = new LabIcon({
      name: "ui-components:optuna",
      svgstr: optunaLogo,
    })

    commands.addCommand(CommandIDs.ui, {
      caption: "Launch Optuna Dashboard",
      label: "Optuna Dashboard",
      icon: (args) => (args.isPalette ? undefined : optunaIcon),
      execute: () => {
        const content = new OptunaDashboardWidget()
        const widget = new MainAreaWidget<OptunaDashboardWidget>({ content })
        widget.title.label = "Optuna Dashboard Widget"
        widget.title.icon = optunaIcon
        shell.add(widget, "main")
      },
    })
    if (launcher) {
      launcher.add({
        command: CommandIDs.ui,
      })
    }
    palette.addItem({ command: CommandIDs.ui, category: "Optuna" })
  },
}

export default plugin
