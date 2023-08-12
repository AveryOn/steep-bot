<template>
    <div class="message-container">

        <!-- Экземпляр сообщения Бота -->
        <div class="message bot" v-show="props.data.fromBot" :id="props.data.id">
            <span class="message__icon">
                <img class="message__icon img" src="../assets/chatbot.png" alt="chatbot-icon">
            </span>
            <p class="message__content bot" :style="contentBotStyle">
                {{ content }}
            </p>
        </div>

        <!-- Экземпляр Пользовательского сообщения -->
        <div class="message user" v-show="!props.data.fromBot" :id="props.data.id">
            <p class="message__content user"  :style="contentUserStyle">
                {{ content }}
            </p>
            <span class="message__icon">
                <img class="message__icon img" src="../assets/profile.png" alt="profile-icon">
            </span>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { MessageBotType } from '../types/messageBotType';
import animateText from '../tools/animateText';
import gsap from 'gsap';

const emit = defineEmits(['readyBotMessage'])

const props = defineProps<{
    data: MessageBotType,
}>();

// Анимированный контент сообщения
const content = ref('');

// Стили для сообщений бота
const contentBotStyle = computed(() => {
    if(!props.data.isFirstMessage && !props.data.isLastMessage) {
        return {
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px'
        }
    }
    if(!props.data.isFirstMessage && props.data.isLastMessage) {
        return {
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '10px'
        }
    }
});

// Стили для сообщений Пользователя
const contentUserStyle = computed(() => {
    if(!props.data.isFirstMessage && !props.data.isLastMessage) {
        return {
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px'
        }
    }
    if(!props.data.isFirstMessage && props.data.isLastMessage) {
        return {
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '10px'
        }
    }
});

onMounted( async () => {

    /* Корректировка стилей сообщений в зависимости от их расположения в чате */
    const message = document.getElementById(props.data.id) as HTMLDivElement;
    // Если Сообщение отправил Пользователь а не БОТ
    if(!props.data.fromBot) {
        // Анимация появления пользовательского сообщения
        gsap.to('.message.user', { duration: 0.5, right: 0 });
        if(typeof props.data.content === 'string') {
            content.value = props.data.content;
        }
        // Если сообщение не в начале партии сообщений (а к примеру второе и т.п)
        // Тогда для иммитации явной партии сообщений убираются иконки
        if(!props.data.isFirstMessage) {
            message.style.marginRight = '7px'
            const icon = message.childNodes[1] as HTMLImageElement;
            icon.style.visibility = 'hidden';
            icon.style.height = '0px';
        } else {
            // Для Сообщения который является первым из пачки сообщений делаем отступ его контейнеру
            const container = message.parentNode as HTMLDivElement;
            container.style.marginTop = '10px'
        }
    }
    // Если это сообщение создал БОТ
    if(props.data.fromBot) {
        // Анимация появления сообщения БОТА
        gsap.to('.message.bot', { duration: 0.5, left: 0 });
        if(typeof props.data.content === 'string') {
            // Для сообщений бота добавил свою функцию анимирования текста.
            // Параметр isReady в колбэке говорит о том, что анимация текста окончена
            animateText(props.data.content, (result, isReady) => {
                if(isReady) {
                    // событие readyBotMessage будет использовано для реализации необходимой логики на освнове окончания анимации текста
                    emit('readyBotMessage')
                }
                // callback вызывается на каждый символ в тексте, парамтер result передает нарастающее со временем сообщение и записывает
                // его в тело сообщения 
                content.value = result;
            }, true, 50);
        }
        // Если сообщение не в начале партии сообщений (а к примеру второе и т.п)
        // Тогда для иммитации явной партии сообщений убираются иконки
        const icon = message.childNodes[0] as HTMLImageElement;
        if(!props.data.isFirstMessage) {
            icon.style.visibility = 'hidden';
            icon.style.height = '0px';
        } else {
            // Для первого сообщения выравнивание для корректного отображения
            const container = message.parentNode as HTMLDivElement;
            container.style.marginTop = '10px'
            message.style.alignItems = 'flex-end';
        }
    }
})

</script>

<style scoped>
.message-container {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 auto 0 0;
    width: 100%;
    min-height: 20px;
    height: max-content;
    /* border: 1px solid black; */
    margin: 2px 0 auto 0;
    cursor: default;
}

.message__icon.img {
    position: relative;
    top: 8px;
    width: 35px;
    height: 35px;
    pointer-events: none;
}
.img{
    top: 8px;
}
.message {
    position: relative;
    max-width: 60%;
    width: max-content;
    display: flex;
    align-items: center;
}
.message.bot {
    left: -100%;
    margin: 0 auto 0 2px;
}
.message.user {
    right: -100%;
    margin: 0 2px 0 auto;
}
.message__content {
    min-height: 28px;
    height: max-content;
    position: relative;
    display: flex;
    word-wrap: break-word;
    padding: 5px 15px;
    background-color: white;
}
.message__content.bot{
    margin-left: 5px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 10px;
}
.message__content.user{
    margin-right: 5px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 0;
}
</style>