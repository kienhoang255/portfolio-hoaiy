import clickSoundUrl from '~/assets/sounds/universfield-bubble-pop-cutted.mp3';

const audioPool: HTMLAudioElement[] = [];
const maxPoolSize = 4;

const preloadedAudio = new Audio(clickSoundUrl);
preloadedAudio.preload = 'auto';
preloadedAudio.volume = 0.45;
preloadedAudio.load();

function getAudio() {
    const cachedAudio = audioPool.pop();

    if (cachedAudio) {
        cachedAudio.src = clickSoundUrl;
        cachedAudio.volume = 0.45;
        cachedAudio.preload = 'auto';
        cachedAudio.load();
        return cachedAudio;
    }

    const audio = preloadedAudio.cloneNode(true) as HTMLAudioElement;
    audio.volume = 0.45;
    audio.preload = 'auto';
    return audio;
}

function releaseAudio(audio: HTMLAudioElement) {
    audio.pause();
    audio.currentTime = 0;
    audio.onended = null;
    audio.onerror = null;

    if (audioPool.length < maxPoolSize) {
        audioPool.push(audio);
    }
}

export function playClickSound() {
    if (typeof window === 'undefined') {
        return;
    }

    const audio = getAudio();
    audio.onended = () => releaseAudio(audio);
    audio.onerror = () => releaseAudio(audio);

    audio.currentTime = 0;
    void audio.play().catch(() => {
        releaseAudio(audio);
    });
}

export function withClickSound<T extends (...args: any[]) => void>(handler: T, ...args: Parameters<T>) {
    return () => {
        playClickSound();
        handler(...args);
    };
}
