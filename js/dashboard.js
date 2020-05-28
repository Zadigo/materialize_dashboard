var products = [
    {id: 1, name: "Kendall", surname: "Jenner", price: 145, selected: false, checked: false, deleted: false},
    {id: 2, name: "Hailey", surname: "Baldwin", price: 345, selected: false, checked: false, deleted: false},
    {id: 3, name: "Taylor", surname: "Swift", price: 175, selected: false, checked: false, deleted: false}
]

// SIDEBAR

$(document).ready(function () {
    var dashboard = $(".dashboard")
    var currentwidth = document.body.clientWidth

    if (currentwidth < 420) {
        dashboard.find(".side").addClass("hide")
        dashboard.find(".wrapper").addClass("show-side-bar")
    }
    
    $(".topnav").find("#trigger-for-sidebar").on("click", function() {
        dashboard.find(".side").toggleClass("hide")
        dashboard.find(".wrapper").toggleClass("show-side-bar")
    }) 
});



// UTILITIES

var productdetailsurl = window.location.origin + "/dashboard/products/"

var constructurl = function(id, slug) {
    return  productdetailsurl + id + "/" + slug
}

var searchproducts = {
    props: ["products"],
    template: "\
    <div class='input-field'>\
        <input @keypress.enter='dosearch' v-model='search' type='search' class='search' id='search' placeholder='Rechercher'>\
    </div>\
    ",
    data() {
        return {}
    }
}

// var filterproducts = {
//     template: "\
//     <select id='filter_products'>\
//         <option @click='doselect(option.value)' v-for='option in options' :key='option.value' :value='option.value'>{{ option.name }}</option>\
//     </select>\
//     ",
//     data() {
//         return {
//             options: [
//                 {value: "all", name: "-----", selected: true},
//                 {value: "croissant", name: "Croissant", selected: false},
//                 {value: "decroissant", name: "Décroissant", selected: false},
//             ]
//         }
//     },
//     methods: {
//         doselect: function(value) {
//             this.$data.options.forEach(option => {
//                 option.selected = false
//                 if (option.value === value) {
//                     option.selected = true
//                 }
//             })
//         }
//     },
//     computed: {
//         selectedfilter() {
//             return this.$data.options.filter(option => {
//                 return option.selected === true
//             })
//         }
//     }
// }

// LISTS

var vuecards = {
    props: ["products"],
    template: "\
    <div class='row'>\
        <div class='col s12 m12 l12'>\
            <div class='col s3 m3 l3'>\
                <select v-model='selectedoption' name='card-filter' id='card-filter'>\
                    <option v-for='option in items' :key='option.value' :value='option.value'>{{ option.name }}</option>\
                </select>\
            </div>\
        </div>\
        <div class='col s12 m12 l12'>\
            <transition-group name='card_items'>\
                <div v-for='card in productlist' :key='card.name' class='col s12 m4 l4'>\
                    <div class='card'>\
                        <div class='card-content'>\
                            <span class='card-title'>{{ card.name }}</span>\
                            <p>{{ card.content }}</p>\
                        </div>\
                        <div class='card-action'>\
                            <a href='' class='btn'><i class='material-icons left'>watch</i>Details</a>\
                        </div>\
                    </div>\
                </div>\
            </transition-group>\
        </div>\
    </div>\
    ",
    data() {
        return {
            items: [
                {value: "all", name: "-----"},
                {value: "first", name: "First"},
                {value: "second", name: "Second"}
            ],
            selectedoption: "all"
        }
    },
    computed: {
        productlist() {
            // Returns a list of products that were
            // previously filtered by other methods
            if (this.$data.selectedoption === "all") {
                return this.$props.products
            }
            if (this.$data.selectedoption === "first") {
                return this.filternames
            }
            if (this.$data.selectedoption === "second") {
                return this.filterprices
            }
        },
        filterprices() {
            // Method to filter prices which avoids
            // messing up the original values
            var products = []
            var productcopy = {}
            this.$props.products.forEach(product => {
                products.push(Object.assign(productcopy, product))
                productcopy = {}
            })
            return products.sort(function (a, b) {
                return b.price - a.price
            })
        },
        filternames() {
            return this.$props.products.filter(product => {
                return product.name === "Kendall"
            })
        }
    }
}

var deletebutton = {
    // This commponent allows the user to
    // delete an item from the database
    // after having selected them

    props: ["selectedproducts"],
    template: "\
        <a @click='deleteitems' class='btn-large red waves-effect waves-light'\
                             id='delete_product' :class='{\"disabled\": showdeletebutton}'>\
            <i class='material-icons left'>delete</i>\
            {{ title }}\
        </a>\
    ",
    data() {
        return {
            title: "Delete"
        }
    },
    computed: {
        hasselection() {
            return this.selectedproductsids.length > 0
        },
        selectedproductsids() {
            var ids = []
            _.forEach(this.$props.selectedproducts, product => {
                ids.push(product["id"])
            })
            return ids
        },
        showdeletebutton() {
            // Defines if the delete button should be enabled
            // or not --; true if products are selected,
            // otherwise false
            if (this.hasselection === true) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        deleteitems: function() {
            this.$emit("deleteitems")
        }
    }
}

var specialtable = {
    props: ["products"],
    template: "\
    <div class='card-table'>\
        <table>\
            <thead>\
                <tr>\
                    <th><p><label><input @click='selectall' type='checkbox'><span></span></label></p></th>\
                    <th @click='dosort(title.name)' v-if='title.sortable' v-for='title in titles' \
                            :key='title.id' class='sortable' :class='{\"sorted\": title.sorted}'>\
                                {{ title.name|capitalize }}\
                    </th>\
                    <th v-else>{{ title.name|capitalize }}</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr v-if='!product.deleted' v-for='(product, index) in sortedproducts' :key='product.id'>\
                    <td><p><label><input @click='selectitem(index)' type='checkbox' :checked='product.selected'><span></span></label></p></td>\
                    <td><a :href='\"./details.html?product=\" + product.id'>{{ product.id }}</a></td>\
                    <td>{{ product.name }}</td>\
                    <td>{{ product.surname }}</td>\
                    <td>{{ product.price|euros }}</td>\
                    <td>\
                        <a :href='\"./update.html?product=\" + product.id'><i class='material-icons'>create</i></a>\
                    </td>\
                    <td class='hide'>\
                        <a><i class='material-icons'><i class='material-icons'>archive</i></a>\
                    </td>\
                    <td>\
                        <a @click='deletesingleitem(product.id)'><i class='material-icons'>delete</i></a>\
                    </td>\
                </tr>\
            </tbody>\
        </table>\
    </div>\
    ",
    data() {
        return {
            titles: [
                {id: 1, name: "id", sortable: true, sorted: false},
                {id: 2, name: "name", sortable: true, sorted: false},
                {id: 3, name: "surname", sortable: true, sorted: false},
                {id: 4, name: "price", sortable: true, sorted: false},
                {id: 5, name: "", sortable: false, sorted: false},
                {id: 6, name: "", sortable: false, sorted: false}
            ],
            currentsort: "initial"
        }
    },
    computed: {
        columncss() {
            var self = this
            self.$data.titles.forEach(title => {
                title.sorted = false
                if (title.name === self.$data.currentsort) {
                    title.sorted = true
                }
            })
        },
        sortbyid() {
            return this.productlist.sort((a, b) => {
                return a - b
            })
        },
        sortbyword() {
            var self = this
            return self.productlist.sort(function(a, b) {
                if (a[self.$data.currentsort] < b[self.$data.currentsort]) {
                    return -1
                }
                if (a[self.$data.currentsort] > b[self.$data.currentsort]) {
                    return 1
                }
                return 0
            })
        },
        sortedproducts() {
            var self = this
            if (self.$data.currentsort === "initial") {
                return self.productlist
            }
            if (self.$data.currentsort === "id") {
                return self.sortbyid
            } else {
                return self.sortbyword
            }
        },
        productlist() {
            // return [...this.$props.products]
            return this.$props.products
        }
    },
    methods: {
        dosort: function(filtername) {
            this.$data.currentsort = filtername
        },
        selectitem: function(index) {
            this.$emit("selectitem", index)
        },
        selectall: function(index) {
            this.$emit("selectall")
        },
        deletesingleitem: function(productid) {
            this.$emit("deletesingleitem", productid)
        }
    },
    filters: {
        capitalize: function(value) {
            // Capitalize the first
            // letter of the title
            return value.toUpperCase()
        },
        slugify: function(value) {
            // Transforms words such as
            // 'eugenie bouchard' becomes
            // 'eugenie_bouchard'
            value.toLowerCase().replace(" ", "_")
        },
        euros: function(value) {
            return value + "€"
        }
    }
}

var vuetable = {
    props: ["products"],
    template: "\
        <table class='highlight responsive-table'>\
            <thead>\
                <tr>\
                    <th>\
                        <label>\
                            <input @click='selectall' type='checkbox' name='select_all' id='selct_all' />\
                            <span></span>\
                        </label>\
                    </th>\
                    <th v-for='title in titles' :key='title'>{{ title|capitalize }}</th>\
                </tr>\
            </thead>\
            <tbody v-if='nondeletedproducts==0'>Vous n'avez aucun produits</tbody>\
            <tbody v-else>\
                <tr v-if='!product.deleted' v-for='(product, index) in products' :key='product.id'>\
                    <td>\
                        <p>\
                            <label>\
                                <input @click='selectitem(index)' type='checkbox' :name='product.name|slugify' :id='product.name|slugify' :checked='product.checked'>\
                                <span></span>\
                            </label>\
                        </p>\
                    </td>\
                    <td><a :href='\"./details.html?product=\" + product.id'>{{ product.id }}</a></td>\
                    <td>{{ product.name }}</td>\
                    <td>{{ product.surname }}</td>\
                    <td>{{ product.price|euros }}</td>\
                    <td>\
                        <a :href='\"./update.html?product=\" + product.id'><i class='material-icons'>create</i></a>\
                    </td>\
                    <td>\
                        <a @click='deletesingleitem(product.id)'><i class='material-icons'>delete</i></a>\
                    </td>\
                </tr>\
            </tbody>\
        </table>\
    ",
    data() {
        return {
            titles: ["iD", "name", "surname", "price", "", ""]
        }
    },
    methods: {
        selectitem: function(index) {
            this.$emit('selectitem', index)
        },
        selectall: function(index) {
            this.$emit('selectall')
        },
        deletesingleitem: function(productid) {
            this.$emit('deletesingleitem', productid)
        }
    },
    computed: {
        nondeletedproducts() {
            // Keeps track of the products that are
            // not marked as deleted in order to
            // to perform certain actions
            var self = this
            var numberofproducts = self.$props.products.length

            self.$props.products.forEach(product => {
                if (product.deleted === true) {
                    numberofproducts -= 1
                }
            })
            return numberofproducts
        }
    },
    filters: {
        capitalize: function(value) {
            // Capitalize the first
            // letter of the title
            return value.toUpperCase()
        },
        slugify: function(value) {
            // Transforms words such as
            // 'eugenie bouchard' becomes
            // 'eugenie_bouchard'
            value.toLowerCase().replace(" ", "_")
        },
        euros: function(value) {
            return value + "€"
        }
    }
}

var messages = {
    template: "\
        <transition name='show_message'>\
            <div v-if='show'>Supprimer un cours est une action irréversible.</div>\
        </transition>\
    ",
    data() {
        return {
            show: false
        }
    }
}


// DASHBOARD

var dashboard = new Vue({
    el: "#vue_dashboard",
    components: {vuetable, deletebutton, createform, 
                    updateform, messages, vuecards, imageupload,
                        switchessettings, specialtable},
    data() {
        return {
            products: [],
            showsidebar: true
        }
    },
    beforeMount() {
        this.$data.products = products
    },
    computed: {
        selectedproducts() {
            // Returns a list of selected products that
            // were also marked as not deleted
            return this.$data.products.filter(product => {
                return product.selected === true && product.deleted === false
            })
        }
    },
    methods: {
        dodeselect: function() {
            // Deselects products before
            // reselecting a single one
            _.forEach(this.$data.products, function(product) {
                product.selected = false
            })
        },
        doselect: function(index) {
            // Selects a product in the table using
            // a selection checkbox
            // this.dodeselect()
            var product = this.$data.products[index]
            product.selected = !product.selected
        },
        getall: function() {
            // Selects all the products in the
            // table by using the selection
            // checkboxes
            this.$data.products.forEach(product => {
                product.checked = !product.checked
                product.selected = !product.selected
            })
        },
        applydelete: function(productid) {
            // Deletes the elements from the list of products
            // before doing the delete on the server
            // this.selectedproducts.forEach(product => {
            //     this.$data.products.forEach((actualproduct, index) => {
            //         if (product.id === actualproduct.id) {
            //             product.deleted = !product.deleted
            //         }
            //     })
            // })
            if (typeof(productid) === "number") {
                this.$data.products.forEach(product => {
                    if (product.id === productid) {
                        product.deleted = !product.deleted
                    }
                })
            }

            if (typeof(productid) === "object") {
                this.$data.products.forEach(product => {
                    this.$data.productid.forEach(id => {
                        if (product.id === id) {
                            product.selected = !product.selected
                        }
                    })
                })
            }
        },
        applydeletesingle: function(productid) {
            var self = this
            // Allows the deletionf of a single
            // item from the table without going
            // through the selection
            // this.$data.products.forEach(product => {
            //     if (product.id === productid) {
            //         product.deleted = !product.deleted
            //     }
            // })

            var promise = new Promise((resolve, reject) => {
                var requests = new XMLHttpRequest()
                var formdata = new FormData()
                formdata.append("productid", productid)

                requests.open("GET", "https://jsonplaceholder.typicode.com/todos/1")
                requests.responseType = "json"
                requests.onloadstart = function() {
                    // DO SOMETHING
                }
                requests.onload = function(response) {
                    // DO SOMETHING
                    if (requests.readyState === 4) {
                        resolve(requests.response)
                    }
                }
                requests.onloadend = function() {
                    // DO SOMETHING
                }
                requests.send(formdata)
            })
            promise.then((response) => {
                // DO SOMETHING
                console.log(response)
                self.applydelete(productid)
            })
        },
        togglesidebar: function() {
            this.$data.showsidebar = !this.$data.showsidebar
        }
    },
})