use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            if args.len() > 1 {
                let file_path = args[1].clone();
                if file_path.ends_with(".pdf") {
                    let _ = app.emit("open-file", file_path);
                }
            }
        }))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let args: Vec<String> = std::env::args().collect();
            if args.len() > 1 {
                let file_path = args[1].clone();
                if file_path.ends_with(".pdf") && std::path::Path::new(&file_path).exists() {
                    let app_handle = app.handle().clone();
                    std::thread::spawn(move || {
                        // Small delay to ensure the frontend is ready to listen
                        std::thread::sleep(std::time::Duration::from_millis(500));
                        let _ = app_handle.emit("open-file", file_path);
                    });
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
