import {createLocalVue, shallowMount} from '@vue/test-utils'
import {createMockClient} from 'mock-apollo-client'
import VueApollo from 'vue-apollo'
import Vuex from 'vuex'

import vuetify from '~/jest.setup'
import IndexPage from '~/pages/index.vue'
import indexQuery from '~/query.gql'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueApollo)

const mockResult = {
    "data": {
      "itemCollectionCollection": {
        "items": [
          {
            "itemsCollection": {
              "items": [
                {
                  "question": "Sample Question 1",
                  "answer": "Sample Answer 1",
                },
                {
                  "question": "Sample Question 2",
                  "answer": "Sample Answer 2",
                }
              ]
            }
          }
        ]
      }
    }
  }

describe('Index page', () => {
    let defaultClient
    let requestHandlers
    let wrapper: any

  const createComponent = (handlers?: any) => {
    requestHandlers = {
        indexQuery: jest.fn().mockResolvedValue(mockResult),
        ...handlers
    }

    defaultClient = createMockClient({resolvers: {}})
    defaultClient.setRequestHandler(indexQuery, requestHandlers.indexQuery)

    const apolloProvider = new VueApollo({defaultClient})

    wrapper = shallowMount(IndexPage, {
      apolloProvider,
      localVue,
      vuetify
    })
  }

  afterEach(() => {wrapper.destroy()})

  describe('apollo', () => {
    it('should render Vue component with apollo query', () => {
      createComponent()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$apollo.queries.itemCollectionCollection).toBeTruthy()
    })

    it('should render the list of products and price when query is resolved', async() => {
      createComponent()
      await wrapper.vm.$nextTick()
      const {data} = mockResult
      const {itemCollectionCollection} = data
      expect(wrapper.vm.itemCollectionCollection).toStrictEqual(itemCollectionCollection)
    })

    it('should set error if query fails', async() => {
      const errorMessage = 'GraphQL Error'
      createComponent({indexQuery: jest.fn().mockRejectedValue(new Error(errorMessage))})
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.error).toEqual(`Network error: ${errorMessage}`)
    })
  })
})
