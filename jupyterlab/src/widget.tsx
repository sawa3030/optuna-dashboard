import { ReactWidget } from "@jupyterlab/ui-components"
import React from "react"
import { JupyterLabEntrypoint } from "./components/JupyterLabEntrypoint"

export class OptunaDashboardWidget extends ReactWidget {
  private _path: string 

  constructor(path: string = "") {
    super()
    this._path = path
    this.addClass("jp-react-widget")
  }

  render(): JSX.Element {
    return <JupyterLabEntrypoint filePath={this._path} />
  }
}
