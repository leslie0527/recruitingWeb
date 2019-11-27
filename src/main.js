
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import 'es6-promise/auto'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import SIdentify from './components/Identify';    //自定义组件
Vue.component("SIdentify",SIdentify);
const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://api.tomorrow979.cn/job/public/index.php/api/gql',
})
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})
Vue.use(VueApollo)

Vue.config.productionTip = false
Vue.use(Vuex)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  components: { App },
  template: '<App/>'
})
