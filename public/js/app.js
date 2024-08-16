import { setupEventListener } from './components/EventListener.js';
import { autoRefreshIframe } from './components/AutoRefresh.js';

setupEventListener();
window.onload = autoRefreshIframe;
