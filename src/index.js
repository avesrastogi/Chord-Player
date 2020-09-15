// import { note, interval, transpose } from '@tonaljs/tonal';
// import {chord} from '@tonaljs/chord';

import { entries } from '@tonaljs/chord-dictionary';

const startNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

const startNotesSelector = document.querySelector('#start-note');
const octaveSelector = document.querySelector('#octave');

const app = {
    init() {
        this.setupStartNotes();
        this.setupOctaves();
    },
    setupStartNotes() {
        startNotes.forEach(noteName => {
            let noteNameOption = this.createElement('option', noteName);
            startNotesSelector.appendChild(noteNameOption);
        });       
    },
    setupOctaves() {
        for (let i = 1; i<=7; i++) {
            let octaveNumber = this.createElement('option', i);
            octaveSelector.appendChild(octaveNumber);
        }
    },
    createElement(elementName, content) {
        let element = document.createElement(elementName);
        element.innerHTML = content;
        return element;
    }
}
app.init();