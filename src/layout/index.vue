<template>
    <div class="flex-row main-between box">
        <SideBar class="side"></SideBar>
        <div class="content">
            <AppMain></AppMain>
        </div>
    </div>
</template>

<script>
import SideBar from './components/side-bar/index'
import AppMain from './components/app-main/index'

export default {
    name: 'Layout',
    components: {
        SideBar,
        AppMain
    }
}
</script>

<style lang="scss" scoped>
.box {
    height: 100vh;
    overflow: hidden;
}
.side {
    width: 15vw;
    height: 100%;
}
.content {
    width: 85vw;
    height: 100%;
}
</style>