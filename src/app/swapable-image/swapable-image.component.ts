import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UtilitiesService } from '../utilities';



@Component({
    templateUrl: './swapable-image.component.html',
    styleUrls: ['./swapable-image.component.css'],
    selector: 'app-swapable-image'
})
export class SwapableImageComponent implements AfterViewInit {


    @Input() url: string;
    @Output() urlChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() width = 200;
    @Input() blockStyle: boolean;
    @Input() prompt = 'Change';
    @Input() iconClass: string;
    @Input() pasteTargetId: string;
    @Input() showClear: boolean;

    imageType: string;
    dragTargetActive = false;
    fileElemId = UtilitiesService.newid();

    handleFiles(files) {
        if (files.srcElement) {
            files = files.srcElement.files;
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.imageType = file.type;
            const imageType = /^image\//;

            if (!imageType.test(file.type)) {
                continue;
            }
            const reader = new FileReader();

            const setUrl = (url) => {
                this.url = url;
                this.urlChange.emit(this.url);
            };
            reader.onload = (function () {
                return function (e) {

                    this.dragTargetActive = false;
                    setUrl(e.target.result);

                };
            })();

            reader.readAsDataURL(file);
        }
    }

    ngAfterViewInit() {
        if (this.pasteTargetId) {
            this.setupPasteHandler();
        }
    }

    clear(event) {
        this.url = null;
        this.urlChange.emit(this.url);
        event.cancelBubble = true;
        event.preventDefault();
        event.stopPropagation();
    }

    private setupPasteHandler() {

        if (!document.getElementById(this.pasteTargetId)) {
            setTimeout(() => this.setupPasteHandler(), 100);
            return;
        }

        document.getElementById(this.pasteTargetId).onpaste = (event: any) => {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;

            for (const index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    var reader = new FileReader();
                    const loadIt = (base64, fileName) => {
                        // const attachment = new NoteAttachmentModel(fileName, null, base64);
                        // this.attachments.push(attachment);
                        // this.missionService.showToast('Image added as attachment');
                        // if (!this.newNoteText) {
                        //     this.newNoteText = 'Screenshot Attachment';
                        // }
                        this.url = base64;
                        this.urlChange.emit(this.url);
                    };
                    reader.onload = function (event) {
                        const base64 = event.target.result;
                        let fileName = '';
                        if (base64 && base64.toString().indexOf('image/png')) {
                            fileName = 'screen-shot.png';
                        }
                        if (fileName) {
                            loadIt(base64, fileName);
                        }
                    }; // data url!
                    reader.readAsDataURL(blob);
                }
            }
        };
    }

    drop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
        this.dragTargetActive = false;
    }

    dragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    dragover(e) {
        e.stopPropagation();
        e.preventDefault();
        this.dragTargetActive = true;
    }

    dragleave(e) {
        e.stopPropagation();
        e.preventDefault();
        this.dragTargetActive = false;
    }
}
