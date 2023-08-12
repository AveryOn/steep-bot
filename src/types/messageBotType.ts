// Интерфйес для автокомплита, заблаговременного выявления ошибок и аннотации типов для сущности сообщения чата

interface MessageBotType {
    id: string,
    content: string | null,
    fromBot?: boolean,
    isLastMessage?: boolean,
    isFirstMessage?: boolean,
}

export { MessageBotType };