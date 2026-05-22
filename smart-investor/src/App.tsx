import React, { useEffect, useState, useRef } from "react";
import { useTicker } from "./hooks/useTicker";
import { useTickerStore } from "./stores/useTickerStore";
import "./App.css";

// Interface for mock orders
interface MockOrder {
  id: string;
  symbol: string;
  exchange: string;
  side: "Buy" | "Sell";
  orderType: string;
  quantity: number;
  price?: number;
  status: "Filled" | "Open" | "Pending";
  timestamp: string;
}

function App() {
  const symbol = "BTC/USD";
  
  // Wire up the Tauri listener hook for BTC/USD
  useTicker(symbol);
  
  // Get live tick from Zustand store
  const tick = useTickerStore((state) => state.ticks[symbol]);
  
  // States for visual effects & tracking
  const [flashClass, setFlashClass] = useState("");
  const prevPriceRef = useRef<number | null>(null);
  const [tickerHistory, setTickerHistory] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Chat panel states
  const [chatMessages, setChatMessages] = useState([
    { sender: "assistant", text: "Hello! I am NativeTerminal's local AI assistant running on Ollama. How can I help you analyze the markets today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Track price changes to apply flash animation classes
  useEffect(() => {
    if (!tick) return;
    
    if (prevPriceRef.current !== null && prevPriceRef.current !== tick.price) {
      const isUp = tick.price > prevPriceRef.current;
      setFlashClass(isUp ? "flash-up" : "flash-down");
      
      // Keep a historical log of the last 15 prices for minor tick visualizer
      setTickerHistory(prev => [tick.price, ...prev.slice(0, 14)]);

      // Reset flash animation class after 300ms
      const timer = setTimeout(() => {
        setFlashClass("");
      }, 300);
      return () => clearTimeout(timer);
    }
    
    prevPriceRef.current = tick.price;
  }, [tick?.price]);

  // Handle chat submission
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputMessage("");

    // Simulate a local AI response (Phase 6 will connect to real Ollama)
    setTimeout(() => {
      let aiResponse = "I can see the live feed for BTC/USD is streaming correctly. ";
      if (userMsg.toLowerCase().includes("price") || userMsg.toLowerCase().includes("btc")) {
        aiResponse += tick 
          ? `The current price of BTC/USD is $${tick.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Price has drifted in a sine pattern for Phase 1 testing.`
          : "The BTC/USD price data is currently loading.";
      } else {
        aiResponse += "For Phase 1 scaffold, this chat panel shows how local models running on Ollama will interact with terminal state to provide real-time analysis.";
      }
      setChatMessages((prev) => [...prev, { sender: "assistant", text: aiResponse }]);
    }, 1000);
  };

  // Render mock order book blotter rows
  const mockOrders: MockOrder[] = [
    { id: "ORD-94821", symbol: "BTC/USD", exchange: "Kraken", side: "Buy", orderType: "Limit", quantity: 0.15, price: 64920.00, status: "Filled", timestamp: "12:05:32" },
    { id: "ORD-94822", symbol: "AAPL", exchange: "Alpaca", side: "Buy", orderType: "Market", quantity: 20, price: 181.25, status: "Filled", timestamp: "12:06:14" },
    { id: "ORD-94823", symbol: "BTC/USD", exchange: "Kraken", side: "Sell", orderType: "Limit", quantity: 0.05, price: tick ? Math.round((tick.price + 5.0) * 100) / 100 : 65050.00, status: "Open", timestamp: "12:07:45" },
    { id: "ORD-94824", symbol: "NIFTY50", exchange: "Zerodha", side: "Buy", orderType: "BracketOrder", quantity: 75, price: 22150.00, status: "Pending", timestamp: "12:08:02" }
  ];

  // Format currency
  const formatCurrency = (val?: number) => {
    if (val === undefined) return "$0.00";
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="terminal-layout">
      {/* Header */}
      <header className="terminal-header">
        <div className="brand-section">
          <div className="brand-logo">N</div>
          <span className="brand-title">NativeTerminal</span>
          <span className="brand-version">v0.1.0-alpha</span>
        </div>
        <div className="system-status">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Backend Feed: Active</span>
          </div>
          <div className="status-indicator">
            <div className="status-dot idle"></div>
            <span>SQLite DB: Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace-grid">
        {/* Left Sidebar: Market Watch & Feed */}
        <section className="sidebar-panel">
          <div className="terminal-panel" style={{ height: "100%" }}>
            <div className="panel-header">
              <span className="panel-title">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ color: "var(--color-accent)" }}>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.5 7.5V3h1v4.5H12v1H7.5z"/>
                </svg>
                Watchlist
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace" }}>1 ACTIVE</span>
            </div>
            
            <div className="panel-body ticker-container">
              {/* Active BTC/USD Ticker */}
              <div className={`ticker-card selected ${flashClass}`}>
                <div className="ticker-card-header">
                  <span className="ticker-symbol">BTC/USD</span>
                  <span className="ticker-exchange">Kraken WS</span>
                </div>
                
                <div className="ticker-price-row">
                  <span className="ticker-price">
                    {tick ? formatCurrency(tick.price) : "$65,000.00"}
                  </span>
                  {tick && (
                    <span className={`ticker-change ${tick.price >= 65000.0 ? "up" : "down"}`}>
                      {tick.price >= 65000.0 ? "▲" : "▼"} 
                      {(((tick.price - 65000.0) / 65000.0) * 100).toFixed(3)}%
                    </span>
                  )}
                </div>

                <div className="ticker-meta">
                  <span>Vol: {tick ? tick.volume.toFixed(4) : "0.00"} BTC</span>
                  <span>{tick ? `${(tick.timestamp_ms % 100000).toString().padStart(5, "0")}ms` : "Syncing..."}</span>
                </div>
              </div>

              {/* Mock Tickers to populate UI */}
              <div className="ticker-card" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                <div className="ticker-card-header">
                  <span className="ticker-symbol">AAPL</span>
                  <span className="ticker-exchange">Alpaca (P4)</span>
                </div>
                <div className="ticker-price-row">
                  <span className="ticker-price">$181.25</span>
                  <span className="ticker-change up">▲ 0.42%</span>
                </div>
                <div className="ticker-meta">
                  <span>Vol: 24.5M</span>
                  <span>Delayed</span>
                </div>
              </div>

              <div className="ticker-card" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                <div className="ticker-card-header">
                  <span className="ticker-symbol">NIFTY50</span>
                  <span className="ticker-exchange">Zerodha (P3)</span>
                </div>
                <div className="ticker-price-row">
                  <span className="ticker-price">₹22,150.20</span>
                  <span className="ticker-change down">▼ -0.15%</span>
                </div>
                <div className="ticker-meta">
                  <span>NSE Cash</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Center Section: Charting and Order Blotter */}
        <section className="center-content">
          {/* Chart Panel Mock */}
          <div className="terminal-panel chart-panel-placeholder">
            <div className="chart-grid-mockup"></div>
            <div className="chart-label">
              <div className="chart-symbol-badge">
                {symbol}
              </div>
              <p style={{ margin: "4px 0", fontSize: "14px" }}>
                Live Stream Price: <span style={{ color: "var(--color-accent)", fontFamily: "monospace", fontWeight: "bold" }}>
                  {tick ? formatCurrency(tick.price) : "$65,000.00"}
                </span>
              </p>
              <div className="chart-line-mockup"></div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px" }}>
                TradingView Candlestick renderer connects to Kraken WebSocket in Phase 2
              </p>
            </div>
            
            <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: "8px" }}>
              <span className="brand-version" style={{ cursor: "pointer" }}>1m</span>
              <span className="brand-version" style={{ opacity: 0.5 }}>5m</span>
              <span className="brand-version" style={{ opacity: 0.5 }}>15m</span>
              <span className="brand-version" style={{ opacity: 0.5 }}>1D</span>
            </div>
          </div>

          {/* Order Blotter (Ag Grid style) */}
          <div className="terminal-panel">
            <div className="panel-header">
              <span className="panel-title">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ color: "var(--color-accent)" }}>
                  <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
                  <path d="M5 4h6v1H5V4zm0 3h6v1H5V7zm0 3h6v1H5v-1z"/>
                </svg>
                Order Blotter (AG Grid blotter)
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>4 ORDERS RECORDED</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              <table className="blotter-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>SYMBOL</th>
                    <th>EXCHANGE</th>
                    <th>SIDE</th>
                    <th>TYPE</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th>STATUS</th>
                    <th>TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((ord, idx) => (
                    <tr key={idx}>
                      <td style={{ color: "var(--text-dimmed)" }}>{ord.id}</td>
                      <td style={{ fontWeight: 600 }}>{ord.symbol}</td>
                      <td>{ord.exchange}</td>
                      <td style={{ color: ord.side === "Buy" ? "var(--color-green)" : "var(--color-red)", fontWeight: 600 }}>{ord.side}</td>
                      <td>{ord.orderType}</td>
                      <td>{ord.quantity}</td>
                      <td>{formatCurrency(ord.price)}</td>
                      <td>
                        <span className={`badge-status ${ord.status.toLowerCase()}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{ord.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right Section: AI Assistant Panel */}
        <section className="ai-panel">
          <div className="terminal-panel" style={{ height: "100%" }}>
            <div className="panel-header">
              <span className="panel-title">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ color: "var(--color-accent)" }}>
                  <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM3 8.062C3 5.17 5.234 3 8 3s5 2.17 5 5.062c0 1.954-1.166 3.374-2.632 3.812-.09.028-.168.106-.168.2v.328a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-.328c0-.094-.078-.172-.168-.2C4.167 11.436 3 10.016 3 8.062z"/>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                </svg>
                Ollama Copilot (llama3)
              </span>
              <span className="brand-version">Local CPU</span>
            </div>

            <div className="chat-history">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="chat-input-wrapper">
              <input
                type="text"
                placeholder="Ask Ollama about BTC..."
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                Send
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="terminal-footer">
        <div className="footer-item">
          <span style={{ color: "var(--color-green)", fontSize: "14px" }}>●</span>
          <span>TAURI TERMINAL IPC BRIDGE: OK</span>
        </div>
        <div className="footer-item">
          <span>TICK FEED RATE: 2.0/s (500ms)</span>
        </div>
        <div className="footer-item" style={{ gap: "10px" }}>
          <span>PORT: 5173</span>
          <span>CLIENT TIMING: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;