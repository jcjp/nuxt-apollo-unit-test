import Vue from 'vue'
import Vuetify from 'vuetify'
import {config} from '@vue/test-utils'

Vue.config.silent = true
Vue.use(Vuetify)

config.stubs['nuxt-link'] = true
config.stubs['no-ssr'] = true

const vuetify = new Vuetify()

export default vuetify
