<template>
    <div class="row align-items-center justify-content-center">
         <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">     
                <div class="card-body p-4"> 
                    <div class="text-center mt-2">
                        <h5 class="text-primary">Sign In !</h5>
                    </div>
                    <div class="p-2 mt-4">
                        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="uil uil-exclamation-octagon mr-2"></i>
                            Invalid data!
                        </div>
                        <form method="POST" @submit.prevent="login">

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email" placeholder="Enter your email address" v-model="data.email">
                            </div>

                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter your password" v-model="data.password">
                            </div>

                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="auth-remember-check">
                                <label class="custom-control-label" for="auth-remember-check">Remember me</label>
                            </div>
                            
                            <div>
                                <a href="/register">sign up</a>
                            </div>
                            
                            <div class="mt-3 text-right">
                                <button class="btn btn-primary w-sm waves-effect waves-light" type="submit">Log In</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_BASE_URL } from '~/shared/const'
    export default {
        middleware: "notAuthenticated",
        asyncData () {
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve()
                }, 1000)
            })
        },
        head: {
            title: "Messenger | Login"
        },
        data() {
            return {
                data: {
                    email: "",
                    password: ""
                },
                error: false
            }
        },
        methods: {
            async login() {
                if (this.data.email === "" || this.data.password === "") {
                    this.error = true
                }
                else {
                    try {
                        const res = await axios.post(API_BASE_URL + '/login', { email: this.data.email, password: this.data.password })
                        localStorage.setItem('access_token', res.data.access_token)
                        console.log('=======', res.access_token, res)

                        const options = {
                            headers: { 
                                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                            }
                        };
                        const userData = await axios.get(API_BASE_URL + '/user', options)
                        localStorage.setItem('me', JSON.stringify(userData.data))
                        this.$router.push("/")
                    } catch (error) {
                        if (error.message === 'Request failed with status code 401') {
                            window.alert('Invalid email or passpord!')    
                        } else {
                            window.alert(error.message)
                        }
                        console.log(JSON.stringify(error))
                    }
                }
            }
        }
    }
</script>

<style scoped>
</style>