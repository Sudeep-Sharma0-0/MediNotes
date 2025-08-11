<script>
    import { onMount, onDestroy } from "svelte";
    import { createEditorInstance } from "../lib/editorSetup.js";

    let editor;
    let editorElement;

    $: if (editorElement && !editor) {
        editor = createEditorInstance(editorElement);
    }

    onDestroy(() => {
        editor.destroy();
    });
</script>

<div bind:this={editorElement} class="editor" />

<style>
    .editor {
        flex: 1;
        overflow-y: auto;
        padding: 0;
        margin: 0;
        background-color: #161b22;
        border-radius: 0;
        color: #adbac7;
        outline: none;
        min-height: 300px;
        font-size: 16px;
    }
</style>
