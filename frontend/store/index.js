import VueCookie from 'vue-cookie'
import CookieParser from 'cookieparser'

export const state = () => ({
    authUser: ""
})

export const mutations = {
    SET_AUTH_USER (state, user) {
        state.authUser = user
    }
}

export const actions = {
    nuxtServerInit ({ commit }, { req }) {
        if(req && req.headers && req.headers.cookie) {
            const cookieParsed = CookieParser.parse(req.headers.cookie)
            const data = {
                email: cookieParsed._____AuthEmail,
                password: cookieParsed._____AuthPassword
            }

            commit('SET_AUTH_USER', data)
        }
    },
    async login ({ commit }, { email, password }) {
        try {
            const data = {
                email: email,
                password: password
            }

            VueCookie.set("_____AuthEmail", email)
            VueCookie.set("_____AuthPassword", password)

            commit('SET_AUTH_USER', data)
        }
        catch (error) {
            throw error
        }
    },
    async logout ({ commit }) {
        try {
            VueCookie.delete("_____AuthEmail")
            VueCookie.delete("_____AuthPassword")
            
            commit('SET_AUTH_USER', "")
        }
        catch (error) {
            console.error(error)
        }
    }

}
