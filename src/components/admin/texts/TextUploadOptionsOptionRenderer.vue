<script setup lang="ts">
    import type {
        ImportConfig
    } from '@/types/import';
    import SwitchOption from '@/components/settings/SwitchOption.vue';
    import inputFilter from '@/ts/util/inputFilter';

    const props = defineProps<{
        'parsers': ImportConfig<unknown>[];
    }>();
    const selected = defineModel<number>( {
        'default': -1
    } );

    const fileSelectHandler = ( opt: string, ev: InputEvent ) => {
        const files = ( ev.target as HTMLInputElement ).files;

        if ( !files || !files[ 0 ] ) return;

        props.parsers[ selected.value ]!.options[ opt ]!.value = files[ 0 ];
    };
</script>

<template>
    <div>
        <div class="parser-select">
            <p>Data parser</p>
            <select v-model="selected">
                <option :value="-1">
                    Auto
                </option>
                <option v-for="parser, idx in props.parsers" :key="idx" :value="idx">
                    {{ parser.display }}
                </option>
            </select>
        </div>
        <div v-if="selected >= 0">
            <div v-for="opt, idx in props.parsers[ selected ]!.options" :key="idx">
                <input
                    v-if="opt.input === 'string'"
                    v-model="opt.value as string"
                    type="text"
                    :placeholder="opt.display"
                >
                <input
                    v-else-if="opt.input === 'number'"
                    v-model.number="opt.value as number"
                    type="text"
                    :placeholder="opt.display"
                    @keydown="inputFilter.numeric"
                >
                <input
                    v-else-if="opt.input === 'file'"
                    type="file"
                    :placeholder="opt.display"
                    @change="ev => fileSelectHandler( idx, ev as InputEvent )"
                >
                <SwitchOption v-else-if="opt.input === 'boolean'" v-model="opt.value as boolean" text="Use TextID on fixations" />
                <select v-else-if="opt.input === 'dropdown'" v-model="opt.value">
                    <option v-for="val, i in opt.options!" :key="i" :value="val"></option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use '@/scss/admin/general';

    .parser-select {
        display: flex;
        align-items: center;

        >p {
            margin: 0;
            margin-left: 1rem;
            color: var( --theme-background-text-20 );
        }
    }

    select {
        margin: 1rem;
    }
</style>
