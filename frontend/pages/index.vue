<template>
    <div>
        <Chat :messengers="messengers" :pusher="pusher" :channel="channel"/>
    </div>
</template>

<script>
    import Chat from "~/components/pages/Chat"
    import Pusher from 'pusher-js'
    import axios from 'axios'
    import { API_BASE_URL } from '~/shared/const'

    export default {
        middleware: 'authenticated',
        async asyncData () {
            // return new Promise((resolve) => {
            //     setTimeout(function () {
            //         resolve()
            //     }, 1000)
            // })
            const options = {
                    headers: { 
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                };
            const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
                cluster: process.env.PUSHER_APP_CLUSTER,
                authEndpoint: '/api/chat/chat/auth',
                auth: {
                    headers: { 
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }
            })
            
            const channel = pusher.subscribe('private-chat')

            const res = await axios.get(API_BASE_URL + '/chat/messengers', options)
            
            console.log(res)


            return {
                pusher: pusher,
                channel: channel,
                messengers: res.data.messengers
            }
        },
        components: { Chat },
    }
</script>

<style scoped>

</style>