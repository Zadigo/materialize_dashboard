// Vue JS for the special details
// section of the dashboard relevant
// to dealing with a user's profile

$(document).ready(function () {
    var dashboard = $(".dashboard")
    $(".topnav").find("#trigger-for-sidebar").on("click", function() {
        dashboard.find(".side").toggleClass("hide")
        dashboard.find(".wrapper").toggleClass("show-side-bar")
    }) 
});

var sendmessage = {
    template: "\
    <div class='messages-section'>\
        <div class='messages'>\
            <div v-for='message in messages' :key='message.id' class='message'>\
                {{ message.text }}\
            </div>\
        </div>\
        <textarea v-model='newmessage' name='message' id='message' \
                cols='30' rows='30' placeholder='Message'></textarea>\
        <a @click='sendmessage' class='btn' :class='{disabled: hasnomessage}' \
            id='envoyer-message'>Envoyer</a>\
    </div>\
    ",
    data() {
        return {
            newmessage: "",
            messages: []
        }
    },
    computed: {
        hasnomessage() {
            if (this.$data.newmessage === "") {
                return true
            }
            return false
        }
    },
    methods: {
        sendmessage: function() {
            this.$data.messages.push(
                {id: this.lastmessageid(), text: this.$data.newmessage}
            )
            this.$data.newmessage = ""
        },
        lastmessageid: function() {
            if (this.$data.messages.length > 0) {
                return 1
            } else {
                return _.maxBy(this.$data.messages, function(element) {
                    return element.id
                })
            } 
        }
    }
}

var scoreproposition = {
    template: "\
    <div>\
        <div v-if='!scored' class='stars'>\
            <i @click='selectedstar(star)' v-for='star in stars' \
                :key='star' class='material-icons'>star</i>\
        </div>\
        <p v-else>Score : {{ selected }}/{{ maxstars }}</p>\
    </div>\
    ",
    data() {
        return {
            stars: [1, 2, 3, 4, 5],
            selected: 0,
            scored: false
        }
    },
    computed: {
        maxstars() {
            return _.max(this.$data.stars)
        }
    },
    methods: {
        selectedstar: function(star) {
            this.$data.selected = star
            this.$data.scored = true
        },
        activestars: function(n) {
            if (n <= this.$data.selected) {
                return "blue-text"
            }
        }
    }
}

var actionbuttons = {
    template: "\
    <div class='card-panel center'>\
        <button v-if='!accepted' @click='accepted=true' :disabled='refused' class='btn indigo lighten-1 waves-effect waves-light'><i class='material-icons left'>check</i>Accept</button>\
        <button v-else v-show='!hasmeeting' class='btn indigo lighten-1 waves-effect waves-light'><i class='material-icons left'>calendar_today</i>Prendre rendez-vous</button>\
        \
        <button v-show='hasmeeting' class='btn indigo lighten-1 waves-effect waves-light'><i class='material-icons left'>calendar_today</i>Bilan rendez-vous</button>\
        \
        <button @click='standby=true' :disabled='accepted || refused || standby' class='btn indigo lighten-1 waves-effect waves-light'><i class='material-icons left'>pause</i>Stand by</button>\
        <button @click='refused=true' :disabled='accepted || refused' class='btn red darken-1 waves-effect waves-light'><i class='material-icons left'>block</i>Refuse</button>\
    </div>\
    ",
    data() {
        return {
            accepted: false,
            refused: false,
            standby: false,
            hasmeeting: false
        }
    },
    mounted() {}
}

var dashboardetails = new Vue({
    el: "#profile_details",
    components: {actionbuttons, scoreproposition, sendmessage}
})