<script setup lang="ts">
    import {
        type ConfigPreset,
        availableTime,
        setConfigPreset
    } from '@/editor/config-presets';
    import {
        ref
    } from 'vue';
    import request from '@/ts/util/request';

    const show = ref( false );
    const cmd = ref( '' );

    console.warn( '[DevTools] EYE-TAP Dev tools available via Ctrl + Shift + X' );

    window.addEventListener( 'keydown', ev => {
        if ( ev.key == 'X' && ev.ctrlKey ) {
            show.value = !show.value;

            if ( show.value ) {
                setTimeout( () => {
                    document.getElementById( 'dev-tool-input' )!.focus();
                }, 250 );
            }
        }
    } );

    interface Command {
        'desc': string,
        'cmd': () => void,
        'successMsg'?: string,
        'errorMsg'?: string
    }

    interface CommandList {
        [cmd: string]: Command
    }

    const cmds: CommandList = {
        'timer:reset': {
            'desc': 'Reset the user\'s timeout',
            'cmd': () => {
                request.updateUserOptions( 'startTime', new Date().toISOString() );
            }
        },
        'ethics:reset': {
            'desc': 'Reset the user\'s ethics confirmation status',
            'cmd': () => {
                request.updateUserOptions( 'ethicsApproved', 'false' );
            }
        },
        'ended:reset': {
            'desc': 'Reset the user\'s prematurely ended status',
            'cmd': () => {
                request.updateUserOptions( 'ended', 'false' );
            }
        },
        'preset:set': {
            'desc': 'Set the current preset for the user',
            'cmd': () => {
                setConfigPreset(
                    prompt( 'Enter the preset to use (can be full, basic, nopreannotations)' ) as ConfigPreset,
                    availableTime.value
                );
            }
        },
        'timer:set': {
            'desc': 'Set the available time in seconds available to logout',
            'cmd': () => {
                availableTime.value = parseInt( prompt( 'Enter the time in seconds to logout' )! );
            }
        }
    };

    const cmdHandler = ( ev: KeyboardEvent ) => {
        if ( ev.key === 'Enter' ) {
            if ( cmd.value === 'help' ) {
                alert( 'Available commands' + Object.keys( cmds )
                    .map( val => {
                        return `\n- ${ val }: ${ cmds[ val ]!.desc }`;
                    } )
                    .reduce( ( prev, curr ) => {
                        return prev + curr;
                    } ) );

                return;
            }

            const currCmd = cmds[ cmd.value ];

            if ( currCmd ) {
                try {
                    currCmd.cmd();
                    alert( currCmd.successMsg ? currCmd.successMsg : 'Command executed successfully' );
                    cmd.value = '';
                } catch ( e ) {
                    alert( currCmd.errorMsg ? currCmd.errorMsg : 'Command failed. See browser console for more details' );
                    console.error( '[DevTools] Command run error', e );
                }
            } else {
                alert( 'Command ' + cmd.value + ' not found' );
            }
        }
    };
</script>

<template>
    <div v-if="show" class="dev-console">
        <input
            id="dev-tool-input"
            v-model="cmd"
            type="text"
            @keydown="cmdHandler"
        >
    </div>
</template>

<style lang="scss" scoped>
.dev-console {
    position: fixed;
    top: 30vh;
    width: 40vw;
    left: 30vw;
    box-shadow: 10px 5px 5px black;
    z-index: 100;

    >input {
        width: 100%;
        height: 50px;
        font-size: 20px;
    }
}
</style>
