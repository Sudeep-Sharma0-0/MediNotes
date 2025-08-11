<script>
  import Editor from "./components/Editor.svelte";

  let currentTitle = "";

  function handleTitleChange(event) {
    currentTitle = event.detail;
  }
</script>

<main>
  <Editor />
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
