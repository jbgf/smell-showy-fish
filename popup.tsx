
import Logo from './images/logo.png';
import "~style.css"
import { Storage } from "@plasmohq/storage"

import { Button, Flex, Slider, Tabs, Tag, type SliderSingleProps } from "antd";
import { CheckCircleFilled, HomeFilled, SettingFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { ReqRangeKey } from '~const/local';
import { sendToBackground, sendToBackgroundViaRelay, sendToContentScript } from '@plasmohq/messaging';
import { SearchTypes } from '~const/enum';

const searchStorage = new Storage()

const steps = new Array(6).fill(0).map((_, i) => i + 5);
const marks: SliderSingleProps['marks'] = steps.reduce((acc, cur) => Object.assign(acc, {[cur]: `${cur}S`}), {});
const fields = [
  "Name",
  "Feature",
  "Full Address",
  "Street",
  "Municipality",
  "Categories",
  "Phones",
  "Review Count",
  "Average Rating",
  "Review URL",
  "Google Maps URL",
  "Cid",
  "Latitude",
  "Longitude",
  "Website",
  "Domain",
  "Opening Hours",
  "Featured Image",
  "Place Id",
  "Emails",
  "Plus Code",
  "Google Knowledge URL",
  "Kgmid"
];
function IndexPopup() {
  const [arr, setArr] = useState([...fields]);
  const toggle = (field) => setArr(arr.includes(field) ? arr.filter(f => f !== field) : [...arr, field]);
  const openGMap = () => {
    chrome.tabs.create({ url: 'https://www.google.com/maps' }, function(tab) {
    });
  }
  const [values, setValues] = useState([steps[0], steps[steps?.length - 1]]);
  
  const initReqConfig = async () => {
    // await storage.set("key", "value")
    const data = await searchStorage.get<number[]>(ReqRangeKey)

    if (data) {
      setValues(data)
      sendToBackground({
        name: "search",
        body: {
          type: SearchTypes.StoreReqConfig,
          data
        },
      }).then((res) => {
        console.log(res)
      })
    }
    
  }
  
  useEffect(() => {
    initReqConfig()
  }, [])

  const onChange = (values: number[]) => {
    setValues(values)
  }
  const onChangeComplete = async (values: number[]) => {
    await searchStorage.set(ReqRangeKey, values)
    sendToBackground({
      name: "search",
      body: {
        type: SearchTypes.StoreReqConfig,
        data: values
      },
    }).then((res) => {
      console.log(res)
    })
  }
  return (
    <div style={{width: 440}}>
      <Flex className="plasmo-h-16 plasmo-pl-4" align="center">
        <img src={Logo} className="plasmo-w-6 plasmo-h-6" />
        <span className="plasmo-text-base plasmo-ml-1 plasmo-font-bold">G Map Leads Finder</span>
      </Flex>
      <Tabs
        tabPosition={'left'}
        items={[{
            label: <HomeFilled />,
            key: 'home',
            children: <div className="plasmo-pl-4 plasmo-pr-4">
              <Button onClick={openGMap} block type="primary"><b>Open Google Maps™</b></Button>
            </div>,
          }, {
            label: <SettingFilled />,
            key: 'settings',
            children: <div className="plasmo-pl-4 plasmo-pr-4">
              1. Random Interval between the requests for data (seconds)
            <Slider range  marks={marks} onChange={onChange} onChangeComplete={onChangeComplete} defaultValue={values} value={values} min={steps[0]} max={steps[steps?.length - 1]} />
              2. Fields to export.
              <Flex wrap="wrap" gap={0}>
                {fields.map((field, index) => {
                  const isActive = arr.includes(field);
                  return (
                    <Tag color={isActive ? `#108ee9` : `#f5f5f5`} style={{color: isActive ? undefined : 'rgba(0,0,0,.7)'}} onClick={() => toggle(field)} key={index} className="plasmo-justify-center plasmo-items-center plasmo-me-2 plasmo-mb-2 plasmo-cursor-pointer" >
                      <CheckCircleFilled style={{color: isActive ? undefined : '#b5b5b5'}}  />
                      <span>{field}</span>
                    </Tag>
                )})}
              </Flex>
            </div>,
          }]
        }
      />
    </div>
  )
}

export default IndexPopup
