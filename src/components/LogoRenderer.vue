<script setup lang="ts">
    import {
        onMounted,
        onUnmounted,
        ref
    } from 'vue';

    const fontSize = ref( 30 );
    const elementID = ref( crypto.randomUUID() );

    const listener = () => {
        const el = document.getElementById( 'logo-' + elementID.value ) as HTMLDivElement;

        if ( !el ) fontSize.value = window.innerHeight * 0.05;
        else fontSize.value = el.clientHeight * 0.8;
    };

    onMounted( () => {
        window.addEventListener( 'resize', listener );
        listener();
    } );
    onUnmounted( () => {
        window.removeEventListener( 'resize', listener );
    } );

    defineProps<{
        'kind': 'full' | 'full-vertical' | 'eye'
    }>();
</script>

<template>
    <div :id="'logo-' + elementID" :class="[ 'rendered-logo', $props.kind ]" :style="`font-size: ${ fontSize }px;`">
        <p v-if="$props.kind !== 'eye'">
            EYE
        </p>
        <i class="fa fa-eye"></i>
        <p v-if="$props.kind !== 'eye'">
            TAP
        </p>
    </div>
</template>

<style lang="scss" scoped>
.rendered-logo {
    display: flex;
    justify-content: center;
    align-items: center;

    &.full, &.full-vertical {
        >p {
            padding: 0;
            margin: 0;
            font-family: 'Staatliches', sans-serif;
        }

        >i {
            font-size: 60%;
        }
    }
}
</style>
