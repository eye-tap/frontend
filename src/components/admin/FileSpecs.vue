<script setup lang="ts">
    import type {
        ImportConfig
    } from '@/types/import';

    const props = defineProps<{
        'parsers': ImportConfig<unknown>[]
    }>();
</script>

<template>
    <div>
        <div v-for="parser, idx in props.parsers" :key="idx">
            <h3>{{ parser.display }}</h3>
            <p>Required columns</p>
            <ul>
                <li v-for="opt, key in parser.options" :key="key">
                    {{ opt.display }}: {{ opt.searchTerms?.reduce( ( str, val ) => str + ', ' + val ) ?? 'No requirements' }}
                    Default: {{ opt.value }}
                    {{ opt.notes ? 'Notes: ' + opt.notes : '' }}
                </li>
            </ul>
        </div>
    </div>
</template>
