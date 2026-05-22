use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct RawTick {
    pub symbol: String,       // e.g. "BTC/USD", "NIFTY50", "AAPL"
    pub exchange: Exchange,
    pub price: f64,
    pub volume: f64,
    pub timestamp_ms: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct OhlcvCandle {
    pub symbol: String,
    pub timeframe: String,    // "1m" | "5m" | "15m" | "1h" | "1d"
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: f64,
    pub time: i64,            // Unix seconds (TradingView format)
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Exchange {
    Kraken,
    HyperLiquid,
    Zerodha,
    Dhan,
    Upstox,
    Alpaca,
    IBKR,
    Yahoo,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Order {
    pub id: String,
    pub symbol: String,
    pub exchange: Exchange,
    pub side: OrderSide,
    pub order_type: OrderType,
    pub quantity: f64,
    pub price: Option<f64>,
    pub status: OrderStatus,
    pub timestamp_ms: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum OrderSide   { Buy, Sell }

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum OrderType   { Market, Limit, StopLoss, BracketOrder, GTT }

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum OrderStatus { Pending, Open, Filled, Cancelled, Rejected }

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
