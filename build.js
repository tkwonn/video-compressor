const { build } = require('electron-builder');

build({
    config: {
        productName: 'video-compressor',
        artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
        copyright: 'Copyright (c) 2024 Taesok Kwon',
        files: ['./**/*'],
        directories: {
            output: 'release',
        },
        publish: {
            provider: 'github',
            releaseType: 'draft',
        },
        win: {
            target: ['nsis', 'zip'],
            publisherName: 'Taesok Kwon',
        },
        nsis: {
            artifactName: '${productName}-${version}-win32-installer.exe',
        },
        mac: {
            category: 'public.app-category.developer-tools',
            target: {
                target: 'dmg', // or 'default', 'zip'
                arch: ['x64', 'arm64'],
            },
            identity: null,
            hardenedRuntime: false,
            gatekeeperAssess: false,
        },
        linux: {
            target: ['AppImage'], // or 'deb', 'snap'
            category: 'Development',
        },
    },
});
