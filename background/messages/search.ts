import type { PlasmoMessaging } from "@plasmohq/messaging"
import { SearchTypes } from "~const/enum"

let storedData = [];

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body
  console.log(`data search`, data)
  if (data.type === SearchTypes.StartSearch) {
    storedData = []
  }
  if (data.type === SearchTypes.OnRes) {
    storedData.push(data.data)
  }
  res.send({
    message: 'Hello from background',
  })
}
 
export default handler