import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { Search } from "~features/search"

export const config: PlasmoCSConfig = {
  matches: ["https://www.google.com/maps/*"],
  world: "MAIN"
} 

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50  plasmo-fixed plasmo-rounded plasmo-top-32 plasmo-right-8 plasmo-bg-white plasmo-p-3 plasmo-pb-1 plasmo-w-96">
      <Search />
    </div>
  )
}

export default PlasmoOverlay
