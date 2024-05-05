import { SearchOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useReducer } from "react"

export const Search = () => {
  const handleSearch = () => {
    const input = document.querySelector<HTMLInputElement>("#searchbox input")
    console.log(input.value)
    const value = input.value;
    if (!value) {
      alert(`Please enter an address or name of a place.`)
      return;
    }
    const searchButton = document.querySelector<HTMLButtonElement>("#searchbox-searchbutton")
    console.log(searchButton, 'searchButton')
    searchButton?.click()
  }
  return (
    <div className="plasmo-text-center w-full">
      <div onClick={handleSearch} className="plasmo-w-full plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-2 plasmo-text-3 plasmo-text-gray-600 plasmo-rounded"><SearchOutlined /> Start Finding Leads</div>
      <div className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-pt-3">Powered by leads</div>
    </div>
  )
}
