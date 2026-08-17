export interface DemoAdvisorMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface DemoSuggestedQuestion {
  id: string
  text: string
}
