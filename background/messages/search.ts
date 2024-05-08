import type { PlasmoMessaging } from "@plasmohq/messaging"

import { message } from "antd";
import { SearchTypes } from "~const/enum"
import { EventEmitter } from 'events';
const emitter = new EventEmitter();
let storedData = [];

function waitForOnRes(): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout after 30 seconds'));
    }, 30000); // 30 seconds

    emitter.once('SearchTypes.OnRes', (data) => {
      clearTimeout(timeout);
      resolve(data);
    });
  });
}



const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body
  console.log(`data search`, data)

  if (data.type === SearchTypes.StartSearch) {
    storedData = []
    const data = await waitForOnRes();
    res?.send({message: 'search finished'})
    return;
  }
  if (data.type === SearchTypes.SearchNextPage) {
    const data = await waitForOnRes();
    res?.send({message: 'search next page finished'})
    return;
  }
  if (data.type === SearchTypes.OnRes) {
    storedData.push(...(data.data || []))
    emitter.emit('SearchTypes.OnRes');
  }
  res.send({
    message: storedData,
  })
}
 
export default handler