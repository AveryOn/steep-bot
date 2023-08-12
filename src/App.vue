<template>
    <div class="main">
        <!-- Виджет с Чат-Ботом -->
        <botView></botView>
    </div>
</template>

<script setup lang="ts">
import botView from './views/botView.vue';

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --sync: calc(1vw + 1vh);
}
::selection {
    color: rgb(0, 0, 0);
    background-color: rgb(92, 224, 182);
}
.main {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(60deg, #6D72F1, #dbdcfd);
}

</style>
