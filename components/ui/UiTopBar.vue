<template>
  <section class="ui-top-bar">
    <div class="left">
      <UserAvatar :user="me" size="40px" />
    </div>
    <div class="right">
      <button @click="reset">{{ $t("global.reset") }}</button>
      <button @click="disconnect">{{ $t("global.disconnect") }}</button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { Game } from "@/assets/scripts/game/Game";
import UserAvatar from "@/components/users/UserAvatar";

export default {
  name: "UiTopBar",
  components: {
    UserAvatar
  },
  computed: {
    ...mapState({
      me: state => state.authentication.me
    })
  },
  methods: {
    reset() {
      Game.resetPlayerPosition();
    },
    disconnect() {
      this.$emit("disconnect", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.ui-top-bar {
  align-items: center;
  background-color: $black;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.left {
  flex-grow: 1;
  padding: 5px 10px;
  text-align: left;
}

.user-avatar {
  display: block;
}

.right {
  padding: 10px;
}
</style>
