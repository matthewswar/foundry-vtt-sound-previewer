class SoundPreviewer extends Application {
    constructor(...args) {
        super(...args);
        this.currentClip = undefined;
        this.preppedFile = undefined;
    }

    play(filePath) {
        if (!this.preppedFile || this.preppedFile != filePath) {
            this.stop();
            this.preppedFile = filePath;
        } else if (this.preppedFile === filePath && !this.currentClip) {
            this.currentClip = new Audio(filePath);
            this.currentClip.addEventListener('ended', () => this.currentClip = undefined);
            this.currentClip.play();
        }
    }

    stop() {
        if (this.currentClip) {
            this.currentClip.pause();
            this.currentClip = undefined;
            this.preppedFile = undefined;
        }
    }
}

Hooks.on('init', () => {
    const previewer = new SoundPreviewer();
    Hooks.on('renderFilePicker', (_app, html, _data) => {
        previewer.stop();
        html.find('.file').click(ev => {
            const filePath = ev.currentTarget.dataset.path;
            const fileExtension = filePath.substring(filePath.lastIndexOf('.')).slice(1);
            if (CONST.AUDIO_FILE_EXTENSIONS.includes(fileExtension)) {
                previewer.play(filePath);
            } else {
                previewer.stop();
            }
        })
    });

    Hooks.on('closeFilePicker', () => {
        previewer.stop();
    });
})

