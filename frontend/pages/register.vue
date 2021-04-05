<template>
    <div class="row align-items-center justify-content-center">
         <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">     
                <div class="card-body p-4"> 
                    <div class="text-center mt-2">
                        <h5 class="text-primary">Register</h5>
                    </div>
                    <div class="p-2 mt-4">
                        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="uil uil-exclamation-octagon mr-2"></i>
                            Invalid data!
                        </div>
                        <form method="POST" @submit.prevent="register">

                            <div class="form-group">
                                <label for="email">Name</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter your name" v-model="data.name">
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email" placeholder="Enter your email address" v-model="data.email">
                            </div>

                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter your password" v-model="data.password">
                            </div>

                            <div class="form-group">
                                <label for="confirmPassword">Confirm password</label>
                                <input type="password" class="form-control" id="confirm_password" placeholder="Enter your password" v-model="data.password_confirmation">
                            </div>

                            <div>
                                <a href="/login">log in</a>
                            </div>
                            
                            <div class="mt-3 text-right">
                                <button class="btn btn-primary w-sm waves-effect waves-light" type="submit">Register</button>
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
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: ""
                },
                error: false
            }
        },
        methods: {
            async register() {
                if (this.data.name === "" || this.data.email === "" || this.data.password === "" || this.data.password_confirmation === "") {
                    this.error = true
                }
                else {
                    let res
                    try {
                        res = await axios.post(API_BASE_URL + '/register', { name: this.data.name, email: this.data.email, password: this.data.password, password_confirmation: this.data.password_confirmation })
                        this.$router.push("/")
                    } catch (error) {
                        console.log(error)
                        window.alert(error.message)
                    }
                }
            }
        }
    }
</script>

<style scoped>
</style>