import { SearchOutlined } from "@ant-design/icons"
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { Button } from "antd"
import { useEffect, useReducer, useRef, useState } from "react"
import { SearchTypes } from "~const/enum"

export const Search = () => {
  /** mock data */
  const [isSearching, setIsSearching] = useState(true)
  const isSearchingRef = useRef(isSearching);

  useEffect(() => {
    isSearchingRef.current = isSearching;
  }, [isSearching]);
  const scrollToBottom = (element) => {

    return new Promise((resolve) => {    
      setTimeout(() => {
        if (!isSearchingRef.current) {
          return resolve(false);
        }
        if (element.scrollTop + element.clientHeight === element.scrollHeight) {
          console.log('Scrolled to bottom');
          setIsSearching(false)
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
    // console.log(searchButton, 'searchButton')
    searchButton?.click()
    setIsSearching(true)
    search()
    
  }
  return (
    <div className="plasmo-text-center w-full">
      {isSearching 
      ? <div onClick={handleSearch} className="plasmo-w-full plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-2 plasmo-text-3 plasmo-text-gray-600 plasmo-rounded">
          <SearchOutlined />
          Finding leads...
          
        </div>  
      : <div onClick={handleSearch} className="plasmo-w-full plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-2 plasmo-text-3 plasmo-text-gray-600 plasmo-rounded"><SearchOutlined /> Start Finding Leads</div>}
      <div className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-pt-3">Powered by leads</div>
    </div>
  )
}
