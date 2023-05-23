// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::BufReader;
use rodio::{Decoder, OutputStream, Sink};
use cpal::traits::{DeviceTrait, HostTrait};
use serde::Serialize;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_sound,stop_sound,get_output_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Debug, Serialize)]
struct OutputDeviceInfo {
    name: String,
    id: usize,
}

#[tauri::command]
fn get_output_devices() -> Vec<OutputDeviceInfo> {
    let host = cpal::default_host();
    let output_devices = host.output_devices().unwrap();

    let output_devices: Vec<_> = output_devices
        .filter(|device| device.name().is_ok())
        .collect();

    output_devices
        .iter()
        .enumerate()
        .map(|(index, device)| OutputDeviceInfo {
            name: device.name().unwrap(),
            id: index,
        })
        .collect()
}

#[tauri::command(async)]
async fn play_sound(_sound_name: String, sound_path: String, output_device_id: usize) {
    let host = cpal::default_host();
    let output_devices = host.output_devices().unwrap();

    let filtered_devices: Vec<_> = output_devices
        .filter(|device| device.name().is_ok())
        .collect();

    let output_device = &filtered_devices[output_device_id];

    let (_stream, stream_handle) = OutputStream::try_from_device(output_device).unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    let file = BufReader::new(File::open(sound_path).unwrap());
    // Decode that sound file into a source
    let source = Decoder::new(file).unwrap();

    sink.append(source);

    // The sound plays in a separate thread. This call will block the current thread until the sink
    // has finished playing all its queued sounds.
    sink.sleep_until_end();
}

#[tauri::command]
fn stop_sound(_name: &str) {

}

