
import Logo from './images/logo.png';
import "~style.css"
import { Storage } from "@plasmohq/storage"

import { Button, Flex, Slider, Tabs, Tag, type SliderSingleProps } from "antd";
import { CheckCircleFilled, HomeFilled, SettingFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { FieldsKey, ReqRangeKey } from '~const/local';
import { sendToBackground, sendToBackgroundViaRelay, sendToContentScript } from '@plasmohq/messaging';
import { SearchTypes } from '~const/enum';
import {fields as fieldsData} from '~const/fields';
const searchStorage = new Storage()

const steps = new Array(6).fill(0).map((_, i) => i + 5);
const marks: SliderSingleProps['marks'] = steps.reduce((acc, cur) => Object.assign(acc, {[cur]: `${cur}S`}), {});
const fields = fieldsData.map(item => item.label);
function IndexPopup() {
  const [arr, setArr] = useState([...fields]);
  const toggle = (field) => {
    const newArr = arr.includes(field) ? arr.filter(f => f !== field) : [...arr, field]
    setArr(newArr);
    searchStorage.set(FieldsKey, newArr)
    sendToBackground({
      name: "search",
      body: {
        type: SearchTypes.StoreExportFields,
        data: newArr
      },
    }).then((res) => {
      console.log(res)
    })
  }
  const openGMap = () => {
    chrome.tabs.create({ url: 'https://www.google.com/maps' }, function(tab) {
    });
  }
  const [values, setValues] = useState([steps[0], steps[steps?.length - 1]]);
  
  const initReqConfig = async () => {
    const localFields = await searchStorage.get<string[]>(FieldsKey)
    if (localFields) {
      setArr(localFields)
    }
    const data = await searchStorage.get<number[]>(ReqRangeKey)

    if (data) {
      setValues(data)
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
              <Flex wrap="wrap" gap={0} className='plasmo-mt-2'>
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
