import { entries } from '@tonaljs/chord-type';

const startNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

const startNotesSelector = document.querySelector('#start-note');
const octaveSelector = document.querySelector('#octave');
const buttons = document.querySelector('.buttons');

let selectedStartNote;

const app = {
    init() {
        this.setupStartNotes();
        this.setupOctaves();
        this.setupButtons();
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
    setupButtons() {
        const chordNames = entries().map(entry => {
            return entry.aliases[0];
        });
        chordNames.forEach(chordName => {
            let chordButton = this.createElement('button', chordName);
            buttons.appendChild(chordButton);
        });
    },
    setupEventListeners() {
        startNotesSelector.addEventListener('change', () => {
            selectedStartNote = startNotesSelector.nodeValue;

        });
    },
    createElement(elementName, content) {
        let element = document.createElement(elementName);
        element.innerHTML = content;
        return element;
    }
}
app.init();
