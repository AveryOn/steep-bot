// Функция анимации появления текста
// Писал давно, не помню как работает, поэтому не стал тратить время на доскональное комментирование
function animateText(text: string, callback: (result: string, isStop?: boolean) => void, onlyUp: boolean = false, delay: number = 60): void {
    let arrayWords: string[] = text.split('');
    let resultText: string = '';
    let count: number = 0;
    for (let word of arrayWords) {
        count++
        setTimeout(() => {
            resultText += word;
            callback(resultText);
            if (resultText.length === text.length) {
                callback(resultText, true);
            }
        }, count * delay);
    }
    if (!onlyUp) {
        setTimeout(() => {
            arrayWords = resultText.split('');
            for (let word of arrayWords) {
                count++
                setTimeout(() => {
                    arrayWords.pop()
                    callback(arrayWords.join(''));
                }, count * 40);
            }
        }, count * 100);
    }
    else return;
}

export default animateText;