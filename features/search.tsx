import { SearchOutlined } from "@ant-design/icons"
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { Button } from "antd"
import { useReducer } from "react"
import { SearchTypes } from "~const/enum"

export const Search = () => {
  const scrollToBottom = (element) => {
    return new Promise((resolve) => {    
      setTimeout(() => {
        if (element.scrollTop + element.clientHeight === element.scrollHeight) {
          console.log('Scrolled to bottom');
          return resolve(true)
        } else {
          element.scrollTop = element.scrollHeight;
          return scrollToBottom(element)
        }
        
      }, 100);
    })
    
  }
  const search = (type?: SearchTypes) => {
    sendToBackgroundViaRelay({
      name: "search",
      body: {
        type: type ?? SearchTypes.StartSearch
      },
    }).then(() => {
      const element = document.querySelector(`[aria-label*='Results for']`)  
      setTimeout(async () => {
        if (element) {

          const res = await scrollToBottom(element)
          
          search(SearchTypes.SearchNextPage)
          
        }
      }, 500);
    })
  }
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
    search()
    
  }
  return (
    <div className="plasmo-text-center w-full">
      <div onClick={handleSearch} className="plasmo-w-full plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-2 plasmo-text-3 plasmo-text-gray-600 plasmo-rounded"><SearchOutlined /> Start Finding Leads</div>
      <div className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-pt-3">Powered by leads</div>
    </div>
  )
}
