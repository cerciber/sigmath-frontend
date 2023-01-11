<template>
  <div class="notifications">
    <b-alert
      v-for="notification in notifications.list"
      :key="notification.idNotification"
      id="notification"
      :mytype="notification.type"
      :show="notification.duration"
      @dismiss-count-down="timeDecrease(notification.idNotification)"
      v-show="notification.notificationState"
    >
      <!-- Icono para cerrar el panel -->
      <Close
        class="notifications-close-icon"
        v-on:click="hide(notification.idNotification)"
      />
      {{ notification.text }}
      <!--
      (Cierra en
      {{ notification.timeLeft }} seg.)
      -->
    </b-alert>
  </div>
</template>

<script>
/**
 * Estructura de notificaciones
 *
 * @module notificationsVue
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Close from "vue-material-design-icons/Close.vue";

export default {
  name: "notifications",
  components: { Close },
  data() {
    return {};
  },
  methods: {
    //Reducir atributo de tiempo de la notificación

    timeDecrease(id) {
      this.$store.commit("notificationTimeDecrease", id);
    },
    hide(idNotification) {
      this.$store.commit("deleteNotification", {
        idNotification: idNotification
      });
    }
  },
  computed: {
    //Obtener lista inicial de notificaciones
    notifications() {
      return this.$store.state.notifications;
    }
  }
};
</script>

<style>
.notifications {
  position: fixed;
  z-index: 9999;
  top: 33px;
  left: calc(50% - 150px);
}

#notification {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18.25px;
  width: 300px;
  margin: 0px;
  margin-top: 20px;
  padding-right: 30px;
}

#notification[myType="danger"] {
  background-color: #ff1f0d;
  border-color: #ff1f0d;
  color: #ffffff;
}

#notification[myType="warning"] {
  background-color: #ffa70d;
  border-color: #ffa70d;
  color: #000000;
}

#notification[myType="success"] {
  background-color: #05ff3c;
  border-color: #05ff3c;
  color: #000000;
}

#notification[myType="info"] {
  background-color: #054cff;
  border-color: #054cff;
  color: #ffffff;
}

.notifications-close-icon {
  position: absolute;
  left: calc(100% - 25px);
  top: 1px;
}

.notifications-close-icon[myType="danger"] {
  color: #ffffff;
}

.notifications-close-icon[myType="warning"] {
  color: #000000;
}

.notifications-close-icon[myType="success"] {
  color: #000000;
}

.notifications-close-icon[myType="info"] {
  color: #ffffff;
}

.notifications-close-icon:hover {
  cursor: pointer;
  color: #ffffff;
}
</style>
