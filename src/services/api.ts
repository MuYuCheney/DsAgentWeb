import { ChatMessage } from '../types'

// 将接口定义移到类外部
interface StreamChunk {
  type?: 'think' | 'response'
  content: string
}

export class ApiService {
  private static baseUrl = 'http://localhost:8000'

  // 处理聊天消息流
  static async handleChatStream(reader: ReadableStreamDefaultReader<Uint8Array>, 
                              onChunk: (chunk: StreamChunk) => void) {
    const decoder = new TextDecoder()
    let thinkContent = ''
    let responseContent = ''
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const text = decoder.decode(value)
        const lines = text.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6) // 移除 'data: ' 前缀
            if (content === '[DONE]') continue
            
            // 检查是否是思考过程
            if (content.includes('<think>')) {
              thinkContent = content.replace('<think>', '').replace('</think>', '')
              onChunk({ type: 'think', content: thinkContent })
            } else {
              responseContent += content
              onChunk({ type: 'response', content: responseContent })
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error)
      throw error
    }
  }

  // 聊天接口
  static async chat(messages: ChatMessage[]) {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.body?.getReader()
  }

  // 推理接口
  static async reason(messages: ChatMessage[]) {
    const response = await fetch(`${this.baseUrl}/reason`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.body?.getReader()
  }

  // 添加搜索方法
  static async search(messages: ChatMessage[]) {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.body?.getReader()
  }
} 