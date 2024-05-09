import { CaretRightOutlined, CoffeeOutlined, DownloadOutlined, LoadingOutlined, PauseOutlined, SearchOutlined } from "@ant-design/icons"
import cn from 'classnames'
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { Button, Flex, Space } from "antd"
import { useEffect, useReducer, useRef, useState } from "react"
import { SearchTypes } from "~const/enum"

export const Search = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [paused, setIsPaused] = useState(false)
  const isSearchingRef = useRef(isSearching);
  const isPausedRef = useRef(paused);
  const [data, setData] = useState([])

  useEffect(() => {
    isSearchingRef.current = isSearching;
  }, [isSearching]);

  useEffect(() => {
    isPausedRef.current = paused;
  }, [paused]);

  const scrollToBottom = (element) => {

    return new Promise((resolve) => {    
      setTimeout(() => {
        if (isPausedRef.current) {
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
    }).then((res) => {
      setData(res?.data)
      searchNext()
    })
  }
  const searchNext = () => {
    const element = document.querySelector(`[aria-label*='Results for']`)  
    setTimeout(async () => {
        if (element) {

          const res = await scrollToBottom(element)
          
          search(SearchTypes.SearchNextPage)
          
        }
    }, 500);
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
  const pauseSearch = () => {
    setIsPaused(true)
  }
  const continueSearch = () => {
    setIsPaused(false)
    searchNext()
  }
  return (
    <div className="plasmo-text-center w-full">
      {isSearching 
      ? <div className="plasmo-w-full  plasmo-p-2 plasmo-text-sm ">
          <div className="plasmo-flex plasmo-gap-x-3 plasmo-justify-center plasmo-items-center plasmo-mb-2 plasmo-text-xs">
            {paused ? <CoffeeOutlined className="plasmo-text-red-500"  />: <LoadingOutlined className="plasmo-text-red-500" />}
            {paused 
              ? <div>
                  In the pause <span className="plasmo-text-red-500">{data?.length}</span> leads were found.
                </div>
              : <div>
                  Finding <span className="plasmo-text-red-500">{data?.length}</span> leads...
                </div>
            }
            {
              paused
              ? <div onClick={continueSearch} className={"plasmo-outline plasmo-outline-offset-2 plasmo-outline-blue-500 plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-1  plasmo-text-gray-600 plasmo-rounded"}>
                  <CaretRightOutlined /> CONTINUE
                </div>
              : <div onClick={pauseSearch} className={" plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-1  plasmo-text-gray-600 plasmo-rounded"}>
                  <PauseOutlined /> pause
                </div>
            }
           
          </div>
          <div className="plasmo-w-full plasmo-flex plasmo-justify-center plasmo-gap-x-3 plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-2 plasmo-text-sm plasmo-text-gray-600 plasmo-rounded plasmo-items-center">
            <DownloadOutlined />
            <div>Export <span>{data?.length}</span> Leads to CSV</div>
            
          </div>
          
        </div>  
      : <div onClick={handleSearch} className="plasmo-w-full plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-1 plasmo-text-sm plasmo-text-gray-600 plasmo-rounded">
        <SearchOutlined /> Start Finding Leads
      </div>}
      <div className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-pt-3">Powered by leads</div>
    </div>
  )
}
