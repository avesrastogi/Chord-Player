import { transpose , note } from '@tonaljs/tonal';
import { chord } from "@tonaljs/chord";
import { ChordType } from "@tonaljs/tonal";
import { howler, how } from "howler";

const sound = new Howl({
    src: ['assets/pianosprite.mp3'],
    onload() {
        console.log('Sound file has been loaded.');
        soundEngine.init();
    },
    onloaderror(e, msg) {
        console.log('Error', e, msg);
    }
});

const startNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

const startNotesSelector = document.querySelector('#start-note');
const octaveSelector = document.querySelector('#octave');
const buttons = document.querySelector('.buttons');
const intervalsInChord = document.querySelector('.intervals-in-chord');
const notesInChord = document.querySelector('.notes-in-chord');

let selectedStartNote = 'C';
let selectedOctave = '1';
let selectedChord;

const app = {
    init() {
        this.setupStartNotes();
        this.setupOctaves();
        this.setupButtons();
        this.setupEventListeners();
    },
    setupStartNotes() {
        startNotes.forEach(noteName => {
            let noteNameOption = this.createElement('option', noteName);
            startNotesSelector.appendChild(noteNameOption);
        });       
    },
    setupOctaves() {
        for (let i = 1; i<=4; i++) {
            let octaveNumber = this.createElement('option', i);
            octaveSelector.appendChild(octaveNumber);
        }
    },
    setupButtons() {
        const chordNames = ChordType.all().map(entry => {
            return entry.aliases[0];   
        });
        chordNames.forEach(chordName => {
            let chordButton = this.createElement('button', chordName);
            buttons.appendChild(chordButton);
        });
    },
    setupEventListeners() {
        startNotesSelector.addEventListener('change', () => {
            selectedStartNote = startNotesSelector.value;
            // console.log(selectedStartNote);
        });
        octaveSelector.addEventListener('change', () => {
            selectedOctave = octaveSelector.value;
            // console.log(selectedOctave);
        });
        buttons.addEventListener('click', (event) => {
            //to prevent console of <div class='buttons'>
            if(event.target.classList.contains('buttons')) {
                return;
            }
            selectedChord = event.target.innerText;
            this.displayAndPlayChord(selectedChord);
        })
    },
    displayAndPlayChord(selectedChord) {
        let chordIntervals = chord(selectedChord).intervals;
        intervalsInChord.innerText = chordIntervals.join('-');

        const startNoteWithOctave = selectedStartNote + selectedOctave;
        let chordNotes = chordIntervals.map(val => {
            return transpose(startNoteWithOctave, val);
        });
        notesInChord.innerText = chordNotes.join('-');
        soundEngine.play(chordNotes);
    },
    createElement(elementName, content) {
        let element = document.createElement(elementName);
        element.innerHTML = content;
        return element;
    }
}

const soundEngine = {
    init() {
        //know the time difference between two notes
        const lengthOfNote = 2400;
        let timeIndex = 0;
        for(let i = 24; i<=96; i++) {
            sound['_sprite'][i] = [timeIndex, lengthOfNote];
            timeIndex += lengthOfNote; 
        }
        // sound.play('44');
    },
    play(soundSequence) {

        const soundSequenceMidiNumbers = soundSequence.map(noteName => {
            return note(noteName).midi;
        }); 

        sound.volume(0.75);
        soundSequenceMidiNumbers.forEach(noteMidiNumber => {
            // console.log(noteMidiNumber);
            sound.play(noteMidiNumber.toString());
        });
    }
}

app.init();

