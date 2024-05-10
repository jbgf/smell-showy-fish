import { CaretRightOutlined, CheckCircleFilled, CoffeeOutlined, DownloadOutlined, LoadingOutlined, PauseOutlined, RedoOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons"
import cn from 'classnames'
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { Button, Flex, Space } from "antd"
import { useEffect, useReducer, useRef, useState } from "react"
import { SearchTypes } from "~const/enum"
import { ButtonFull } from "./button-full"
import { ReqRangeKey } from "~const/local"
import { Storage } from "@plasmohq/storage"
 
export const searchStorage = new Storage()
export const Search = () => {

  const [isSearching, setIsSearching] = useState<boolean>()
  const searchEnded = isSearching === false;

  const [paused, setIsPaused] = useState(false)
  const isSearchingRef = useRef(isSearching);
  const isPausedRef = useRef(paused);
  const [data, setData] = useState([])
  const initReqConfig = async () => {
    // await storage.set("key", "value")
    const data = await searchStorage.get(ReqRangeKey)

  }


  /** mock data */
  const min = 5;
  const max = 15
  const random = Math.random() * (max - min) + min;

  useEffect(() => {
    initReqConfig()
  }, [])

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
        // const hasBottomText = element.querySelector(`[aria-label*='Results for']`)
        if (element.scrollTop + element.clientHeight === element.scrollHeight) {
          console.log('Scrolled to bottom');
          setIsSearching(false)
          return resolve(true)
        } else {
          element.scrollTop = element.scrollHeight;
          return scrollToBottom(element)
        }
        
      }, random * 1000);
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
    // console.log(input.value)
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
  const reset = () => {
    sendToBackgroundViaRelay({
      name: "search",
      body: {
        type: SearchTypes.Reset
      },
    }).then((res) => {
      setData(res?.data)
      setIsSearching(undefined)
      setIsPaused(false)
    })
  }
  const EXPORT_BTN = (
    <ButtonFull disabled={!searchEnded}>
      <DownloadOutlined />
      <div>Export <span>{data?.length}</span> Leads to CSV</div>
    </ButtonFull>
  )
  return (
    <div className="plasmo-text-center w-full">
      {isSearching 
      ? <div className="plasmo-w-full  plasmo-p-2 plasmo-text-sm ">
          <div className="plasmo-flex plasmo-gap-x-3 plasmo-justify-center plasmo-items-center plasmo-mb-2 plasmo-text-xs">
            {paused ? <CoffeeOutlined className="plasmo-text-red-500"  />: <SyncOutlined className="plasmo-text-red-500" />}
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
          {EXPORT_BTN}
          
        </div>  
      : searchEnded  
          ? <div className="plasmo-w-full  plasmo-p-2 plasmo-text-sm ">
              <div className="plasmo-flex plasmo-gap-x-3 plasmo-justify-center plasmo-items-center plasmo-mb-2 plasmo-text-xs">
                  <CheckCircleFilled className="plasmo-text-green-500"  />
                  <div>
                      <span className="plasmo-text-red-500">{data?.length}</span> leads were extracted.
                  </div>
              </div> 
              {EXPORT_BTN}
              <ButtonFull className={"plasmo-mt-3"} onClick={reset}>
                <RedoOutlined rotate={275}/>
                Reset
              </ButtonFull>
            </div>
          : <div onClick={handleSearch} className="plasmo-w-full plasmo-border plasmo-border-light-900 plasmo-cursor-pointer plasmo-p-1 plasmo-text-sm plasmo-text-gray-600 plasmo-rounded">
              <SearchOutlined /> Start Finding Leads
              </div>
      }
      <div className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-pt-3">Powered by leads</div>
    </div>
  )
}
