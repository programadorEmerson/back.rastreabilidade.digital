import { create, Whatsapp, SocketState } from 'venom-bot'
import fs from 'fs'
import { SendFileProps, SendMessageLinkProps, SendMessageProps } from '~types/messages'

export type QrCodeProps = {
  base64Qr: string;
  asciiQr: string;
  attempts: number;
  urlCode: string;
};

class Sender {
  private client: Whatsapp
  private connected: boolean = false
  private qr: QrCodeProps

  get isConnected (): boolean {
    return this.connected
  }

  get qrCode (): QrCodeProps {
    return this.qr
  }

  constructor () {
    this.initialize()
  }

  async sendText ({ to, body }: SendMessageProps) {
    await this.client.sendText(to, body)
  }

  async convertPDFToBase64 (file: string): Promise<string> {
    // convert pdf including mime type
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err)
        }
        const base64 = Buffer.from(data).toString('base64')
        resolve(base64)
      })
    })
  }

  async sendFile ({ to }: SendFileProps) {
    await this.client
      .sendImage(
        to,
        'https://img.elo7.com.br/product/main/2C475C8/teste-teste.jpg',
        'title-emerson',
        'capition-emerson'
      )
      .then((result) => {
        console.log('Result: ', result) // return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro) // return object error
      })
  }

  async sendLinkPreview ({ to, body, url }: SendMessageLinkProps) {
    (await this.client.sendLinkPreview(to, url, body)) as any
  }

  private initialize () {
    const qr = (
      base64Qr: string,
      asciiQr: string,
      attempts: number,
      urlCode: string
    ) => {
      this.qr = {
        base64Qr,
        asciiQr,
        attempts,
        urlCode
      }
    }

    const status = (statusSession: string) => {
      this.connected = ['isLogged', 'qrReadSuccess', 'chatsAvailable'].includes(
        statusSession
      )
    }

    const start = (client: Whatsapp) => {
      this.client = client

      client.onStateChange((state: SocketState) => {
        this.connected = state === SocketState.CONNECTED
      })
    }

    create('ws-dender-dev', qr, status)
      .then((client) => start(client))
      .catch((err) => console.log(err))
  }
}

export default Sender
