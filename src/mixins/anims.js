

export default {
    isPlayingAnims(animsKey) {
        return this.anims.isPlaying && this.anims.getName() === animsKey;
    }
}