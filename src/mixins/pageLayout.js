export const pageLayout = {
    data() {
        return {
            contentStyleObj: {
                height: ""
            },
            tableContStyle: {
                width: ""
            }
        }
    },
    created() {
        window.addEventListener("resize", this.getMixinHeight);
    },
    destroyed() {
        window.removeEventListener("resize", this.getMixinHeight);
    },
    mounted() {
        this.getMixinHeight();
    },
    methods: {
        // 实时获取屏幕高度
        getMixinHeight() {
            if(this.$store.state.app.sidebar.opened) {
                this.tableContStyle.width = window.innerWidth - 540 + "px";
            } else {
                this.tableContStyle.width = window.innerWidth - 325 + "px";
            }
            if(["BankSetting", "PayFeeSetting"].includes(this.$route.name)) {
                this.contentStyleObj.height = window.innerHeight - 282 + "px";
            } else {
                this.contentStyleObj.height = window.innerHeight - 250 + "px";
            }
            
        }
    }
}