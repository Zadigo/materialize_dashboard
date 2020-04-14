var switchessettings = {
    template: "\
    <div>\
        <div v-for='setting in settings' :key='setting.id' class='setting'>\
            <div v-if='setting.type==\"switch\"' class='switch'>\
                <label>\
                    <input @click='runmethod(setting.method)' v-model='setting.selected' \
                             type='checkbox' name='darkmode' id='dark-mode'>\
                    <span class='lever'></span>\
                    {{ setting.name }}\
                </label>\
            </div>\
            <div v-if='setting.type==\"checkbox\"'>\
                <p>\
                    <label>\
                        <input type='checkbox' name='test' id='test'>\
                        <span>{{ setting.name }}</span>\
                    </label>\
                </p>\
            </div>\
        </div>\
    </div>\
    ",
    data() {
        return {
            settings: [
                {id: 1, name: "Dark mode", type: "switch", selected: false, method: "darkmode"},
                {id: 2, name: "Activer les notifications", type: "switch", selected: false, method: "notifications"}
            ]
        }
    },
    methods: {
        runmethod: function(method) {
            if (method === "darkmode") {
                this.darkmode()
            }
        },
        darkmode: function() {
            if (this.$data.settings[0].selected === true) {
                $("html *").css({
                    "background-color": "black",
                    "color": "white"
                })
            } else {
                $("html *").css({
                    "background-color": "white",
                    "color": "black"
                })

            }
        }
    }
}