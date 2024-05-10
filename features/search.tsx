import { CaretRightOutlined, CheckCircleFilled, CoffeeOutlined, DownloadOutlined, LoadingOutlined, PauseOutlined, RedoOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons"
import cn from 'classnames'
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { Button, Flex, Space } from "antd"
import { useEffect, useReducer, useRef, useState } from "react"
import { SearchTypes } from "~const/enum"
import { ButtonFull } from "./button-full"
 
export const Search = () => {

  const [isSearching, setIsSearching] = useState<boolean>()
  const searchEnded = isSearching === false;

  const [paused, setIsPaused] = useState(false)
  const isSearchingRef = useRef(isSearching);
  const isPausedRef = useRef(paused);
  const [data, setData] = useState([])
  
  
  const [intervalRange, setIntervalRange] = useState<Search.RequestConfig['intervalRange']>()

  const min = intervalRange?.[0];
  const max = intervalRange?.[1]
  const random = (Math.random() * (max - min) + min) || 5;

  const initReqConfig = async () => {
    sendToBackgroundViaRelay({
      name: "search",
      body: {
        type: SearchTypes.GetConfig
      },
    }).then((res) => {
      setIntervalRange(res?.data)
    })
    
  }
  useEffect(() => {
  }, [])

  useEffect(() => {
    isSearchingRef.current = isSearching;
  }, [isSearching]);

  useEffect(() => {
    isPausedRef.current = paused;
  }, [paused]);
  let scrollTopPrev = 0;
  let scrollHeightPrev = 0;
  const getResult = () => {
    sendToBackgroundViaRelay({
      name: "search",
      body: {
        type: SearchTypes.SearchNextPage
      },
    }).then((res) => {
      setData(res?.data)
    })
  }
  const scrollToBottom = (element) => {

    return new Promise((resolve) => {    
      setTimeout(() => {
        if (isPausedRef.current) {
          return resolve(false);
        }
        // console.log('element.scrollTop', element.scrollTop, 'clientHeight', element.clientHeight, 'scrollHeight', element.scrollHeight)
        if (scrollTopPrev === element.scrollTop && scrollHeightPrev === element.scrollHeight) {
          console.log('Scrolled to bottom');
          setIsSearching(false)
          return resolve(true)
        };
        scrollTopPrev = element.scrollTop;
        scrollHeightPrev = element.scrollHeight;

        /* if ((Math.abs(element.scrollTop + element.clientHeight - element.scrollHeight) < 1) || (scrollTopPrev === element.scrollTop)) {
          console.log('Scrolled to bottom');
          setIsSearching(false)
          return resolve(true)
        } else { */
          getResult()
          element.scrollTop = element.scrollHeight;          
          return scrollToBottom(element)
        // }
        
      }, random * 1000);
    })
    
  }
  const search = () => {
    sendToBackgroundViaRelay({
      name: "search",
      body: {
        type: SearchTypes.StartSearch
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
          getResult()
        }
    }, 500);
  }
  const handleSearch = async () => {
    const input = document.querySelector<HTMLInputElement>("#searchbox input")
    // console.log(input.value)
    const value = input.value;
    if (!value) {
      alert(`Please enter an address or name of a place.`)
      return;
    }

    await initReqConfig()

    const searchButton = document.querySelector<HTMLButtonElement>("#searchbox-searchbutton")
    // console.log(searchButton, 'searchButton')
    searchButton?.click()
    const element = document.querySelector(`[aria-label*='Results for']`)  
    element.scrollTop = 0;
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
            {paused ? <CoffeeOutlined className="plasmo-text-red-500"  />: <SyncOutlined spin className="plasmo-text-red-500" />}
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
