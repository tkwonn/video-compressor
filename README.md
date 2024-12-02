# Video compressor

[![GitHub last commit](https://img.shields.io/github/last-commit/tkwonn/video-compressor?color=chocolate)](https://github.com/tkwonn/video-compressor/commits/)
[![Release](https://github.com/tkwonn/video-compressor/actions/workflows/release.yml/badge.svg)](https://github.com/tkwonn/video-compressor/actions/workflows/release.yml)

<br>

## What is this

This desktop application lets users compress or convert videos easily through a simple dashboard.

<br>

## Demo

Step1.  
Upload your video file and select the desired compression settings.  
Click the "Compress" button to start the compression process.

Step2.  
Upload your video file and choose the target video format.  
Click the "Convert" button to begin the conversion.

Step3.  
Get the `.dmg` from the releases page and launch the app.

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

## Architecture

```mermaid
flowchart LR
    subgraph MP[Main Process]
        N[Node.js Runtime]
        FF[ffmpeg Library]
    end

    subgraph IPC[IPC Layer]
        SM[Shared Memory]
    end

    subgraph RP[Renderer Process]
        UI[User Interface]
        DOM[HTML DOM]
    end

    N --> FF
    MP <--> SM
    SM <--> RP
    UI --> DOM

    classDef mainProcess fill:#e1f5fe,stroke:#01579b
    classDef rendererProcess fill:#f3e5f5,stroke:#4a148c
    classDef ipcLayer fill:#fff3e0,stroke:#e65100

    class MP mainProcess
    class RP rendererProcess
    class IPC ipcLayer
```