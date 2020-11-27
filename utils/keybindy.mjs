/*
syntax

alt := A, alt, option, alternative

ctrl := C, ctrl, control

meta := M, alt, meta

shift := S, shift

modifiers := <meta>, <ctrl>, 

keycombo := ((<modifiers>+)*-<key><space><repeat || composing>?)+

*/

const alt   = ['alt', 'alternative', 'option', 'opt', '⌥'];
const ctrl  = ['ctrl', 'control'];
const meta  = ['meta', 'windows', 'win', '⊞', '⌘', 'command', 'cmd'];
const shift = ['shift'];

function parseKeyCombo(string) {
    if (typeof string !== 'string') throw 'argument is not of type \'string\'';
    const phaser = { strKeyCombo: string, phase: 0, phases: [] };
    const sequences = string
        .toLowerCase()
        .split(' ')
        .map(str => str.split('+'));

    for (const sequence of sequences) {
        const phase = {
            altKey   : isFalse,
            ctrlKey  : isFalse,
            metaKey  : isFalse,
            shiftKey : isFalse,
            repeat   : isFalse,
        };
        // string is either a modifier or a key with settings
        for (const string of sequence) {
            console.log('oaeu')
            if (string[0] === '-' || string[0] === '#') {
                const [keyOrCode, settings] = string.slice(1).split(':');
                switch (string[0]) {
                    case '-': phase.key  = is(keyOrCode); break;
                    case '#': phase.code = is(keyOrCode); break;
                }
                if (settings) {
                    const settingsArray = settings.slice(1).slice(0, -1).split(',');
                    phaser.settings = settingsArray;
                    if (settingsArray.includes('repeat'    )) phase.repeat    = isTrue;
                    if (settingsArray.includes('onrepeat'  )) phase.repeat    = alwaysTrue; // TODO implment logic: only runs once when repeating starts
                    if (settingsArray.includes('canrepeat' )) phase.repeat    = alwaysTrue;
                    if (settingsArray.includes('trusted'   )) phase.isTrusted = true;
                }
            }
            if (alt  .includes(string)) phase.altKey   = isTrue;
            if (ctrl .includes(string)) phase.ctrlKey  = isTrue;
            if (meta .includes(string)) phase.metaKey  = isTrue;
            if (shift.includes(string)) phase.shiftKey = isTrue;
        }
        phaser.phases.push(phase);
    }

    return phaser;
}

function isFalse(test) { return test === false; }
function isTrue(test)  { return test === true; }
function is(value)      { return (test) => test === value }
function alwaysTrue()  { return true; }

function matches(event, phase) {
    for (const prop in phase) {
        if (prop === 'settings') continue;
        if(!phase[prop](event[prop])) return false;
    }
    return true;
}

function keyEventHandler(event, bindings) {
    for (const [binding, fn] of bindings.entries()) {
        if (matches(event, binding.phases[binding.phase])) {
            console.log(called);
            binding.phase++;
        }
        if (binding.phase >= binding.phases.length) {
            binding.phase = 0;
            fn(event);
        }

        // e.code
        // e.isComposing
        // e.locale
        // e.location

        // e.isTrusted

        // e.defaultPrevented
    }
}

export function KeyBinder(element) {
    const down = new Map();
    this.down = down;
    const up = new Map();

    element.addEventListener('keydown', e => keyEventHandler(e, down));
    element.addEventListener('keyup',   e => keyEventHandler(e, up)  );

    this._bind = (phaser, fn, when) => {
        switch (when) {
            case 'down': down.set(phaser, fn); break;
            case 'up'  : up  .set(phaser, fn); break;
        }
    }

    this.bind = (keyCombo, fn, when = 'down') => {
        this._bind(parseKeyCombo(keyCombo));
    };

    this.unbind = () => {};

    this.removeAllBindings = () => {};

    this.setBindingsFromObject = () => {};
}