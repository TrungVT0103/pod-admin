<template>
  <div>
    <!-- <h1>{{ getName }}</h1> -->
    <h1>1111</h1>
    <v-btn @click="clickButton">Click</v-btn>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { io } from "socket.io-client";
export default {
  data() {
    return {};
  },
  created() {
    console.log(111);
    this.initSocket();
    console.log(222);
  },
  methods: {
    initSocket() {
      // const socket = io.connect(process.env.VUE_APP_SOCKET, {
      //   reconnectionAttempts: 5,
      //   transports: ['websocket'],
      // })
      const socket = io('https://printhub.vnstore.xyz/api/printhub/publisher', {
        extraHeaders: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjYwNTdmOTEzODhhY2E3N2JhZGFhOGJiNCIsInRva2VuSWQiOiI2MTZjZGVlN2E2MDAwNzFmMjllNzRhMGEiLCJpYXQiOjE2MzQ1MjQ5MDMsImV4cCI6MTYzNDYxMTMwM30.hVv2-D3n1jD0S1UCxdrAfL14qj_DOdSO62NA3__8OJ8',
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjYwNTdmOTEzODhhY2E3N2JhZGFhOGJiNCIsInRva2VuSWQiOiI2MTZjZGVlN2E2MDAwNzFmMjllNzRhMGEiLCJpYXQiOjE2MzQ1MjQ5MDMsImV4cCI6MTYzNDYxMTMwM30.hVv2-D3n1jD0S1UCxdrAfL14qj_DOdSO62NA3__8OJ8',
        },
      })
      socket.on('connect', () => {
        // const user = { username: rootState.auth.username }
        console.log('listened');
        // commit('SET_SOCKET', socket)
        // dispatch('joinRoom', user)
      })
      socket.on('join', (users) => {
        console.log(users)
        // dispatch('pushJoin', users)
      })
      socket.on('message', ({ username, text, createdAt }) => {
        console.log(username, text, createdAt)
        // dispatch('pushMessage', { username, text, createdAt })
      })
      socket.on('leave', (clientId) => {
        console.log(clientId)
        // dispatch('pushLeave', clientId)
      })
      console.log(3333);
    },
    clickButton: function (name) {
        // $socket is socket.io-client instance
        this.$socket.emit('emit_method', name)
      }
  }
  // computed: {
  //   ...mapGetters(['getName']),
  // },
  // sockets: {
  //     connect: function () {
  //         console.log('socket connected')
  //     },
  //     customEmit: function () {
  //         console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
  //     }
  // },
  // methods: {
  //     clickButton: function (name) {
  //       // $socket is socket.io-client instance
  //       this.$socket.emit('emit_method', name)
  //     }
  // }
}
</script>

<style></style>
