var currentpagefields = [
    {page: 1, fields: [
            {type: "text", name: "name", placeholder: "Name", size: "m12 l12"},
            {type: "text", name: "category", placeholder: "Category", size: "m4 l4"},
            {type: "number", name: "price", placeholder: "Price", size: "m4 l4"}
        ]
    },
    {page: 2, fields: [
        {type: "text", name: "domaine", placeholder: "Domaine", size: "m12 l12"}
    ]},
    {page: 3, fields: [
        {type: "text", name: "domaine", placeholder: "Element", size: "m12 l12"}
    ]}
]

var imageupload = {
    template: "\
    <div class='form-interface img-form'>\
        <div class='row'>\
            <div class='col s12 m4 l4'>\
                <img @click='' :src='image' alt='image'>\
            </div>\
            <div class='col s12 m8 l8'>\
                <div class='input-field'>\
                    <input type='file'>\
                    <input v-model='name' type='text' name='name' id='name' placeholder='Name' autocomplete='off'>\
                    <input type='text' name='slug' id='slug' :value='createslug' disabled>\
                </div>\
                <div class='input-field'>\
                    <p>\
                        <label>\
                            <input v-model='mainimage' type='checkbox' name='mainimage'>\
                            <span>Main image</span>\
                        </label>\
                    </p>\
                </div>\
            </div>\
        </div>\
    </div>\
    ",
    data() {
        return {
            name: "",
            mainimage: false,
            image: "https://dummyimage.com/150x150/fff/aaa"
        }
    },
    computed: {
        createslug() {
            return this.$data.name.replace(" ", "-")
        }
    }
}

var formbutton = {
    props: ["formbuttonname", "isfinalstep"],
    template: "\
    <button type='submit' class='btn-large lighten-1 waves-effect waves-light' :class='{indigo: !isfinalstep, red: isfinalstep}'>\
        <i class='material-icons left'>create</i>{{ formbuttonname }}\
    </button>\
    "
}

var updateform = {
    components: {formbutton},
    template: "\
    <form @submit.prevent='updateitem'>\
        <div class='row'>\
            <div v-for='field in fields' :key='field.name' :class='\"input-field col s12 \" + field.size'>\
                <input :type='field.type' :name='field.name' :id='field.name' :placeholder='field.placeholder'>\
            </div>\
        </div>\
        <formbutton v-bind:formbuttonname='formbuttonname' />\
    </form>\
    ",
    data() {
        return {
            fields: [
                {type: "text", name: "name", placeholder: "Name", size: "m12 l12"},
                {type: "text", name: "category", placeholder: "Category", size: "m4 l4"},
            ],
            productid: undefined,
            formbuttonname: "Update"
        }
    },
    // beforeMount() {
    //     var self = this
    //     var url = new URLSearchParams(window.location.search)
    //     var product = url.get("product")
    //     if (product) {
    //         // $.ajax({
    //         //     type: "GET",
    //         //     url: "http://example.com",
    //         //     success: function (response) {
    //         //         self.$data.product = product
    //         //     }
    //         // })
    //     }
    // },
    methods: {
        updateitem: function() {
            window.location.href = "http://127.0.0.1:5500/materialize_for_startups/templates/dashboard/products2.html"
        }
    }
}

var createform = {
    components: {formbutton},
    template: "\
    <form @submit.prevent='createitem'>\
        <div class='row'>\
            <div v-for='field in currentfields' :key='field.name' class='input-field col s12' :class='field.size'>\
                <input v-model='completedfields[field.name]' :type='field.type' :name='field.name' :id='field.name' :placeholder='field.placeholder'>\
            </div>\
        </div>\
        <formbutton v-if='isfinalstep' v-bind:formbuttonname='\"Save to draft\"' v-bind:isfinalstep='isfinalstep' />\
        <formbutton v-bind:formbuttonname='formbuttonname' v-bind:isfinalstep='isfinalstep' />\
    </form>\
    ",
    data() {
        return {
            fields: [],
            formbuttonname: "Continuer",
            completedfields: {},
            currentstep: 1,
            maxsteps: 3
        }
    },
    beforeMount() {
        var fields = currentpagefields.filter(field => {
            return field.page == 1
        })
        this.$data.fields = fields[0].fields
    },
    computed: {
        isfinalstep() {
            return this.$data.currentstep == this.$data.maxsteps
        },
        currentfields() {
            var self = this
            var fields = currentpagefields.filter(field => {
                return field.page == self.$data.currentstep
            })
            return fields[0].fields
        }
    },
    methods: {
        createitem: function() {
            this.changestep()
        },
        changestep: function() {
            // Change button name on the before last step
            if (this.$data.currentstep == this.$data.maxsteps - 1) {
                this.$data.formbuttonname = "Terminer"
            }

            if (this.$data.currentstep === this.$data.maxsteps) {
                window.location.href = "http://127.0.0.1:5500/materialize_for_startups/templates/dashboard/products2.html"
            } else {
                this.$data.completedfields = {}
                this.$data.currentstep = this.$data.currentstep + 1
            }
        }
    }
}