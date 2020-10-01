<template>
    <account-admin id="adminVue" class="d-flex rounded mt-2 mb-2"></account-admin>
</template>

<script>
import AccountAdmin from '../components/admin'
export default {
    name: 'admin',
    components: {AccountAdmin}
}
</script>

<style>
#adminVue{
    flex-grow: 1;
    background-size: cover;
    box-shadow: 0 0 12px black;
}
</style>