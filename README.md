<div align="center">

```
███╗   ██╗ █████╗ ████████╗██╗██╗   ██╗███████╗
████╗  ██║██╔══██╗╚══██╔══╝██║██║   ██║██╔════╝
██╔██╗ ██║███████║   ██║   ██║██║   ██║█████╗
██║╚██╗██║██╔══██║   ██║   ██║╚██╗ ██╔╝██╔══╝
██║ ╚████║██║  ██║   ██║   ██║ ╚████╔╝ ███████╗
╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
```

**A high-performance, locally installed desktop financial terminal**
**for Crypto · US Equities · Indian Equities**

![Rust](https://img.shields.io/badge/Rust-CE6A2E?style=flat-square&logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri_v2-24C8D8?style=flat-square&logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-FF6B35?style=flat-square&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Roadmap](#-roadmap) · [Data Sources](#-data--api-model) · [Contributing](#-contributing)

</div>

---

## Why NativeTerminal?

| | NativeTerminal | Cloud Terminal | Electron App |
|---|---|---|---|
| **Cloud costs** | ✅ Zero | ❌ High | ✅ Zero |
| **API key safety** | ✅ Machine-local, AES-256 | ❌ Stored on server | ⚠️ Local but unencrypted |
| **AI assistant** | ✅ Free, local Ollama | ❌ Paid API credits | ❌ None |
| **Memory usage** | ✅ ~80MB (Tauri) | — | ❌ ~400MB+ (Electron) |
| **Works offline** | ✅ Full functionality | ❌ No | ⚠️ Partial |

---

## ✦ Features

- **Live multi-asset streaming** — Crypto (Kraken/HyperLiquid), Indian equities (Zerodha/Dhan/Upstox), US equities (Alpaca/IBKR)
- **High-performance charts** — TradingView Lightweight Charts (Canvas/WebGL), multi-timeframe OHLCV, drawing tools
- **Order management** — Market, Limit, Stop-Loss, Bracket, GTT orders across all connected brokers
- **Encrypted key storage** — AES-256-GCM, machine-bound SQLite. Keys never leave your device
- **Local AI assistant** — Ollama-powered LLM for earnings parsing, news sentiment, trade journal analysis
- **Stock screener** — Multi-factor, saved filter configs, alert on trigger
- **Backtester** — Rust-speed OHLCV replay with full strategy statistics
- **Options chain** — Greeks, OI, PCR, strategy payoff builder

---

## ✦ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                             │
│                                                                 │
│  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐  │
│  │  Kraken          │ │  Zerodha · Dhan  │ │  Alpaca · IBKR │  │
│  │  HyperLiquid     │ │  Upstox          │ │  Yahoo Finance │  │
│  │  Public WS · Free│ │  OAuth · NSE/BSE │ │  WS + REST     │  │
│  └────────┬─────────┘ └────────┬─────────┘ └───────┬────────┘  │
│           └────────────────────┼───────────────────┘           │
└────────────────────────────────┼────────────────────────────────┘
                                 │ raw frames
┌────────────────────────────────▼────────────────────────────────┐
│                     RUST CORE ENGINE                            │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ WS Multiplexer  │  │ OHLCV Aggregator │  │ Order Router  │  │
│  │ async-tungstenite│  │ tick→candle      │  │ Market/Limit  │  │
│  │ auto-reconnect  │  │ 30fps throttle   │  │ SL/Bracket/GTT│  │
│  └─────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ OAuth Handler   │  │ Alert Engine     │  │ Screener Core │  │
│  │ Zerodha / Alpaca│  │ price/volume/    │  │ multi-factor  │  │
│  │ token exchange  │  │ indicator triggers│  │ saved configs │  │
│  └─────────────────┘  └──────────────────┘  └───────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ typed commands + events
┌────────────────────────────────▼────────────────────────────────┐
│                     TAURI v2  IPC BRIDGE                        │
│                                                                 │
│   invoke()  ←──── request / response ────►  #[tauri::command]  │
│   listen()  ←──── streaming tick data  ────  app.emit()        │
│                                                                 │
│              OS native webview · system tray                    │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
┌──────────────▼──────────┐    ┌─────────────▼──────────────────┐
│    SQLITE + SECURE STORE │    │         LOCAL AI ENGINE        │
│                          │    │                                │
│  AES-256-GCM encrypted   │    │  Ollama  localhost:11434       │
│  · Broker API keys       │    │  · Llama 3 / Mistral / Phi-3  │
│  · OHLCV history         │    │  · Earnings call parser        │
│  · Chart layouts         │    │  · News sentiment              │
│  · Watchlists            │    │  · Trade journal analysis      │
│  · Screener configs      │    │  · Streamed token-by-token     │
└──────────────────────────┘    └────────────────────────────────┘
                                 │ Zustand stores
┌────────────────────────────────▼────────────────────────────────┐
│                   REACT 18 + TYPESCRIPT FRONTEND                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ ChartPanel   │  │ OrderBook    │  │ AIChat Panel          │ │
│  │ TradingView  │  │ AG Grid      │  │ Streamed LLM output   │ │
│  │ LWC v4       │  │ virtualized  │  │ market queries        │ │
│  │ Canvas/WebGL │  │ depth/blotter│  │ strategy analysis     │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Portfolio    │  │ Screener UI  │  │ BrokerSettings        │ │
│  │ NAV · P&L    │  │ filter builder│  │ OAuth connect flows   │ │
│  │ heatmap      │  │ saved configs│  │ watchlist manager     │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✦ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Core Engine** | Rust + Tokio | Zero GC pauses. Handles hundreds of concurrent WebSocket streams without stutter. |
| **Desktop Shell** | Tauri v2 | OS native webview → ~10MB binary vs ~400MB Electron. Full OS API access. |
| **Frontend** | React 18 + TypeScript + Vite | Component model fits the multi-panel workspace. Vite gives instant HMR. |
| **State** | Zustand | Minimal, fast. No boilerplate. Market data slices stay independent. |
| **Charts** | TradingView Lightweight Charts v4 | Canvas/WebGL rendering. Handles 50k+ candles without DOM jank. |
| **Grid** | AG Grid Community | Virtualized rows. Essential for order book depth with thousands of entries. |
| **Styling** | TailwindCSS | Utility-first. Dark theme via `dark:` variants. |
| **Database** | SQLite via sqlx | Local-first. AES-256-GCM encrypted. Machine-bound keys. |
| **Local AI** | Ollama | Runs Llama 3 / Mistral on your own GPU. Zero API credits. |

---

## ✦ Quick Start

### Prerequisites

```bash
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. Install Node 18+
# → https://nodejs.org

# 3. Install Tauri CLI
npm install -g @tauri-apps/cli

# 4. Install Ollama (optional — for AI features)
# → https://ollama.com
ollama pull llama3
```

### Install & Run

```bash
# Clone
git clone https://github.com/your-username/native-terminal
cd native-terminal

# Install JS dependencies
npm install

# Start dev server (opens native desktop window)
cargo tauri dev
```

### Build for Production

```bash
cargo tauri build
# Outputs a native installer for your platform:
#   Windows  →  src-tauri/target/release/bundle/msi/
#   macOS    →  src-tauri/target/release/bundle/dmg/
#   Linux    →  src-tauri/target/release/bundle/appimage/
```

---

## ✦ Project Structure

```
native-terminal/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       ├── main.rs              ← registers all commands + plugins
│       ├── lib.rs               ← shared types (RawTick, OhlcvCandle, Order)
│       ├── websocket/
│       │   ├── kraken.rs        ← Crypto WebSocket
│       │   ├── zerodha.rs       ← Indian equities (binary frame parser)
│       │   └── alpaca.rs        ← US equities
│       ├── broker/
│       │   ├── auth.rs          ← OAuth flows (Zerodha, Alpaca)
│       │   ├── orders.rs        ← order routing
│       │   └── instruments.rs   ← NSE instrument CSV cache
│       ├── aggregator/
│       │   └── ohlcv.rs         ← tick → candle builder, 30fps throttle
│       ├── screener/
│       │   └── mod.rs
│       ├── alerts/
│       │   └── mod.rs
│       └── db/
│           ├── mod.rs           ← AES-256-GCM encrypted store
│           └── schema.sql
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── market.ts            ← TypeScript mirrors of all Rust structs
    ├── stores/
    │   ├── useTickerStore.ts
    │   ├── useOrderStore.ts
    │   ├── usePortfolioStore.ts
    │   ├── useAlertStore.ts
    │   └── useAIStore.ts
    ├── hooks/
    │   ├── useChart.ts
    │   ├── useTicker.ts
    │   └── useBroker.ts
    └── components/
        ├── Workspace/           ← multi-panel layout
        ├── ChartPanel/          ← TradingView wrapper
        ├── OrderBook/           ← AG Grid blotter
        ├── Portfolio/
        ├── Screener/
        ├── BrokerSettings/      ← OAuth connect UI
        └── AIChat/              ← Ollama streaming panel
```

---

## ✦ Data & API Model

The app uses a **"Bring Your Own Broker" (BYOB)** model. No centralised data distribution. No subscription fees.

**Cryptocurrency**
- Kraken and HyperLiquid public WebSockets — zero cost, no auth required
- Supports BTC, ETH, SOL, and all pairs available on each exchange

**Indian Equities (NSE/BSE)**
- Users authenticate via their existing Zerodha / Dhan / Upstox account using OAuth
- Zerodha sends binary-encoded tick frames (not JSON) — the Rust parser handles this natively
- NSE instrument list is downloaded once daily and cached in SQLite

**US Equities**
- Alpaca and IBKR via broker WebSocket for real-time execution
- Yahoo Finance REST API for delayed broad-market scanning (no auth needed)

> **Security note:** All broker access tokens are stored exclusively in AES-256-GCM encrypted SQLite on your local machine. The encryption key is derived from your machine's hardware ID — credentials cannot be used on another device even if the database file is copied.

---

## ✦ Roadmap

```
Phase 1 — Scaffold         [██████████] done
Phase 2 — Crypto + Charts  [████████░░] active
Phase 3 — Zerodha / NSE    [░░░░░░░░░░] next
Phase 4 — Alpaca / US      [░░░░░░░░░░] upcoming
Phase 5 — Order Management [░░░░░░░░░░] upcoming
Phase 6 — Local AI         [░░░░░░░░░░] upcoming
```

| Phase | Milestone | Status |
|---|---|---|
| **1** | Tauri scaffold. Rust mock tick → React live display. | ✅ Done |
| **2** | Kraken WebSocket → OHLCV aggregator → TradingView candlestick chart. | 🔄 Active |
| **3** | Zerodha OAuth, AES-256 key storage, NSE binary tick feed, instrument search. | ⬜ Next |
| **4** | Alpaca US equities stream. Yahoo Finance delayed fallback. | ⬜ Upcoming |
| **5** | Order placement across all brokers. AG Grid live blotter. Paper trading mode. | ⬜ Upcoming |
| **6** | Ollama local LLM. Streamed AI chat panel. Earnings + sentiment tools. | ⬜ Upcoming |

**Planned beyond Phase 6**
- Options chain viewer with Greeks, OI, PCR, payoff builder
- Backtesting engine (Rust-speed OHLCV replay)
- Multi-factor stock screener with saved configs
- Trade journal with AI-powered pattern analysis
- Alerts engine (price, indicator, volume, custom scripts)
- Voice query via local Whisper model

---

## ✦ Core Architecture Rules

These rules are enforced throughout the codebase:

1. **Keys never leave the machine.** Broker API keys are AES-256-GCM encrypted before writing to SQLite and are machine-bound via hardware-derived key.

2. **One-directional data flow.** `Exchange WS → Rust → Tauri IPC → Zustand → React`. React components never call exchange or broker APIs directly.

3. **IPC pattern.** `invoke()` for request-response (place order, fetch quote). `listen()` + `app.emit()` for streaming tick data. Tick emissions are throttled to 30fps in the Rust aggregator.

4. **No `unwrap()` in production paths.** All Rust command handlers return `Result<T, String>`. All errors surface to the frontend as typed error states.

5. **TypeScript mirrors Rust exactly.** `/src/types/market.ts` is the canonical frontend type file. Every new Rust struct gets a corresponding TypeScript interface.

6. **No Electron.** Tauri uses the OS native webview. This is non-negotiable.

---

## ✦ Contributing

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name

# Run tests
cargo test
npm run test

# Check Rust formatting
cargo fmt --check
cargo clippy -- -D warnings

# Submit a PR against main
```

**Good first issues** — look for the `good-first-issue` label on GitHub Issues.
**New data sources** — adding a new broker or exchange is self-contained in `src-tauri/src/websocket/`.
**Frontend components** — new panels follow the existing `useChart` / `useTicker` hook patterns in `/src/hooks/`.

---

## ✦ License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with Rust · Tauri · React · TradingView · Ollama

*Zero cloud costs. Maximum privacy. Free local AI.*

</div>
