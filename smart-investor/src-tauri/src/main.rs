// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use smart_investor_lib::{RawTick, Exchange};
use tauri::Emitter;

#[tauri::command]
fn fetch_simulated_price(ticker: &str) -> String {
    format!("Rust Backend says: The simulated price of {} is $45,231.00", ticker)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![fetch_simulated_price])
        .setup(|app| {
            let handle = app.handle().clone();
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(500));
                let base_price = 65000.0;
                let mut angle: f64 = 0.0;
                
                loop {
                    interval.tick().await;
                    
                    // Simple deterministic drift using sine wave
                    angle += 0.05;
                    let drift = angle.sin() * 25.5; // fluctuates within +/- 25.5
                    let price = base_price + drift;
                    
                    // Get current timestamp in milliseconds
                    let timestamp_ms = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .map(|d| d.as_millis() as i64)
                        .unwrap_or(0);
                        
                    let tick = RawTick {
                        symbol: "BTC/USD".to_string(),
                        exchange: Exchange::Kraken,
                        price,
                        volume: 2.34 + drift.abs() * 0.03,
                        timestamp_ms,
                    };
                    
                    // Emit tick to the frontend
                    let _ = handle.emit("tick", &tick);
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}