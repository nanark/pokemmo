<template>
  <section class="ui-top-bar">
    <div class="left">
      <UserAvatar :user="user" size="40px" />
    </div>
    <div class="right">
      <button @click="disconnect">{{ $t("global.disconnect") }}</button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import UserAvatar from "@/components/users/UserAvatar";

export default {
  name: "UiTopBar",
  components: {
    UserAvatar
  },
  computed: mapState({
    user: state => state.user
  }),
  methods: {
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
