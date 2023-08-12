<!-- Не классическая кнопка а опция (реплика) выбора, которую выдвает бот как доступные варианты вопросов -->
<template>
    <div class="button">
        <slot></slot>
    </div>
</template>


<style scoped>
.button {
    position: relative;
    height: max-content;
    width: max-content;
    padding: 5px 15px;
    border: 3px solid rgba(15, 15, 15, 0.2);
    border-radius: 10px;
    background-color: #43cfb8;
    font-style: italic;
    transition: all 0.2s ease;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, .4);
    margin: 2px;
    cursor: pointer;
}
.button:hover {
    transition: all 0.2s ease;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0);
}
</style>