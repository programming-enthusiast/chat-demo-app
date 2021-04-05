<template>
    <div class="d-lg-flex mb-4">
        <div class="chat-leftsidebar card">
            <div class="p-3 px-4">
                <div class="media">
                    <div class="media-body">
                        Messenger
                    </div>
                    <div class="dropdown chat-noti-dropdown">
                        <button class="btn dropdown-toggle py-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="uil uil-ellipsis-h"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="javascript:void(0)" @click="logout">Logout</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-3">
                <div class="chat-overflow" style="max-height: 470px; ">
                    <!-- <div class="p-4 border-top">
                        <div>
                        </div>
                    </div> -->

                    <div class="p-4 border-top">
                        <div>
                            <h5 class="font-size-16 mb-3"><i class="uil uil-user mr-1"></i> Users</h5>

                            <ul class="list-unstyled chat-list">
                                <li v-for="messenger in messengers" @click="onUserClick(messenger)">
                                    <a href="javascript:void(0)">
                                        <div class="media align-items-center">
                                            
                                            <div class="avatar-xs mr-3">
                                                <span class="avatar-title rounded-circle bg-soft-primary text-primary">
                                                </span>
                                            </div>
                                            
                                            <div class="media-body overflow-hidden">
                                                <h5 class="text-truncate font-size-14 mb-1">{{ messenger.name }}</h5>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- end chat-leftsidebar -->

        <div v-if="currentUser" class="w-100 user-chat mt-4 mt-sm-0 ml-lg-1">
            <div class="card">
                <div class="p-3 px-lg-4 border-bottom">
                    <div class="row">
                        <div class="col-md-4 col-6">
                        </div>
                    </div>
                </div>

                <div class="px-lg-2">
                    <div class="chat-conversation p-3 custom-m-h">
                        <ul v-chat-scroll class="list-unstyled mb-0 chat-overflow">
                            <li class="chat-day-title"> 
                                <div class="title">Start chat with Messenger</div>
                            </li>
                            <li v-for="item in messages" :class="{ 'right': me.id === item.to_id }">
                                <div class="conversation-list">
                                    <div class="ctext-wrap">
                                        <div class="ctext-wrap-content">
                                            <h5 class="font-size-14 conversation-name"><a href="javascript:void(0)" class="text-dark">{{ }}</a> <span class="d-inline-block font-size-12 text-muted ml-2">{{ item.time }}</span></h5>
                                            <p class="mb-0">
                                                {{ item.body }}
                                            </p>
                                            <p v-if="item.attachment" class="mb-0">
                                                <img style="max-width: 250px;" id="imageModalBox" :src="'/storage/attachments/' + item.attachment.split(',')[0]">
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="p-3 chat-input-section">
                    <form @submit.prevent="sendMessage">
                    <div class="row">
                        <div class="col-auto">
                            <button type="button" class="btn btn-primary" @click="onUploadAttachmentClick"><span>Upload...</span></button>
                            <input 
                                class="upload-attachment" 
                                id="file-upload" 
                                type="file" 
                                name="file" 
                                accept="image/*" 
                                ref="fileUpload"
                                @change="onFilePicked"
                            />
                        </div>
                        <div v-if="fileName" class="upload-file-name">
                            {{ '📎' + (this.fileName.length > 12 ? this.fileName.slice(0, 11) + '...' : this.fileName) }}
                        </div>
                        <div class="col">
                            <div class="position-relative">
                                <input type="text" class="form-control chat-input rounded" placeholder="Enter Message..." v-model="newMessage.text">
                            </div>
                        </div>
                        <div class="col-auto">
                            <button type="submit" class="btn btn-primary chat-send w-md waves-effect waves-light"><span class="d-none d-sm-inline-block mr-2">Send</span> <i class="mdi mdi-send float-right"></i></button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '~/plugins/VueChatScroll'
    import Pusher from 'pusher-js'
    import axios from 'axios'
    import { API_BASE_URL } from '~/shared/const'

    export default {
        props: {
            messengers: Array,
            pusher: Object,
            channel: Object
        },
        mounted() {
            this.channel.bind('messaging', (data) => {
                console.log('this component::::::', this)
                console.log('channel subscribing:::::::', data)
                this.onMessageNotification(data)
            })
        },
        data() {
            
            return {
                authData: {
                    username: "",
                },
                messages: [],
                newMessage: {
                    text: "",
                    attachment: null
                },
                onlineUsers: [],
                image: null,
                fileName: '',
                currentUser: null,
                me: JSON.parse(localStorage.getItem('me'))
            }
        },
        methods: {
            async onUserClick(user) {
                this.currentUser = user
                console.log('clicked::', user)
                const options = {
                    headers: { 
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                };
                const res = await axios.post(API_BASE_URL + '/chat/fetchMessages', {id: user.id}, options)
                console.log(res.data)
                this.messages = res.data.messages
            },
            onMessageNotification(data) {
                if (!this.currentUser)
                    return
                const myProfile = JSON.parse(localStorage.getItem('me'))
                if ((myProfile.id == data.to_id && this.currentUser.id == data.from_id)
                    || (myProfile.id == data.from_id && this.currentUser.id == data.to_id)) {
                    const message = { 
                        body: data.message.message, 
                        from_id: data.message.from_id, 
                        to_id: data.message.to_id, 
                        attachment: data.message.attachment[0] ? data.message.attachment.join(',') : null
                    }
                    this.messages.push(message)
                    console.log('attached message======', message)
                }
            },
            logout() {
                localStorage.setItem('access_token', null)
                localStorage.setItem('me', null)
                this.redirectToLogin()
            },
            async sendMessage() {
                const options = {
                    headers: { 
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                };
                console.log('++++++++++++++', this.newMessage)
                const formData = new FormData();
                var imagefile = document.querySelector('#file');
                formData.append("file", this.newMessage.attachment);
                formData.append("id", this.currentUser.id);
                formData.append("message", this.newMessage.text);
                formData.append("type", 'user');
                try {
                    const res = await axios.post(
                        API_BASE_URL + '/chat/sendMessage', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                            }
                    })
                    this.newMessage.text = ''
                    this.newMessage.attachment = null
                    this.fileName = ''
                } catch (error) {
                    window.alert(error)
                }
            },
            redirectToLogin() {
                this.$router.push("login")
            },
            onUploadAttachmentClick() {
                this.$refs.fileUpload.click()
            },
            onFilePicked(event) {
                try {
                    const files = event.target.files
                    this.newMessage.attachment = files[0]
                    this.fileName = files[0].name;
                } catch (error) {
                    console.log(error)
                }
            }
        },
    }
</script>

<style scoped>
    body[data-layout=horizontal] .page-content{
        margin-top: 0 !important;
    }
    .simplebar-content-wrapper {
      overflow: auto;
    }
    .chat-overflow {
        height: 300px;
        overflow: auto;
    }
    .chat-overflow::-webkit-scrollbar {
        width: 5px;
        min-height: 20px;
    }
    
    .chat-overflow::-webkit-scrollbar-track {
        border-radius: 10px;
    }
    
    .chat-overflow::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #5b73e8;
    }
    .upload-attachment {
        display: none;
    }
    .upload-file-name {
        margin: auto;
        width: max-content;
    }
</style>