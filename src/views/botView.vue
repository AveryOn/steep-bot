<template>
    <div class="bot-view">
        <!-- Блок с отрисовкой сообщений -->
        <div class="bot-view__chat-block">
            <!-- Компонент характеризующий сообщение Бота и Пользователя -->
            <messageBotComp 
            v-for="message of messages"
            :data="message" 
            :key="message.id"
            @ready-bot-message="messageBotReady"
            ></messageBotComp>
            <!-- Блок с набором доступных реплик (в в этом контексте "опции") доступные пользователю на выбор, которые выдает бот -->
            <div class="bot-view__options" v-show="isSelectOption">
                <!-- Единицы Опций (Реплики) -->
                <buttonComp class="option" id="pizza" @click="selectionOption('pizza')">Order pizza!</buttonComp>
                <buttonComp class="option" id="alarm" @click="selectionOption('alarm')">Set an alarm</buttonComp>
                <buttonComp class="option" id="weather" @click="selectionOption('weather')">Bring out the weather</buttonComp>
            </div>
        </div>
        <!-- Интерактивная кнопка-меню бота. Можно наладить функционал меню чат-бота, но всё зависит от ТЗ  -->
        <span class="bot-view__bot-menu" id="bot-menu"></span>
    </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ref, watch, onMounted } from 'vue';
import messageBotComp from '@/components/messageBotComp.vue';
import buttonComp from '@/components/buttonComp.vue';
import { MessageBotType } from '../types/messageBotType';

// Массив с сообщениями виджета
const messages = ref<MessageBotType[]>([]);

// Служит в роли шлюза для того чтобы рендерить или убирать компонент с набором реплик (опций)
const isSelectOption = ref<boolean>(false);

// Накладывает анимации появления на набор реплик (опций)
function openOptionsMenu(tl: gsap.core.Timeline) {
    gsap.to('.bot-view__options', { duration: 0.4, left: '0%' });
    tl.to('#pizza', { duration: 0.4, left: 0 });
    tl.to('#alarm', { duration: 0.3, left: 0 });
    tl.to('#weather', { duration: 0.2, left: 0 });
}

// Накладывает анимации скрытия на набор реплик (опций)
function closeOptionsMenu(){
    gsap.to('.bot-view__options', { duration: 0.4, left: '-100%' });
    gsap.to('#pizza', { duration: 0.4, left: '-100%' });
    gsap.to('#alarm', { duration: 0.3, left: '-100%' });
    gsap.to('#weather', { duration: 0.2, left: '-100%' });
}

// Обработчик событий, которое я определил в компоненте messageBotComp. Отрабатывает когда, анимация текста сообщения завершена.
function messageBotReady() {
    const blockMessages = document.querySelector('.bot-view__chat-block') as HTMLDivElement;
    // Скролит блок сообщений вниз автоматический всякий раз когда анимация сообщения завершена
    setTimeout(() => {
        blockMessages.scroll({
            top: blockMessages.scrollHeight,
            behavior: "smooth",
        });
    }, 0);
}

// Служит для выборки реплки (опции), предложенных ботом.
async function selectionOption(elementID: 'pizza' | 'alarm' | 'weather') {
    // При выборе реплики (опции) происходит анимация скрытия реплик
    closeOptionsMenu();
    // создание таймлайна для последовательного выполнения анимаций
    const tl = gsap.timeline();
    const content = (document.getElementById(elementID) as HTMLButtonElement).innerText;
    // создает новое сообщение с контентом который был расположен в innerText кнопки реплики (опции)
    await createMessage(false, { id: `ID-${Date.now()}`, content});
    // Иммитация перегрузки, для того, чтобы создать сообщение с подходящим реплике(опции) контентом
    if(elementID === 'pizza') await createMessage(true, { id: `ID-${Date.now()}`, content: "Okay, I'll order a pizza. Is there anything else I can do?"}, 900);
    if(elementID === 'alarm') await createMessage(true, { id: `ID-${Date.now()}`, content: "Okay, I set an alarm. Is there anything else I can do?"}, 900);
    if(elementID === 'weather') await createMessage(true, { id: `ID-${Date.now()}`, content: "The weather is simply magnificent! Is there anything else I can do?"}, 900);
    // Костыльный timeout, подстраивал так, чтобы он снова открывал набор реплик(опций) ровно после того, когда ответное сообщение бота 
    // было сформировано
    setTimeout(() => {
        // Рендерит блок с репликами(опциями)
        isSelectOption.value = true;
        openOptionsMenu(tl)
    }, 3000 );

}

// Создает новое сообщение
// isBot - Указывает на то, создается ли сообщение ботом или пользователем
// data - необходимые данные сообщения, которые отвеают за контент, отрисовку, позиционирование и оформление (через JS)
function createMessage(isBot: boolean, data: MessageBotType, delay = 200): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            // Берет последнее сообщение из массива чатов для того, чтобы решить задачу с компоновкой нескольких сообщений
            // в одну партию, если они отправлены подряд одно за другим одним из собеседников чата
            const lastMessage: MessageBotType | undefined = messages.value[messages.value.length - 1];
            // Если предыдущее сообщение в чате существует
            if(lastMessage) {
                // Если сообщение создается Ботом
                if(isBot) {
                    // Если у сообщения поле fromBot true, тогда указываем последнему сообщению в массиве, что оно теперь не последнее
                    // Так как новосозданное сообщение будет последним (замыкающим)
                    if(lastMessage.fromBot) {
                        messages.value[messages.value.length - 1].isLastMessage = false;
                        // Поэтому данное сообщение не может быть первым, так как перед ним есть еще одно сообщение от его же создателя
                        // (входит в его партию)
                        data.isFirstMessage = false;
                        // Так как это новосозданное сообщение, то оно будет являтся последним вообщем.
                        data.isLastMessage = true;
                        // Обязательно указывается поле fromBot, для коректировки стилей
                        data.fromBot = isBot;
                        setTimeout(() => { 
                            // с задержкой добавляем созданный объект сообщения
                            return resolve(messages.value.push(data)); 
                        }, delay);
                    } else {
                        // Если предыдущее сообщение не было от БОТА, а от пользователя, то мы объявляем последнее сообщение последней
                        // из своей партии, так как сейчас будет создаваться сообщение БОТОМ (и будет инициализирована новая партия сообщений бота)
                        messages.value[messages.value.length - 1].isLastMessage = true;
                        // Так как данное сообщение открывает новую партию сообщений, то указываем, что оно первое
                        data.isFirstMessage = true;
                        // также оно является последним, потому что оно новосозданное
                        data.isLastMessage = true;
                        data.fromBot = isBot;
                        setTimeout(() => { 
                            // Добавление в общий массив
                            return resolve(messages.value.push(data)); 
                        }, delay);
                    }
                }
                // Если сообщение создается Пользователем
                else if(!isBot) {
                    // Если предыдущее сообщение было от БОТА 
                    if(lastMessage.fromBot) {
                        // Объявялем о новой партии сообщений указывая данному сообщению, что оно первое в своей партии
                        data.isFirstMessage = true;
                        // И Также оно является последним на данный момент 
                        data.isLastMessage = true;
                        data.fromBot = isBot;
                        setTimeout(() => { 
                            return resolve(messages.value.push(data)); 
                        }, delay);
                    } else {
                        messages.value[messages.value.length - 1].isLastMessage = false;
                        data.isFirstMessage = false;
                        data.isLastMessage = true;
                        data.fromBot = isBot;
                        setTimeout(() => { 
                            // Добавление в общий массив
                            return resolve(messages.value.push(data)); 
                        }, delay);
                    }
                }
            } 
            // Если массив пуст и сообщений до этого не было.
            else {
                // Указываем то это сообщение будет началом новой партии сообщений
                data.isFirstMessage = true;
                data.isLastMessage = true;
                data.fromBot = isBot;
                setTimeout(() => { 
                    // Добавление в общий массив
                    return resolve(messages.value.push(data)); 
                }, delay);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });

}

onMounted(async () => {
    // Отслеживание каждого изменения поля, которе указывает активен ли блок с репликами (опциями)
    // Для того, чтобы выполнять автоматический скролл в конец области блока сообщений
    const blockMessages = document.querySelector('.bot-view__chat-block') as HTMLDivElement;
    watch(()=> isSelectOption.value, () => {
        setTimeout(() => {
            blockMessages.scroll({
                top: blockMessages.scrollHeight,
                behavior: "smooth",
            });
        }, 0);
    });
    setTimeout( async() => {
        // При первой загрузке рендерим блок с набором базовых реплик(опций). Но на данном этапе их не видно так как они смещены влево
        // Для анимации
        isSelectOption.value = true;
        const tl_Chat = gsap.timeline();
        const tl_Menu = gsap.timeline();
        // Ожидаем выполнение анимации блока с сообщениями (скатывание сверху вниз)
        await Promise.resolve(tl_Chat.to('.bot-view__chat-block', { delay: 0, duration: 0.4, height: '90%'}));
        // Проверяем если массив пуст, то создаем первые приветственные сообщения для БОТА
        if(!messages.value.length) {
            // значение true первым аргументом будет указывать, что сообщение создается БОТОМ
            await createMessage(true, { id: `ID-${Date.now()}`, content: 'Hello Human!' });
            // Последний аргумент указывает на задержку анимации
            await createMessage(true, { id: `ID-${Date.now()}`, content: 'What can I do for you?' }, 800);
        }
        // Анимация вращения меню кнопки чата
        tl_Menu.to(".bot-view__bot-menu", {
            delay: 0.4,
            duration: 0.6,
            left: 'auto',
            x: 5,
            rotation: 370,
            visibility: 'visible',
            ease: "none",
        });
        tl_Menu.to(".bot-view__bot-menu", {
            duration: 0.5,
            rotation: 360,
            x: 0,
        });
        // Выполняется анимация в которой реплики(опции) выезжают поочередно в блок реплик(опций)
        openOptionsMenu(tl_Menu);
    }, 300);
    // Эффект поступательного движения кнопки чат-бота
    const botMenu = document.getElementById('bot-menu') as HTMLSpanElement;
    botMenu.addEventListener('mouseover', () => {
        gsap.to(botMenu, { duration: 0.5, rotate: 0, });
    });
    botMenu.addEventListener('mouseleave', () => {
        gsap.to(botMenu, { delay: 0.2, duration: 0.5, rotate: 360, });
    });
});

</script>

<style scoped>
::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(25,25,25,.4);
    border-radius: 20px;
}

::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0);
}
.bot-view {
    position: relative;
    width: 300px;
    height: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(-45deg, #6D72F1, #888cf9);
    border-radius: 15px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, .4);
    overflow: hidden;
    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    font-weight: bolder;
    color: rgb(58, 58, 58);
}
.bot-view__chat-block {
    position: absolute;
    right: 7px;
    left: 7px;
    top: 6px;
    height: 0%;
    border-radius: 15px;
    /* box-shadow: 0px 0px 5px rgba(0, 0, 0, .4); */
    background: rgba(0, 0, 0, .1);
    padding: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
.bot-view__options {
    /* position: absolute; */
    position: relative;
    height: max-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 10px;
    padding: 5px;
    /* background-color: rgba(15,15,15,.2); */
}
.option {
    position: relative;
    left: -100%;
}
.bot-view__bot-menu {
    position: absolute;
    bottom: 4px;
    width: 40px;
    height: 40px;
    left: -100px;
    visibility: hidden;
    border-radius: 50%;
    background-color: #888cf9;
    background-image: url(../assets/chatbot.png);
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .4);
}
</style>