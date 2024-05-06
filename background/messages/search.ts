import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body
  console.log(`data search`, data)
  res.send({
    message: 'Hello from background',
  })
}
 
export default handler