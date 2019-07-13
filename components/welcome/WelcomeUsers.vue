<template>
  <ul class="welcome-users">
    <li
      v-for="user in users"
      :key="user.id"
      class="user"
      @click="userClicked(user.id)"
    >
      <UserAvatar :user="user" size="100px" />
      <span class="username">{{ user.username }}</span>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";
import UserAvatar from "@/components/users/UserAvatar";

export default {
  name: "WelcomeUsers",
  components: { UserAvatar },
  computed: mapState(["users"]),
  created() {
    this.$store.dispatch("getUsers");
  },
  methods: {
    userClicked(id) {
      this.$store.dispatch("setUser", id);
      this.$emit("clickedUser", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.welcome-users {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.user {
  padding: 10px;
  text-align: center;
}

.user-avatar {
  cursor: pointer;
  margin: 0 auto;
}

.username {
  color: $white;
  display: block;
  margin-top: 5px;
}
</style>
