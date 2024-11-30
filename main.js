import App from './App'
import { createSSRApp } from 'vue'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// ... 其他代码 