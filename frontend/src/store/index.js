import Vue from 'vue'
import Vuex from 'vuex'
import { user } from './user'
import { posts } from './posts'
import { research } from './research'
import { issues } from './userIssues'
import { reports } from './reports'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    posts,
    research,
    issues,
    reports
  }
})
