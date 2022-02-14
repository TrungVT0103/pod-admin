import { getToken } from '@/common/jwt.service'
import jwt_decode from 'jwt-decode';


export default {
  methods: {
    verifyToken() {
      let token = getToken()
      if (!token) return false
      let verifyToken = this.decodeToken(token)
      if (!verifyToken) {
        this.logout()
      }
    },
    // verify token
    decodeToken(token) {
      try {
        var decodedHeader = jwt_decode(token, { header: true })
        if (decodedHeader) {
          var decoded = jwt_decode(token)
          return decoded.exp > Date.now() / 1000
        }
      } catch (error) {
        return false
      }
    },
    // func logout
    logout() {
      try {
        localStorage.clear()
        this.$router.push({ path: '/auth/login' })
      } catch (error) {
        console.log(error.response)
      }
    },
  },
}
