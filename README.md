# Video compressor

[![GitHub last commit](https://img.shields.io/github/last-commit/tkwonn/video-compressor?color=chocolate)](https://github.com/tkwonn/video-compressor/commits/)
[![Release](https://github.com/tkwonn/video-compressor/actions/workflows/release.yml/badge.svg)](https://github.com/tkwonn/video-compressor/actions/workflows/release.yml)

<br>

## What is this

This desktop application that allows users compress or convert videos easily through a simple dashboard.

<br>

## Demo

Step1.  
Upload your video file and select the desired compression settings.  
Click the "Compress" button to start the compression process.

https://github.com/user-attachments/assets/d209c39b-f2ba-4671-a6fe-e83afef4e49f


Step2.  
Upload your video and choose the target video format.  
Click the "Convert" button to begin the conversion.

https://github.com/user-attachments/assets/7d7f076f-a5d8-4bac-b3cc-a1a10e25b0d9


Step3.  
Get the `.dmg` from the releases page and launch the app.

https://github.com/user-attachments/assets/cdb51ad8-4183-4de8-933e-b5d645f6fa71

<br>

## Built with

| **Category**                             | **Technology**                           |
|------------------------------------------|------------------------------------------|
| Frontend                                 | HTML, TailwindCSS, TypeScript, React     |
| Framework & Tools                        | Electron.js, ffmpeg                      |
| CI/CD                                    | GitHub Actions                           |

<br>

## Download

[Download from here](https://github.com/tkwonn/video-compressor/releases)

> [!IMPORTANT]
> This application is currently unsigned as it was created solely for learning purposes.   

#### Why is the app unsigned?

Code signing requires an Apple Developer Program subscription and other paid certificates for Windows.

<br>

## Architecture

Electron's built-in IPC mechanism implements message-passing between the main process, which accesses the OS and ffmpeg via Node.js, and the renderer process, which manages the UI through the HTML DOM.

```mermaid
flowchart LR
    subgraph MP["Main Process"]
        N[Node.js Runtime]
        FF[ffmpeg Library]
        IM[ipcMain]
    end

    subgraph CP["Channel Communication"]
        CH["Message Channel"]
    end

    subgraph RP["Renderer Process"]
        IR[ipcRenderer]
        UI[User Interface]
    end

    N --> FF
    IM <--> CH
    CH <--> IR
    IR --> UI

    classDef mainProcess fill:#e1f5fe,stroke:#01579b,color:#01579b
    classDef rendererProcess fill:#f3e5f5,stroke:#4a148c,color:#4a148c
    classDef channel fill:#fff3e0,stroke:#e65100,color:#e65100

    class MP mainProcess
    class RP rendererProcess
    class CP channel
```