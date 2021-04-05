<template>
    <div>
        <footer class="footer">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        {{ dateFormatted }} © Messenger
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dateFormatted: this.$dateFns.format(new Date(), 'yyyy')
            }
        }
    }
</script>