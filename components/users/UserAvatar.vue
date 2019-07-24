<template>
  <span class="user-avatar" :style="setAvatarStyle()"></span>
</template>

<script>
export default {
  name: "UserAvatar",
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: "100px"
    }
  },
  methods: {
    setAvatarStyle() {
      this.user.avatar =
        "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/009.png";
      return `background-image: url(${this.user.avatar}); height: ${this.size}; width: ${this.size};`;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-avatar {
  border-radius: 50%;
  background-size: cover;
  background-color: $white;
  display: inline-block;
}
</style>
