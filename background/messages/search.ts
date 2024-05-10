import type { PlasmoMessaging } from "@plasmohq/messaging"

import { message } from "antd";
import { SearchTypes } from "~const/enum"
import { EventEmitter } from 'events';
import { Storage } from "@plasmohq/storage"

const emitter = new EventEmitter();
let storedData = [];
function waitForOnRes(): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout after 30 seconds'));
    }, 30000); // 30 seconds

    emitter.once('SearchTypes.OnRes', () => {
      clearTimeout(timeout);
      resolve(storedData);
    });
  });
}



const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage()


  const data = req.body
  console.log(`data search`, data)

  if (data.type === SearchTypes.StartSearch) {
    storedData = []
    const data = await waitForOnRes();
    res?.send({message: 'search finished', data: storedData})
    return;
  }
  if (data.type === SearchTypes.Reset) {
    storedData = []
    res?.send({message: 'search reset', data: storedData})
    return;
  }
  if (data.type === SearchTypes.SearchNextPage) {
    const data = await waitForOnRes();
    res?.send({message: 'search next page finished', data: storedData})
    return;
  }
  if (data.type === SearchTypes.StoreReqConfig) {
    
    storage.set('requestConfig', data?.data)
    res?.send({message: 'search config stored'})
    return;
  }
  if (data.type === SearchTypes.GetConfig) {
    const config = await storage.get('requestConfig')
    res?.send({message: 'search config result', data: config})
    return;
  }
  if (data.type === SearchTypes.OnRes) {
    storedData.push(...(data.data || []))
    emitter.emit('SearchTypes.OnRes', );
    res.send({
      message: 'search ressponse',
      data: storedData
    })
  }
}
 
export default handler